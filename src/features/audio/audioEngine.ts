import { ensureAudioReady } from "@/features/audio/toneEngine";
import type { AudioInstrument } from "@/features/audio/presets";
import { ensureWebAudioFontInstrumentReady } from "@/features/audio/webaudiofont/runtime";

export type AudioBackend = "tone" | "webaudiofont";

export async function resolveAudioBackend(
  instrument: AudioInstrument
): Promise<AudioBackend> {
  await ensureAudioReady();

  try {
    if (instrument === "keyboard") {
      await ensureWebAudioFontInstrumentReady("keyboard");
      return "webaudiofont";
    }

    if (instrument === "bass") {
      await ensureWebAudioFontInstrumentReady("bass");
      return "webaudiofont";
    }

    if (instrument === "guitar") {
      await ensureWebAudioFontInstrumentReady("guitar");
      return "webaudiofont";
    }

    return "tone";
  } catch (error) {
    console.warn(
      `[ToneMap] WebAudioFont no pudo inicializarse para ${instrument}. Se usará Tone.js.`,
      error
    );
    return "tone";
  }
}