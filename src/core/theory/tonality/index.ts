import type {
  ChordQuality,
  HarmonicFunctionLabel,
  KeyMode,
  NoteName,
  TonalityCandidate,
} from "@/core/types";
import { noteToPitchClass, pitchClassToSharp } from "@/core/theory/notes";

const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const NATURAL_MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

const MAJOR_DEGREES = ["I", "ii", "iii", "IV", "V", "vi", "vii°"] as const;
const MINOR_DEGREES = ["i", "ii°", "III", "iv", "v", "VI", "VII"] as const;

type DiatonicFamily =
  | "major"
  | "minor"
  | "dominant"
  | "diminished"
  | "suspended"
  | "power"
  | "other";

function getScaleIntervals(mode: KeyMode) {
  return mode === "major" ? MAJOR_SCALE_INTERVALS : NATURAL_MINOR_SCALE_INTERVALS;
}

function getDegreeLabels(mode: KeyMode) {
  return mode === "major" ? MAJOR_DEGREES : MINOR_DEGREES;
}

function buildScalePitchClasses(tonic: NoteName, mode: KeyMode): number[] {
  const tonicPc = noteToPitchClass(tonic);
  return getScaleIntervals(mode).map((interval) => (tonicPc + interval) % 12);
}

function getDiatonicFamilyForQuality(quality: ChordQuality): DiatonicFamily {
  switch (quality) {
    case "major":
    case "major6":
    case "add9":
    case "maj7":
    case "maj9":
      return "major";

    case "minor":
    case "minor6":
    case "madd9":
    case "m7":
    case "m9":
      return "minor";

    case "dominant7":
    case "dominant9":
    case "dominant11":
    case "dominant13":
      return "dominant";

    case "diminished":
    case "m7b5":
    case "dim7":
      return "diminished";

    case "sus2":
    case "sus4":
      return "suspended";

    case "power":
      return "power";

    default:
      return "other";
  }
}

function getExpectedFamiliesByMode(mode: KeyMode): DiatonicFamily[] {
  if (mode === "major") {
    return ["major", "minor", "minor", "major", "dominant", "minor", "diminished"];
  }

  return ["minor", "diminished", "major", "minor", "minor", "major", "major"];
}

function getFunctionForDegree(
  mode: KeyMode,
  degreeIndex: number
): {
  label: HarmonicFunctionLabel;
  nameEs: string;
  explanation: string;
} {
  if (mode === "major") {
    switch (degreeIndex) {
      case 0:
        return {
          label: "tonic",
          nameEs: "tónica",
          explanation: "Centro de reposo y afirmación dentro de la tonalidad.",
        };
      case 1:
        return {
          label: "subdominant",
          nameEs: "predominante",
          explanation: "Prepara movimiento armónico hacia la zona dominante.",
        };
      case 2:
        return {
          label: "tonic",
          nameEs: "prolongación de tónica",
          explanation: "Comparte material con la tónica y funciona como expansión suave.",
        };
      case 3:
        return {
          label: "subdominant",
          nameEs: "subdominante",
          explanation: "Aporta apertura y prepara desplazamiento armónico.",
        };
      case 4:
        return {
          label: "dominant",
          nameEs: "dominante",
          explanation: "Genera dirección y empuje hacia la resolución.",
        };
      case 5:
        return {
          label: "tonic",
          nameEs: "relativo de tónica",
          explanation: "Comparte estabilidad relativa con la tónica principal.",
        };
      default:
        return {
          label: "dominant",
          nameEs: "sensación dominante",
          explanation: "Aporta tensión e inestabilidad antes de resolver.",
        };
    }
  }

  switch (degreeIndex) {
    case 0:
      return {
        label: "tonic",
        nameEs: "tónica menor",
        explanation: "Centro de reposo del modo menor.",
      };
    case 1:
      return {
        label: "dominant",
        nameEs: "tensión de paso",
        explanation: "Color inestable que suele preparar movimiento.",
      };
    case 2:
      return {
        label: "tonic",
        nameEs: "relativo mayor",
        explanation: "Comparte material con la tonalidad menor y abre el color.",
      };
    case 3:
      return {
        label: "subdominant",
        nameEs: "subdominante menor",
        explanation: "Zona de preparación y desplazamiento expresivo.",
      };
    case 4:
      return {
        label: "dominant",
        nameEs: "dominante modal",
        explanation: "Dirección más suave que la dominante mayor funcional.",
      };
    case 5:
      return {
        label: "subdominant",
        nameEs: "submediante",
        explanation: "Color amplio, estable y cinematográfico dentro del menor.",
      };
    default:
      return {
        label: "modal-color",
        nameEs: "color modal",
        explanation: "Aporta contraste modal dentro del campo menor.",
      };
  }
}

function getCompatibleScaleLabel(tonic: NoteName, mode: KeyMode) {
  return mode === "major" ? `${tonic} mayor` : `${tonic} menor natural`;
}

function getModeLabel(mode: KeyMode) {
  return mode === "major" ? "mayor" : "menor";
}

function buildKeyLabel(tonic: NoteName, mode: KeyMode) {
  return `${tonic} ${getModeLabel(mode)}`;
}

