import type {
  ChordQuality,
  ExtensionContextKind,
  GlobalKeyCandidate,
  KeyMode,
  NoteName,
  ProgressionAnalysis,
  ProgressionStepAnalysis,
  SlashChordContextKind,
  TonalAmbiguity,
  TonalityCandidate,
} from "@/core/types";
import {
  buildChord,
  getChordContextualTag,
  getChordExtensionCategory,
} from "@/core/theory/chords";
import { getTonalityCandidatesForChord } from "@/core/theory/tonality";
import { resolveRomanProgression } from "@/core/theory/romanNumerals";
import { detectModalMixture } from "@/core/theory/harmony/modalMixture";

type ProgressionChordInput = {
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
  bass?: NoteName | null;
};

type CandidateMapEntry = {
  chord: ProgressionChordInput;
  index: number;
  candidates: TonalityCandidate[];
};

function buildCandidateMap(chords: ProgressionChordInput[]): CandidateMapEntry[] {
  return chords.map((chord, index) => ({
    chord,
    index,
    candidates: getTonalityCandidatesForChord({
      root: chord.root,
      quality: chord.quality,
      limit: 8,
    }),
  }));
}

function getKeyIdentity(candidate: TonalityCandidate) {
  return `${candidate.tonic}-${candidate.mode}`;
}

function degreeFeelsTonic(degree: string) {
  return degree === "I" || degree === "i" || degree === "vi" || degree === "III";
}

function degreeFeelsDominant(degree: string) {
  return degree === "V" || degree === "v" || degree === "vii°" || degree === "VII";
}

function degreeFeelsSubdominant(degree: string) {
  return (
    degree === "ii" ||
    degree === "ii°" ||
    degree === "IV" ||
    degree === "iv" ||
    degree === "VI"
  );
}

function scoreChordInsideKey(
  entry: CandidateMapEntry,
  candidate: TonalityCandidate,
  totalChords: number
) {
  const match = entry.candidates.find(
    (item) =>
      item.tonic === candidate.tonic &&
      item.mode === candidate.mode &&
      item.keyLabel === candidate.keyLabel
  );

  if (!match) {
    return {
      total: 0,
      matched: false,
      tonicWeight: 0,
      dominantWeight: 0,
      subdominantWeight: 0,
      diatonicWeight: 0,
      cadenceWeight: 0,
      startEndWeight: 0,
      strongDegree: null as string | null,
    };
  }

  let total = match.confidence;
  let tonicWeight = 0;
  let dominantWeight = 0;
  let subdominantWeight = 0;
  let diatonicWeight = 0;
  let cadenceWeight = 0;
  let startEndWeight = 0;

  if (match.diatonic) {
    diatonicWeight += 18;
    total += 18;
  }

  if (match.functionLabel === "tonic") {
    tonicWeight += 14;
    total += 14;
  }

  if (match.functionLabel === "dominant") {
    dominantWeight += 12;
    total += 12;
  }

  if (match.functionLabel === "subdominant") {
    subdominantWeight += 8;
    total += 8;
  }

  if (entry.index === 0 && degreeFeelsTonic(match.degree)) {
    startEndWeight += 14;
    total += 14;
  }

  if (entry.index === totalChords - 1 && degreeFeelsTonic(match.degree)) {
    startEndWeight += 22;
    total += 22;
  }

  if (entry.index === totalChords - 1 && degreeFeelsDominant(match.degree)) {
    startEndWeight -= 10;
    total -= 10;
  }

  if (
    totalChords >= 2 &&
    entry.index === totalChords - 2 &&
    degreeFeelsDominant(match.degree)
  ) {
    cadenceWeight += 16;
    total += 16;
  }

  if (
    totalChords >= 2 &&
    entry.index === totalChords - 1 &&
    degreeFeelsSubdominant(match.degree)
  ) {
    cadenceWeight -= 8;
    total -= 8;
  }

  return {
    total,
    matched: true,
    tonicWeight,
    dominantWeight,
    subdominantWeight,
    diatonicWeight,
    cadenceWeight,
    startEndWeight,
    strongDegree: match.degree,
  };
}

