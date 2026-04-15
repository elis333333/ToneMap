import type { NoteName } from "./types";

export const NOTE_TO_PITCH_CLASS: Record<NoteName, number> = {
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

export const PITCH_CLASS_TO_SHARP: Record<number, NoteName> = {
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B",
};

export const PITCH_CLASS_TO_FLAT: Record<number, NoteName> = {
  0: "C",
  1: "Db",
  2: "D",
  3: "Eb",
  4: "E",
  5: "F",
  6: "Gb",
  7: "G",
  8: "Ab",
  9: "A",
  10: "Bb",
  11: "B",
};

const SPANISH_NOTE_MAP: Record<string, string> = {
  do: "C",
  re: "D",
  mi: "E",
  fa: "F",
  sol: "G",
  la: "A",
  si: "B",
};

export function normalizeNoteInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/♯/g, "#")
    .replace(/♭/g, "b")
    .replace(/\s+/g, " ");
}

export function spanishToEnglishNote(input: string): string {
  const normalized = normalizeNoteInput(input);

  const match = normalized.match(
    /^(do|re|mi|fa|sol|la|si)(#|b)?(?:\s+(.*))?$/i
  );

  if (!match) {
    return input;
  }

  const spanishBase = match[1].toLowerCase();
  const accidental = match[2] ?? "";
  const rest = match[3]?.trim() ?? "";

  const englishBase = SPANISH_NOTE_MAP[spanishBase];

  if (!englishBase) {
    return input;
  }

  const translatedRoot = `${englishBase}${accidental}`;
  return rest ? `${translatedRoot} ${rest}` : translatedRoot;
}

export function isValidNoteName(note: string): note is NoteName {
  return note in NOTE_TO_PITCH_CLASS;
}

export function noteToPitchClass(note: NoteName): number {
  return NOTE_TO_PITCH_CLASS[note];
}

export function pitchClassToSharp(pc: number): NoteName {
  return PITCH_CLASS_TO_SHARP[((pc % 12) + 12) % 12];
}

export function pitchClassToFlat(pc: number): NoteName {
  return PITCH_CLASS_TO_FLAT[((pc % 12) + 12) % 12];
}

export function uniquePitchClasses(notes: NoteName[]): number[] {
  return [...new Set(notes.map(noteToPitchClass))].sort((a, b) => a - b);
}

export function transposeNote(note: NoteName, semitones: number): NoteName {
  const pc = noteToPitchClass(note);
  return pitchClassToSharp(pc + semitones);
}

