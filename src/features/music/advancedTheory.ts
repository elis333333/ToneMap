import type { ChordQuality, NoteName } from "@/core/types";
import { getTonalityCandidatesForChord } from "@/core/theory/tonality";

type AdvancedTheoryInput = {
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
  notes: NoteName[];
  semitones: number[];
  activeInstrument: "keyboard" | "guitar" | "bass";
  guitarVoicing?: {
    baseFret: number;
    difficulty: string;
    usesBarre: boolean;
    positions: Array<{
      stringIndex: number;
      fret: number;
      note: NoteName;
    }>;
  } | null;
};

type AdvancedTheoryData = {
  identity: {
    symbol: string;
    qualityLabel: string;
    notes: string[];
    degrees: string[];
    harmonicFunctionHint: string;
  };
  scaleRelation: {
    mainScale: string;
    compatibleScales: string[];
    guideTones: string[];
  };
  functionMusic: {
    role: string;
    explanation: string;
  };
  tension: {
    level: string;
    intervals: string[];
    explanation: string;
  };
  voicing: {
    type: string;
    inversion: string;
    distribution: string;
    technique?: string;
    positionLabel?: string;
  };
  substitutions: {
    canSubstitute: string[];
    sharesColorWith: string[];
  };
  usage: {
    genres: string[];
    contexts: string[];
  };
  progressions: string[];
  extensions: string[];
};

function getQualityLabel(quality: ChordQuality) {
  switch (quality) {
    case "major":
      return "Triada mayor";
    case "minor":
      return "Triada menor";
    case "maj7":
      return "Séptima mayor";
    case "m7":
      return "Séptima menor";
    case "dominant7":
      return "Séptima dominante";
    case "sus2":
      return "Suspendido 2";
    case "sus4":
      return "Suspendido 4";
    case "diminished":
      return "Disminuido";
    case "augmented":
      return "Aumentado";
    case "power":
      return "Power chord";
    case "major6":
      return "Acorde con sexta";
    case "minor6":
      return "Menor con sexta";
    case "add9":
      return "Mayor add9";
    case "madd9":
      return "Menor add9";
    case "maj9":
      return "Novena mayor";
    case "m9":
      return "Novena menor";
    case "dominant9":
      return "Novena dominante";
    case "dominant11":
      return "Once dominante";
    case "dominant13":
      return "Trece dominante";
    case "mMaj7":
      return "Menor séptima mayor";
    case "m7b5":
      return "Semidisminuido";
    case "dim7":
      return "Disminuido séptima";
    default:
      return quality;
  }
}

function getFormulaDegrees(quality: ChordQuality): string[] {
  switch (quality) {
    case "major":
      return ["1", "3", "5"];
    case "minor":
      return ["1", "b3", "5"];
    case "maj7":
      return ["1", "3", "5", "7"];
    case "m7":
      return ["1", "b3", "5", "b7"];
    case "dominant7":
      return ["1", "3", "5", "b7"];
    case "sus2":
      return ["1", "2", "5"];
    case "sus4":
      return ["1", "4", "5"];
    case "diminished":
      return ["1", "b3", "b5"];
    case "augmented":
      return ["1", "3", "#5"];
    case "power":
      return ["1", "5"];
    case "major6":
      return ["1", "3", "5", "6"];
    case "minor6":
      return ["1", "b3", "5", "6"];
    case "add9":
      return ["1", "3", "5", "9"];
    case "madd9":
      return ["1", "b3", "5", "9"];
    case "maj9":
      return ["1", "3", "5", "7", "9"];
    case "m9":
      return ["1", "b3", "5", "b7", "9"];
    case "dominant9":
      return ["1", "3", "5", "b7", "9"];
    case "dominant11":
      return ["1", "3", "5", "b7", "9", "11"];
    case "dominant13":
      return ["1", "3", "5", "b7", "9", "13"];
    case "mMaj7":
      return ["1", "b3", "5", "7"];
    case "m7b5":
      return ["1", "b3", "b5", "b7"];
    case "dim7":
      return ["1", "b3", "b5", "bb7"];
    default:
      return [];
  }
}

function getScaleBlock(root: NoteName, quality: ChordQuality) {
  const tonalCandidates = getTonalityCandidatesForChord({
    root,
    quality,
    limit: 4,
  });

  if (tonalCandidates.length > 0) {
    return {
      mainScale: tonalCandidates[0].compatibleScale,
      compatibleScales: tonalCandidates.map(
        (candidate) => `${candidate.keyLabel} (${candidate.degree})`
      ),
      guideTones:
        quality === "dominant7" ||
        quality === "dominant9" ||
        quality === "dominant11" ||
        quality === "dominant13"
          ? ["3ra", "b7"]
          : quality === "maj7" || quality === "maj9"
            ? ["3ra", "7ma"]
            : quality === "m7" || quality === "m9" || quality === "m7b5"
              ? ["b3", "b7"]
              : ["3ra / b3", "5ta"],
    };
  }

  switch (quality) {
    case "major":
      return {
        mainScale: `${root} mayor`,
        compatibleScales: ["Jónica", "Pentatónica mayor"],
        guideTones: ["3ra", "5ta"],
      };
    case "minor":
      return {
        mainScale: `${root} menor natural`,
        compatibleScales: ["Eólica", "Dórica", "Pentatónica menor"],
        guideTones: ["b3", "5ta"],
      };
    default:
      return {
        mainScale: root,
        compatibleScales: [],
        guideTones: [],
      };
  }
}

