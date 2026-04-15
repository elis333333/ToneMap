import type { ChordQuality } from "@/core/types";

export function getHarmonicFunction(quality: ChordQuality) {
  switch (quality) {
    case "major":
      return {
        role: "tónica / estabilidad",
        description: "sensación de reposo, claridad o afirmación",
      };

    case "minor":
      return {
        role: "color emocional / profundidad",
        description: "sensación introspectiva, expresiva o melancólica",
      };

    case "maj7":
      return {
        role: "tónica sofisticada",
        description: "reposo elegante con una ligera tensión interna",
      };

    case "m7":
      return {
        role: "subdominante suave / color modal",
        description: "profundidad relajada, útil para ambientes suaves o jazzy",
      };

    case "dominant7":
      return {
        role: "dominante",
        description: "tensión funcional que busca resolución",
      };

    case "sus2":
      return {
        role: "apertura",
        description: "sensación de suspensión ligera y espacio",
      };

    case "sus4":
      return {
        role: "suspensión",
        description: "tensión suave que sugiere movimiento hacia resolución",
      };

    case "diminished":
      return {
        role: "inestabilidad",
        description: "alta tensión, acorde de paso o dirección fuerte",
      };

    case "augmented":
      return {
        role: "expansión / ambigüedad",
        description: "tensión abierta con sensación poco estable",
      };

    default:
      return {
        role: "indefinido",
        description: "depende del contexto",
      };
  }
}