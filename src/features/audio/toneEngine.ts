import * as Tone from "tone";
import {
  getAudioPreset,
  type AudioInstrument,
  type InstrumentPlaybackPreset,
} from "@/features/audio/presets";

type PolyEngineSynth = Tone.PolySynth<Tone.AMSynth> | Tone.PolySynth<Tone.FMSynth>;
type MonoEngineSynth = Tone.MonoSynth;
type EngineSynth = PolyEngineSynth | MonoEngineSynth;

export interface InstrumentEngine {
  instrument: AudioInstrument;
  preset: InstrumentPlaybackPreset;
  synth: EngineSynth;
  input: Tone.Gain;
  filter: Tone.Filter;
  compressor: Tone.Compressor;
  reverb: Tone.Reverb;
  delay: Tone.FeedbackDelay;
  output: Tone.Gain;
}

const engineCache = new Map<AudioInstrument, InstrumentEngine>();

let transportConfigured = false;

function configureTransportOnce() {
  if (transportConfigured) return;
  Tone.getTransport().bpm.value = 120;
  transportConfigured = true;
}

function createPolyAMSynth(preset: InstrumentPlaybackPreset) {
  return new Tone.PolySynth(Tone.AMSynth, {
    harmonicity: 1.8,
    oscillator: {
      type: "triangle",
    },
    envelope: preset.envelope,
    modulation: {
      type: "sine",
    },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.12,
      sustain: 0.15,
      release: 0.8,
    },
    volume: preset.volume,
  });
}

function createPolyFMSynth(preset: InstrumentPlaybackPreset) {
  return new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 2.4,
    modulationIndex: 8,
    oscillator: {
      type: "triangle",
    },
    envelope: preset.envelope,
    modulation: {
      type: "sine",
    },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.15,
      sustain: 0.12,
      release: 1.2,
    },
    volume: preset.volume,
  });
}

function createMonoBassSynth(preset: InstrumentPlaybackPreset) {
  return new Tone.MonoSynth({
    oscillator: {
      type: "sawtooth",
    },
    filter: {
      Q: 2,
      type: "lowpass",
      rolloff: -24,
    },
    envelope: preset.envelope,
    filterEnvelope: {
      attack: 0.01,
      decay: 0.12,
      sustain: 0.35,
      release: 0.7,
      baseFrequency: 90,
      octaves: 2.2,
    },
    volume: preset.volume,
  });
}

function createSynthForPreset(preset: InstrumentPlaybackPreset): EngineSynth {
  switch (preset.synthType) {
    case "poly-am":
      return createPolyAMSynth(preset);
    case "poly-fm":
      return createPolyFMSynth(preset);
    case "mono-bass":
      return createMonoBassSynth(preset);
    default:
      return createPolyFMSynth(preset);
  }
}

function createInstrumentEngine(instrument: AudioInstrument): InstrumentEngine {
  const preset = getAudioPreset(instrument);

  const input = new Tone.Gain(1);
  const filter = new Tone.Filter({
    type: "lowpass",
    frequency: preset.filterFrequency,
    Q: preset.filterQ,
  });
  const compressor = new Tone.Compressor({
    threshold: -20,
    ratio: 3,
    attack: 0.003,
    release: 0.2,
  });
  const reverb = new Tone.Reverb({
    decay: instrument === "keyboard" ? 3.2 : instrument === "guitar" ? 1.9 : 1.2,
    preDelay: 0.01,
    wet: preset.reverbWet,
  });
  const delay = new Tone.FeedbackDelay({
    delayTime: instrument === "keyboard" ? "16n" : "32n",
    feedback: instrument === "keyboard" ? 0.16 : 0.1,
    wet: preset.delayWet,
  });
  const output = new Tone.Gain(0.95);

  const synth = createSynthForPreset(preset);

  synth.connect(input);
  input.connect(filter);
  filter.connect(compressor);
  compressor.connect(reverb);
  compressor.connect(delay);
  reverb.connect(output);
  delay.connect(output);
  output.toDestination();

  return {
    instrument,
    preset,
    synth,
    input,
    filter,
    compressor,
    reverb,
    delay,
    output,
  };
}

export async function ensureAudioReady() {
  configureTransportOnce();

  if (Tone.getContext().state !== "running") {
    await Tone.start();
  }
}

export function getInstrumentEngine(instrument: AudioInstrument): InstrumentEngine {
  const existing = engineCache.get(instrument);
  if (existing) return existing;

  const created = createInstrumentEngine(instrument);
  engineCache.set(instrument, created);
  return created;
}

export function getChordDuration(instrument: AudioInstrument, durationMs?: number) {
  const preset = getAudioPreset(instrument);
  return durationMs ?? preset.defaultDurationMs;
}

export function getInstrumentRange(instrument: AudioInstrument) {
  const preset = getAudioPreset(instrument);

  return {
    minOctave: preset.preferredMinOctave,
    maxOctave: preset.preferredMaxOctave,
  };
}

export function isMonoInstrument(instrument: AudioInstrument) {
  return instrument === "bass";
}

export async function disposeAudioEngines() {
  for (const engine of engineCache.values()) {
    engine.synth.dispose();
    engine.input.dispose();
    engine.filter.dispose();
    engine.compressor.dispose();
    engine.reverb.dispose();
    engine.delay.dispose();
    engine.output.dispose();
  }

  engineCache.clear();
}