function getFunctionBlock(root: NoteName, quality: ChordQuality) {
  const tonalPrimary = getTonalityCandidatesForChord({
    root,
    quality,
    limit: 1,
  })[0];

  if (tonalPrimary) {
    return {
      role: `${tonalPrimary.functionNameEs} en ${tonalPrimary.keyLabel}`,
      explanation: tonalPrimary.explanation,
    };
  }

  switch (quality) {
    case "major":
      return {
        role: "tónica / estabilidad",
        explanation: "Se siente firme, claro y útil como punto de llegada o afirmación.",
      };
    case "minor":
      return {
        role: "color emocional / profundidad",
        explanation: "Aporta intimidad, introspección o un matiz más humano y expresivo.",
      };
    case "maj7":
      return {
        role: "tónica sofisticada",
        explanation: "Suena como reposo elegante: estable, pero con una tensión fina dentro.",
      };
    case "m7":
      return {
        role: "subdominante suave / color modal",
        explanation: "Funciona muy bien para ambientes relajados, nostálgicos o jazzy.",
      };
    case "dominant7":
      return {
        role: "dominante",
        explanation: "Empuja hacia adelante y pide resolución. Tiene dirección muy clara.",
      };
    default:
      return {
        role: "indefinido",
        explanation: "Depende del contexto musical.",
      };
  }
}

function getTensionBlock(quality: ChordQuality) {
  switch (quality) {
    case "major":
      return {
        level: "baja",
        intervals: ["3ra mayor"],
        explanation: "Es bastante estable; la tensión no domina la percepción general.",
      };
    case "minor":
      return {
        level: "baja-media",
        intervals: ["3ra menor"],
        explanation: "Tiene color emocional, pero no una tensión funcional fuerte.",
      };
    case "maj7":
      return {
        level: "media",
        intervals: ["7ma mayor"],
        explanation: "La séptima mayor genera una tensión interna elegante sobre la tónica.",
      };
    case "m7":
      return {
        level: "media-suave",
        intervals: ["b7"],
        explanation: "La tensión existe, pero está suavizada por el color menor y el contexto.",
      };
    case "dominant7":
    case "dominant9":
    case "dominant11":
    case "dominant13":
      return {
        level: "alta",
        intervals: ["3ra mayor", "b7", "tritono implícito"],
        explanation: "Su tensión funcional es clara y normalmente apunta a resolver.",
      };
    case "sus2":
      return {
        level: "baja-media",
        intervals: ["2da"],
        explanation: "La suspensión genera apertura más que conflicto fuerte.",
      };
    case "sus4":
      return {
        level: "media",
        intervals: ["4ta"],
        explanation: "La cuarta suspendida crea espera hasta que la armonía se resuelva.",
      };
    case "diminished":
    case "m7b5":
    case "dim7":
      return {
        level: "alta",
        intervals: ["b5", "tritono"],
        explanation: "Es uno de los colores más tensos y menos estables.",
      };
    case "augmented":
      return {
        level: "alta",
        intervals: ["#5"],
        explanation: "La quinta aumentada rompe la sensación de cierre tradicional.",
      };
    default:
      return {
        level: "media",
        intervals: [],
        explanation: "La tensión depende del uso.",
      };
  }
}

function getSubstitutionsBlock(root: NoteName, quality: ChordQuality) {
  switch (quality) {
    case "major":
      return {
        canSubstitute: [`${root}add9`, `${root}6`, `${root}maj7`],
        sharesColorWith: [`${root}5`, `${root}sus2`],
      };
    case "minor":
      return {
        canSubstitute: [`${root}m7`, `${root}m(add9)`, `${root}m6`],
        sharesColorWith: [`${root}5`, `${root}sus2`],
      };
    case "maj7":
      return {
        canSubstitute: [`${root}maj9`, `${root}6`],
        sharesColorWith: ["reposo sofisticado", "color lídio / jónico"],
      };
    case "m7":
      return {
        canSubstitute: [`${root}m9`, `${root}m11`],
        sharesColorWith: ["triada menor", "color dórico"],
      };
    case "dominant7":
    case "dominant9":
    case "dominant11":
    case "dominant13":
      return {
        canSubstitute: [`${root}9`, `${root}13`, `${root}7sus4`],
        sharesColorWith: ["acorde dominante extendido"],
      };
    default:
      return {
        canSubstitute: [],
        sharesColorWith: [],
      };
  }
}

