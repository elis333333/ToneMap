export type NaturalNoteLetter = "C" | "D" | "E" | "F" | "G" | "A" | "B";

export type Accidental = "#" | "b";

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

export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type ChordQuality =
  | "major"
  | "minor"
  | "diminished"
  | "augmented"
  | "power"
  | "sus2"
  | "sus4"
  | "major6"
  | "minor6"
  | "add9"
  | "madd9"
  | "maj7"
  | "m7"
  | "dominant7"
  | "mMaj7"
  | "m7b5"
  | "dim7"
  | "maj9"
  | "m9"
  | "dominant9"
  | "dominant11"
  | "dominant13";

export type IntervalShortName =
  | "1"
  | "b2"
  | "2"
  | "b3"
  | "3"
  | "4"
  | "b5"
  | "5"
  | "b6"
  | "6"
  | "b7"
  | "7"
  | "b9"
  | "9"
  | "#9"
  | "11"
  | "#11"
  | "b13"
  | "13";

export type ScaleQuality =
  | "major"
  | "naturalMinor"
  | "majorPentatonic"
  | "minorPentatonic";

export type KeyMode = "major" | "minor";

export type HarmonicFunctionLabel =
  | "tonic"
  | "subdominant"
  | "dominant"
  | "modal-color"
  | "borrowed"
  | "ambiguous";

export type TonalAmbiguityKind =
  | "relative-major-minor"
  | "modal"
  | "weak-cadence"
  | "competing-centers"
  | "none";

export type ChordInversionLabel =
  | "root-position"
  | "1st-inversion"
  | "2nd-inversion"
  | "3rd-inversion"
  | "slash";

export type ChordExtensionCategory =
  | "basic"
  | "added-color"
  | "seventh"
  | "extended"
  | "altered";

export type SlashChordContextKind =
  | "none"
  | "functional-inversion"
  | "bass-color"
  | "pedal-bass"
  | "linear-motion";

export type ExtensionContextKind =
  | "none"
  | "stable-color"
  | "dominant-tension"
  | "modal-color"
  | "expanded-color"
  | "altered-tension";

export type NonDiatonicKind =
  | "borrowed"
  | "secondary-dominant"
  | "chromatic"
  | "unknown";

export type GuitarVoicingIntent =
  | "balanced"
  | "compact"
  | "open"
  | "bright"
  | "stable"
  | "color-rich";

export interface NoteDescriptor {
  name: NoteName;
  pitchClass: PitchClass;
}

export interface IntervalDefinition {
  semitones: number;
  shortName: IntervalShortName;
  nameEs: string;
  nameEn: string;
  aliases: string[];
}

export interface ChordDefinition {
  id: ChordQuality;
  symbol: string;
  aliases: string[];
  nameEs: string;
  nameEn: string;
  semitones: number[];
  formula: string[];
  family:
    | "triad"
    | "power"
    | "suspended"
    | "sixth"
    | "added"
    | "seventh"
    | "extended"
    | "altered";
  allowsOmit5?: boolean;
}

export interface BuiltChord {
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
  notes: NoteName[];
  pitchClasses: PitchClass[];
  semitones: number[];
  formula: string[];
  bass?: NoteName | null;
  inversion?: ChordInversionLabel;
  inversionLabel?: string;
  extensionCategory?: ChordExtensionCategory;
  contextualTag?: string | null;
}

export interface DetectedChordAlternative {
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
  confidence: number;
  bass: NoteName | null;
  inversion: ChordInversionLabel;
}

export interface TonalityCandidate {
  tonic: NoteName;
  mode: KeyMode;
  keyLabel: string;
  degree: string;
  chordSymbolInKey: string;
  functionLabel: HarmonicFunctionLabel;
  functionNameEs: string;
  confidence: number;
  diatonic: boolean;
  explanation: string;
  compatibleScale: string;
}

export interface GlobalKeyCandidate {
  tonic: NoteName;
  mode: KeyMode;
  keyLabel: string;
  totalScore: number;
  normalizedScore: number;
  reasons: string[];
  strongDegrees: string[];
  chordMatches: number;
  tonicWeight: number;
  dominantWeight: number;
  subdominantWeight: number;
  diatonicWeight: number;
  cadenceWeight: number;
  startEndWeight: number;
}

export interface TonalAmbiguity {
  isAmbiguous: boolean;
  kind: TonalAmbiguityKind;
  reason: string | null;
  alternatives: GlobalKeyCandidate[];
}

export interface ProgressionStepAnalysis {
  index: number;
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
  bass?: NoteName | null;
  inversion?: ChordInversionLabel;
  inversionLabel?: string;
  extensionCategory?: ChordExtensionCategory;
  slashContextKind?: SlashChordContextKind;
  slashContextLabel?: string | null;
  extensionContextKind?: ExtensionContextKind;
  extensionContextLabel?: string | null;
  degree: string;
  functionLabel: HarmonicFunctionLabel;
  functionNameEs: string;
  explanation: string;
  compatibleScale: string;
  confidence: number;
  diatonic: boolean;
  contextualWeight?: number;
  previousSymbol?: string | null;
  nextSymbol?: string | null;
  nonDiatonicKind?: NonDiatonicKind;
  nonDiatonicLabel?: string | null;
  nonDiatonicExplanation?: string | null;
}

export interface ProgressionAnalysis {
  input: string;
  normalizedSymbols: string[];
  detectedKey: TonalityCandidate | null;
  cadenceLabel: string | null;
  emotionalProfile: string;
  steps: ProgressionStepAnalysis[];
  keyCandidates?: GlobalKeyCandidate[];
  ambiguity?: TonalAmbiguity | null;
}

export interface RomanNumeralStep {
  raw: string;
  normalized: string;
  degreeIndex: number;
  qualityHint: ChordQuality;
}

export interface ResolvedRomanProgression {
  tonic: NoteName;
  mode: KeyMode;
  keyLabel: string;
  input: string;
  symbols: string[];
  chords: Array<{
    root: NoteName;
    quality: ChordQuality;
    symbol: string;
    degree: string;
    bass?: NoteName | null;
  }>;
}

export interface DetectedChord {
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
  notes: NoteName[];
  pitchClasses: PitchClass[];
  semitones: number[];
  confidence: number;
  bass: NoteName | null;
  inversion: ChordInversionLabel;
  matchedIntervals: number[];
  missingIntervals: number[];
  extraPitchClasses: number[];
  alternatives: DetectedChordAlternative[];
  tonalContext: {
    primary: TonalityCandidate | null;
    candidates: TonalityCandidate[];
  };
}

export interface ScaleDefinition {
  id: ScaleQuality;
  nameEs: string;
  nameEn: string;
  semitones: number[];
  formula: string[];
}

export interface BuiltScale {
  root: NoteName;
  quality: ScaleQuality;
  notes: NoteName[];
  semitones: number[];
  formula: string[];
}