function scoreGlobalKey(
  candidate: TonalityCandidate,
  allEntries: CandidateMapEntry[]
): GlobalKeyCandidate {
  let totalScore = 0;
  let chordMatches = 0;
  let tonicWeight = 0;
  let dominantWeight = 0;
  let subdominantWeight = 0;
  let diatonicWeight = 0;
  let cadenceWeight = 0;
  let startEndWeight = 0;

  const strongDegrees: string[] = [];
  const reasons: string[] = [];

  for (const entry of allEntries) {
    const partial = scoreChordInsideKey(entry, candidate, allEntries.length);

    totalScore += partial.total;
    tonicWeight += partial.tonicWeight;
    dominantWeight += partial.dominantWeight;
    subdominantWeight += partial.subdominantWeight;
    diatonicWeight += partial.diatonicWeight;
    cadenceWeight += partial.cadenceWeight;
    startEndWeight += partial.startEndWeight;

    if (partial.matched) chordMatches += 1;
    if (partial.strongDegree) strongDegrees.push(partial.strongDegree);
  }

  if (tonicWeight > 0) reasons.push("aparece material con peso de tónica");
  if (dominantWeight > 0) reasons.push("hay empuje armónico de dominante");
  if (startEndWeight > 0) reasons.push("el inicio o el cierre refuerzan este centro tonal");
  if (diatonicWeight > 20) reasons.push("varios acordes encajan bien en el campo tonal");
  if (cadenceWeight > 0) reasons.push("hay indicios de dirección cadencial");

  const normalizedScore =
    allEntries.length > 0 ? Math.round(totalScore / allEntries.length) : totalScore;

  return {
    tonic: candidate.tonic,
    mode: candidate.mode,
    keyLabel: candidate.keyLabel,
    totalScore,
    normalizedScore,
    reasons,
    strongDegrees,
    chordMatches,
    tonicWeight,
    dominantWeight,
    subdominantWeight,
    diatonicWeight,
    cadenceWeight,
    startEndWeight,
  };
}

function areRelativeKeys(a: GlobalKeyCandidate, b: GlobalKeyCandidate) {
  const relativePairs = new Set([
    "C-major|A-minor",
    "C#-major|A#-minor",
    "D-major|B-minor",
    "D#-major|C-minor",
    "E-major|C#-minor",
    "F-major|D-minor",
    "F#-major|D#-minor",
    "G-major|E-minor",
    "G#-major|F-minor",
    "A-major|F#-minor",
    "A#-major|G-minor",
    "B-major|G#-minor",
  ]);

  const k1 = `${a.tonic}-${a.mode}`;
  const k2 = `${b.tonic}-${b.mode}`;

  return relativePairs.has(`${k1}|${k2}`) || relativePairs.has(`${k2}|${k1}`);
}

function classifyAmbiguity(
  best: GlobalKeyCandidate | null,
  second: GlobalKeyCandidate | null
): TonalAmbiguity {
  if (!best || !second) {
    return {
      isAmbiguous: false,
      kind: "none",
      reason: null,
      alternatives: [],
    };
  }

  const delta = best.totalScore - second.totalScore;
  const alternatives = [second];

  if (delta > 18) {
    return {
      isAmbiguous: false,
      kind: "none",
      reason: null,
      alternatives,
    };
  }

  if (areRelativeKeys(best, second)) {
    return {
      isAmbiguous: true,
      kind: "relative-major-minor",
      reason: `La progresión comparte mucho material entre ${best.keyLabel} y ${second.keyLabel}, sin resolución lo bastante fuerte para separar completamente ambos centros.`,
      alternatives,
    };
  }

  if (best.cadenceWeight <= 0 && second.cadenceWeight <= 0) {
    return {
      isAmbiguous: true,
      kind: "weak-cadence",
      reason: `La progresión no marca una cadencia final lo bastante fuerte, así que el centro tonal sigue relativamente abierto entre ${best.keyLabel} y ${second.keyLabel}.`,
      alternatives,
    };
  }

  if (Math.abs(best.dominantWeight - second.dominantWeight) <= 6) {
    return {
      isAmbiguous: true,
      kind: "competing-centers",
      reason: "Hay dos centros que compiten de forma parecida y ninguno domina con claridad suficiente.",
      alternatives,
    };
  }

  return {
    isAmbiguous: true,
    kind: "modal",
    reason: `La progresión favorece ${best.keyLabel}, pero todavía conserva un comportamiento cercano a otra lectura posible.`,
    alternatives,
  };
}

