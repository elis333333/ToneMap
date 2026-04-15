import type {
  ChordQuality,
  InstrumentTuning,
  InstrumentVoicing,
  NoteName,
} from "@/core/types";
import { BASS_PATTERNS } from "@/core/shapes/bass";
import { buildChord } from "@/core/theory/chords";
import { noteToPitchClass, transposeNote } from "@/core/theory/notes";
import { getDifficultyFromScore, scoreVoicing } from "@/core/voicings/shared";

export interface BassVoicingResult {
  primary: InstrumentVoicing | null;
  variants: InstrumentVoicing[];
  all: InstrumentVoicing[];
}

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

function getRootFret(root: NoteName, openNote: NoteName): number {
  const rootPc = noteToPitchClass(root);
  const openPc = noteToPitchClass(openNote);
  return ((rootPc - openPc) % 12 + 12) % 12;
}

function buildBassVoicing(params: {
  root: NoteName;
  quality: ChordQuality;
  tuning: InstrumentTuning;
  patternId: string;
}): InstrumentVoicing | null {
  const { root, quality, tuning, patternId } = params;

  if (tuning.instrument !== "bass") return null;

  const pattern = BASS_PATTERNS.find((entry) => entry.id === patternId);
  if (!pattern) return null;

  const chord = buildChord(root, quality);
  const rootFret = getRootFret(root, tuning.strings[0].openNote);

  const strings = tuning.strings.map((stringInfo, index) => {
    const shapeValue = pattern.strings[index];

    if (shapeValue === "x") {
      return {
        stringIndex: stringInfo.stringIndex,
        fret: null,
        note: null,
        audioNote: null,
        muted: true,
        open: false,
      };
    }

    const absoluteFret = rootFret + shapeValue;
    const note = transposeNote(stringInfo.openNote, absoluteFret);

    return {
      stringIndex: stringInfo.stringIndex,
      fret: absoluteFret,
      note,
      audioNote: buildAudioNote(stringInfo.openAudioNote, absoluteFret),
      muted: false,
      open: absoluteFret === 0,
    };
  });

  const playedFrets = strings
    .map((entry) => entry.fret)
    .filter((fret): fret is number => fret !== null);

  const nonZeroFrets = playedFrets.filter((fret) => fret > 0);

  const minFret = nonZeroFrets.length > 0 ? Math.min(...nonZeroFrets) : 0;
  const maxFret = playedFrets.length > 0 ? Math.max(...playedFrets) : 0;

  const includedNotes = strings
    .map((entry) => entry.note)
    .filter((note): note is NoteName => note !== null);

  const provisional: InstrumentVoicing = {
    id: `${pattern.id}-${root}`,
    instrument: "bass",
    chordSymbol: chord.symbol,
    root,
    quality,
    includedNotes,
    type: pattern.tags.includes("arpeggio") ? "arpeggio" : "custom",
    strings,
    minFret,
    maxFret,
    baseFret: rootFret,
    usesBarre: false,
    barre: null,
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
    tags: pattern.tags,
  };

  const score = scoreVoicing(provisional);

  return {
    ...provisional,
    score,
    difficulty: getDifficultyFromScore(score),
  };
}

export function generateBassVoicings(params: {
  root: NoteName;
  quality: ChordQuality;
  tuning: InstrumentTuning;
}): BassVoicingResult {
  const { root, quality, tuning } = params;

  const candidates = BASS_PATTERNS.map((pattern) =>
    buildBassVoicing({
      root,
      quality,
      tuning,
      patternId: pattern.id,
    })
  ).filter((candidate): candidate is InstrumentVoicing => candidate !== null);

  const sorted = [...candidates].sort((a, b) => {
    if (a.score.total !== b.score.total) {
      return b.score.total - a.score.total;
    }

    return a.minFret - b.minFret;
  });

  return {
    primary: sorted[0] ?? null,
    variants: sorted.slice(1, 4),
    all: sorted,
  };
}