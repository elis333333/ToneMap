import type {
  ChordDefinition,
  DetectedChord,
  DetectedChordAlternative,
  NoteName,
} from "@/core/types";
import { CHORD_DEFINITIONS, buildChordSymbol } from "@/core/theory/chords";
import {
  isValidNoteName,
  noteToPitchClass,
  pitchClassToSharp,
  uniquePitchClasses,
} from "@/core/theory/notes";
import { getIntervalBySemitones } from "@/core/theory/intervals";
import { getTonalityCandidatesForChord } from "@/core/theory/tonality";

export interface DetectedInterval {
  semitones: number;
  shortName: string;
  nameEs: string;
  notes: NoteName[];
}

interface ScoredChordCandidate {
  root: NoteName;
  quality: ChordDefinition["id"];
  symbol: string;
  notes: NoteName[];
  pitchClasses: number[];
  semitones: number[];
  confidence: number;
  bass: NoteName | null;
  inversion:
    | "root-position"
    | "1st-inversion"
    | "2nd-inversion"
    | "3rd-inversion"
    | "slash";
  matchedIntervals: number[];
  missingIntervals: number[];
  extraPitchClasses: number[];
}

function normalizePitchClassSet(values: number[]): number[] {
  return [...new Set(values.map((value) => ((value % 12) + 12) % 12))].sort(
    (a, b) => a - b
  );
}

function normalizeIntervalsFromRoot(values: number[], rootPc: number): number[] {
  return normalizePitchClassSet(values.map((pc) => pc - rootPc));
}

function getBassNote(inputNotes: NoteName[]): NoteName | null {
  if (inputNotes.length === 0) return null;
  return inputNotes[0] ?? null;
}

function getInversionFromBass(params: {
  bass: NoteName | null;
  root: NoteName;
  chordDefinition: ChordDefinition;
}): ScoredChordCandidate["inversion"] {
  const { bass, root, chordDefinition } = params;

  if (!bass) return "root-position";
  if (bass === root) return "root-position";

  const bassPc = noteToPitchClass(bass);
  const rootPc = noteToPitchClass(root);
  const bassInterval = ((bassPc - rootPc) % 12 + 12) % 12;

  const normalizedSemitones = normalizePitchClassSet(chordDefinition.semitones);

  const orderedChordTones = normalizedSemitones.filter(
    (interval) => interval !== 0
  );

  const foundIndex = orderedChordTones.findIndex((interval) => interval === bassInterval);

  if (foundIndex === 0) return "1st-inversion";
  if (foundIndex === 1) return "2nd-inversion";
  if (foundIndex === 2) return "3rd-inversion";

  return "slash";
}

function scoreCandidate(params: {
  inputPitchClasses: number[];
  rootPc: number;
  root: NoteName;
  chordDefinition: ChordDefinition;
  bass: NoteName | null;
}): ScoredChordCandidate | null {
  const { inputPitchClasses, rootPc, root, chordDefinition, bass } = params;

  const expectedIntervals = normalizePitchClassSet(chordDefinition.semitones);
  const actualIntervals = normalizeIntervalsFromRoot(inputPitchClasses, rootPc);

  const matchedIntervals = expectedIntervals.filter((interval) =>
    actualIntervals.includes(interval)
  );

  const missingIntervals = expectedIntervals.filter(
    (interval) => !actualIntervals.includes(interval)
  );

  const extraPitchClasses = actualIntervals.filter(
    (interval) => !expectedIntervals.includes(interval)
  );

  const hasRoot = actualIntervals.includes(0);
  if (!hasRoot) return null;

  let score = 0;

  score += matchedIntervals.length * 20;
  score -= extraPitchClasses.length * 18;

  if (missingIntervals.length === 0) {
    score += 24;
  } else {
    for (const missing of missingIntervals) {
      const isFifthLike = missing === 7 || missing === 6 || missing === 8;

      if (isFifthLike && chordDefinition.allowsOmit5) {
        score -= 4;
      } else if (isFifthLike) {
        score -= 10;
      } else {
        score -= 18;
      }
    }
  }

  const hasThirdLike =
    actualIntervals.includes(3) ||
    actualIntervals.includes(4);

  const requiresThird =
    chordDefinition.family !== "power" &&
    chordDefinition.family !== "suspended";

  if (requiresThird && hasThirdLike) {
    score += 12;
  }

  if (requiresThird && !hasThirdLike) {
    score -= 20;
  }

  if (bass) {
    const bassPc = noteToPitchClass(bass);
    const bassInterval = ((bassPc - rootPc) % 12 + 12) % 12;

    if (bassInterval === 0) {
      score += 12;
    } else if (expectedIntervals.includes(bassInterval)) {
      score += 6;
    } else {
      score -= 10;
    }
  }

  if (chordDefinition.family === "triad" && actualIntervals.length > 4) {
    score -= 8;
  }

  if (chordDefinition.family === "extended" && matchedIntervals.length >= 4) {
    score += 10;
  }

  if (score <= 0) return null;

  const notes = chordDefinition.semitones.map((interval) =>
    pitchClassToSharp(rootPc + interval)
  );

  const inversion = getInversionFromBass({
    bass,
    root,
    chordDefinition,
  });

  const symbol = buildChordSymbol(
    root,
    chordDefinition.id,
    bass && bass !== root ? bass : null
  );

  return {
    root,
    quality: chordDefinition.id,
    symbol,
    notes,
    pitchClasses: inputPitchClasses,
    semitones: chordDefinition.semitones,
    confidence: Math.max(1, Math.min(100, score)),
    bass,
    inversion,
    matchedIntervals,
    missingIntervals,
    extraPitchClasses,
  };
}