function detectGlobalKeyWithContext(chords: ProgressionChordInput[]): {
  primary: TonalityCandidate | null;
  ranking: GlobalKeyCandidate[];
  ambiguity: TonalAmbiguity | null;
} {
  const map = buildCandidateMap(chords);
  const flattened = map.flatMap((entry) => entry.candidates);

  if (flattened.length === 0) {
    return {
      primary: null,
      ranking: [],
      ambiguity: null,
    };
  }

  const uniqueCandidates = new Map<string, TonalityCandidate>();

  for (const candidate of flattened) {
    uniqueCandidates.set(getKeyIdentity(candidate), candidate);
  }

  const ranking = [...uniqueCandidates.values()]
    .map((candidate) => scoreGlobalKey(candidate, map))
    .sort((a, b) => {
      if (a.totalScore !== b.totalScore) return b.totalScore - a.totalScore;
      if (a.chordMatches !== b.chordMatches) return b.chordMatches - a.chordMatches;
      return a.keyLabel.localeCompare(b.keyLabel);
    });

  const best = ranking[0] ?? null;
  const second = ranking[1] ?? null;

  if (!best) {
    return {
      primary: null,
      ranking,
      ambiguity: null,
    };
  }

  const bestSeed = uniqueCandidates.get(`${best.tonic}-${best.mode}`) ?? null;

  let primary: TonalityCandidate | null = null;

  if (bestSeed) {
    primary = {
      ...bestSeed,
      confidence: Math.max(1, Math.min(100, best.normalizedScore)),
      explanation:
        best.reasons.length > 0
          ? `La progresión gravita con más fuerza hacia ${best.keyLabel} porque ${best.reasons.join(
              ", "
            )}.`
          : `La progresión sugiere como centro tonal principal ${best.keyLabel}.`,
    };
  }

  const ambiguity = classifyAmbiguity(best, second);

  return {
    primary,
    ranking: ranking.slice(0, 4),
    ambiguity,
  };
}

function buildFallbackStep(
  index: number,
  chord: ProgressionChordInput,
  previousSymbol?: string | null,
  nextSymbol?: string | null
): ProgressionStepAnalysis {
  const chordData = buildChord(chord.root, chord.quality, chord.bass ?? null);

  return {
    index,
    root: chord.root,
    quality: chord.quality,
    symbol: chordData.symbol,
    bass: chordData.bass ?? null,
    inversion: chordData.inversion,
    inversionLabel: chordData.inversionLabel,
    extensionCategory: chordData.extensionCategory,
    slashContextKind: chordData.bass ? "bass-color" : "none",
    slashContextLabel: chordData.bass
      ? "Bajo presente sin lectura contextual suficiente todavía."
      : null,
    extensionContextKind:
      chordData.extensionCategory === "basic" ? "none" : "expanded-color",
    extensionContextLabel:
      chordData.extensionCategory === "basic"
        ? null
        : "El acorde añade color, pero aún sin lectura contextual firme.",
    degree: "?",
    functionLabel: "ambiguous",
    functionNameEs: "función ambigua",
    explanation: "Aún no se pudo ubicar con claridad dentro de una tonalidad global.",
    compatibleScale: chord.root,
    confidence: 20,
    diatonic: false,
    contextualWeight: 0,
    previousSymbol: previousSymbol ?? null,
    nextSymbol: nextSymbol ?? null,
    nonDiatonicKind: "unknown",
    nonDiatonicLabel: null,
    nonDiatonicExplanation: null,
  };
}

function getContextualMotionBonus(
  degree: string,
  previousDegree?: string | null,
  nextDegree?: string | null
) {
  let bonus = 0;

  if (previousDegree) {
    if (
      (previousDegree === "ii" && degree === "V") ||
      (previousDegree === "ii°" && degree === "v") ||
      (previousDegree === "IV" && degree === "V") ||
      (previousDegree === "iv" && degree === "v") ||
      (previousDegree === "VII" && degree === "III")
    ) {
      bonus += 12;
    }

    if (
      degreeFeelsTonic(degree) &&
      (previousDegree === "V" || previousDegree === "v" || previousDegree === "VII")
    ) {
      bonus += 16;
    }
  }

  if (nextDegree) {
    if (degreeFeelsDominant(degree) && degreeFeelsTonic(nextDegree)) {
      bonus += 16;
    }

    if (degreeFeelsSubdominant(degree) && degreeFeelsDominant(nextDegree)) {
      bonus += 10;
    }
  }

  return bonus;
}

