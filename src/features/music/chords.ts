import { CHORD_FORMULAS } from "./formulas";
import { noteToPitchClass, pitchClassToSharp } from "./notes";
import type { ChordQuality, NoteName } from "./types";

export function getChordDefinitionByQuality(quality: ChordQuality) {
  return CHORD_FORMULAS.find((chord) => chord.id === quality) ?? null;
}

export function buildChordNotes(root: NoteName, quality: ChordQuality): NoteName[] {
  const definition = getChordDefinitionByQuality(quality);

  if (!definition) {
    throw new Error(`No chord definition found for quality: ${quality}`);
  }

  const rootPc = noteToPitchClass(root);

  return definition.semitones.map((interval) => pitchClassToSharp(rootPc + interval));
}

export function buildChordSymbol(root: NoteName, quality: ChordQuality): string {
  const definition = getChordDefinitionByQuality(quality);

  if (!definition) {
    throw new Error(`No chord definition found for quality: ${quality}`);
  }

  return `${root}${definition.symbol}`;
}