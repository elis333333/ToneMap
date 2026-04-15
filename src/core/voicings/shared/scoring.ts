import type {
  DifficultyLevel,
  InstrumentVoicing,
  PlayabilityScore,
} from "@/core/types";

function getFretSpanScore(minFret: number, maxFret: number): number {
  if (maxFret === 0) return 20;

  const span = maxFret - Math.max(minFret, 1);

  if (span <= 3) return 20;
  if (span <= 4) return 15;
  if (span <= 5) return 9;
  return 3;
}

function getOpenStringScore(voicing: InstrumentVoicing): number {
  const openCount = voicing.strings.filter((stringNote) => stringNote.open).length;

  if (openCount >= 3) return 18;
  if (openCount === 2) return 13;
  if (openCount === 1) return 8;
  return 4;
}

function getBarreScore(voicing: InstrumentVoicing): number {
  if (!voicing.usesBarre) return 18;
  if (!voicing.barre) return 4;
  return voicing.barre.full ? 4 : 8;
}

function getRootPresenceScore(voicing: InstrumentVoicing): number {
  return voicing.includedNotes.includes(voicing.root) ? 18 : 4;
}

function getThirdPresenceScore(voicing: InstrumentVoicing): number {
  const hasThirdLike =
    voicing.quality === "major" ||
    voicing.quality === "minor" ||
    voicing.quality === "maj7" ||
    voicing.quality === "m7" ||
    voicing.quality === "dominant7" ||
    voicing.quality === "diminished" ||
    voicing.quality === "augmented";

  return hasThirdLike ? 16 : 10;
}

function getShapeFamiliarityScore(voicing: InstrumentVoicing): number {
  if (voicing.type === "open") return 18;
  if (voicing.type === "barre-e" || voicing.type === "barre-a") return 10;
  if (voicing.type === "triad" || voicing.type === "shell") return 12;
  return 8;
}

export function scoreVoicing(voicing: InstrumentVoicing): PlayabilityScore {
  const fretSpanScore = getFretSpanScore(voicing.minFret, voicing.maxFret);
  const openStringScore = getOpenStringScore(voicing);
  const barreScore = getBarreScore(voicing);
  const rootPresenceScore = getRootPresenceScore(voicing);
  const thirdPresenceScore = getThirdPresenceScore(voicing);
  const shapeFamiliarityScore = getShapeFamiliarityScore(voicing);

  const total =
    fretSpanScore +
    openStringScore +
    barreScore +
    rootPresenceScore +
    thirdPresenceScore +
    shapeFamiliarityScore;

  return {
    total,
    fretSpanScore,
    openStringScore,
    barreScore,
    rootPresenceScore,
    thirdPresenceScore,
    shapeFamiliarityScore,
  };
}

export function getDifficultyFromScore(score: PlayabilityScore): DifficultyLevel {
  if (score.total >= 90) return "easy";
  if (score.total >= 70) return "medium";
  return "hard";
}