import type { NoteName, BarreInfo, DifficultyLevel } from "@/core/types";
import type { GeneratedGuitarVoicing } from "@/core/voicings/guitar";

export interface GuitarRenderPosition {
  id: string;
  stringIndex: number;
  fret: number;
  note: NoteName;
  audioNote: string;
  label: string;
  isRoot: boolean;
}

export interface GuitarRenderVoicing {
  instrument: "guitar";
  chordSymbol: string;
  root: NoteName;
  positions: GuitarRenderPosition[];
  mutedStrings: number[];
  minFret: number;
  maxFret: number;
  baseFret: number;
  usesBarre: boolean;
  barre: BarreInfo | null;
  difficulty: DifficultyLevel;
  tags: string[];
}

export function adaptGuitarVoicingToRender(
  voicing: GeneratedGuitarVoicing,
  meta: {
    root: NoteName;
    chordSymbol: string;
    tuningId?: "standard" | "drop-d";
  }
): GuitarRenderVoicing {
  const tuningId = meta.tuningId ?? "standard";

  const positions = voicing.positions.map((position) => ({
    id: `guitar-${tuningId}-${position.stringIndex}-${position.fret}`,
    stringIndex: position.stringIndex,
    fret: position.fret,
    note: position.note,
    audioNote: position.audioNote,
    label: `Cuerda ${6 - position.stringIndex}, traste ${position.fret}`,
    isRoot: position.note === meta.root,
  }));

  const playedFrets = voicing.positions.map((position) => position.fret);
  const nonZeroFrets = playedFrets.filter((fret) => fret > 0);

  const minFret = nonZeroFrets.length > 0 ? Math.min(...nonZeroFrets) : 0;
  const maxFret = playedFrets.length > 0 ? Math.max(...playedFrets) : 0;

  const tags = [
    voicing.source,
    voicing.usesBarre ? "barre" : "no-barre",
    `base-fret-${voicing.baseFret}`,
    voicing.character ?? "stable",
    voicing.shapeType ?? "unknown-shape",
    voicing.shapeId ?? "no-shape-id",
  ];

  return {
    instrument: "guitar",
    chordSymbol: meta.chordSymbol,
    root: meta.root,
    positions,
    mutedStrings: voicing.mutedStrings,
    minFret,
    maxFret,
    baseFret: voicing.baseFret,
    usesBarre: voicing.usesBarre,
    barre: null,
    difficulty: voicing.difficulty,
    tags,
  };
}