function getUsageBlock(quality: ChordQuality) {
  switch (quality) {
    case "major":
      return {
        genres: ["pop", "rock", "folk"],
        contexts: ["resoluciones", "coros abiertos", "acompañamiento estable"],
      };
    case "minor":
      return {
        genres: ["indie", "rock", "balada"],
        contexts: ["versos íntimos", "momentos melancólicos", "color emocional"],
      };
    case "maj7":
      return {
        genres: ["jazz", "lo-fi", "neo soul"],
        contexts: ["intros suaves", "finales abiertos", "ambientes elegantes"],
      };
    case "m7":
      return {
        genres: ["jazz", "neo soul", "r&b"],
        contexts: ["vamps relajados", "pasajes nostálgicos", "colores suaves"],
      };
    case "dominant7":
    case "dominant9":
    case "dominant11":
    case "dominant13":
      return {
        genres: ["blues", "jazz", "funk"],
        contexts: ["dominantes", "transiciones fuertes", "empuje armónico"],
      };
    default:
      return {
        genres: [],
        contexts: [],
      };
  }
}

function getProgressions(root: NoteName, quality: ChordQuality) {
  const tonalCandidates = getTonalityCandidatesForChord({
    root,
    quality,
    limit: 3,
  });

  if (tonalCandidates.length > 0) {
    return tonalCandidates.map(
      (candidate) =>
        `${candidate.degree} en ${candidate.keyLabel} → función ${candidate.functionNameEs}`
    );
  }

  switch (quality) {
    case "major":
      return [`${root} – V – vi – IV`, `I – IV – V`, `I – vi – IV – V`];
    case "minor":
      return [`${root}m – VI – III – VII`, `i – iv – v`, `i – VI – VII`];
    case "maj7":
      return [`Imaj7 – V7 – vi – IV`, `ii – V – Imaj7`, `Imaj7 – IVmaj7`];
    case "m7":
      return [`ii – V – I`, `i7 – iv7`, `vi7 – ii7 – V7`];
    case "dominant7":
      return [`V7 – I`, `ii – V7 – I`, `I – VI7 – ii – V7`];
    default:
      return [];
  }
}

function getExtensions(quality: ChordQuality) {
  switch (quality) {
    case "major":
      return ["6", "add9", "maj7", "maj9"];
    case "minor":
      return ["m6", "m7", "m(add9)", "m9"];
    case "maj7":
      return ["maj9", "#11"];
    case "m7":
      return ["m9", "11"];
    case "dominant7":
      return ["9", "11", "13", "b9", "#9"];
    case "dominant9":
      return ["11", "13", "b9", "#9"];
    default:
      return [];
  }
}

export function buildAdvancedTheory(input: AdvancedTheoryInput): AdvancedTheoryData {
  const tonalPrimary = getTonalityCandidatesForChord({
    root: input.root,
    quality: input.quality,
    limit: 1,
  })[0] ?? null;

  const voicingType =
    input.activeInstrument === "guitar" && input.guitarVoicing
      ? input.guitarVoicing.usesBarre
        ? "voicing con cejilla"
        : "voicing guitarrístico abierto / localizado"
      : input.activeInstrument === "keyboard"
        ? "voicing base de teclado"
        : "voicing base";

  const inversion =
    tonalPrimary?.degree === "I" || tonalPrimary?.degree === "i"
      ? "posición funcional de reposo probable"
      : "inversión no calculada aún por registro real";

  const distribution =
    input.notes.length >= 5
      ? "acorde extendido con color distribuido"
      : input.notes.length === 4
        ? "distribución cerrada-media"
        : "distribución simple";

  return {
    identity: {
      symbol: input.symbol,
      qualityLabel: getQualityLabel(input.quality),
      notes: input.notes,
      degrees: getFormulaDegrees(input.quality),
      harmonicFunctionHint: tonalPrimary
        ? `${tonalPrimary.degree} en ${tonalPrimary.keyLabel}`
        : "depende del contexto",
    },
    scaleRelation: getScaleBlock(input.root, input.quality),
    functionMusic: getFunctionBlock(input.root, input.quality),
    tension: getTensionBlock(input.quality),
    voicing: {
      type: voicingType,
      inversion,
      distribution,
      technique:
        input.activeInstrument === "guitar" && input.guitarVoicing?.usesBarre
          ? "cejilla"
          : undefined,
      positionLabel:
        input.activeInstrument === "guitar" && input.guitarVoicing
          ? `base en traste ${input.guitarVoicing.baseFret}`
          : undefined,
    },
    substitutions: getSubstitutionsBlock(input.root, input.quality),
    usage: getUsageBlock(input.quality),
    progressions: getProgressions(input.root, input.quality),
    extensions: getExtensions(input.quality),
  };
}