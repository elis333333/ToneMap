import type { InstrumentTuning } from "@/core/types";

export const BASS_STANDARD_TUNING: InstrumentTuning = {
  id: "standard",
  instrument: "bass",
  name: "Standard Bass",
  strings: [
    { stringIndex: 0, openNote: "E", openAudioNote: "E1", label: "4" },
    { stringIndex: 1, openNote: "A", openAudioNote: "A1", label: "3" },
    { stringIndex: 2, openNote: "D", openAudioNote: "D2", label: "2" },
    { stringIndex: 3, openNote: "G", openAudioNote: "G2", label: "1" },
  ],
};

export const BASS_TUNINGS = [BASS_STANDARD_TUNING];

export function getBassTuningById(id: "standard") {
  return BASS_TUNINGS.find((tuning) => tuning.id === id) ?? null;
}