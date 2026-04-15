import type {
  BuiltChord,
  ChordQuality,
  NoteName,
  GuitarVoicingIntent,
} from "@/core/types";
import { buildChord } from "@/core/theory/chords";
import { generateGuitarVoicings, type PreviousGuitarVoicingReference } from "@/core/voicings/guitar";
import { generateBassVoicings } from "@/core/voicings/bass";
import { adaptGuitarVoicingToRender } from "@/core/adaptors/guitar";
import { adaptBassVoicingToRender } from "@/core/adaptors/bass";
import { adaptChordToPianoRender } from "@/core/adaptors/piano";
import {
  getGuitarTuningById,
  GUITAR_STANDARD_TUNING,
} from "@/data/tunings/guitar";
import { BASS_STANDARD_TUNING } from "@/data/tunings/bass";

export interface EngineResult {
  chord: BuiltChord;
  guitar: ReturnType<typeof adaptGuitarVoicingToRender> | null;
  guitarVariants: ReturnType<typeof adaptGuitarVoicingToRender>[];
  bass: ReturnType<typeof adaptBassVoicingToRender> | null;
  piano: ReturnType<typeof adaptChordToPianoRender>;
}

export function resolveChordForInstruments(
  root: NoteName,
  quality: ChordQuality,
  options?: {
    guitarTuningId?: "standard" | "drop-d";
    bassNote?: NoteName | null;
    previousGuitarVoicing?: PreviousGuitarVoicingReference | null;
    guitarIntent?: GuitarVoicingIntent;
  }
): EngineResult {
  const chord = buildChord(root, quality, options?.bassNote ?? null);

  const guitarTuning =
    getGuitarTuningById(options?.guitarTuningId ?? "standard") ??
    GUITAR_STANDARD_TUNING;

  const guitarVoicings = generateGuitarVoicings({
    root: chord.root,
    quality: chord.quality,
    tuning: guitarTuning,
    previousVoicing: options?.previousGuitarVoicing ?? null,
    intent: options?.guitarIntent ?? "balanced",
  });

  const guitar = guitarVoicings.primary
    ? adaptGuitarVoicingToRender(guitarVoicings.primary, {
        root: chord.root,
        chordSymbol: chord.symbol,
        tuningId: guitarTuning.id,
      })
    : null;

  const guitarVariants = guitarVoicings.variants.map((voicing) =>
    adaptGuitarVoicingToRender(voicing, {
      root: chord.root,
      chordSymbol: chord.symbol,
      tuningId: guitarTuning.id,
    })
  );

  const bassVoicings = generateBassVoicings({
    root: chord.root,
    quality: chord.quality,
    tuning: BASS_STANDARD_TUNING,
  });

  const bass = bassVoicings.primary
    ? adaptBassVoicingToRender(bassVoicings.primary)
    : null;

  const piano = adaptChordToPianoRender(chord);

  return {
    chord,
    guitar,
    guitarVariants,
    bass,
    piano,
  };
}