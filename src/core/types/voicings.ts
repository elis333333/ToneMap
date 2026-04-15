import type { ChordQuality, NoteName } from "./music";
import type { InstrumentId } from "./instruments";

export type VoicingType =
  | "open"
  | "barre-e"
  | "barre-a"
  | "closed"
  | "triad"
  | "shell"
  | "power"
  | "arpeggio"
  | "custom";

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface BarreInfo {
  fret: number;
  fromString: number;
  toString: number;
  full: boolean;
}

export interface FrettedStringNote {
  stringIndex: number;
  fret: number | null;
  note: NoteName | null;
  audioNote: string | null;
  muted: boolean;
  open: boolean;
}

export interface PlayabilityScore {
  total: number;
  fretSpanScore: number;
  openStringScore: number;
  barreScore: number;
  rootPresenceScore: number;
  thirdPresenceScore: number;
  shapeFamiliarityScore: number;
}

export interface InstrumentVoicing {
  id: string;
  instrument: InstrumentId;
  chordSymbol: string;
  root: NoteName;
  quality: ChordQuality;
  includedNotes: NoteName[];
  type: VoicingType;
  strings: FrettedStringNote[];
  minFret: number;
  maxFret: number;
  baseFret: number;
  usesBarre: boolean;
  barre: BarreInfo | null;
  difficulty: DifficultyLevel;
  score: PlayabilityScore;
  tags: string[];
}

export interface GuitarShapeDefinition {
  id: string;
  rootString: number | null;
  quality: ChordQuality;
  type: VoicingType;
  movable: boolean;
  strings: Array<number | "x">;
  usesBarre: boolean;
  tags: string[];
}

export interface BassPatternDefinition {
  id: string;
  quality: ChordQuality | "root" | "arpeggio";
  strings: Array<number | "x">;
  tags: string[];
}