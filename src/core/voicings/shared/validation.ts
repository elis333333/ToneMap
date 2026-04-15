import type { InstrumentVoicing } from "@/core/types";

export interface VoicingValidationResult {
  valid: boolean;
  reasons: string[];
}

export function validateVoicing(voicing: InstrumentVoicing): VoicingValidationResult {
  const reasons: string[] = [];

  const playedStrings = voicing.strings.filter((stringNote) => !stringNote.muted);

  if (playedStrings.length === 0) {
    reasons.push("El voicing no contiene cuerdas sonando.");
  }

  const fretted = playedStrings
    .map((stringNote) => stringNote.fret)
    .filter((fret): fret is number => fret !== null);

  const maxFret = fretted.length > 0 ? Math.max(...fretted) : 0;
  const minNonZeroFretCandidates = fretted.filter((fret) => fret > 0);
  const minNonZeroFret =
    minNonZeroFretCandidates.length > 0 ? Math.min(...minNonZeroFretCandidates) : 0;

  const fretSpan =
    minNonZeroFret > 0 && maxFret > 0 ? maxFret - minNonZeroFret : 0;

  if (fretSpan > 5) {
    reasons.push("El rango de trastes es demasiado amplio.");
  }

  const uniqueStringIndexes = new Set(
    voicing.strings
      .filter((stringNote) => !stringNote.muted)
      .map((stringNote) => stringNote.stringIndex)
  );

  if (uniqueStringIndexes.size !== playedStrings.length) {
    reasons.push("Hay más de una nota en la misma cuerda.");
  }

  if (voicing.usesBarre && !voicing.barre) {
    reasons.push("El voicing indica cejilla pero no tiene datos de cejilla.");
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}