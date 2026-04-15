import type { BuiltScale, NoteName, ScaleDefinition, ScaleQuality } from "@/core/types";
import { noteToPitchClass, pitchClassToSharp } from "@/core/theory/notes";

export const SCALE_DEFINITIONS: ScaleDefinition[] = [
  {
    id: "major",
    nameEs: "escala mayor",
    nameEn: "major scale",
    semitones: [0, 2, 4, 5, 7, 9, 11],
    formula: ["1", "2", "3", "4", "5", "6", "7"],
  },
  {
    id: "naturalMinor",
    nameEs: "escala menor natural",
    nameEn: "natural minor scale",
    semitones: [0, 2, 3, 5, 7, 8, 10],
    formula: ["1", "2", "b3", "4", "5", "b6", "b7"],
  },
  {
    id: "majorPentatonic",
    nameEs: "pentatónica mayor",
    nameEn: "major pentatonic",
    semitones: [0, 2, 4, 7, 9],
    formula: ["1", "2", "3", "5", "6"],
  },
  {
    id: "minorPentatonic",
    nameEs: "pentatónica menor",
    nameEn: "minor pentatonic",
    semitones: [0, 3, 5, 7, 10],
    formula: ["1", "b3", "4", "5", "b7"],
  },
];

export function getScaleDefinitionByQuality(
  quality: ScaleQuality
): ScaleDefinition | null {
  return SCALE_DEFINITIONS.find((scale) => scale.id === quality) ?? null;
}

export function buildScale(root: NoteName, quality: ScaleQuality): BuiltScale {
  const definition = getScaleDefinitionByQuality(quality);

  if (!definition) {
    throw new Error(`No scale definition found for quality: ${quality}`);
  }

  const rootPc = noteToPitchClass(root);

  const notes = definition.semitones.map((interval) =>
    pitchClassToSharp(rootPc + interval)
  );

  return {
    root,
    quality,
    notes,
    semitones: definition.semitones,
    formula: definition.formula,
  };
}

export function getRelatedScalesForChordQuality(
  quality: "major" | "minor" | "maj7" | "m7" | "dominant7"
): ScaleQuality[] {
  switch (quality) {
    case "major":
    case "maj7":
      return ["major", "majorPentatonic"];
    case "minor":
    case "m7":
      return ["naturalMinor", "minorPentatonic"];
    case "dominant7":
      return ["major", "majorPentatonic"];
    default:
      return [];
  }
}