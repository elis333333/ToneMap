import type { NoteName } from "@/features/music/types";

export type GuitarTuning = {
  id: "standard";
  name: string;
  strings: NoteName[];
};

export const STANDARD_GUITAR_TUNING: GuitarTuning = {
  id: "standard",
  name: "Standard",
  // de 6ta a 1ra cuerda
  strings: ["E", "A", "D", "G", "B", "E"],
};