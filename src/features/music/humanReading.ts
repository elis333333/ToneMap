import type { NoteName, ChordQuality } from "@/core/types";

type HumanReadingInput = {
  root: NoteName;
  quality: ChordQuality;
};

export function buildHumanReading({
  root,
  quality,
}: HumanReadingInput): string {
  const symbolBase = `${root}`;

  switch (quality) {
    case "major":
      return `${symbolBase} mayor suena estable, claro y brillante. Se percibe como un punto firme y directo, muy útil para sensación de llegada o apertura.`;

    case "minor":
      return `${symbolBase} menor suena íntimo, emocional y ligeramente melancólico. Suele sentirse introspectivo o expresivo según el contexto.`;

    case "maj7":
      return `${symbolBase}maj7 combina estabilidad con sofisticación. Suena brillante pero suave, y suele sentirse elegante, aérea o soñadora.`;

    case "m7":
      return `${symbolBase}m7 tiene un color nostálgico y relajado. Mantiene la profundidad del acorde menor, pero con un carácter más suave y jazzy.`;

    case "dominant7":
      return `${symbolBase}7 tiene una tensión clara que empuja hacia resolución. Suena dinámico, inestable y muy funcional dentro de progresiones.`;

    case "sus2":
      return `${symbolBase}sus2 suena abierto, ligero y flotante. No se siente totalmente resuelto, lo que le da un carácter moderno y espacioso.`;

    case "sus4":
      return `${symbolBase}sus4 suena suspendido y expectante. Tiene una tensión suave que sugiere movimiento o resolución cercana.`;

    case "diminished":
      return `${symbolBase} disminuido suena inestable, oscuro y tenso. Suele percibirse como un acorde de paso o de fuerte dirección armónica.`;

    case "augmented":
      return `${symbolBase} aumentado suena extraño, expansivo e inquietante. Tiene una cualidad ambigua que genera sorpresa o tensión elegante.`;

    default:
      return `${symbolBase} tiene una identidad armónica definida que puede adquirir distintos significados según el contexto musical.`;
  }
}