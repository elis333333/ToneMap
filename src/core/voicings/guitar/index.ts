import type {
  ChordQuality,
  GuitarShapeDefinition,
  GuitarVoicingIntent,
  NoteName,
} from "@/core/types";
import type { GuitarTuning } from "@/data/tunings/guitar";
import { buildChord } from "@/core/theory/chords";
import { noteToPitchClass, transposeNote } from "@/core/theory/notes";
import { getGuitarShapesByQuality } from "@/core/shapes/guitar";
import {
  sortGuitarVoicingsByMusicalScore,
  type GuitarVoicingCandidate,
  type PreviousGuitarVoicingReference,
  type GuitarVoicingCharacter,
} from "@/core/voicings/guitar/scoreVoicing";

export interface GeneratedGuitarPosition {
  stringIndex: number;
  fret: number;
  note: NoteName;
  audioNote: string;
}

export interface GeneratedGuitarVoicing {
  positions: GeneratedGuitarPosition[];
  baseFret: number;
  difficulty: "easy" | "medium" | "hard";
  usesBarre: boolean;
  mutedStrings: number[];
  musicalScore?: number;
  character?: GuitarVoicingCharacter;
  source: "shape" | "fallback";
  shapeId?: string;
  shapeType?: string;
  scoreBreakdown?: {
    fretRange: number;
    compactness: number;
    openStringBonus: number;
    lowBassBonus: number;
    barrePenalty: number;
    highFretPenalty: number;
    stringSkipPenalty: number;
    baseFretContinuity: number;
    averageMotion: number;
    topVoiceContinuity: number;
    extensionBonus: number;
    upperStringColorBonus: number;
    intentBonus: number;
    duplicatePenalty: number;
    stringCoverageBonus: number;
    ergonomicPenalty: number;
    rootBassBonus: number;
  };
}

export interface GenerateGuitarVoicingsParams {
  root: NoteName;
  quality: ChordQuality;
  tuning: GuitarTuning;
  previousVoicing?: PreviousGuitarVoicingReference | null;
  intent?: GuitarVoicingIntent;
}

export interface GenerateGuitarVoicingsResult {
  primary: GeneratedGuitarVoicing | null;
  variants: GeneratedGuitarVoicing[];
}

const OPEN_SHAPE_ROOTS: Record<string, NoteName> = {
  "open-c-major": "C",
  "open-a-major": "A",
  "open-g-major": "G",
  "open-e-major": "E",
  "open-d-major": "D",
  "open-a-minor": "A",
  "open-e-minor": "E",
  "open-d-minor": "D",
  "open-c-maj7": "C",
  "open-a-minor7": "A",
  "open-e7": "E",
  "open-d7": "D",
};

