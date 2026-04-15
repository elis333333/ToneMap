import type { NoteName } from "./music";

export type InstrumentId = "piano" | "guitar" | "bass";

export type GuitarTuningId = "standard" | "drop-d";
export type BassTuningId = "standard";

export type InstrumentTuningId = GuitarTuningId | BassTuningId;

export interface StringTuning {
  stringIndex: number;
  openNote: NoteName;
  openAudioNote: string;
  label: string;
}

export interface InstrumentTuning {
  id: InstrumentTuningId;
  instrument: InstrumentId;
  name: string;
  strings: StringTuning[];
}

export interface InstrumentPosition {
  note: NoteName;
  audioNote: string;
}

export interface FrettedPosition extends InstrumentPosition {
  stringIndex: number;
  fret: number;
  isOpen: boolean;
}

export interface PianoPosition extends InstrumentPosition {
  keyId: string;
  isBlack: boolean;
  octave: number;
}