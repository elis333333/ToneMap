import { CHORD_FORMULAS } from "./formulas";
import {
  isValidNoteName,
  noteToPitchClass,
  pitchClassToSharp,
  uniquePitchClasses,
} from "./notes";
import type { DetectedChordMatch, NoteName } from "./types";

function normalizeSemitoneSet(values: number[], rootPc: number): number[] {
  return values
    .map((pc) => ((pc - rootPc) % 12 + 12) % 12)
    .sort((a, b) => a - b);
}

function sameSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

export function detectChord(inputNotes: string[]): DetectedChordMatch | null {
  const validNotes = inputNotes.filter(isValidNoteName) as NoteName[];

  if (validNotes.length < 3) return null;

  const pitchClasses = uniquePitchClasses(validNotes);

  for (const rootPc of pitchClasses) {
    const normalizedSet = normalizeSemitoneSet(pitchClasses, rootPc);

    for (const chord of CHORD_FORMULAS) {
      if (sameSet(normalizedSet, chord.semitones)) {
        const root = pitchClassToSharp(rootPc);
        return {
          root,
          quality: chord.id,
          symbol: `${root}${chord.symbol}`,
          semitones: chord.semitones,
          matchedNotes: validNotes,
        };
      }
    }
  }

  return null;
}

export function detectInterval(inputNotes: string[]): { semitones: number } | null {
  const validNotes = inputNotes.filter(isValidNoteName) as NoteName[];

  if (validNotes.length !== 2) return null;

  const first = noteToPitchClass(validNotes[0]);
  const second = noteToPitchClass(validNotes[1]);

  return {
    semitones: ((second - first) % 12 + 12) % 12,
  };
}