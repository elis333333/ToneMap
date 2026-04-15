import type { NoteName } from "@/core/types";
import {
  noteToPitchClass,
  pitchClassToFlat,
  pitchClassToSharp,
} from "@/core/theory/notes";

export function getEnharmonicPair(note: NoteName): NoteName[] {
  const pitchClass = noteToPitchClass(note);
  const sharp = pitchClassToSharp(pitchClass);
  const flat = pitchClassToFlat(pitchClass);

  if (sharp === flat) {
    return [sharp];
  }

  return [sharp, flat];
}

export function preferSharpName(note: NoteName): NoteName {
  return pitchClassToSharp(noteToPitchClass(note));
}

export function preferFlatName(note: NoteName): NoteName {
  return pitchClassToFlat(noteToPitchClass(note));
}

export function respellNotesAsSharps(notes: NoteName[]): NoteName[] {
  return notes.map(preferSharpName);
}

export function respellNotesAsFlats(notes: NoteName[]): NoteName[] {
  return notes.map(preferFlatName);
}