function classifySlashContext(params: {
  bass: NoteName | null | undefined;
  inversionLabel: string | undefined;
  previousBass?: NoteName | null;
  nextBass?: NoteName | null;
}): {
  kind: SlashChordContextKind;
  label: string | null;
} {
  const { bass, inversionLabel, previousBass, nextBass } = params;

  if (!bass) {
    return { kind: "none", label: null };
  }

  if (
    inversionLabel &&
    inversionLabel !== "posición fundamental" &&
    inversionLabel !== "slash chord / bajo no estructural"
  ) {
    return {
      kind: "functional-inversion",
      label: `El bajo parece funcionar como ${inversionLabel}, no solo como adorno.`,
    };
  }

  if ((previousBass && previousBass === bass) || (nextBass && nextBass === bass)) {
    return {
      kind: "pedal-bass",
      label: "El bajo parece sostener un pedal o punto de apoyo entre acordes.",
    };
  }

  if (previousBass && nextBass && previousBass !== bass && nextBass !== bass) {
    return {
      kind: "linear-motion",
      label: "El bajo parece formar una línea de movimiento entre acordes.",
    };
  }

  return {
    kind: "bass-color",
    label: "El bajo añade color y reorienta la percepción del acorde.",
  };
}

function classifyExtensionContext(params: {
  extensionCategory: ProgressionStepAnalysis["extensionCategory"];
  functionLabel: ProgressionStepAnalysis["functionLabel"];
}): {
  kind: ExtensionContextKind;
  label: string | null;
} {
  const { extensionCategory, functionLabel } = params;

  if (!extensionCategory || extensionCategory === "basic") {
    return { kind: "none", label: null };
  }

  if (extensionCategory === "altered") {
    return {
      kind: "altered-tension",
      label: "La sonoridad añade una tensión alterada e inestable.",
    };
  }

  if (functionLabel === "dominant") {
    return {
      kind: "dominant-tension",
      label: "La extensión refuerza la tensión y la dirección de dominante.",
    };
  }

  if (functionLabel === "subdominant") {
    return {
      kind: "modal-color",
      label: "La extensión amplía el color y la apertura de la zona subdominante.",
    };
  }

  if (functionLabel === "tonic" && extensionCategory === "seventh") {
    return {
      kind: "stable-color",
      label: "La extensión añade sofisticación sin romper del todo la estabilidad.",
    };
  }

  if (extensionCategory === "extended" || extensionCategory === "added-color") {
    return {
      kind: "expanded-color",
      label: "La extensión expande el color del acorde más que su función base.",
    };
  }

  return {
    kind: "stable-color",
    label: "La extensión aporta color estable dentro del contexto.",
  };
}

function buildExtendedContextText(
  extensionCategory: ProgressionStepAnalysis["extensionCategory"],
  contextualTag: string | null,
  inversionLabel: string | undefined,
  bass: NoteName | null | undefined,
  slashContextLabel: string | null,
  extensionContextLabel: string | null,
  nonDiatonicExplanation: string | null
) {
  const fragments: string[] = [];

  if (extensionCategory === "extended") {
    fragments.push("Aporta una extensión armónica más amplia dentro del contexto.");
  } else if (extensionCategory === "added-color") {
    fragments.push("Añade color sin cambiar por completo la función base del acorde.");
  } else if (extensionCategory === "altered") {
    fragments.push("Introduce una tensión más inestable o sofisticada.");
  }

  if (slashContextLabel) {
    fragments.push(slashContextLabel);
  } else if (bass && inversionLabel && inversionLabel !== "posición fundamental") {
    fragments.push(`El bajo sugiere ${inversionLabel}.`);
  } else if (contextualTag) {
    fragments.push(`Lectura contextual: ${contextualTag}.`);
  }

  if (extensionContextLabel) {
    fragments.push(extensionContextLabel);
  }

  if (nonDiatonicExplanation) {
    fragments.push(nonDiatonicExplanation);
  }

  return fragments.join(" ");
}

