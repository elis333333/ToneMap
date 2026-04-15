import * as Tone from "tone";
import { WEB_AUDIO_FONT_PRESETS, type WebAudioFontInstrument } from "./catalog";

export type WebAudioFontScheduledNote = {
  note: string;
  offsetSeconds: number;
  velocity: number;
  durationSeconds: number;
};

const scriptCache = new Map<string, Promise<void>>();
const presetCache = new Map<WebAudioFontInstrument, Promise<WebAudioFontPreset>>();

let playerPromise: Promise<WebAudioFontPlayerInstance> | null = null;

function assertBrowser() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("WebAudioFont solo puede cargarse en el navegador.");
  }
}

function loadScriptOnce(url: string): Promise<void> {
  const cached = scriptCache.get(url);
  if (cached) return cached;

  const promise = new Promise<void>((resolve, reject) => {
    assertBrowser();

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-webaudiofont-src="${url}"]`
    );

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error(`No se pudo cargar el script: ${url}`)),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.dataset.webaudiofontSrc = url;

    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };

    script.onerror = () => {
      reject(new Error(`No se pudo cargar el script: ${url}`));
    };

    document.head.appendChild(script);
  });

  scriptCache.set(url, promise);
  return promise;
}

function getSharedAudioContext(): AudioContext {
  return Tone.getContext().rawContext as AudioContext;
}

function noteNameToMidi(note: string): number {
  const match = note.match(/^([A-G])(#|b)?(-?\d+)$/);

  if (!match) {
    throw new Error(`Nota inválida para WebAudioFont: ${note}`);
  }

  const [, letter, accidental = "", octaveRaw] = match;
  const octave = Number(octaveRaw);

  const pitchClassMap: Record<string, number> = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
  };

  const pitchClass = pitchClassMap[`${letter}${accidental}`];

  if (pitchClass === undefined) {
    throw new Error(`No se pudo convertir la nota a MIDI: ${note}`);
  }

  return (octave + 1) * 12 + pitchClass;
}

function getGlobalDynamicValue(key: string): unknown {
  return (globalThis as Record<string, unknown>)[key];
}

async function ensurePlayerLoaded(): Promise<WebAudioFontPlayerInstance> {
  if (playerPromise) return playerPromise;

  playerPromise = (async () => {
    const presetEntry = WEB_AUDIO_FONT_PRESETS.keyboard;

    await loadScriptOnce(presetEntry.playerScriptUrl);

    if (!window.WebAudioFontPlayer) {
      throw new Error("WebAudioFontPlayer no quedó disponible en window.");
    }

    return new window.WebAudioFontPlayer();
  })();

  return playerPromise;
}

async function tryLoadPresetVariant(
  audioContext: AudioContext,
  player: WebAudioFontPlayerInstance,
  variant: {
    label: string;
    presetScriptUrl: string;
    globalVariableName: string;
  }
): Promise<WebAudioFontPreset | null> {
  try {
    await loadScriptOnce(variant.presetScriptUrl);

    player.loader.decodeAfterLoading(audioContext, variant.globalVariableName);

    await new Promise<void>((resolve) => {
      player.loader.waitLoad(() => resolve());
    });

    const globalPreset = getGlobalDynamicValue(
      variant.globalVariableName
    ) as WebAudioFontPreset | undefined;

    if (!globalPreset) {
      return null;
    }

    return globalPreset;
  } catch (error) {
    console.warn(
      `[ToneMap] Falló preset WebAudioFont: ${variant.label}`,
      error
    );
    return null;
  }
}

export async function ensureWebAudioFontInstrumentReady(
  instrument: WebAudioFontInstrument
): Promise<WebAudioFontPreset> {
  const cached = presetCache.get(instrument);
  if (cached) return cached;

  const promise = (async () => {
    const presetEntry = WEB_AUDIO_FONT_PRESETS[instrument];
    const audioContext = getSharedAudioContext();
    const player = await ensurePlayerLoaded();

    for (const variant of presetEntry.variants) {
      const preset = await tryLoadPresetVariant(audioContext, player, variant);

      if (preset) {
        console.info(
          `[ToneMap] WebAudioFont activo para ${instrument}: ${variant.label}`
        );
        return preset;
      }
    }

    throw new Error(
      `No se pudo cargar ningún preset WebAudioFont para ${instrument}.`
    );
  })();

  presetCache.set(instrument, promise);
  return promise;
}

export async function playWebAudioFontScheduledNotes(
  notes: WebAudioFontScheduledNote[],
  instrument: WebAudioFontInstrument
) {
  if (notes.length === 0) return;

  await Tone.start();

  const audioContext = getSharedAudioContext();

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  const player = await ensurePlayerLoaded();
  const preset = await ensureWebAudioFontInstrumentReady(instrument);

  const baseTime = audioContext.currentTime + 0.01;

  for (const item of notes) {
    const midi = noteNameToMidi(item.note);

    player.queueWaveTable(
      audioContext,
      audioContext.destination,
      preset,
      baseTime + item.offsetSeconds,
      midi,
      Math.max(0.08, item.durationSeconds),
      Math.max(0.05, Math.min(1, item.velocity))
    );
  }
}