export type ChordColorType = {
  primary: string
  bg: string
  text: string
  glow: string
}

export const getChordColor = (chord: string): ChordColorType => {
  const lower = chord.toLowerCase()

  // 🎹 REGLAS (alineadas con tu paleta)
  if (lower.includes("maj7") || lower.includes("maj")) {
    return {
      primary: "#FFBE0B", // amarillo
      bg: "rgba(255,190,11,0.08)",
      text: "#FFBE0B",
      glow: "rgba(255,190,11,0.4)"
    }
  }

  if (lower.includes("m7") || lower.includes("min") || lower.includes("m")) {
    return {
      primary: "#3A86FF", // azul
      bg: "rgba(58,134,255,0.08)",
      text: "#3A86FF",
      glow: "rgba(58,134,255,0.4)"
    }
  }

  if (lower.includes("7")) {
    return {
      primary: "#FF006E", // rojo
      bg: "rgba(255,0,110,0.08)",
      text: "#FF006E",
      glow: "rgba(255,0,110,0.4)"
    }
  }

  if (lower.includes("dim") || lower.includes("ø")) {
    return {
      primary: "#8338EC", // morado
      bg: "rgba(131,56,236,0.08)",
      text: "#8338EC",
      glow: "rgba(131,56,236,0.4)"
    }
  }

  // default mayor
  return {
    primary: "#FFBE0B",
    bg: "rgba(255,190,11,0.08)",
    text: "#FFBE0B",
    glow: "rgba(255,190,11,0.4)"
  }
}