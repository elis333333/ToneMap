export const NOTE_COLORS: Record<string, string> = {
  C: "#a855f7",   // morado
  "C#": "#ec4899",
  D: "#3b82f6",
  "D#": "#6366f1",
  E: "#22c55e",
  F: "#eab308",
  "F#": "#0ea5e9",
  G: "#f97316",
  "G#": "#ef4444",
  A: "#10b981",
  "A#": "#f43f5e",
  B: "#84cc16",
};

export function getChordColor(root: string) {
  return NOTE_COLORS[root] || "#888";
}

export function getEmotionColor(tag: string) {
  const map: Record<string, string> = {
    brillante: "#facc15",
    elegante: "#a855f7",
    soñador: "#60a5fa",
    melancólico: "#6366f1",
    íntimo: "#14b8a6",
    profundo: "#0ea5e9",
    oscuro: "#334155",
  };

  return map[tag.toLowerCase()] || "#999";
}