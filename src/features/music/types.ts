export type NoteName =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B";

export type ChordQuality =
  | "major"
  | "minor"
  | "diminished"
  | "augmented"
  | "sus2"
  | "sus4"
  | "maj7"
  | "m7"
  | "dominant7";

export interface ParsedNote {
  kind: "note";
  root: NoteName;
  symbol: string;
}

export interface ParsedChord {
  kind: "chord";
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
}

export interface ParsedInterval {
  kind: "interval";
  semitones: number;
  shortName: string;
  nameEs: string;
  symbol: string;
}

export interface ParsedUnknown {
  kind: "unknown";
  raw: string;
}

export type ParsedEntity =
  | ParsedNote
  | ParsedChord
  | ParsedInterval
  | ParsedUnknown;

export interface ChordDefinition {
  id: ChordQuality;
  symbol: string;
  aliases: string[];
  nameEs: string;
  nameEn: string;
  semitones: number[];
}

export interface DetectedChordMatch {
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
  semitones: number[];
  matchedNotes: NoteName[];
}