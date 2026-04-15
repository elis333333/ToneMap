export type AudioInstrument = "keyboard" | "guitar" | "bass";
export type PlaybackStyle = "block" | "strum";
export type StrumDirection = "up" | "down" | "alternate";

export interface InstrumentEnvelope {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface InstrumentPlaybackPreset {
  instrument: AudioInstrument;
  label: string;
  synthType: "poly-am" | "poly-fm" | "mono-bass";
  volume: number;
  velocity: number;
  envelope: InstrumentEnvelope;
  reverbWet: number;
  delayWet: number;
  filterFrequency: number;
  filterQ: number;
  strumStepMs: number;
  blockHumanizeMs: number;
  noteHumanizeMs: number;
  defaultDurationMs: number;
  strumDirection: StrumDirection;
  velocitySpread: number;
  durationSpreadMs: number;
  preferredMinOctave: number;
  preferredMaxOctave: number;
  accentBias: "low" | "mid" | "high" | "balanced";
  articulation: "soft" | "tight" | "pluck";
  strumAccentCurve: "front" | "back" | "middle" | "flat";
  releaseTrimMs: number;
  staggerDecayMs: number;
}

export const AUDIO_PRESETS: Record<AudioInstrument, InstrumentPlaybackPreset> = {
  keyboard: {
    instrument: "keyboard",
    label: "Piano híbrido",
    synthType: "poly-fm",
    volume: -10,
    velocity: 0.88,
    envelope: {
      attack: 0.005,
      decay: 0.35,
      sustain: 0.28,
      release: 1.8,
    },
    reverbWet: 0.18,
    delayWet: 0.06,
    filterFrequency: 5200,
    filterQ: 0.7,
    strumStepMs: 10,
    blockHumanizeMs: 8,
    noteHumanizeMs: 4,
    defaultDurationMs: 1350,
    strumDirection: "down",
    velocitySpread: 0.08,
    durationSpreadMs: 110,
    preferredMinOctave: 2,
    preferredMaxOctave: 6,
    accentBias: "mid",
    articulation: "soft",
    strumAccentCurve: "middle",
    releaseTrimMs: 0,
    staggerDecayMs: 18,
  },

  guitar: {
    instrument: "guitar",
    label: "Guitarra prototipo realista",
    synthType: "poly-am",
    volume: -12,
    velocity: 0.82,
    envelope: {
      attack: 0.002,
      decay: 0.22,
      sustain: 0.18,
      release: 1.15,
    },
    reverbWet: 0.12,
    delayWet: 0.04,
    filterFrequency: 3800,
    filterQ: 1.1,
    strumStepMs: 34,
    blockHumanizeMs: 10,
    noteHumanizeMs: 6,
    defaultDurationMs: 1150,
    strumDirection: "alternate",
    velocitySpread: 0.1,
    durationSpreadMs: 80,
    preferredMinOctave: 2,
    preferredMaxOctave: 5,
    accentBias: "high",
    articulation: "tight",
    strumAccentCurve: "front",
    releaseTrimMs: 90,
    staggerDecayMs: 28,
  },

  bass: {
    instrument: "bass",
    label: "Bajo cálido",
    synthType: "mono-bass",
    volume: -9,
    velocity: 0.9,
    envelope: {
      attack: 0.01,
      decay: 0.18,
      sustain: 0.5,
      release: 0.9,
    },
    reverbWet: 0.05,
    delayWet: 0,
    filterFrequency: 1400,
    filterQ: 1.6,
    strumStepMs: 18,
    blockHumanizeMs: 5,
    noteHumanizeMs: 3,
    defaultDurationMs: 1100,
    strumDirection: "down",
    velocitySpread: 0.06,
    durationSpreadMs: 60,
    preferredMinOctave: 1,
    preferredMaxOctave: 4,
    accentBias: "low",
    articulation: "pluck",
    strumAccentCurve: "front",
    releaseTrimMs: 120,
    staggerDecayMs: 10,
  },
};

export function getAudioPreset(instrument: AudioInstrument): InstrumentPlaybackPreset {
  return AUDIO_PRESETS[instrument];
}

export function clampVelocity(value: number) {
  return Math.max(0.05, Math.min(1, value));
}

export function msToSeconds(ms: number) {
  return Math.max(0, ms) / 1000;
}

export function randomHumanizeMs(rangeMs: number) {
  if (rangeMs <= 0) return 0;
  return (Math.random() * 2 - 1) * rangeMs;
}

export function randomSpread(amount: number) {
  if (amount <= 0) return 0;
  return (Math.random() * 2 - 1) * amount;
}