import type {
  IntervalDefinition,
  IntervalShortName,
  NoteName,
} from "@/core/types";
import { transposeNote } from "@/core/theory/notes";

export const INTERVALS: IntervalDefinition[] = [
  {
    semitones: 0,
    shortName: "1",
    nameEs: "unísono",
    nameEn: "unison",
    aliases: ["1", "unison", "unísono"],
  },
  {
    semitones: 1,
    shortName: "b2",
    nameEs: "segunda menor",
    nameEn: "minor second",
    aliases: ["b2", "segunda menor", "minor second", "b9", "novena menor"],
  },
  {
    semitones: 2,
    shortName: "2",
    nameEs: "segunda mayor",
    nameEn: "major second",
    aliases: ["2", "segunda mayor", "major second", "9", "novena"],
  },
  {
    semitones: 3,
    shortName: "b3",
    nameEs: "tercera menor",
    nameEn: "minor third",
    aliases: ["b3", "tercera menor", "minor third", "#9"],
  },
  {
    semitones: 4,
    shortName: "3",
    nameEs: "tercera mayor",
    nameEn: "major third",
    aliases: ["3", "tercera mayor", "major third"],
  },
  {
    semitones: 5,
    shortName: "4",
    nameEs: "cuarta justa",
    nameEn: "perfect fourth",
    aliases: ["4", "cuarta justa", "perfect fourth", "11", "once"],
  },
  {
    semitones: 6,
    shortName: "b5",
    nameEs: "tritono",
    nameEn: "tritone",
    aliases: ["b5", "tritono", "tritone", "#11"],
  },
  {
    semitones: 7,
    shortName: "5",
    nameEs: "quinta justa",
    nameEn: "perfect fifth",
    aliases: ["5", "quinta justa", "perfect fifth"],
  },
  {
    semitones: 8,
    shortName: "b6",
    nameEs: "sexta menor",
    nameEn: "minor sixth",
    aliases: ["b6", "sexta menor", "minor sixth", "b13"],
  },
  {
    semitones: 9,
    shortName: "6",
    nameEs: "sexta mayor",
    nameEn: "major sixth",
    aliases: ["6", "sexta mayor", "major sixth", "13", "trece"],
  },
  {
    semitones: 10,
    shortName: "b7",
    nameEs: "séptima menor",
    nameEn: "minor seventh",
    aliases: ["b7", "séptima menor", "minor seventh"],
  },
  {
    semitones: 11,
    shortName: "7",
    nameEs: "séptima mayor",
    nameEn: "major seventh",
    aliases: ["7", "séptima mayor", "major seventh"],
  },
];

export function getIntervalBySemitones(semitones: number): IntervalDefinition | null {
  const normalized = ((semitones % 12) + 12) % 12;
  return INTERVALS.find((interval) => interval.semitones === normalized) ?? null;
}

export function getIntervalByAlias(input: string): IntervalDefinition | null {
  const clean = input.trim().toLowerCase();

  return (
    INTERVALS.find((interval) =>
      interval.aliases.some((alias) => alias.toLowerCase() === clean)
    ) ?? null
  );
}

export function buildIntervalNotes(root: NoteName, semitones: number): NoteName[] {
  return [root, transposeNote(root, semitones)];
}

export function getIntervalFormula(semitones: number): IntervalShortName | null {
  return getIntervalBySemitones(semitones)?.shortName ?? null;
}