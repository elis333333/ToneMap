import type { BuiltChord, BuiltScale, NoteName } from "@/core/types";
import { PITCH_CLASS_TO_SHARP, noteToPitchClass } from "@/core/theory/notes";

export interface PianoRenderKey {
  id: string;
  note: NoteName;
  audioNote: string;
  octave: number;
  isBlack: boolean;
  isRoot: boolean;
}

const PIANO_OCTAVES = [3, 4, 5, 6];
const BLACK_PITCH_CLASSES = new Set([1, 3, 6, 8, 10]);

function buildPianoKeysFromNotes(
  notes: NoteName[],
  root: NoteName
): PianoRenderKey[] {
  const uniquePitchClasses = [...new Set(notes.map(noteToPitchClass))];

  return uniquePitchClasses.map((pitchClass) => {
    const note = PITCH_CLASS_TO_SHARP[pitchClass];
    const octave =
      note === root
        ? 4
        : PIANO_OCTAVES.find((candidateOctave) => candidateOctave === 4) ?? 4;

    return {
      id: `${note}${octave}`,
      note,
      audioNote: `${note}${octave}`,
      octave,
      isBlack: BLACK_PITCH_CLASSES.has(pitchClass),
      isRoot: note === root,
    };
  });
}

export function adaptChordToPianoRender(chord: BuiltChord) {
  return {
    instrument: "piano" as const,
    symbol: chord.symbol,
    root: chord.root,
    keys: buildPianoKeysFromNotes(chord.notes, chord.root),
  };
}

export function adaptScaleToPianoRender(scale: BuiltScale) {
  return {
    instrument: "piano" as const,
    root: scale.root,
    quality: scale.quality,
    keys: buildPianoKeysFromNotes(scale.notes, scale.root),
  };
}