function midiFromAudioNote(audioNote: string) {
  const match = audioNote.match(/^([A-G](?:#|b)?)(-?\d+)$/);
  if (!match) return 60;

  const [, note, octaveText] = match;
  const octave = Number(octaveText);

  const noteToPc: Record<string, number> = {
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

  return (octave + 1) * 12 + (noteToPc[note] ?? 0);
}

function buildAudioNote(openAudioNote: string, fret: number) {
  const openMidi = midiFromAudioNote(openAudioNote);
  const midi = openMidi + fret;

  const pcs = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const pitchClass = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;

  return `${pcs[pitchClass]}${octave}`;
}

function noteNameFromAudioNote(audioNote: string): NoteName {
  const match = audioNote.match(/^([A-G](?:#|b)?)-?\d+$/);
  return (match?.[1] as NoteName) ?? "C";
}

function getRootStringIndex(rootString: number) {
  return 6 - rootString;
}

function getShapeRootNote(shape: GuitarShapeDefinition, tuning: GuitarTuning): NoteName | null {
  if (shape.type === "open") {
    return OPEN_SHAPE_ROOTS[shape.id] ?? null;
  }
if (shape.rootString === null || shape.rootString === undefined) {
    return null;
  }
  const rootStringIndex = getRootStringIndex(shape.rootString);
  const rootString = tuning.strings[rootStringIndex];

  return rootString?.openNote ?? null;
}

function getBaseFretForShape(
  shape: GuitarShapeDefinition,
  targetRoot: NoteName,
  tuning: GuitarTuning
): number | null {
  const shapeRoot = getShapeRootNote(shape, tuning);
  if (!shapeRoot) return null;

  if (shape.type === "open" && !shape.movable) {
    return shapeRoot === targetRoot ? 0 : null;
  }

  const shapeRootPc = noteToPitchClass(shapeRoot);
  const targetRootPc = noteToPitchClass(targetRoot);
  const diff = (targetRootPc - shapeRootPc + 12) % 12;

  return diff;
}

function containsRequiredChordTones(
  positions: GeneratedGuitarPosition[],
  chordNotes: NoteName[]
) {
  const used = new Set(positions.map((position) => position.note));
  return chordNotes.every((note) => used.has(note));
}

function estimateDifficulty(params: {
  baseFret: number;
  usesBarre: boolean;
  shapeType?: string;
  mutedStrings: number[];
}) {
  const { baseFret, usesBarre, shapeType, mutedStrings } = params;

  if (shapeType === "open" && !usesBarre) return "easy" as const;
  if (usesBarre && baseFret >= 7) return "hard" as const;
  if (usesBarre || mutedStrings.length >= 2 || baseFret >= 5) return "medium" as const;
  return "easy" as const;
}

function buildCandidateFromShape(params: {
  root: NoteName;
  quality: ChordQuality;
  tuning: GuitarTuning;
  shape: GuitarShapeDefinition;
}): (GuitarVoicingCandidate & {
  source: "shape";
  shapeId: string;
  shapeType: string;
}) | null {
  const chord = buildChord(params.root, params.quality);
  const baseFret = getBaseFretForShape(params.shape, params.root, params.tuning);

  if (baseFret === null) return null;

  if (params.shape.type === "open" && params.tuning.id !== "standard") {
    return null;
  }

  const positions: GeneratedGuitarPosition[] = [];
  const mutedStrings: number[] = [];

  for (let stringIndex = 0; stringIndex < params.shape.strings.length; stringIndex += 1) {
    const shapeValue = params.shape.strings[stringIndex];

    if (shapeValue === "x") {
      mutedStrings.push(stringIndex);
      continue;
    }

    const openString = params.tuning.strings[stringIndex];
    if (!openString) {
      mutedStrings.push(stringIndex);
      continue;
    }

    const fret = baseFret + shapeValue;

    if (fret < 0 || fret > 15) {
      return null;
    }

    const audioNote = buildAudioNote(openString.openAudioNote, fret);
    const note = noteNameFromAudioNote(audioNote);

    positions.push({
      stringIndex,
      fret,
      note,
      audioNote,
    });
  }

  if (positions.length < 3) return null;
  if (!containsRequiredChordTones(positions, chord.notes)) return null;

  return {
    positions,
    baseFret,
    difficulty: estimateDifficulty({
      baseFret,
      usesBarre: params.shape.usesBarre,
      shapeType: params.shape.type,
      mutedStrings,
    }),
    usesBarre: params.shape.usesBarre,
    mutedStrings,
    source: "shape",
    shapeId: params.shape.id,
    shapeType: params.shape.type,
  };
}

function buildFallbackCandidateFromWindow(params: {
  startFret: number;
  root: NoteName;
  quality: ChordQuality;
  tuning: GuitarTuning;
}): (GuitarVoicingCandidate & {
  source: "fallback";
}) | null {
  const chord = buildChord(params.root, params.quality);
  const allowedNotes = new Set(chord.notes);

  const positions: GeneratedGuitarPosition[] = [];
  const mutedStrings: number[] = [];

  for (let stringIndex = 0; stringIndex < params.tuning.strings.length; stringIndex += 1) {
    const openString = params.tuning.strings[stringIndex];
    let chosen: GeneratedGuitarPosition | null = null;

    for (let fret = params.startFret; fret <= params.startFret + 4; fret += 1) {
      const audioNote = buildAudioNote(openString.openAudioNote, fret);
      const note = noteNameFromAudioNote(audioNote);

      if (allowedNotes.has(note)) {
        chosen = {
          stringIndex,
          fret,
          note,
          audioNote,
        };
        break;
      }
    }

    if (chosen) {
      positions.push(chosen);
    } else {
      mutedStrings.push(stringIndex);
    }
  }

  if (positions.length < 3) return null;
  if (!containsRequiredChordTones(positions, chord.notes)) return null;

  const usesBarre = positions.filter((position) => position.fret > 0).length >= 4;

  return {
    positions,
    baseFret: params.startFret,
    difficulty: estimateDifficulty({
      baseFret: params.startFret,
      usesBarre,
      mutedStrings,
    }),
    usesBarre,
    mutedStrings,
    source: "fallback",
  };
}

function dedupeCandidates<T extends GuitarVoicingCandidate & { source: "shape" | "fallback" }>(
  candidates: T[]
) {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const candidate of candidates) {
    const key = candidate.positions
      .map((position) => `${position.stringIndex}:${position.fret}`)
      .join("|");

    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(candidate);
  }

  return unique;
}

function getShapePriorityBonus(shapeType?: string) {
  if (shapeType === "open") return 8;
  if (shapeType === "barre-e" || shapeType === "barre-a") return 4;
  return 0;
}

export function generateGuitarVoicings(
  params: GenerateGuitarVoicingsParams
): GenerateGuitarVoicingsResult {
  const shapeCandidates = getGuitarShapesByQuality(params.quality)
    .map((shape) =>
      buildCandidateFromShape({
        root: params.root,
        quality: params.quality,
        tuning: params.tuning,
        shape,
      })
    )
    .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null);

  const fallbackCandidates: Array<
    GuitarVoicingCandidate & {
      source: "fallback";
    }
  > = [];

  if (shapeCandidates.length === 0) {
    for (let startFret = 0; startFret <= 12; startFret += 1) {
      const fallback = buildFallbackCandidateFromWindow({
        startFret,
        root: params.root,
        quality: params.quality,
        tuning: params.tuning,
      });

      if (fallback) {
        fallbackCandidates.push(fallback);
      }
    }
  }

  const candidates = dedupeCandidates([...shapeCandidates, ...fallbackCandidates]);

  if (candidates.length === 0) {
    return {
      primary: null,
      variants: [],
    };
  }

  const sorted = sortGuitarVoicingsByMusicalScore(
    candidates,
    params.previousVoicing ?? null,
    params.intent ?? "balanced"
  ).sort((a, b) => {
    const shapeBonusA = getShapePriorityBonus((a as { shapeType?: string }).shapeType);
    const shapeBonusB = getShapePriorityBonus((b as { shapeType?: string }).shapeType);

    const scoreA = a.musicalScore + shapeBonusA;
    const scoreB = b.musicalScore + shapeBonusB;

    if (scoreA !== scoreB) return scoreB - scoreA;
    return a.baseFret - b.baseFret;
  });

  const variants: GeneratedGuitarVoicing[] = sorted.slice(0, 6).map((candidate) => ({
    positions: candidate.positions,
    baseFret: candidate.baseFret,
    difficulty: candidate.difficulty,
    usesBarre: candidate.usesBarre,
    mutedStrings: candidate.mutedStrings ?? [],
    musicalScore: candidate.musicalScore,
    character: candidate.character,
    source: candidate.source,
    shapeId: (candidate as { shapeId?: string }).shapeId,
    shapeType: (candidate as { shapeType?: string }).shapeType,
    scoreBreakdown: candidate.scoreBreakdown,
  }));

  return {
    primary: variants[0] ?? null,
    variants,
  };
}

export type { PreviousGuitarVoicingReference };