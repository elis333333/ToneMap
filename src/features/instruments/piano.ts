import { noteToPitchClass } from "@/core/theory/notes";
import type { NoteName } from "@/core/types";
import type { SelectedKey } from "@/features/explorer/explorerStore";

type PianoKey = SelectedKey & {
  isBlack: boolean;
  afterWhiteIndex?: number;
};

export const PIANO_WHITE_KEYS: PianoKey[] = [
  { id: "C3", note: "C", audioNote: "C3", isBlack: false },
  { id: "D3", note: "D", audioNote: "D3", isBlack: false },
  { id: "E3", note: "E", audioNote: "E3", isBlack: false },
  { id: "F3", note: "F", audioNote: "F3", isBlack: false },
  { id: "G3", note: "G", audioNote: "G3", isBlack: false },
  { id: "A3", note: "A", audioNote: "A3", isBlack: false },
  { id: "B3", note: "B", audioNote: "B3", isBlack: false },

  { id: "C4", note: "C", audioNote: "C4", isBlack: false },
  { id: "D4", note: "D", audioNote: "D4", isBlack: false },
  { id: "E4", note: "E", audioNote: "E4", isBlack: false },
  { id: "F4", note: "F", audioNote: "F4", isBlack: false },
  { id: "G4", note: "G", audioNote: "G4", isBlack: false },
  { id: "A4", note: "A", audioNote: "A4", isBlack: false },
  { id: "B4", note: "B", audioNote: "B4", isBlack: false },

  { id: "C5", note: "C", audioNote: "C5", isBlack: false },
  { id: "D5", note: "D", audioNote: "D5", isBlack: false },
  { id: "E5", note: "E", audioNote: "E5", isBlack: false },
  { id: "F5", note: "F", audioNote: "F5", isBlack: false },
  { id: "G5", note: "G", audioNote: "G5", isBlack: false },
  { id: "A5", note: "A", audioNote: "A5", isBlack: false },
  { id: "B5", note: "B", audioNote: "B5", isBlack: false },

  { id: "C6", note: "C", audioNote: "C6", isBlack: false },
  { id: "D6", note: "D", audioNote: "D6", isBlack: false },
  { id: "E6", note: "E", audioNote: "E6", isBlack: false },
  { id: "F6", note: "F", audioNote: "F6", isBlack: false },
  { id: "G6", note: "G", audioNote: "G6", isBlack: false },
  { id: "A6", note: "A", audioNote: "A6", isBlack: false },
  { id: "B6", note: "B", audioNote: "B6", isBlack: false },
];

export const PIANO_BLACK_KEYS: PianoKey[] = [
  { id: "C#3", note: "C#", audioNote: "C#3", isBlack: true, afterWhiteIndex: 0 },
  { id: "D#3", note: "D#", audioNote: "D#3", isBlack: true, afterWhiteIndex: 1 },
  { id: "F#3", note: "F#", audioNote: "F#3", isBlack: true, afterWhiteIndex: 3 },
  { id: "G#3", note: "G#", audioNote: "G#3", isBlack: true, afterWhiteIndex: 4 },
  { id: "A#3", note: "A#", audioNote: "A#3", isBlack: true, afterWhiteIndex: 5 },

  { id: "C#4", note: "C#", audioNote: "C#4", isBlack: true, afterWhiteIndex: 7 },
  { id: "D#4", note: "D#", audioNote: "D#4", isBlack: true, afterWhiteIndex: 8 },
  { id: "F#4", note: "F#", audioNote: "F#4", isBlack: true, afterWhiteIndex: 10 },
  { id: "G#4", note: "G#", audioNote: "G#4", isBlack: true, afterWhiteIndex: 11 },
  { id: "A#4", note: "A#", audioNote: "A#4", isBlack: true, afterWhiteIndex: 12 },

  { id: "C#5", note: "C#", audioNote: "C#5", isBlack: true, afterWhiteIndex: 14 },
  { id: "D#5", note: "D#", audioNote: "D#5", isBlack: true, afterWhiteIndex: 15 },
  { id: "F#5", note: "F#", audioNote: "F#5", isBlack: true, afterWhiteIndex: 17 },
  { id: "G#5", note: "G#", audioNote: "G#5", isBlack: true, afterWhiteIndex: 18 },
  { id: "A#5", note: "A#", audioNote: "A#5", isBlack: true, afterWhiteIndex: 19 },

  { id: "C#6", note: "C#", audioNote: "C#6", isBlack: true, afterWhiteIndex: 21 },
  { id: "D#6", note: "D#", audioNote: "D#6", isBlack: true, afterWhiteIndex: 22 },
  { id: "F#6", note: "F#", audioNote: "F#6", isBlack: true, afterWhiteIndex: 24 },
  { id: "G#6", note: "G#", audioNote: "G#6", isBlack: true, afterWhiteIndex: 25 },
  { id: "A#6", note: "A#", audioNote: "A#6", isBlack: true, afterWhiteIndex: 26 },
];

export const PIANO_ALL_KEYS = [...PIANO_WHITE_KEYS, ...PIANO_BLACK_KEYS];

export function findPianoKeysForNotes(notes: NoteName[]): SelectedKey[] {
  const uniquePitchClasses = [...new Set(notes.map(noteToPitchClass))];

  return uniquePitchClasses
    .map((pc) => {
      const candidates = PIANO_ALL_KEYS.filter(
        (key) => noteToPitchClass(key.note) === pc
      );

      return (
        candidates.find((key) => key.audioNote.endsWith("4")) ??
        candidates[0] ??
        null
      );
    })
    .filter(Boolean) as SelectedKey[];
}