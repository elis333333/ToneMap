import type {
  ChordQuality,
  GuitarShapeDefinition,
  InstrumentTuning,
  InstrumentVoicing,
  NoteName,
} from "@/core/types";
import { noteToPitchClass, transposeNote } from "@/core/theory/notes";
import { buildChord } from "@/core/theory/chords";
import { getDifficultyFromScore, scoreVoicing } from "./scoring";

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

function getRootStringOpenNote(
  tuning: InstrumentTuning,
  rootString: number
): NoteName | null {
  const tuningEntry = tuning.strings.find(
    (stringInfo) => 6 - stringInfo.stringIndex === rootString
  );

  return tuningEntry?.openNote ?? null;
}

function getBaseFretForMovableShape(
  shape: GuitarShapeDefinition,
  root: NoteName,
  tuning: InstrumentTuning
): number | null {
  if (!shape.rootString) return null;

  const openNote = getRootStringOpenNote(tuning, shape.rootString);
  if (!openNote) return null;

  const openPc = noteToPitchClass(openNote);
  const rootPc = noteToPitchClass(root);

  return ((rootPc - openPc) % 12 + 12) % 12;
}

export function transposeGuitarShapeToVoicing(params: {
  shape: GuitarShapeDefinition;
  root: NoteName;
  quality: ChordQuality;
  tuning: InstrumentTuning;
}): InstrumentVoicing | null {
  const { shape, root, quality, tuning } = params;

  const chord = buildChord(root, quality);

  if (shape.quality !== quality) return null;
  if (tuning.instrument !== "guitar") return null;
  if (tuning.strings.length !== shape.strings.length) return null;

  const baseFret = shape.movable
    ? getBaseFretForMovableShape(shape, root, tuning)
    : 0;

  if (shape.movable && baseFret === null) return null;

  const strings = shape.strings.map((shapeFret, index) => {
    const tuningEntry = tuning.strings[index];

    if (!tuningEntry) {
      throw new Error(`Missing tuning entry for string index ${index}`);
    }

    if (shapeFret === "x") {
      return {
        stringIndex: tuningEntry.stringIndex,
        fret: null,
        note: null,
        audioNote: null,
        muted: true,
        open: false,
      };
    }

    const absoluteFret = shape.movable ? shapeFret + (baseFret ?? 0) : shapeFret;
    const note = transposeNote(tuningEntry.openNote, absoluteFret);

    return {
      stringIndex: tuningEntry.stringIndex,
      fret: absoluteFret,
      note,
      audioNote: buildAudioNote(tuningEntry.openAudioNote, absoluteFret),
      muted: false,
      open: absoluteFret === 0,
    };
  });

  const playedFrets = strings
    .map((stringNote) => stringNote.fret)
    .filter((fret): fret is number => fret !== null);

  const nonZeroFrets = playedFrets.filter((fret) => fret > 0);

  const minFret = nonZeroFrets.length > 0 ? Math.min(...nonZeroFrets) : 0;
  const maxFret = playedFrets.length > 0 ? Math.max(...playedFrets) : 0;

  const includedNotes = strings
    .map((stringNote) => stringNote.note)
    .filter((note): note is NoteName => note !== null);

  const provisionalVoicing: InstrumentVoicing = {
    id: `${shape.id}-${root}`,
    instrument: "guitar",
    chordSymbol: chord.symbol,
    root,
    quality,
    includedNotes,
    type: shape.type,
    strings,
    minFret,
    maxFret,
    baseFret: baseFret ?? 0,
    usesBarre: shape.usesBarre,
    barre:
      shape.usesBarre && shape.movable && (baseFret ?? 0) > 0
        ? {
            fret: baseFret ?? 0,
            fromString: 1,
            toString: shape.rootString === 6 ? 6 : 5,
            full: shape.rootString === 6,
          }
        : null,
    difficulty: "medium",
    score: {
      total: 0,
      fretSpanScore: 0,
      openStringScore: 0,
      barreScore: 0,
      rootPresenceScore: 0,
      thirdPresenceScore: 0,
      shapeFamiliarityScore: 0,
    },
    tags: shape.tags,
  };

  const score = scoreVoicing(provisionalVoicing);

  return {
    ...provisionalVoicing,
    score,
    difficulty: getDifficultyFromScore(score),
  };
}