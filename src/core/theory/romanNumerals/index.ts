import type {
  ChordQuality,
  KeyMode,
  NoteName,
  ResolvedRomanProgression,
  RomanNumeralStep,
} from "@/core/types";
import { buildChordSymbol } from "@/core/theory/chords";
import { noteToPitchClass, pitchClassToSharp } from "@/core/theory/notes";

const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

type RomanMapEntry = {
  degreeIndex: number;
  quality: ChordQuality;
};

const MAJOR_ROMAN_MAP: Record<string, RomanMapEntry> = {
  I: { degreeIndex: 0, quality: "major" },
  I7: { degreeIndex: 0, quality: "maj7" },
  ii: { degreeIndex: 1, quality: "minor" },
  ii7: { degreeIndex: 1, quality: "m7" },
  iii: { degreeIndex: 2, quality: "minor" },
  iii7: { degreeIndex: 2, quality: "m7" },
  IV: { degreeIndex: 3, quality: "major" },
  IV7: { degreeIndex: 3, quality: "maj7" },
  V: { degreeIndex: 4, quality: "major" },
  V7: { degreeIndex: 4, quality: "dominant7" },
  vi: { degreeIndex: 5, quality: "minor" },
  vi7: { degreeIndex: 5, quality: "m7" },
  "vii°": { degreeIndex: 6, quality: "diminished" },
};

const MINOR_ROMAN_MAP: Record<string, RomanMapEntry> = {
  i: { degreeIndex: 0, quality: "minor" },
  i7: { degreeIndex: 0, quality: "m7" },
  "ii°": { degreeIndex: 1, quality: "diminished" },
  III: { degreeIndex: 2, quality: "major" },
  III7: { degreeIndex: 2, quality: "maj7" },
  iv: { degreeIndex: 3, quality: "minor" },
  iv7: { degreeIndex: 3, quality: "m7" },
  v: { degreeIndex: 4, quality: "minor" },
  V: { degreeIndex: 4, quality: "major" },
  V7: { degreeIndex: 4, quality: "dominant7" },
  VI: { degreeIndex: 5, quality: "major" },
  VI7: { degreeIndex: 5, quality: "maj7" },
  VII: { degreeIndex: 6, quality: "major" },
  VII7: { degreeIndex: 6, quality: "dominant7" },
};

function splitRomanTokens(input: string): string[] {
  return input
    .split(/\s*(?:\||-|–|—|>|,|;)\s*/g)
    .map((token) => token.trim())
    .filter(Boolean);
}

function normalizeRomanToken(token: string): string {
  return token
    .trim()
    .replace(/º/g, "°")
    .replace(/ø/g, "°")
    .replace(/\s+/g, "");
}

function getRomanEntryFromMode(
  token: string,
  mode: KeyMode
): RomanMapEntry | null {
  const primaryMap = mode === "major" ? MAJOR_ROMAN_MAP : MINOR_ROMAN_MAP;
  const secondaryMap = mode === "major" ? MINOR_ROMAN_MAP : MAJOR_ROMAN_MAP;

  if (primaryMap[token]) return primaryMap[token];
  if (secondaryMap[token]) return secondaryMap[token];

  return null;
}

function inferQualityFromRomanToken(token: string): ChordQuality | null {
  if (token.endsWith("7")) {
    const base = token.slice(0, -1);

    if (base === "V" || base === "v") return "dominant7";

    if (
      base === "I" ||
      base === "IV" ||
      base === "III" ||
      base === "VI" ||
      base === "VII"
    ) {
      return "maj7";
    }

    if (
      base === "i" ||
      base === "ii" ||
      base === "iii" ||
      base === "iv" ||
      base === "v" ||
      base === "vi"
    ) {
      return "m7";
    }
  }

  if (token.includes("°")) {
    return "diminished";
  }

  const lettersOnly = token.replace(/[0-9°]/g, "");
  if (!lettersOnly) return null;

  const first = lettersOnly[0];
  return first === first.toUpperCase() ? "major" : "minor";
}

function getDegreeIndexFromRomanToken(token: string): number | null {
  const normalized = token.replace(/[0-9°]/g, "");

  switch (normalized.toUpperCase()) {
    case "I":
      return 0;
    case "II":
      return 1;
    case "III":
      return 2;
    case "IV":
      return 3;
    case "V":
      return 4;
    case "VI":
      return 5;
    case "VII":
      return 6;
    default:
      return null;
  }
}

function getLooseFallbackEntry(token: string): RomanMapEntry | null {
  const degreeIndex = getDegreeIndexFromRomanToken(token);
  const quality = inferQualityFromRomanToken(token);

  if (degreeIndex === null || !quality) return null;

  return {
    degreeIndex,
    quality,
  };
}

export function parseRomanNumeralProgression(
  input: string,
  forcedMode?: KeyMode
): {
  mode: KeyMode;
  steps: RomanNumeralStep[];
} | null {
  const tokens = splitRomanTokens(input);
  if (tokens.length < 2) return null;

  const normalizedTokens = tokens.map(normalizeRomanToken);
  const mode = forcedMode ?? "major";

  const steps: RomanNumeralStep[] = [];

  for (const token of normalizedTokens) {
    const mapped =
      getRomanEntryFromMode(token, mode) ?? getLooseFallbackEntry(token);

    if (!mapped) {
      return null;
    }

    steps.push({
      raw: token,
      normalized: token,
      degreeIndex: mapped.degreeIndex,
      qualityHint: mapped.quality,
    });
  }

  return {
    mode,
    steps,
  };
}

export function resolveRomanProgression(params: {
  input: string;
  tonic: NoteName;
  mode: KeyMode;
}): ResolvedRomanProgression | null {
  const parsed = parseRomanNumeralProgression(params.input, params.mode);
  if (!parsed) return null;

  const scaleIntervals =
    parsed.mode === "major" ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;

  const tonicPc = noteToPitchClass(params.tonic);

  const chords = parsed.steps.map((step) => {
    const root = pitchClassToSharp(tonicPc + scaleIntervals[step.degreeIndex]);
    const symbol = buildChordSymbol(root, step.qualityHint);

    return {
      root,
      quality: step.qualityHint,
      symbol,
      degree: step.normalized,
    };
  });

  return {
    tonic: params.tonic,
    mode: parsed.mode,
    keyLabel: `${params.tonic} ${parsed.mode === "major" ? "mayor" : "menor"}`,
    input: params.input,
    symbols: chords.map((chord) => chord.symbol),
    chords,
  };
}

export function looksLikeRomanNumeralProgression(
  input: string,
  forcedMode?: KeyMode
): boolean {
  return parseRomanNumeralProgression(input, forcedMode) !== null;
}