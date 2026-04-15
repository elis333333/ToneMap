import type {
  BuiltChord,
  ChordDefinition,
  ChordExtensionCategory,
  ChordInversionLabel,
  ChordQuality,
  NoteName,
} from "@/core/types";
import {
  noteToPitchClass,
  pitchClassToSharp,
  uniquePitchClasses,
} from "@/core/theory/notes";

export const CHORD_DEFINITIONS: ChordDefinition[] = [
  {
    id: "major",
    symbol: "",
    aliases: ["", "major", "mayor", "maj"],
    nameEs: "mayor",
    nameEn: "major",
    semitones: [0, 4, 7],
    formula: ["1", "3", "5"],
    family: "triad",
  },
  {
    id: "minor",
    symbol: "m",
    aliases: ["m", "minor", "menor", "min"],
    nameEs: "menor",
    nameEn: "minor",
    semitones: [0, 3, 7],
    formula: ["1", "b3", "5"],
    family: "triad",
  },
  {
    id: "diminished",
    symbol: "dim",
    aliases: ["dim", "diminished", "disminuido"],
    nameEs: "disminuido",
    nameEn: "diminished",
    semitones: [0, 3, 6],
    formula: ["1", "b3", "b5"],
    family: "triad",
  },
  {
    id: "augmented",
    symbol: "aug",
    aliases: ["aug", "augmented", "aumentado"],
    nameEs: "aumentado",
    nameEn: "augmented",
    semitones: [0, 4, 8],
    formula: ["1", "3", "#5"],
    family: "triad",
  },
  {
    id: "power",
    symbol: "5",
    aliases: ["5", "power", "powerchord"],
    nameEs: "quinta",
    nameEn: "power chord",
    semitones: [0, 7],
    formula: ["1", "5"],
    family: "power",
  },
  {
    id: "sus2",
    symbol: "sus2",
    aliases: ["sus2"],
    nameEs: "suspendido segunda",
    nameEn: "suspended second",
    semitones: [0, 2, 7],
    formula: ["1", "2", "5"],
    family: "suspended",
  },
  {
    id: "sus4",
    symbol: "sus4",
    aliases: ["sus4"],
    nameEs: "suspendido cuarta",
    nameEn: "suspended fourth",
    semitones: [0, 5, 7],
    formula: ["1", "4", "5"],
    family: "suspended",
  },
  {
    id: "major6",
    symbol: "6",
    aliases: ["6", "maj6", "major6", "mayor6"],
    nameEs: "sexta mayor",
    nameEn: "major sixth",
    semitones: [0, 4, 7, 9],
    formula: ["1", "3", "5", "6"],
    family: "sixth",
  },
  {
    id: "minor6",
    symbol: "m6",
    aliases: ["m6", "min6", "minor6", "menor6"],
    nameEs: "sexta menor",
    nameEn: "minor sixth",
    semitones: [0, 3, 7, 9],
    formula: ["1", "b3", "5", "6"],
    family: "sixth",
  },
  {
    id: "add9",
    symbol: "add9",
    aliases: ["add9", "add2"],
    nameEs: "add nueve",
    nameEn: "add nine",
    semitones: [0, 4, 7, 14],
    formula: ["1", "3", "5", "9"],
    family: "added",
  },
  {
    id: "madd9",
    symbol: "m(add9)",
    aliases: [
      "madd9",
      "m(add9)",
      "minadd9",
      "minoradd9",
      "menoradd9",
      "madd2",
    ],
    nameEs: "menor add nueve",
    nameEn: "minor add nine",
    semitones: [0, 3, 7, 14],
    formula: ["1", "b3", "5", "9"],
    family: "added",
  },
  {
    id: "maj7",
    symbol: "maj7",
    aliases: ["maj7", "major7", "mayor7", "ma7", "Δ7"],
    nameEs: "séptima mayor",
    nameEn: "major seventh",
    semitones: [0, 4, 7, 11],
    formula: ["1", "3", "5", "7"],
    family: "seventh",
  },
  {
    id: "m7",
    symbol: "m7",
    aliases: ["m7", "min7", "minor7", "menor7"],
    nameEs: "séptima menor",
    nameEn: "minor seventh",
    semitones: [0, 3, 7, 10],
    formula: ["1", "b3", "5", "b7"],
    family: "seventh",
  },
  {
    id: "dominant7",
    symbol: "7",
    aliases: ["7", "dom7", "dominant7", "dominante7"],
    nameEs: "séptima dominante",
    nameEn: "dominant seventh",
    semitones: [0, 4, 7, 10],
    formula: ["1", "3", "5", "b7"],
    family: "seventh",
  },
  {
    id: "mMaj7",
    symbol: "mMaj7",
    aliases: ["mmaj7", "mmaj", "minmaj7", "minormajor7"],
    nameEs: "menor séptima mayor",
    nameEn: "minor major seventh",
    semitones: [0, 3, 7, 11],
    formula: ["1", "b3", "5", "7"],
    family: "seventh",
  },
  {
    id: "m7b5",
    symbol: "m7b5",
    aliases: ["m7b5", "min7b5", "halfdim", "ø", "ø7"],
    nameEs: "semidisminuido",
    nameEn: "half diminished",
    semitones: [0, 3, 6, 10],
    formula: ["1", "b3", "b5", "b7"],
    family: "altered",
  },
  {
    id: "dim7",
    symbol: "dim7",
    aliases: ["dim7", "diminished7", "disminuido7"],
    nameEs: "disminuido séptima",
    nameEn: "diminished seventh",
    semitones: [0, 3, 6, 9],
    formula: ["1", "b3", "b5", "bb7"],
    family: "altered",
  },
  {
    id: "maj9",
    symbol: "maj9",
    aliases: ["maj9", "major9", "mayor9", "Δ9"],
    nameEs: "novena mayor",
    nameEn: "major ninth",
    semitones: [0, 4, 7, 11, 14],
    formula: ["1", "3", "5", "7", "9"],
    family: "extended",
    allowsOmit5: true,
  },
  {
    id: "m9",
    symbol: "m9",
    aliases: ["m9", "min9", "minor9", "menor9"],
    nameEs: "novena menor",
    nameEn: "minor ninth",
    semitones: [0, 3, 7, 10, 14],
    formula: ["1", "b3", "5", "b7", "9"],
    family: "extended",
    allowsOmit5: true,
  },
  {
    id: "dominant9",
    symbol: "9",
    aliases: ["9", "dom9", "dominant9", "dominante9"],
    nameEs: "novena dominante",
    nameEn: "dominant ninth",
    semitones: [0, 4, 7, 10, 14],
    formula: ["1", "3", "5", "b7", "9"],
    family: "extended",
    allowsOmit5: true,
  },
  {
    id: "dominant11",
    symbol: "11",
    aliases: ["11", "dom11", "dominant11", "dominante11"],
    nameEs: "once dominante",
    nameEn: "dominant eleventh",
    semitones: [0, 4, 7, 10, 14, 17],
    formula: ["1", "3", "5", "b7", "9", "11"],
    family: "extended",
    allowsOmit5: true,
  },
  {
    id: "dominant13",
    symbol: "13",
    aliases: ["13", "dom13", "dominant13", "dominante13"],
    nameEs: "trece dominante",
    nameEn: "dominant thirteenth",
    semitones: [0, 4, 7, 10, 14, 21],
    formula: ["1", "3", "5", "b7", "9", "13"],
    family: "extended",
    allowsOmit5: true,
  },
];

function normalizeChordDescriptorInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[()]/g, "")
    .replace(/△/g, "maj")
    .replace(/–/g, "-");
}

export function getChordDefinitionByQuality(
  quality: ChordQuality
): ChordDefinition | null {
  return CHORD_DEFINITIONS.find((chord) => chord.id === quality) ?? null;
}

export function resolveChordQuality(input: string): ChordQuality | null {
  const clean = normalizeChordDescriptorInput(input);

  if (clean === "") return "major";

  const found = CHORD_DEFINITIONS.find((definition) =>
    definition.aliases.some(
      (alias) => normalizeChordDescriptorInput(alias) === clean
    )
  );

  return found?.id ?? null;
}

export function buildChordSymbol(
  root: NoteName,
  quality: ChordQuality,
  bass?: NoteName | null
): string {
  const definition = getChordDefinitionByQuality(quality);

  if (!definition) {
    throw new Error(`No chord definition found for quality: ${quality}`);
  }

  return `${root}${definition.symbol}${bass ? `/${bass}` : ""}`;
}

export function buildChordNotes(root: NoteName, quality: ChordQuality): NoteName[] {
  const definition = getChordDefinitionByQuality(quality);

  if (!definition) {
    throw new Error(`No chord definition found for quality: ${quality}`);
  }

  const rootPc = noteToPitchClass(root);

  return definition.semitones.map((interval) =>
    pitchClassToSharp(rootPc + interval)
  );
}

