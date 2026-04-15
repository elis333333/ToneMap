import type { NoteName, ChordQuality } from "@/core/types";

export function getScaleRelations(root: NoteName, quality: ChordQuality) {
  switch (quality) {
    case "major":
      return {
        main: `${root} mayor`,
        compatible: ["Jónica", "Pentatónica mayor"],
        guideTones: ["3ra", "5ta"],
      };

    case "minor":
      return {
        main: `${root} menor natural`,
        compatible: ["Pentatónica menor", "Dórica", "Eólica"],
        guideTones: ["b3", "5ta"],
      };

    case "maj7":
      return {
        main: `${root} mayor`,
        compatible: ["Jónica", "Lidia"],
        guideTones: ["3ra", "7ma"],
      };

    case "m7":
      return {
        main: `${root} menor`,
        compatible: ["Dórica", "Eólica", "Pentatónica menor"],
        guideTones: ["b3", "b7"],
      };

    case "dominant7":
      return {
        main: `${root} mixolidia`,
        compatible: ["Mixolidia", "Blues mayor"],
        guideTones: ["3ra", "b7"],
      };

    case "sus2":
      return {
        main: `${root} mayor`,
        compatible: ["Jónica", "Pentatónica mayor"],
        guideTones: ["2da", "5ta"],
      };

    case "sus4":
      return {
        main: `${root} mayor`,
        compatible: ["Jónica", "Mixolidia"],
        guideTones: ["4ta", "5ta"],
      };

    case "diminished":
      return {
        main: `${root} disminuida`,
        compatible: ["Escala disminuida"],
        guideTones: ["b3", "b5"],
      };

    case "augmented":
      return {
        main: `${root} aumentada`,
        compatible: ["Escala aumentada"],
        guideTones: ["3ra", "#5"],
      };

    default:
      return {
        main: `${root}`,
        compatible: [],
        guideTones: [],
      };
  }
}