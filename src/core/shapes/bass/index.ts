import type { BassPatternDefinition } from "@/core/types";

export const BASS_PATTERNS: BassPatternDefinition[] = [
  {
    id: "bass-root",
    quality: "root",
    strings: [0, "x", "x", "x"],
    tags: ["root", "simple", "study"],
  },
  {
    id: "bass-root-fifth",
    quality: "major",
    strings: [0, "x", 2, "x"],
    tags: ["root", "fifth", "simple"],
  },
  {
    id: "bass-minor-root-fifth",
    quality: "minor",
    strings: [0, "x", 2, "x"],
    tags: ["root", "fifth", "minor", "simple"],
  },
  {
    id: "bass-arpeggio-maj7",
    quality: "maj7",
    strings: [0, 2, 1, 2],
    tags: ["arpeggio", "maj7", "study"],
  },
  {
    id: "bass-arpeggio-m7",
    quality: "m7",
    strings: [0, 2, 0, 1],
    tags: ["arpeggio", "m7", "study"],
  },
  {
    id: "bass-arpeggio-dominant7",
    quality: "dominant7",
    strings: [0, 2, 0, 2],
    tags: ["arpeggio", "dominant7", "study"],
  },
];