export function getChordInversion(params: {
  root: NoteName;
  quality: ChordQuality;
  bass?: NoteName | null;
}): {
  inversion: ChordInversionLabel;
  inversionLabel: string;
} {
  const { root, quality, bass } = params;
  const definition = getChordDefinitionByQuality(quality);

  if (!definition || !bass || bass === root) {
    return {
      inversion: "root-position",
      inversionLabel: "posición fundamental",
    };
  }

  const rootPc = noteToPitchClass(root);
  const bassPc = noteToPitchClass(bass);
  const intervalFromRoot = ((bassPc - rootPc) % 12 + 12) % 12;

  const normalizedSemitones = [...new Set(definition.semitones.map((s) => s % 12))]
    .filter((interval) => interval !== 0);

  const foundIndex = normalizedSemitones.findIndex(
    (interval) => interval === intervalFromRoot
  );

  if (foundIndex === 0) {
    return {
      inversion: "1st-inversion",
      inversionLabel: "primera inversión",
    };
  }

  if (foundIndex === 1) {
    return {
      inversion: "2nd-inversion",
      inversionLabel: "segunda inversión",
    };
  }

  if (foundIndex === 2) {
    return {
      inversion: "3rd-inversion",
      inversionLabel: "tercera inversión",
    };
  }

  return {
    inversion: "slash",
    inversionLabel: "slash chord / bajo no estructural",
  };
}

export function getChordExtensionCategory(
  quality: ChordQuality
): ChordExtensionCategory {
  const definition = getChordDefinitionByQuality(quality);

  if (!definition) return "basic";

  switch (definition.family) {
    case "added":
    case "sixth":
      return "added-color";
    case "seventh":
      return "seventh";
    case "extended":
      return "extended";
    case "altered":
      return "altered";
    default:
      return "basic";
  }
}

export function getChordContextualTag(params: {
  quality: ChordQuality;
  bass?: NoteName | null;
}): string | null {
  const { quality, bass } = params;
  const extensionCategory = getChordExtensionCategory(quality);

  if (bass) {
    return "bajo dirigido / color de inversión";
  }

  if (extensionCategory === "extended") {
    return "extensión armónica";
  }

  if (extensionCategory === "added-color") {
    return "color añadido";
  }

  if (extensionCategory === "altered") {
    return "tensión alterada";
  }

  return null;
}

export function buildChord(
  root: NoteName,
  quality: ChordQuality,
  bass?: NoteName | null
): BuiltChord {
  const definition = getChordDefinitionByQuality(quality);

  if (!definition) {
    throw new Error(`No chord definition found for quality: ${quality}`);
  }

  const notes = buildChordNotes(root, quality);
  const inversionData = getChordInversion({ root, quality, bass });
  const extensionCategory = getChordExtensionCategory(quality);
  const contextualTag = getChordContextualTag({ quality, bass });

  return {
    root,
    quality,
    symbol: buildChordSymbol(root, quality, bass),
    notes,
    pitchClasses: uniquePitchClasses(notes),
    semitones: definition.semitones,
    formula: definition.formula,
    bass: bass ?? null,
    inversion: inversionData.inversion,
    inversionLabel: inversionData.inversionLabel,
    extensionCategory,
    contextualTag,
  };
}