function compareCandidates(a: ScoredChordCandidate, b: ScoredChordCandidate): number {
  if (a.confidence !== b.confidence) {
    return b.confidence - a.confidence;
  }

  if (a.extraPitchClasses.length !== b.extraPitchClasses.length) {
    return a.extraPitchClasses.length - b.extraPitchClasses.length;
  }

  if (a.missingIntervals.length !== b.missingIntervals.length) {
    return a.missingIntervals.length - b.missingIntervals.length;
  }

  return a.symbol.localeCompare(b.symbol);
}

export function detectChordFromNotes(inputNotes: string[]): DetectedChord | null {
  const validNotes = inputNotes.filter(isValidNoteName) as NoteName[];

  if (validNotes.length < 2) return null;

  const pitchClasses = uniquePitchClasses(validNotes);
  const bass = getBassNote(validNotes);

  const candidates: ScoredChordCandidate[] = [];

  for (const rootPc of pitchClasses) {
    const root = pitchClassToSharp(rootPc);

    for (const chordDefinition of CHORD_DEFINITIONS) {
      const candidate = scoreCandidate({
        inputPitchClasses: pitchClasses,
        rootPc,
        root,
        chordDefinition,
        bass,
      });

      if (candidate) {
        candidates.push(candidate);
      }
    }
  }

  if (candidates.length === 0) return null;

  const sorted = [...candidates].sort(compareCandidates);
  const best = sorted[0];

  const alternatives: DetectedChordAlternative[] = sorted
    .slice(1, 4)
    .map((candidate) => ({
      root: candidate.root,
      quality: candidate.quality,
      symbol: candidate.symbol,
      confidence: candidate.confidence,
      bass: candidate.bass,
      inversion: candidate.inversion,
    }));

  const tonalCandidates = getTonalityCandidatesForChord({
    root: best.root,
    quality: best.quality,
  });

  return {
    root: best.root,
    quality: best.quality,
    symbol: best.symbol,
    notes: best.notes,
    pitchClasses,
    semitones: best.semitones,
    confidence: best.confidence,
    bass: best.bass,
    inversion: best.inversion,
    matchedIntervals: best.matchedIntervals,
    missingIntervals: best.missingIntervals,
    extraPitchClasses: best.extraPitchClasses,
    alternatives,
    tonalContext: {
      primary: tonalCandidates[0] ?? null,
      candidates: tonalCandidates,
    },
  };
}

export function detectIntervalFromNotes(inputNotes: string[]): DetectedInterval | null {
  const validNotes = inputNotes.filter(isValidNoteName) as NoteName[];

  if (validNotes.length !== 2) return null;

  const first = noteToPitchClass(validNotes[0]);
  const second = noteToPitchClass(validNotes[1]);
  const semitones = ((second - first) % 12 + 12) % 12;

  const definition = getIntervalBySemitones(semitones);
  if (!definition) return null;

  return {
    semitones,
    shortName: definition.shortName,
    nameEs: definition.nameEs,
    notes: validNotes,
  };
}