import type { NoteName, GuitarVoicingIntent } from "@/core/types";

export interface GuitarVoicingPosition {
  stringIndex: number;
  fret: number;
  note: NoteName;
  audioNote: string;
}

export interface GuitarVoicingCandidate {
  positions: GuitarVoicingPosition[];
  baseFret: number;
  difficulty: "easy" | "medium" | "hard";
  usesBarre: boolean;
  mutedStrings?: number[];
}

export interface PreviousGuitarVoicingReference {
  baseFret: number;
  positions: Array<{
    stringIndex: number;
    fret: number;
    note: NoteName;
  }>;
}

export type GuitarVoicingCharacter =
  | "compact"
  | "open"
  | "bright"
  | "stable"
  | "color-rich";

export interface ScoredGuitarVoicing extends GuitarVoicingCandidate {
  musicalScore: number;
  character: GuitarVoicingCharacter;
  scoreBreakdown: {
    fretRange: number;
    compactness: number;
    openStringBonus: number;
    lowBassBonus: number;
    barrePenalty: number;
    highFretPenalty: number;
    stringSkipPenalty: number;
    baseFretContinuity: number;
    averageMotion: number;
    topVoiceContinuity: number;
    extensionBonus: number;
    upperStringColorBonus: number;
    intentBonus: number;
    duplicatePenalty: number;
    stringCoverageBonus: number;
    ergonomicPenalty: number;
    rootBassBonus: number;
  };
}

function getUsedFrets(positions: GuitarVoicingPosition[]) {
  return positions
    .map((position) => position.fret)
    .filter((fret) => fret >= 0);
}

function getFretSpread(frets: number[]) {
  if (frets.length === 0) return 0;
  return Math.max(...frets) - Math.min(...frets);
}

function countOpenStrings(positions: GuitarVoicingPosition[]) {
  return positions.filter((position) => position.fret === 0).length;
}

function countStringSkips(positions: GuitarVoicingPosition[]) {
  const ordered = [...positions].sort((a, b) => a.stringIndex - b.stringIndex);
  let skips = 0;

  for (let i = 1; i < ordered.length; i += 1) {
    const gap = ordered[i].stringIndex - ordered[i - 1].stringIndex;
    if (gap > 1) skips += gap - 1;
  }

  return skips;
}

function getLowestPlayedString(positions: GuitarVoicingPosition[]) {
  if (positions.length === 0) return 5;
  return Math.min(...positions.map((position) => position.stringIndex));
}

function getHighestPlayedString(positions: GuitarVoicingPosition[]) {
  if (positions.length === 0) return 0;
  return Math.max(...positions.map((position) => position.stringIndex));
}

function getTopVoiceFret(positions: GuitarVoicingPosition[]) {
  if (positions.length === 0) return 0;

  const highestString = getHighestPlayedString(positions);
  const onHighest = positions
    .filter((position) => position.stringIndex === highestString)
    .sort((a, b) => a.fret - b.fret);

  return onHighest[0]?.fret ?? 0;
}

function getAverageMatchedMotion(
  current: GuitarVoicingPosition[],
  previous: PreviousGuitarVoicingReference["positions"]
) {
  let matches = 0;
  let totalMotion = 0;

  for (const currentPosition of current) {
    const previousPosition = previous.find(
      (item) => item.stringIndex === currentPosition.stringIndex
    );

    if (!previousPosition) continue;

    matches += 1;
    totalMotion += Math.abs(currentPosition.fret - previousPosition.fret);
  }

  if (matches === 0) return null;
  return totalMotion / matches;
}

function scoreBaseFretContinuity(
  currentBaseFret: number,
  previousBaseFret: number
) {
  const distance = Math.abs(currentBaseFret - previousBaseFret);

  if (distance === 0) return 22;
  if (distance <= 2) return 16;
  if (distance <= 4) return 8;
  if (distance <= 6) return 0;
  return -12;
}