function getDegreeStrength(mode: KeyMode, degreeIndex: number): number {
  if (mode === "major") {
    switch (degreeIndex) {
      case 0:
        return 26; // I
      case 4:
        return 24; // V
      case 3:
        return 16; // IV
      case 5:
        return 12; // vi
      case 1:
        return 10; // ii
      case 2:
        return 8; // iii
      default:
        return 6; // vii°
    }
  }

  switch (degreeIndex) {
    case 0:
      return 26; // i
    case 4:
      return 16; // v modal
    case 3:
      return 14; // iv
    case 2:
      return 12; // III
    case 5:
      return 10; // VI
    case 6:
      return 10; // VII
    default:
      return 6; // ii°
  }
}

function getFamilyCompatibilityScore(
  actualFamily: DiatonicFamily,
  expectedFamily: DiatonicFamily,
  degreeIndex: number,
  mode: KeyMode
): { score: number; diatonic: boolean } {
  if (actualFamily === expectedFamily) {
    return { score: 72, diatonic: true };
  }

  if (
    (actualFamily === "suspended" || actualFamily === "power") &&
    ["major", "minor", "dominant"].includes(expectedFamily)
  ) {
    return { score: 54, diatonic: false };
  }

  if (
    actualFamily === "dominant" &&
    expectedFamily === "major" &&
    mode === "major" &&
    (degreeIndex === 0 || degreeIndex === 3)
  ) {
    return { score: 42, diatonic: false };
  }

  if (
    actualFamily === "major" &&
    expectedFamily === "minor" &&
    mode === "minor" &&
    degreeIndex === 4
  ) {
    return { score: 48, diatonic: false };
  }

  return { score: 18, diatonic: false };
}

function scoreTonalityCandidate(params: {
  chordRoot: NoteName;
  chordQuality: ChordQuality;
  tonic: NoteName;
  mode: KeyMode;
}): TonalityCandidate | null {
  const { chordRoot, chordQuality, tonic, mode } = params;

  const chordRootPc = noteToPitchClass(chordRoot);
  const scalePitchClasses = buildScalePitchClasses(tonic, mode);
  const degreeIndex = scalePitchClasses.findIndex((pc) => pc === chordRootPc);

  if (degreeIndex === -1) {
    return null;
  }

  const expectedFamilies = getExpectedFamiliesByMode(mode);
  const expectedFamily = expectedFamilies[degreeIndex];
  const actualFamily = getDiatonicFamilyForQuality(chordQuality);

  const familyScore = getFamilyCompatibilityScore(
    actualFamily,
    expectedFamily,
    degreeIndex,
    mode
  );

  const degreeStrength = getDegreeStrength(mode, degreeIndex);
  const fn = getFunctionForDegree(mode, degreeIndex);

  let score = familyScore.score + degreeStrength;

  if (fn.label === "tonic") score += 8;
  if (fn.label === "dominant") score += 7;
  if (fn.label === "subdominant") score += 5;

  if (mode === "major" && degreeIndex === 4 && actualFamily === "dominant") {
    score += 10;
  }

  if (mode === "minor" && degreeIndex === 0 && actualFamily === "minor") {
    score += 10;
  }

  const degree = getDegreeLabels(mode)[degreeIndex];
  const confidence = Math.max(1, Math.min(100, score));

  return {
    tonic,
    mode,
    keyLabel: buildKeyLabel(tonic, mode),
    degree,
    chordSymbolInKey: degree,
    functionLabel: fn.label,
    functionNameEs: fn.nameEs,
    confidence,
    diatonic: familyScore.diatonic,
    explanation: `${chordRoot} ${chordQuality} puede leerse como ${degree} en ${buildKeyLabel(
      tonic,
      mode
    )}. ${fn.explanation}`,
    compatibleScale: getCompatibleScaleLabel(tonic, mode),
  };
}

export function getTonalityCandidatesForChord(params: {
  root: NoteName;
  quality: ChordQuality;
  limit?: number;
}): TonalityCandidate[] {
  const { root, quality, limit = 6 } = params;

  const candidates: TonalityCandidate[] = [];

  for (let pc = 0; pc < 12; pc += 1) {
    const tonic = pitchClassToSharp(pc);

    const majorCandidate = scoreTonalityCandidate({
      chordRoot: root,
      chordQuality: quality,
      tonic,
      mode: "major",
    });

    if (majorCandidate) candidates.push(majorCandidate);

    const minorCandidate = scoreTonalityCandidate({
      chordRoot: root,
      chordQuality: quality,
      tonic,
      mode: "minor",
    });

    if (minorCandidate) candidates.push(minorCandidate);
  }

  return candidates
    .sort((a, b) => {
      if (a.confidence !== b.confidence) return b.confidence - a.confidence;
      if (a.diatonic !== b.diatonic) return Number(b.diatonic) - Number(a.diatonic);
      return a.keyLabel.localeCompare(b.keyLabel);
    })
    .slice(0, limit);
}

export function getPrimaryTonalityForChord(params: {
  root: NoteName;
  quality: ChordQuality;
}): TonalityCandidate | null {
  return getTonalityCandidatesForChord(params).at(0) ?? null;
}