import * as Tone from "tone";
import {
  clampVelocity,
  getAudioPreset,
  msToSeconds,
  randomHumanizeMs,
  randomSpread,
  type AudioInstrument,
  type PlaybackStyle,
  type StrumDirection,
} from "@/features/audio/presets";
import { resolveAudioBackend } from "@/features/audio/audioEngine";
import {
  ensureAudioReady,
  getChordDuration,
  getInstrumentEngine,
  getInstrumentRange,
  isMonoInstrument,
} from "@/features/audio/toneEngine";
import { playWebAudioFontScheduledNotes } from "@/features/audio/webaudiofont/runtime";

export interface PlayChordOptions {
  durationMs?: number;
  style?: PlaybackStyle;
}

type ScheduledNote = {
  note: string;
  offsetSeconds: number;
  velocity: number;
  durationSeconds: number;
};

function uniqueNotes(notes: string[]) {
  return [...new Set(notes)];
}

function parseOctave(note: string) {
  const match = note.match(/(-?\d+)$/);
  return match ? Number(match[1]) : 4;
}

function sortLowToHigh(notes: string[]) {
  return [...notes].sort((a, b) => parseOctave(a) - parseOctave(b));
}

function sortHighToLow(notes: string[]) {
  return [...notes].sort((a, b) => parseOctave(b) - parseOctave(a));
}

function limitNotesToRange(notes: string[], instrument: AudioInstrument) {
  const range = getInstrumentRange(instrument);

  const filtered = notes.filter((note) => {
    const octave = parseOctave(note);
    return octave >= range.minOctave && octave <= range.maxOctave;
  });

  return filtered.length > 0 ? filtered : notes;
}

function getOrderedNotesForInstrument(
  notes: string[],
  instrument: AudioInstrument,
  direction: StrumDirection
) {
  const inRange = limitNotesToRange(uniqueNotes(notes), instrument);

  if (instrument === "bass") {
    return sortLowToHigh(inRange).slice(0, 1);
  }

  if (direction === "up") {
    return sortLowToHigh(inRange);
  }

  if (direction === "down") {
    return sortHighToLow(inRange);
  }

  return sortLowToHigh(inRange);
}

function getAccentMultiplier(
  index: number,
  total: number,
  bias: "low" | "mid" | "high" | "balanced"
) {
  if (total <= 1) return 1;

  switch (bias) {
    case "low":
      return index === 0 ? 1.1 : 0.97;
    case "high":
      return index === total - 1 ? 1.08 : 0.98;
    case "mid": {
      const mid = Math.floor(total / 2);
      return index === mid ? 1.08 : 0.98;
    }
    case "balanced":
    default:
      return 1;
  }
}

function getCurveAccentMultiplier(
  index: number,
  total: number,
  curve: "flat" | "front" | "back" | "middle"
) {
  if (total <= 1) return 1;

  switch (curve) {
    case "front":
      return 1.06 - index * 0.025;
    case "back":
      return 0.94 + index * 0.025;
    case "middle": {
      const center = (total - 1) / 2;
      const distance = Math.abs(index - center);
      return 1.05 - distance * 0.04;
    }
    case "flat":
    default:
      return 1;
  }
}

function getArticulationDurationMultiplier(
  articulation: "soft" | "tight" | "pluck",
  index: number,
  total: number
) {
  if (total <= 1) {
    switch (articulation) {
      case "tight":
        return 0.9;
      case "pluck":
        return 0.88;
      case "soft":
      default:
        return 1;
    }
  }

  switch (articulation) {
    case "soft":
      return 1;
    case "tight":
      return Math.max(0.72, 0.9 - index * 0.015);
    case "pluck":
      return index === 0 ? 0.88 : 0.82;
    default:
      return 1;
  }
}

function buildBlockSchedule(
  notes: string[],
  instrument: AudioInstrument,
  durationMs: number
): ScheduledNote[] {
  const preset = getAudioPreset(instrument);

  return notes.map((note, index) => {
    const velocity = clampVelocity(
      preset.velocity *
        getAccentMultiplier(index, notes.length, preset.accentBias) *
        getCurveAccentMultiplier(index, notes.length, preset.strumAccentCurve) +
        randomSpread(preset.velocitySpread)
    );

    const articulationMultiplier = getArticulationDurationMultiplier(
      preset.articulation,
      index,
      notes.length
    );

    const noteDurationMs =
      (durationMs + randomSpread(preset.durationSpreadMs) - preset.releaseTrimMs) *
      articulationMultiplier;

    return {
      note,
      offsetSeconds: msToSeconds(randomHumanizeMs(preset.blockHumanizeMs)),
      velocity,
      durationSeconds: msToSeconds(
        Math.max(120, noteDurationMs - index * preset.staggerDecayMs)
      ),
    };
  });
}

function buildStrumSchedule(
  notes: string[],
  instrument: AudioInstrument,
  durationMs: number
): ScheduledNote[] {
  const preset = getAudioPreset(instrument);

  return notes.map((note, index) => {
    const velocity = clampVelocity(
      preset.velocity *
        getAccentMultiplier(index, notes.length, preset.accentBias) *
        getCurveAccentMultiplier(index, notes.length, preset.strumAccentCurve) +
        randomSpread(preset.velocitySpread)
    );

    const articulationMultiplier = getArticulationDurationMultiplier(
      preset.articulation,
      index,
      notes.length
    );

    const noteDurationMs =
      (durationMs + randomSpread(preset.durationSpreadMs) - preset.releaseTrimMs) *
      articulationMultiplier;

    return {
      note,
      offsetSeconds: msToSeconds(
        index * preset.strumStepMs + randomHumanizeMs(preset.noteHumanizeMs)
      ),
      velocity,
      durationSeconds: msToSeconds(
        Math.max(100, noteDurationMs - index * preset.staggerDecayMs)
      ),
    };
  });
}

function resolveDirection(style: PlaybackStyle, instrument: AudioInstrument) {
  const preset = getAudioPreset(instrument);

  if (style !== "strum") return "down" as StrumDirection;

  if (preset.strumDirection === "alternate") {
    return Math.random() > 0.5 ? "down" : "up";
  }

  return preset.strumDirection;
}

export async function playChord(
  notes: string[],
  instrument: AudioInstrument,
  options: PlayChordOptions = {}
) {
  const deduped = uniqueNotes(notes);

  if (deduped.length === 0) return;

  await ensureAudioReady();

  const backend = await resolveAudioBackend(instrument);
  const durationMs = getChordDuration(instrument, options.durationMs);
  const style = options.style ?? "block";
  const direction = resolveDirection(style, instrument);

  const orderedNotes = getOrderedNotesForInstrument(deduped, instrument, direction);

  const schedule =
    style === "strum" && instrument !== "keyboard"
      ? buildStrumSchedule(orderedNotes, instrument, durationMs)
      : buildBlockSchedule(orderedNotes, instrument, durationMs);

  if (backend === "webaudiofont") {
    await playWebAudioFontScheduledNotes(schedule, instrument);
    return;
  }

  const engine = getInstrumentEngine(instrument);
  const now = Tone.now() + 0.01;

  if (isMonoInstrument(instrument)) {
    const first = schedule[0];
    if (!first) return;

    (engine.synth as Tone.MonoSynth).triggerAttackRelease(
      first.note,
      first.durationSeconds,
      now + first.offsetSeconds,
      first.velocity
    );

    return;
  }

  for (const item of schedule) {
    (engine.synth as Tone.PolySynth).triggerAttackRelease(
      item.note,
      item.durationSeconds,
      now + item.offsetSeconds,
      item.velocity
    );
  }
}