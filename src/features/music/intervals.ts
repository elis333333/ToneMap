import { transposeNote } from "./notes";
import type { NoteName } from "./types";

export interface IntervalDefinition {
  semitones: number;
  short: string;
  nameEs: string;
  nameEn: string;
  aliases: string[];
}

export const INTERVALS: IntervalDefinition[] = [
  {
    semitones: 0,
    short: "1",
    nameEs: "unísono",
    nameEn: "unison",
    aliases: ["1", "unison", "unísono"],
  },
  {
    semitones: 1,
    short: "b2",
    nameEs: "segunda menor",
    nameEn: "minor second",
    aliases: ["b2", "segunda menor", "minor second"],
  },
  {
    semitones: 2,
    short: "2",
    nameEs: "segunda mayor",
    nameEn: "major second",
    aliases: ["2", "segunda mayor", "major second"],
  },
  {
    semitones: 3,
    short: "b3",
    nameEs: "tercera menor",
    nameEn: "minor third",
    aliases: ["b3", "tercera menor", "minor third"],
  },
  {
    semitones: 4,
    short: "3",
    nameEs: "tercera mayor",
    nameEn: "major third",
    aliases: ["3", "tercera mayor", "major third"],
  },
  {
    semitones: 5,
    short: "4",
    nameEs: "cuarta justa",
    nameEn: "perfect fourth",
    aliases: ["4", "cuarta justa", "perfect fourth"],
  },
  {
    semitones: 6,
    short: "b5",
    nameEs: "tritono",
    nameEn: "tritone",
    aliases: ["b5", "tritono", "tritone"],
  },
  {
    semitones: 7,
    short: "5",
    nameEs: "quinta justa",
    nameEn: "perfect fifth",
    aliases: ["5", "quinta justa", "perfect fifth"],
  },
  {
    semitones: 8,
    short: "b6",
    nameEs: "sexta menor",
    nameEn: "minor sixth",
    aliases: ["b6", "sexta menor", "minor sixth"],
  },
  {
    semitones: 9,
    short: "6",
    nameEs: "sexta mayor",
    nameEn: "major sixth",
    aliases: ["6", "sexta mayor", "major sixth"],
  },
  {
    semitones: 10,
    short: "b7",
    nameEs: "séptima menor",
    nameEn: "minor seventh",
    aliases: ["b7", "séptima menor", "minor seventh"],
  },
  {
    semitones: 11,
    short: "7",
    nameEs: "séptima mayor",
    nameEn: "major seventh",
    aliases: ["7", "séptima mayor", "major seventh"],
  },
];

export function getIntervalBySemitones(semitones: number) {
  const normalized = ((semitones % 12) + 12) % 12;
  return INTERVALS.find((interval) => interval.semitones === normalized) ?? null;
}

export function getIntervalByAlias(input: string) {
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