function scoreAverageMotion(
  current: GuitarVoicingPosition[],
  previous: PreviousGuitarVoicingReference["positions"]
) {
  const averageMotion = getAverageMatchedMotion(current, previous);

  if (averageMotion === null) return 0;
  if (averageMotion <= 1) return 22;
  if (averageMotion <= 2) return 14;
  if (averageMotion <= 4) return 6;
  if (averageMotion <= 6) return -4;
  return -14;
}

function scoreTopVoiceContinuity(
  current: GuitarVoicingPosition[],
  previous: PreviousGuitarVoicingReference["positions"]
) {
  const currentTop = getTopVoiceFret(current);
  const previousTop = getTopVoiceFret(previous as GuitarVoicingPosition[]);
  const distance = Math.abs(currentTop - previousTop);

  if (distance === 0) return 10;
  if (distance <= 2) return 7;
  if (distance <= 4) return 2;
  if (distance <= 6) return -3;
  return -8;
}

function countUpperStringPresence(positions: GuitarVoicingPosition[]) {
  return positions.filter((position) => position.stringIndex >= 3).length;
}

function countDistinctNotes(positions: GuitarVoicingPosition[]) {
  return new Set(positions.map((position) => position.note)).size;
}

function countDuplicateNotes(positions: GuitarVoicingPosition[]) {
  return positions.length - countDistinctNotes(positions);
}

function getStringCoverageBonus(positions: GuitarVoicingPosition[]) {
  const usedStrings = new Set(positions.map((position) => position.stringIndex)).size;

  if (usedStrings >= 5) return 10;
  if (usedStrings === 4) return 6;
  if (usedStrings === 3) return 2;
  return 0;
}

function getErgonomicPenalty(positions: GuitarVoicingPosition[]) {
  let penalty = 0;

  for (const position of positions) {
    if (position.fret >= 10) penalty -= 2;
    if (position.fret >= 12) penalty -= 2;
  }

  return penalty;
}

function getRootBassBonus(positions: GuitarVoicingPosition[]) {
  if (positions.length === 0) return 0;

  const sorted = [...positions].sort((a, b) => a.stringIndex - b.stringIndex);
  const bass = sorted[0];

  return bass ? 6 : 0;
}

function detectCharacter(params: {
  fretSpread: number;
  openStrings: number;
  highestString: number;
  distinctNotes: number;
}): GuitarVoicingCharacter {
  const { fretSpread, openStrings, highestString, distinctNotes } = params;

  if (distinctNotes >= 4) return "color-rich";
  if (openStrings >= 2) return "open";
  if (highestString >= 4) return "bright";
  if (fretSpread <= 3) return "compact";
  return "stable";
}

function scoreIntentBonus(
  intent: GuitarVoicingIntent,
  character: GuitarVoicingCharacter
) {
  if (intent === "balanced") return 0;
  if (intent === character) return 22;

  if (
    (intent === "bright" && character === "color-rich") ||
    (intent === "color-rich" && character === "bright") ||
    (intent === "open" && character === "stable") ||
    (intent === "stable" && character === "compact")
  ) {
    return 8;
  }

  return -4;
}

