import type { InstrumentTuning } from "@/core/types";

export type GuitarTuning = InstrumentTuning & {
  id: "standard" | "drop-d";
  instrument: "guitar";
};

export const GUITAR_STANDARD_TUNING: GuitarTuning = {
  id: "standard",
  instrument: "guitar",
  name: "Standard",
  strings: [
    { stringIndex: 0, openNote: "E", openAudioNote: "E2", label: "6" },
    { stringIndex: 1, openNote: "A", openAudioNote: "A2", label: "5" },
    { stringIndex: 2, openNote: "D", openAudioNote: "D3", label: "4" },
    { stringIndex: 3, openNote: "G", openAudioNote: "G3", label: "3" },
    { stringIndex: 4, openNote: "B", openAudioNote: "B3", label: "2" },
    { stringIndex: 5, openNote: "E", openAudioNote: "E4", label: "1" },
  ],
};

export const GUITAR_DROP_D_TUNING: GuitarTuning = {
  id: "drop-d",
  instrument: "guitar",
  name: "Drop D",
  strings: [
    { stringIndex: 0, openNote: "D", openAudioNote: "D2", label: "6" },
    { stringIndex: 1, openNote: "A", openAudioNote: "A2", label: "5" },
    { stringIndex: 2, openNote: "D", openAudioNote: "D3", label: "4" },
    { stringIndex: 3, openNote: "G", openAudioNote: "G3", label: "3" },
    { stringIndex: 4, openNote: "B", openAudioNote: "B3", label: "2" },
    { stringIndex: 5, openNote: "E", openAudioNote: "E4", label: "1" },
  ],
};

export const GUITAR_TUNINGS: GuitarTuning[] = [
  GUITAR_STANDARD_TUNING,
  GUITAR_DROP_D_TUNING,
];

export function getGuitarTuningById(id: "standard" | "drop-d"): GuitarTuning | null {
  return GUITAR_TUNINGS.find((tuning) => tuning.id === id) ?? null;
}