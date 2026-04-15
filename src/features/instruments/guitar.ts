import { noteToPitchClass, transposeNote } from "@/core/theory/notes";
import type { NoteName } from "@/core/types";
import type { SelectedKey } from "@/features/explorer/explorerStore";
import {
  getGuitarTuningById,
  type GUITAR_STANDARD_TUNING,
} from "@/data/tunings/guitar";

export type GuitarTuningId = "standard" | "drop-d";

export type GuitarFretPosition = SelectedKey & {
  stringIndex: number;
  fret: number;
  label: string;
};

function buildAudioNote(openAudioNote: string, fret: number) {
  const match = openAudioNote.match(/^([A-G]#?)(\d)$/);
  if (!match) return openAudioNote;

  const [, note, octaveRaw] = match;
  const octave = Number(octaveRaw);

  const chromatic = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  const startIndex = chromatic.indexOf(note);
  const total = startIndex + fret;
  const nextNote = chromatic[((total % 12) + 12) % 12];
  const nextOctave = octave + Math.floor(total / 12);

  return `${nextNote}${nextOctave}`;
}

export function buildGuitarFretboardPositions(
  fretCount = 24,
  tuningId: GuitarTuningId = "standard"
): GuitarFretPosition[] {
  const tuning = getGuitarTuningById(tuningId);
  if (!tuning) return [];

  const positions: GuitarFretPosition[] = [];

  tuning.strings.forEach((stringInfo) => {
    for (let fret = 0; fret <= fretCount; fret += 1) {
      const note = transposeNote(stringInfo.openNote, fret);
      const audioNote = buildAudioNote(stringInfo.openAudioNote, fret);

      positions.push({
        id: `guitar-${tuningId}-${stringInfo.stringIndex}-${fret}`,
        stringIndex: stringInfo.stringIndex,
        fret,
        note,
        audioNote,
        label: `Cuerda ${6 - stringInfo.stringIndex}, traste ${fret}`,
      });
    }
  });

  return positions;
}

export function findGuitarPositionsForNotes(
  notes: NoteName[],
  fretCount = 24,
  tuningId: GuitarTuningId = "standard"
): SelectedKey[] {
  const positions = buildGuitarFretboardPositions(fretCount, tuningId);
  const uniquePitchClasses = [...new Set(notes.map(noteToPitchClass))];

  return uniquePitchClasses
    .map((pc) => {
      const candidates = positions
        .filter((position) => noteToPitchClass(position.note) === pc)
        .sort((a, b) => {
          if (a.fret !== b.fret) return a.fret - b.fret;
          return a.stringIndex - b.stringIndex;
        });

      return candidates[0] ?? null;
    })
    .filter(Boolean)
    .map((position) => ({
      id: position.id,
      note: position.note,
      audioNote: position.audioNote,
    })) as SelectedKey[];
}