function selectBestStepCandidate(
  entry: CandidateMapEntry,
  globalKey: TonalityCandidate | null,
  previousStep: ProgressionStepAnalysis | null,
  nextEntry: CandidateMapEntry | null
): ProgressionStepAnalysis {
  const previousDegree = previousStep?.degree ?? null;
  const nextCandidates = nextEntry?.candidates ?? [];
  const chordData = buildChord(
    entry.chord.root,
    entry.chord.quality,
    entry.chord.bass ?? null
  );

  const candidates = entry.candidates.map((candidate) => {
    const sameGlobalKey =
      globalKey &&
      candidate.tonic === globalKey.tonic &&
      candidate.mode === globalKey.mode;

    let score = candidate.confidence;
    let contextualWeight = 0;

    if (sameGlobalKey) {
      score += 24;
      contextualWeight += 24;
    }

    const nextSameKeyCandidate = nextCandidates.find(
      (nextCandidate) =>
        nextCandidate.tonic === candidate.tonic &&
        nextCandidate.mode === candidate.mode
    );

    const nextDegree = nextSameKeyCandidate?.degree ?? null;
    const motionBonus = getContextualMotionBonus(
      candidate.degree,
      previousDegree,
      nextDegree
    );

    score += motionBonus;
    contextualWeight += motionBonus;

    if (candidate.diatonic) {
      score += 8;
      contextualWeight += 8;
    }

    return {
      candidate,
      score,
      contextualWeight,
    };
  });

  const selected = candidates.sort((a, b) => b.score - a.score)[0];

  if (!selected) {
    return buildFallbackStep(
      entry.index,
      entry.chord,
      previousStep?.symbol ?? null,
      nextEntry?.chord.symbol ?? null
    );
  }

  const slashContext = classifySlashContext({
    bass: chordData.bass ?? null,
    inversionLabel: chordData.inversionLabel,
    previousBass: previousStep?.bass ?? null,
    nextBass: nextEntry?.chord.bass ?? null,
  });

  const extensionContext = classifyExtensionContext({
    extensionCategory: chordData.extensionCategory,
    functionLabel: selected.candidate.functionLabel,
  });

  let nonDiatonicKind: ProgressionStepAnalysis["nonDiatonicKind"] = undefined;
  let nonDiatonicLabel: string | null = null;
  let nonDiatonicExplanation: string | null = null;

  if (!selected.candidate.diatonic && globalKey) {
    const mixture = detectModalMixture({
      degree: selected.candidate.degree,
      mode: globalKey.mode,
    });

    if (mixture.isBorrowed) {
      nonDiatonicKind = "borrowed";
      nonDiatonicLabel = mixture.label;
      nonDiatonicExplanation = mixture.explanation;
    } else {
      nonDiatonicKind = "chromatic";
      nonDiatonicLabel = "acorde externo";
      nonDiatonicExplanation =
        "Este acorde no pertenece directamente a la tonalidad y añade color o tensión externa.";
    }
  }

  const extraContext = buildExtendedContextText(
    chordData.extensionCategory,
    getChordContextualTag({
      quality: chordData.quality,
      bass: chordData.bass ?? null,
    }),
    chordData.inversionLabel,
    chordData.bass ?? null,
    slashContext.label,
    extensionContext.label,
    nonDiatonicExplanation
  );

  return {
    index: entry.index,
    root: entry.chord.root,
    quality: entry.chord.quality,
    symbol: chordData.symbol,
    bass: chordData.bass ?? null,
    inversion: chordData.inversion,
    inversionLabel: chordData.inversionLabel,
    extensionCategory: getChordExtensionCategory(entry.chord.quality),
    slashContextKind: slashContext.kind,
    slashContextLabel: slashContext.label,
    extensionContextKind: extensionContext.kind,
    extensionContextLabel: extensionContext.label,
    degree: selected.candidate.degree,
    functionLabel: selected.candidate.functionLabel,
    functionNameEs: selected.candidate.functionNameEs,
    explanation: extraContext
      ? `${selected.candidate.explanation} ${extraContext}`
      : selected.candidate.explanation,
    compatibleScale: selected.candidate.compatibleScale,
    confidence: Math.max(1, Math.min(100, selected.score)),
    diatonic: selected.candidate.diatonic,
    contextualWeight: selected.contextualWeight,
    previousSymbol: previousStep?.symbol ?? null,
    nextSymbol: nextEntry?.chord.symbol ?? null,
    nonDiatonicKind,
    nonDiatonicLabel,
    nonDiatonicExplanation,
  };
}

