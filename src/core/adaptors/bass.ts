import type { InstrumentVoicing, NoteName } from "@/core/types";

export interface BassRenderPosition {
  id: string;
  stringIndex: number;
  fret: number;
  note: NoteName;
  audioNote: string;
  label: string;
  isRoot: boolean;
}

export interface BassRenderVoicing {
  instrument: "bass";
  chordSymbol: string;
  root: NoteName;
  positions: BassRenderPosition[];
  minFret: number;
  maxFret: number;
  baseFret: number;
  difficulty: InstrumentVoicing["difficulty"];
  tags: string[];
}

export function adaptBassVoicingToRender(
  voicing: InstrumentVoicing
): BassRenderVoicing | null {
  if (voicing.instrument !== "bass") return null;

  const positions = voicing.strings
    .filter((stringNote) => !stringNote.muted && stringNote.note && stringNote.audioNote)
    .map((stringNote) => ({
      id: `bass-${stringNote.stringIndex}-${stringNote.fret}`,
      stringIndex: stringNote.stringIndex,
      fret: stringNote.fret ?? 0,
      note: stringNote.note as NoteName,
      audioNote: stringNote.audioNote as string,
      label: `Cuerda ${4 - stringNote.stringIndex}, traste ${stringNote.fret ?? 0}`,
      isRoot: stringNote.note === voicing.root,
    }));

  return {
    instrument: "bass",
    chordSymbol: voicing.chordSymbol,
    root: voicing.root,
    positions,
    minFret: voicing.minFret,
    maxFret: voicing.maxFret,
    baseFret: voicing.baseFret,
    difficulty: voicing.difficulty,
    tags: voicing.tags,
  };
}