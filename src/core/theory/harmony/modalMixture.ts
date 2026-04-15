import type { NoteName, KeyMode } from "@/core/types";

type BorrowedResult = {
  isBorrowed: boolean;
  label: string | null;
  explanation: string | null;
};

const majorBorrowedDegrees = ["iv", "bVII", "bIII", "bVI"];
const minorBorrowedDegrees = ["IV", "V", "bVI"];

export function detectModalMixture(params: {
  degree: string;
  mode: KeyMode;
}): BorrowedResult {
  const { degree, mode } = params;

  if (mode === "major" && majorBorrowedDegrees.includes(degree)) {
    return {
      isBorrowed: true,
      label: "mixture modal (paralelo menor)",
      explanation:
        "Este acorde proviene del modo menor paralelo y añade un color más oscuro o emocional.",
    };
  }

  if (mode === "minor" && minorBorrowedDegrees.includes(degree)) {
    return {
      isBorrowed: true,
      label: "mixture modal (paralelo mayor)",
      explanation:
        "Este acorde proviene del modo mayor paralelo y aporta más brillo o estabilidad.",
    };
  }

  return {
    isBorrowed: false,
    label: null,
    explanation: null,
  };
}