"use client";

import { useExplorerStore } from "@/features/explorer/explorerStore";
import { getEmotionColor } from "@/lib/tonalColor";
import { ColorBadge } from "@/components/ui/ColorBadge";
import { ColorBar } from "@/components/ui/ColorBar";

type EmotionModel = {
  tags: string[];
  energy: number;
  tension: number;
  brightness: number;
  contrast: string;
};

function getEmotionModelByQuality(quality: string): EmotionModel {
  switch (quality) {
    case "major":
      return {
        tags: ["brillante", "estable", "abierto"],
        energy: 60,
        tension: 20,
        brightness: 75,
        contrast: "Claro pero firme",
      };

    case "minor":
      return {
        tags: ["melancólico", "íntimo", "profundo"],
        energy: 35,
        tension: 40,
        brightness: 35,
        contrast: "Oscuro pero expresivo",
      };

    case "maj7":
      return {
        tags: ["soñador", "elegante", "relajado"],
        energy: 30,
        tension: 20,
        brightness: 70,
        contrast: "Brillante pero suave",
      };

    case "m7":
      return {
        tags: ["nostálgico", "suave", "jazzy"],
        energy: 28,
        tension: 28,
        brightness: 40,
        contrast: "Profundo pero relajado",
      };

    case "dominant7":
      return {
        tags: ["tenso", "activo", "inestable"],
        energy: 70,
        tension: 85,
        brightness: 55,
        contrast: "Inestable con dirección",
      };

    case "sus2":
      return {
        tags: ["abierto", "flotante", "ligero"],
        energy: 40,
        tension: 25,
        brightness: 60,
        contrast: "Ligero pero no del todo resuelto",
      };

    case "sus4":
      return {
        tags: ["suspendido", "expectante", "expansivo"],
        energy: 45,
        tension: 50,
        brightness: 55,
        contrast: "Abierto pero con tensión suave",
      };

    case "diminished":
      return {
        tags: ["oscuro", "tenso", "inquietante"],
        energy: 55,
        tension: 90,
        brightness: 20,
        contrast: "Inestable y comprimido",
      };

    case "augmented":
      return {
        tags: ["extraño", "expansivo", "ambiguo"],
        energy: 60,
        tension: 75,
        brightness: 65,
        contrast: "Brillante pero inquietante",
      };

    default:
      return {
        tags: ["neutral"],
        energy: 30,
        tension: 30,
        brightness: 30,
        contrast: "Color emocional indefinido",
      };
  }
}

export default function EmotionCard() {
  const detection = useExplorerStore((state) => state.detection);

  if (detection.type === "none") {
    return (
      <div className="rounded-xl border border-white/10 p-4 text-white/40">
        Sin análisis emocional
      </div>
    );
  }

  const emotion =
    detection.type === "interval"
      ? {
          tags: ["intervalo", "relación", "color"],
          energy: 35,
          tension: 45,
          brightness: 50,
          contrast: "La emoción depende de la distancia entre notas",
        }
      : getEmotionModelByQuality(detection.chord.quality);

  return (
    <div className="rounded-xl border border-white/10 bg-[#111111] p-5">
      <div className="mb-4 flex flex-wrap gap-2">
        {emotion.tags.map((tag) => (
          <ColorBadge
            key={tag}
            label={tag}
            color={getEmotionColor(tag)}
          />
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-xs text-white/60">
            <span>Energía</span>
            <span>{emotion.energy}%</span>
          </div>
          <ColorBar value={emotion.energy} color="#06D6A0" />
        </div>

        <div>
          <div className="mb-1 flex justify-between text-xs text-white/60">
            <span>Tensión</span>
            <span>{emotion.tension}%</span>
          </div>
          <ColorBar value={emotion.tension} color="#8338EC" />
        </div>

        <div>
          <div className="mb-1 flex justify-between text-xs text-white/60">
            <span>Brillo</span>
            <span>{emotion.brightness}%</span>
          </div>
          <ColorBar value={emotion.brightness} color="#FFBE0B" />
        </div>
      </div>

      <div className="mt-4 text-sm italic text-white/70">
        {emotion.contrast}
      </div>
    </div>
  );
}