import type { ChordQuality } from "@/core/types";

export type EmotionData = {
  energy: number;
  tension: number;
  brightness: number;
  label: string;
  color: string;
};

export function getChordEmotion(quality: ChordQuality): EmotionData {
  switch (quality) {
    case "major":
      return {
        energy: 3,
        tension: 1,
        brightness: 3,
        label: "brillante / estable",
        color: "#FFBE0B",
      };

    case "minor":
      return {
        energy: 2,
        tension: 1,
        brightness: 1,
        label: "melancólico / íntimo",
        color: "#3A86FF",
      };

    case "diminished":
      return {
        energy: 2,
        tension: 3,
        brightness: 1,
        label: "inestable / tenso",
        color: "#FF006E",
      };

    case "augmented":
      return {
        energy: 3,
        tension: 2,
        brightness: 3,
        label: "extraño / expansivo",
        color: "#FF006E",
      };

    case "sus2":
      return {
        energy: 2,
        tension: 1,
        brightness: 2,
        label: "abierto / flotante",
        color: "#06D6A0",
      };

    case "sus4":
      return {
        energy: 2,
        tension: 2,
        brightness: 2,
        label: "suspendido / expectante",
        color: "#06D6A0",
      };

    case "maj7":
      return {
        energy: 2,
        tension: 2,
        brightness: 3,
        label: "soñador / sofisticado",
        color: "#8338EC",
      };

    case "m7":
      return {
        energy: 2,
        tension: 2,
        brightness: 1,
        label: "nostálgico / suave",
        color: "#3A86FF",
      };

    case "dominant7":
      return {
        energy: 3,
        tension: 3,
        brightness: 2,
        label: "tenso / dominante",
        color: "#FF006E",
      };

    default:
      return {
        energy: 1,
        tension: 1,
        brightness: 1,
        label: "neutral",
        color: "#FFFFFF",
      };
  }
}

export function getIntervalEmotion(semitones: number): EmotionData {
  switch (semitones) {
    case 3:
      return {
        energy: 2,
        tension: 1,
        brightness: 1,
        label: "triste / suave",
        color: "#3A86FF",
      };
    case 4:
      return {
        energy: 2,
        tension: 1,
        brightness: 3,
        label: "claro / brillante",
        color: "#FFBE0B",
      };
    case 6:
      return {
        energy: 2,
        tension: 3,
        brightness: 1,
        label: "inquietante / tenso",
        color: "#FF006E",
      };
    case 7:
      return {
        energy: 2,
        tension: 1,
        brightness: 2,
        label: "estable / abierto",
        color: "#06D6A0",
      };
    default:
      return {
        energy: 1,
        tension: 1,
        brightness: 1,
        label: "neutral",
        color: "#FFFFFF",
      };
  }
}

export function getSearchEmotionColor(
  detection:
    | { type: "none" }
    | { type: "interval"; semitones: number }
    | { type: "chord"; chord: { quality: ChordQuality } }
): string {
  if (detection.type === "none") {
    return "#FFFFFF";
  }

  if (detection.type === "interval") {
    return getIntervalEmotion(detection.semitones).color;
  }

  return getChordEmotion(detection.chord.quality).color;
}

export function getInstrumentHighlightColor(
  detection:
    | { type: "none" }
    | { type: "interval"; semitones: number }
    | { type: "chord"; chord: { quality: ChordQuality } }
): string {
  if (detection.type === "chord") {
    return getChordEmotion(detection.chord.quality).color;
  }

  return "#FFBE0B";
}