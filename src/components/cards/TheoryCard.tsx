"use client";

import { ReactNode } from "react";
import { useExplorerStore } from "@/features/explorer/explorerStore";
import { buildHumanReading } from "@/features/music/humanReading";
import { getScaleRelations } from "@/core/theory/scaleRelations";
import { getHarmonicFunction } from "@/core/theory/harmonicFunction";
import { getInstrumentHighlightColor } from "@/features/music/emotion";
import { ColorText } from "@/components/ui/ColorText";

function highlightHumanText(
  text: string,
  words: string[],
  color: string
): ReactNode[] {
  if (!words.length) return [text];

  const escapedWords = words
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (!escapedWords.length) return [text];

  const regex = new RegExp(`(${escapedWords.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const matched = words.some(
      (word) => word.toLowerCase() === part.toLowerCase()
    );

    if (matched) {
      return (
        <ColorText key={`${part}-${index}`} color={color}>
          {part}
        </ColorText>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function getHighlightWordsByQuality(quality: string): string[] {
  switch (quality) {
    case "major":
      return [
        "estable",
        "claro",
        "brillante",
        "firme",
        "directo",
        "llegada",
        "apertura",
      ];
    case "minor":
      return [
        "íntimo",
        "emocional",
        "melancólico",
        "introspectivo",
        "expresivo",
        "profundidad",
      ];
    case "maj7":
      return [
        "estabilidad",
        "sofisticación",
        "brillante",
        "suave",
        "elegante",
        "aérea",
        "soñadora",
      ];
    case "m7":
      return [
        "nostálgico",
        "relajado",
        "profundidad",
        "suave",
        "jazzy",
        "modal",
      ];
    case "dominant7":
      return [
        "tensión",
        "resolución",
        "dirección",
        "activo",
        "dominante",
      ];
    default:
      return [];
  }
}

function getExtensionLabel(extensionCategory?: string | null) {
  switch (extensionCategory) {
    case "added-color":
      return "color añadido";
    case "seventh":
      return "séptima";
    case "extended":
      return "extendido";
    case "altered":
      return "alterado";
    default:
      return "básico";
  }
}

function getAmbiguityLabel(kind?: string | null) {
  switch (kind) {
    case "relative-major-minor":
      return "Ambigüedad relativa";
    case "modal":
      return "Color modal";
    case "weak-cadence":
      return "Cierre débil";
    case "competing-centers":
      return "Centros en competencia";
    default:
      return "Lectura abierta";
  }
}

export default function TheoryCard() {
  const detection = useExplorerStore((state) => state.detection);
  const progressionAnalysis = useExplorerStore((state) => state.progressionAnalysis);
  const progressionStepIndex = useExplorerStore((state) => state.progressionStepIndex);

  if (detection.type === "none") {
    return (
      <div className="rounded-xl border border-white/10 p-4 text-white/40">
        Sin análisis teórico
      </div>
    );
  }

  const accentColor = getInstrumentHighlightColor(detection);
  const activeProgressionStep =
    progressionAnalysis?.steps?.[progressionStepIndex] ?? null;

  if (detection.type === "interval") {
    return (
      <div className="rounded-xl border border-white/10 bg-[#111111] p-5 space-y-4">
        <div>
          <h3 className="text-xl font-semibold" style={{ color: accentColor }}>
            {detection.shortName}
          </h3>
          <p className="text-sm text-white/50">{detection.nameEs}</p>
        </div>

        <div className="text-sm leading-relaxed text-white/82">
          Este intervalo tiene una identidad propia y su efecto depende de la{" "}
          <ColorText color={accentColor}>distancia</ColorText> entre las notas.
          Puede sentirse estable, abierto o tenso según su separación.
        </div>

        <div>
          <p className="mb-1 text-xs text-white/40">Construcción</p>
          <p className="text-sm">
            {detection.notes.map((note, index) => (
              <span key={`${note}-${index}`} style={{ color: accentColor }}>
                {note}
                {index < detection.notes.length - 1 ? " – " : ""}
              </span>
            ))}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs text-white/40">Datos</p>
          <p className="text-sm text-white/75">
            <ColorText color={accentColor}>{detection.shortName}</ColorText> —{" "}
            {detection.semitones} semitonos
          </p>
        </div>
      </div>
    );
  }

  const chord = detection.chord;
  const root = chord.root;
  const quality = chord.quality;

  const human = buildHumanReading({ root, quality });
  const scales = getScaleRelations(root, quality);
  const func = getHarmonicFunction(quality);
  const wordsToHighlight = getHighlightWordsByQuality(quality);
  const tonalPrimary = chord.tonalContext.primary;

  return (
    <div className="rounded-xl border border-white/10 bg-[#111111] p-5 space-y-5">
      <div>
        <h3 className="text-xl font-semibold" style={{ color: accentColor }}>
          {chord.symbol}
        </h3>
        <p className="text-sm text-white/50">{quality}</p>
      </div>

      <div className="text-sm leading-relaxed text-white/82">
        {highlightHumanText(human, wordsToHighlight, accentColor)}
      </div>

      <div>
        <p className="mb-1 text-xs text-white/40">Construcción</p>
        <p className="text-sm">
          {chord.notes.map((note, index) => (
            <span key={`${note}-${index}`} style={{ color: accentColor }}>
              {note}
              {index < chord.notes.length - 1 ? " – " : ""}
            </span>
          ))}
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-[14px] border border-white/8 bg-white/[0.02] p-3">
          <p className="mb-1 text-xs text-white/40">Inversión / bajo</p>
          <p className="text-sm text-white/82">
            {activeProgressionStep?.inversionLabel ? (
              <ColorText color={accentColor}>
                {activeProgressionStep.inversionLabel}
              </ColorText>
            ) : (
              "posición fundamental"
            )}
          </p>

          {activeProgressionStep?.bass && (
            <p className="mt-1 text-sm text-white/62">
              Bajo explícito:{" "}
              <ColorText color={accentColor}>{activeProgressionStep.bass}</ColorText>
            </p>
          )}

          {activeProgressionStep?.slashContextLabel && (
            <p className="mt-2 text-sm text-white/62">
              {activeProgressionStep.slashContextLabel}
            </p>
          )}
        </div>

        <div className="rounded-[14px] border border-white/8 bg-white/[0.02] p-3">
          <p className="mb-1 text-xs text-white/40">Tipo de color</p>
          <p className="text-sm text-white/82">
            <ColorText color={accentColor}>
              {getExtensionLabel(activeProgressionStep?.extensionCategory)}
            </ColorText>
          </p>

          {activeProgressionStep?.extensionContextLabel && (
            <p className="mt-2 text-sm text-white/62">
              {activeProgressionStep.extensionContextLabel}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs text-white/40">Función</p>

        {tonalPrimary ? (
          <div className="space-y-1 text-sm text-white/85">
            <p>
              <ColorText color={accentColor}>
                {tonalPrimary.functionNameEs}
              </ColorText>{" "}
              — lectura principal como{" "}
              <ColorText color={accentColor}>
                {tonalPrimary.degree}
              </ColorText>{" "}
              en{" "}
              <ColorText color={accentColor}>
                {tonalPrimary.keyLabel}
              </ColorText>
            </p>
            <p className="text-white/65">{tonalPrimary.explanation}</p>
          </div>
        ) : (
          <p className="text-sm text-white/85">
            <ColorText color={accentColor}>{func.role}</ColorText> —{" "}
            {func.description}
          </p>
        )}
      </div>

      <div>
        <p className="mb-1 text-xs text-white/40">Relación con escala</p>

        {tonalPrimary ? (
          <>
            <p className="text-sm text-white/85">
              Principal:{" "}
              <ColorText color={accentColor}>
                {tonalPrimary.compatibleScale}
              </ColorText>
            </p>

            {chord.tonalContext.candidates.length > 1 && (
              <p className="text-sm text-white/70">
                También podría encajar en:{" "}
                {chord.tonalContext.candidates.slice(1).map((candidate, index) => (
                  <span key={`${candidate.keyLabel}-${index}`}>
                    <ColorText color={accentColor}>
                      {candidate.keyLabel} ({candidate.degree})
                    </ColorText>
                    {index < chord.tonalContext.candidates.slice(1).length - 1
                      ? ", "
                      : ""}
                  </span>
                ))}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-white/85">
              Principal: <ColorText color={accentColor}>{scales.main}</ColorText>
            </p>

            {scales.compatible.length > 0 && (
              <p className="text-sm text-white/70">
                Compatibles:{" "}
                {scales.compatible.map((scale, index) => (
                  <span key={`${scale}-${index}`}>
                    <ColorText color={accentColor}>{scale}</ColorText>
                    {index < scales.compatible.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}

            {scales.guideTones.length > 0 && (
              <p className="text-sm text-white/65">
                Notas guía:{" "}
                {scales.guideTones.map((tone, index) => (
                  <span key={`${tone}-${index}`}>
                    <ColorText color={accentColor}>{tone}</ColorText>
                    {index < scales.guideTones.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
          </>
        )}
      </div>

      {progressionAnalysis && (
        <div className="rounded-[18px] border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-white/40">
            Lectura de progresión
          </p>

          <p className="text-sm text-white/84">
            Progresión:{" "}
            <ColorText color={accentColor}>
              {progressionAnalysis.normalizedSymbols.join(" – ")}
            </ColorText>
          </p>

          {progressionAnalysis.detectedKey && (
            <p className="text-sm text-white/74">
              Tonalidad global probable:{" "}
              <ColorText color={accentColor}>
                {progressionAnalysis.detectedKey.keyLabel}
              </ColorText>
            </p>
          )}

          {progressionAnalysis.ambiguity?.isAmbiguous && (
            <div className="rounded-[14px] border border-white/8 bg-black/20 p-3 space-y-2">
              <p className="text-sm text-white/84">
                <ColorText color={accentColor}>
                  {getAmbiguityLabel(progressionAnalysis.ambiguity.kind)}
                </ColorText>
              </p>

              {progressionAnalysis.ambiguity.reason && (
                <p className="text-sm text-white/66">
                  {progressionAnalysis.ambiguity.reason}
                </p>
              )}
            </div>
          )}

          {activeProgressionStep && (
            <>
              <p className="text-sm text-white/74">
                Paso actual:{" "}
                <ColorText color={accentColor}>
                  {activeProgressionStep.symbol}
                </ColorText>{" "}
                → {activeProgressionStep.degree}
              </p>

              {(activeProgressionStep.bass || activeProgressionStep.inversionLabel) && (
                <p className="text-sm text-white/62">
                  Lectura estructural:{" "}
                  {activeProgressionStep.inversionLabel && (
                    <ColorText color={accentColor}>
                      {activeProgressionStep.inversionLabel}
                    </ColorText>
                  )}
                  {activeProgressionStep.bass ? (
                    <>
                      {" "}con bajo{" "}
                      <ColorText color={accentColor}>
                        {activeProgressionStep.bass}
                      </ColorText>
                    </>
                  ) : null}
                </p>
              )}
            </>
          )}

          <p className="text-sm text-white/68">
            {progressionAnalysis.emotionalProfile}
          </p>
        </div>
      )}
    </div>
  );
}