export function scoreGuitarVoicing(
  candidate: GuitarVoicingCandidate,
  previousVoicing?: PreviousGuitarVoicingReference | null,
  intent: GuitarVoicingIntent = "balanced"
): ScoredGuitarVoicing {
  const frets = getUsedFrets(candidate.positions);
  const fretSpread = getFretSpread(frets);
  const openStrings = countOpenStrings(candidate.positions);
  const stringSkips = countStringSkips(candidate.positions);
  const lowestString = getLowestPlayedString(candidate.positions);
  const highestString = getHighestPlayedString(candidate.positions);
  const distinctNotes = countDistinctNotes(candidate.positions);
  const duplicateNotes = countDuplicateNotes(candidate.positions);

  let fretRange = 0;
  let compactness = 0;
  let openStringBonus = 0;
  let lowBassBonus = 0;
  let barrePenalty = 0;
  let highFretPenalty = 0;
  let stringSkipPenalty = 0;
  let baseFretContinuity = 0;
  let averageMotion = 0;
  let topVoiceContinuity = 0;
  let extensionBonus = 0;
  let upperStringColorBonus = 0;

  if (candidate.baseFret <= 5) fretRange += 22;
  else if (candidate.baseFret <= 8) fretRange += 14;
  else fretRange += 6;

  if (fretSpread <= 3) compactness += 26;
  else if (fretSpread <= 5) compactness += 16;
  else compactness += 6;

  openStringBonus += openStrings * 4;

  if (lowestString <= 1) lowBassBonus += 12;
  else if (lowestString <= 2) lowBassBonus += 8;
  else lowBassBonus += 3;

  if (candidate.usesBarre) {
    barrePenalty -= candidate.difficulty === "hard" ? 14 : 8;
  }

  if (candidate.baseFret >= 10) {
    highFretPenalty -= 12;
  } else if (candidate.baseFret >= 7) {
    highFretPenalty -= 6;
  }

  stringSkipPenalty -= stringSkips * 5;

  if (distinctNotes >= 4) {
    extensionBonus += 10;
  }

  upperStringColorBonus += countUpperStringPresence(candidate.positions) * 2;

  if (previousVoicing) {
    baseFretContinuity += scoreBaseFretContinuity(
      candidate.baseFret,
      previousVoicing.baseFret
    );

    averageMotion += scoreAverageMotion(
      candidate.positions,
      previousVoicing.positions
    );

    topVoiceContinuity += scoreTopVoiceContinuity(
      candidate.positions,
      previousVoicing.positions
    );
  }

  const character = detectCharacter({
    fretSpread,
    openStrings,
    highestString,
    distinctNotes,
  });

  const intentBonus = scoreIntentBonus(intent, character);
  const duplicatePenalty = duplicateNotes * -4;
  const stringCoverageBonus = getStringCoverageBonus(candidate.positions);
  const ergonomicPenalty = getErgonomicPenalty(candidate.positions);
  const rootBassBonus = getRootBassBonus(candidate.positions);

  const musicalScore =
    fretRange +
    compactness +
    openStringBonus +
    lowBassBonus +
    barrePenalty +
    highFretPenalty +
    stringSkipPenalty +
    baseFretContinuity +
    averageMotion +
    topVoiceContinuity +
    extensionBonus +
    upperStringColorBonus +
    intentBonus +
    duplicatePenalty +
    stringCoverageBonus +
    ergonomicPenalty +
    rootBassBonus;

  return {
    ...candidate,
    musicalScore,
    character,
    scoreBreakdown: {
      fretRange,
      compactness,
      openStringBonus,
      lowBassBonus,
      barrePenalty,
      highFretPenalty,
      stringSkipPenalty,
      baseFretContinuity,
      averageMotion,
      topVoiceContinuity,
      extensionBonus,
      upperStringColorBonus,
      intentBonus,
      duplicatePenalty,
      stringCoverageBonus,
      ergonomicPenalty,
      rootBassBonus,
    },
  };
}

export function sortGuitarVoicingsByMusicalScore<T extends GuitarVoicingCandidate>(
  candidates: T[],
  previousVoicing?: PreviousGuitarVoicingReference | null,
  intent: GuitarVoicingIntent = "balanced"
): Array<T & ScoredGuitarVoicing> {
  return candidates
    .map((candidate) => scoreGuitarVoicing(candidate, previousVoicing, intent))
    .sort((a, b) => {
      if (a.musicalScore !== b.musicalScore) {
        return b.musicalScore - a.musicalScore;
      }

      if (a.baseFret !== b.baseFret) {
        return a.baseFret - b.baseFret;
      }

      return a.positions.length - b.positions.length;
    }) as Array<T & ScoredGuitarVoicing>;
}