function buildSteps(
  chords: ProgressionChordInput[],
  globalKey: TonalityCandidate | null
): ProgressionStepAnalysis[] {
  const entries = buildCandidateMap(chords);
  const steps: ProgressionStepAnalysis[] = [];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const previousStep = index > 0 ? steps[index - 1] : null;
    const nextEntry = index < entries.length - 1 ? entries[index + 1] : null;

    const step = selectBestStepCandidate(entry, globalKey, previousStep, nextEntry);
    steps.push(step);
  }

  return steps;
}

function detectCadenceLabel(steps: ProgressionStepAnalysis[]): string | null {
  const degrees = steps.map((step) => step.degree);
  const joined = degrees.join(" ");

  if (joined.includes("ii V I") || joined.includes("ii V I7")) {
    return "cadencia ii – V – I";
  }

  if (joined.includes("IV V I")) {
    return "cadencia IV – V – I";
  }

  if (joined.includes("vi IV I V")) {
    return "progresión pop vi – IV – I – V";
  }

  if (joined.includes("I V vi IV")) {
    return "progresión pop I – V – vi – IV";
  }

  if (joined.includes("i VI III VII")) {
    return "progresión menor i – VI – III – VII";
  }

  const tail = degrees.slice(-2).join(" ");
  if (tail === "V I" || tail === "v i") {
    return "cadencia dominante → tónica";
  }

  return null;
}

function detectEmotionalProfile(steps: ProgressionStepAnalysis[]): string {
  const tonicCount = steps.filter((step) => step.functionLabel === "tonic").length;
  const dominantCount = steps.filter((step) => step.functionLabel === "dominant").length;
  const subdominantCount = steps.filter(
    (step) => step.functionLabel === "subdominant"
  ).length;

  if (dominantCount >= 2 && tonicCount >= 1) {
    return "La progresión tiene dirección clara, tensión funcional y sensación de resolución.";
  }

  if (subdominantCount >= 2 && dominantCount === 0) {
    return "La progresión se siente abierta, modal y más atmosférica que resolutiva.";
  }

  if (tonicCount >= 2 && dominantCount === 0) {
    return "La progresión privilegia estabilidad, repetición emocional y color antes que tensión.";
  }

  return "La progresión mezcla reposo y movimiento de forma equilibrada.";
}

export function analyzeChordProgression(params: {
  input: string;
  chords: ProgressionChordInput[];
}): ProgressionAnalysis {
  const { input, chords } = params;

  const global = detectGlobalKeyWithContext(chords);
  const steps = buildSteps(chords, global.primary);
  const cadenceLabel = detectCadenceLabel(steps);
  const emotionalProfile = detectEmotionalProfile(steps);

  return {
    input,
    normalizedSymbols: chords.map((chord) =>
      buildChord(chord.root, chord.quality, chord.bass ?? null).symbol
    ),
    detectedKey: global.primary,
    cadenceLabel,
    emotionalProfile,
    steps,
    keyCandidates: global.ranking,
    ambiguity: global.ambiguity,
  };
}

export function analyzeRomanProgression(params: {
  input: string;
  tonic: NoteName;
  mode: KeyMode;
}): ProgressionAnalysis | null {
  const resolved = resolveRomanProgression({
    input: params.input,
    tonic: params.tonic,
    mode: params.mode,
  });

  if (!resolved) return null;

  const chords = resolved.chords.map((chord) => ({
    root: chord.root,
    quality: chord.quality,
    symbol: chord.symbol,
    bass: chord.bass ?? null,
  }));

  const baseAnalysis = analyzeChordProgression({
    input: params.input,
    chords,
  });

  return {
    ...baseAnalysis,
    detectedKey:
      baseAnalysis.detectedKey ?? {
        tonic: resolved.tonic,
        mode: resolved.mode,
        keyLabel: resolved.keyLabel,
        degree: "I",
        chordSymbolInKey: "I",
        functionLabel: "tonic",
        functionNameEs: "tónica",
        confidence: 100,
        diatonic: true,
        explanation: `La progresión fue resuelta explícitamente en ${resolved.keyLabel}.`,
        compatibleScale:
          resolved.mode === "major"
            ? `${resolved.tonic} mayor`
            : `${resolved.tonic} menor natural`,
      },
    normalizedSymbols: resolved.symbols,
    steps: baseAnalysis.steps.map((step, index) => ({
      ...step,
      degree: resolved.chords[index]?.degree ?? step.degree,
    })),
  };
}