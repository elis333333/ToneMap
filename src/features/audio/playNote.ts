import * as Tone from "tone";
import {
  clampVelocity,
  getAudioPreset,
  msToSeconds,
  randomSpread,
  type AudioInstrument,
} from "@/features/audio/presets";
import { resolveAudioBackend } from "@/features/audio/audioEngine";
import { playWebAudioFontScheduledNotes } from "@/features/audio/webaudiofont/runtime";
import {
  ensureAudioReady,
  getInstrumentEngine,
  getInstrumentRange,
  isMonoInstrument,
} from "@/features/audio/toneEngine";

function parseOctave(note: string) {
  const match = note.match(/(-?\d+)$/);
  return match ? Number(match[1]) : 4;
}

function normalizeNoteToRange(note: string, instrument: AudioInstrument) {
  const range = getInstrumentRange(instrument);
  const octave = parseOctave(note);

  if (octave >= range.minOctave && octave <= range.maxOctave) {
    return note;
  }

  return note;
}

function getSingleNoteDurationMs(instrument: AudioInstrument) {
  const preset = getAudioPreset(instrument);

  const base = preset.defaultDurationMs * 0.72;
  const adjusted =
    preset.articulation === "tight"
      ? base * 0.86
      : preset.articulation === "pluck"
        ? base * 0.78
        : base;

  return Math.max(90, adjusted - preset.releaseTrimMs * 0.35);
}

export async function playNote(note: string, instrument: AudioInstrument) {
  await ensureAudioReady();

  const backend = await resolveAudioBackend(instrument);
  const preset = getAudioPreset(instrument);
  const playableNote = normalizeNoteToRange(note, instrument);

  const velocity = clampVelocity(
    preset.velocity + randomSpread(Math.max(0.02, preset.velocitySpread * 0.6))
  );

  const durationSeconds = msToSeconds(
    Math.round(
      getSingleNoteDurationMs(instrument) +
        randomSpread(preset.durationSpreadMs * 0.3)
    )
  );

  if (backend === "webaudiofont") {
    await playWebAudioFontScheduledNotes(
      [
        {
          note: playableNote,
          offsetSeconds: 0,
          velocity,
          durationSeconds,
        },
      ],
      instrument
    );
    return;
  }

  const engine = getInstrumentEngine(instrument);
  const now = Tone.now() + 0.01;

  if (isMonoInstrument(instrument)) {
    (engine.synth as Tone.MonoSynth).triggerAttackRelease(
      playableNote,
      durationSeconds,
      now,
      velocity
    );
    return;
  }

  (engine.synth as Tone.PolySynth).triggerAttackRelease(
    playableNote,
    durationSeconds,
    now,
    velocity
  );
}