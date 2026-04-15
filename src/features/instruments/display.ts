import type { NoteName } from "@/core/types";
import { noteToPitchClass } from "@/core/theory/notes";
import { getIntervalFormula } from "@/core/theory/intervals";

export function getRelativeIntervalLabel(
  note: NoteName,
  root: NoteName | null
): string {
  if (!root) return note;

  const notePc = noteToPitchClass(note);
  const rootPc = noteToPitchClass(root);
  const semitones = ((notePc - rootPc) % 12 + 12) % 12;

  return getIntervalFormula(semitones) ?? note;
}

export function getDisplayLabel(params: {
  note: NoteName;
  root: NoteName | null;
  view: "notes" | "intervals" | "fingering";
}): string {
  const { note, root, view } = params;

  if (view === "intervals") {
    return getRelativeIntervalLabel(note, root);
  }

  if (view === "fingering") {
    return "";
  }

  return note;
}