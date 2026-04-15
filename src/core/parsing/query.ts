import { getIntervalByAlias } from "@/core/theory/intervals";
import {
  consumeLeadingNoteToken,
  isValidNoteName,
  normalizeNoteInput,
  spanishToEnglishNote,
} from "@/core/theory/notes";
import {
  buildChordSymbol,
  resolveChordQuality,
} from "@/core/theory/chords";
import { parseRomanNumeralProgression } from "@/core/theory/romanNumerals";
import type { ChordQuality, KeyMode, NoteName } from "@/core/types";

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
  bass?: NoteName | null;
}

export interface ParsedInterval {
  kind: "interval";
  root: NoteName;
  semitones: number;
  shortName: string;
  nameEs: string;
  symbol: string;
}

export interface ParsedProgressionChord {
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
  bass?: NoteName | null;
}

export interface ParsedProgression {
  kind: "progression";
  raw: string;
  chords: ParsedProgressionChord[];
  symbol: string;
}

export interface ParsedRomanProgression {
  kind: "roman-progression";
  raw: string;
  mode: KeyMode;
  degrees: string[];
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
  | ParsedProgression
  | ParsedRomanProgression
  | ParsedUnknown;

function normalizeQuery(input: string) {
  return spanishToEnglishNote(normalizeNoteInput(input))
    .replace(/\s+/g, " ")
    .trim();
}

function splitSlashBass(rest: string): {
  descriptor: string;
  bass: NoteName | null;
} {
  const [descriptorRaw, bassRaw] = rest.split("/", 2);

  if (!bassRaw) {
    return {
      descriptor: descriptorRaw.trim(),
      bass: null,
    };
  }

  const maybeBass = consumeLeadingNoteToken(bassRaw.trim());

  return {
    descriptor: descriptorRaw.trim(),
    bass: maybeBass.note && maybeBass.rest.length === 0 ? maybeBass.note : null,
  };
}

function parseSingleChordToken(token: string): ParsedProgressionChord | null {
  const normalized = normalizeQuery(token);
  if (!normalized) return null;

  const leading = consumeLeadingNoteToken(normalized);

  if (!leading.note || !isValidNoteName(leading.note)) {
    return null;
  }

  const root = leading.note;
  const rest = leading.rest.trim();

  if (!rest) {
    return {
      root,
      quality: "major",
      symbol: root,
      bass: null,
    };
  }

  const { descriptor, bass } = splitSlashBass(rest);
  const quality = resolveChordQuality(descriptor);

  if (!quality) return null;

  return {
    root,
    quality,
    bass,
    symbol: buildChordSymbol(root, quality, bass),
  };
}

function splitProgressionTokens(input: string): string[] {
  return input
    .split(/\s*(?:\||-|–|—|>|,|;)\s*/g)
    .map((token) => token.trim())
    .filter(Boolean);
}

function parseProgression(input: string): ParsedProgression | null {
  const tokens = splitProgressionTokens(input);

  if (tokens.length < 2) return null;

  const chords = tokens
    .map(parseSingleChordToken)
    .filter((item): item is ParsedProgressionChord => item !== null);

  if (chords.length !== tokens.length || chords.length < 2) {
    return null;
  }

  return {
    kind: "progression",
    raw: input,
    chords,
    symbol: chords.map((chord) => chord.symbol).join(" – "),
  };
}

function parseRomanProgression(input: string): ParsedRomanProgression | null {
  const parsed = parseRomanNumeralProgression(input);
  if (!parsed || parsed.steps.length < 2) return null;

  return {
    kind: "roman-progression",
    raw: input,
    mode: parsed.mode,
    degrees: parsed.steps.map((step) => step.normalized),
    symbol: parsed.steps.map((step) => step.normalized).join(" – "),
  };
}

export function parseMusicQuery(input: string): ParsedEntity {
  const romanProgression = parseRomanProgression(input);
  if (romanProgression) {
    return romanProgression;
  }

  const progression = parseProgression(input);
  if (progression) {
    return progression;
  }

  const normalized = normalizeQuery(input);

  if (!normalized) {
    return { kind: "unknown", raw: input };
  }

  const leading = consumeLeadingNoteToken(normalized);

  if (leading.note && isValidNoteName(leading.note)) {
    const root = leading.note;
    const rest = leading.rest.trim();

    if (!rest) {
      return {
        kind: "note",
        root,
        symbol: root,
      };
    }

    const { descriptor, bass } = splitSlashBass(rest);
    const quality = resolveChordQuality(descriptor);

    if (quality) {
      return {
        kind: "chord",
        root,
        quality,
        bass,
        symbol: buildChordSymbol(root, quality, bass),
      };
    }

    const interval = getIntervalByAlias(descriptor);
    if (interval) {
      return {
        kind: "interval",
        root,
        semitones: interval.semitones,
        shortName: interval.shortName,
        nameEs: interval.nameEs,
        symbol: `${root} ${interval.shortName}`,
      };
    }
  }

  const interval = getIntervalByAlias(normalized);
  if (interval) {
    return {
      kind: "interval",
      root: "C",
      semitones: interval.semitones,
      shortName: interval.shortName,
      nameEs: interval.nameEs,
      symbol: interval.shortName,
    };
  }

  return { kind: "unknown", raw: input };
}