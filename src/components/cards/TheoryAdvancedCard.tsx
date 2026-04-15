"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useExplorerStore } from "@/features/explorer/explorerStore";
import { buildAdvancedTheory } from "@/features/music/advancedTheory";
import { getInstrumentHighlightColor } from "@/features/music/emotion";
import { ColorText } from "@/components/ui/ColorText";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.02] p-5">
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/42">
        {title}
      </p>
      <div className="space-y-2 text-sm text-white/84">{children}</div>
    </div>
  );
}

function BulletList({
  items,
  color,
}: {
  items: string[];
  color?: string;
}) {
  if (items.length === 0) {
    return <p className="text-white/45">Sin datos por ahora</p>;
  }

  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item} className="text-white/82">
          • {color ? <ColorText color={color}>{item}</ColorText> : item}
        </li>
      ))}
    </ul>
  );
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

function getVoicingCharacterLabel(character?: string | null) {
  switch (character) {
    case "compact":
      return "compacto";
    case "open":
      return "abierto";
    case "bright":
      return "brillante";
    case "stable":
      return "estable";
    case "color-rich":
      return "rico en color";
    default:
      return "neutral";
  }
}

export default function TheoryAdvancedCard() {
  const [open, setOpen] = useState(false);

  const detection = useExplorerStore((state) => state.detection);
  const progressionAnalysis = useExplorerStore((state) => state.progressionAnalysis);
  const progressionStepIndex = useExplorerStore((state) => state.progressionStepIndex);
  const activeInstrument = useExplorerStore((state) => state.activeInstrument);
  const guitarVoicing = useExplorerStore(
    (state) => state.renderVoicingsByInstrument.guitar
  );

  const data = useMemo(() => {
    if (detection.type !== "chord") return null;

    return buildAdvancedTheory({
      root: detection.chord.root,
      quality: detection.chord.quality,
      symbol: detection.chord.symbol,
      notes: detection.chord.notes,
      semitones: detection.chord.semitones,
      activeInstrument,
      guitarVoicing:
        activeInstrument === "guitar" && guitarVoicing
          ? {
              baseFret: guitarVoicing.baseFret,
              difficulty: guitarVoicing.difficulty,
              usesBarre: guitarVoicing.usesBarre,
              positions: guitarVoicing.positions.map((position) => ({
                stringIndex: position.stringIndex,
                fret: position.fret,
                note: position.note,
              })),
            }
          : null,
    });
  }, [detection, activeInstrument, guitarVoicing]);

  if (detection.type === "none") {
    return null;
  }

  const accentColor = getInstrumentHighlightColor(detection);
  const activeProgressionStep =
    progressionAnalysis?.steps?.[progressionStepIndex] ?? null;

  return (
    <div className="mt-5 w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-[24px] border border-white/8 bg-[#111111] px-5 py-4 text-left transition hover:bg-[#161616]"
      >
        <div>
          <p className="text-[1rem] font-medium text-white">
            Ficha teórica avanzada
          </p>
          <p className="mt-1 text-sm text-white/48">
            {open
              ? "Ocultar análisis profundo"
              : "Mostrar análisis profundo sin abrumar la vista principal"}
          </p>
        </div>

        <span
          className="rounded-full border px-4 py-2 text-xs transition"
          style={{
            color: accentColor,
            borderColor: `${accentColor}44`,
            backgroundColor: `${accentColor}12`,
            boxShadow: `0 0 0 1px ${accentColor}10 inset`,
          }}
        >
          {open ? "cerrar" : "abrir"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {detection.type === "interval" ? (
              <div className="rounded-[26px] border border-white/8 bg-[#111111] p-5 text-sm text-white/68">
                La ficha avanzada de intervalos aún está en desarrollo.
              </div>
            ) : data ? (
              <div className="grid gap-4 rounded-[26px] border border-white/8 bg-[#111111] p-4 lg:grid-cols-2">
                <Section title="Identidad armónica">
                  <p>
                    Acorde: <ColorText color={accentColor}>{data.identity.symbol}</ColorText>
                  </p>
                  <p>
                    Tipo: <ColorText color={accentColor}>{data.identity.qualityLabel}</ColorText>
                  </p>
                  <p>
                    Notas: <ColorText color={accentColor}>{data.identity.notes.join(" – ")}</ColorText>
                  </p>
                  <p>
                    Grados: <ColorText color={accentColor}>{data.identity.degrees.join(" – ")}</ColorText>
                  </p>
                  <p>
                    Función armónica:{" "}
                    <ColorText color={accentColor}>
                      {data.identity.harmonicFunctionHint}
                    </ColorText>
                  </p>
                </Section>

                <Section title="Relación con escala">
                  <p>
                    Escala principal:{" "}
                    <ColorText color={accentColor}>{data.scaleRelation.mainScale}</ColorText>
                  </p>
                  <p>
                    Escalas compatibles:{" "}
                    <ColorText color={accentColor}>
                      {data.scaleRelation.compatibleScales.join(", ")}
                    </ColorText>
                  </p>
                  <p>
                    Notas guía:{" "}
                    <ColorText color={accentColor}>
                      {data.scaleRelation.guideTones.join(", ")}
                    </ColorText>
                  </p>
                </Section>

                <Section title="Función musical">
                  <p>
                    Rol: <ColorText color={accentColor}>{data.functionMusic.role}</ColorText>
                  </p>
                  <p>{data.functionMusic.explanation}</p>
                </Section>

                <Section title="Nivel de tensión real">
                  <p>
                    Tensión interna:{" "}
                    <ColorText color={accentColor}>{data.tension.level}</ColorText>
                  </p>
                  <p>
                    Intervalos tensos:{" "}
                    <ColorText color={accentColor}>
                      {data.tension.intervals.join(", ")}
                    </ColorText>
                  </p>
                  <p>{data.tension.explanation}</p>
                </Section>

                <Section title="Voicing / estructura">
                  <p>
                    Tipo: <ColorText color={accentColor}>{data.voicing.type}</ColorText>
                  </p>
                  <p>
                    Inversión: <ColorText color={accentColor}>{data.voicing.inversion}</ColorText>
                  </p>
                  <p>
                    Distribución:{" "}
                    <ColorText color={accentColor}>{data.voicing.distribution}</ColorText>
                  </p>
                  {data.voicing.technique && (
                    <p>
                      Técnica: <ColorText color={accentColor}>{data.voicing.technique}</ColorText>
                    </p>
                  )}
                  {data.voicing.positionLabel && (
                    <p>
                      Lectura instrumental:{" "}
                      <ColorText color={accentColor}>{data.voicing.positionLabel}</ColorText>
                    </p>
                  )}
                  {guitarVoicing?.tags?.length ? (
                    <p>
                      Carácter actual:{" "}
                      <ColorText color={accentColor}>
                        {getVoicingCharacterLabel(
                          guitarVoicing.tags.find((tag) =>
                            ["compact", "open", "bright", "stable", "color-rich"].includes(tag)
                          ) ?? null
                        )}
                      </ColorText>
                    </p>
                  ) : null}
                </Section>

                <Section title="Sustituciones / equivalencias">
                  <p className="text-white/58">Puede sustituir:</p>
                  <BulletList items={data.substitutions.canSubstitute} color={accentColor} />
                  <p className="pt-2 text-white/58">Comparte color con:</p>
                  <BulletList items={data.substitutions.sharesColorWith} color={accentColor} />
                </Section>

                <Section title="Uso musical real">
                  <p className="text-white/58">Géneros:</p>
                  <BulletList items={data.usage.genres} color={accentColor} />
                  <p className="pt-2 text-white/58">Contextos:</p>
                  <BulletList items={data.usage.contexts} color={accentColor} />
                </Section>

                <Section title="Progresiones típicas">
                  <BulletList items={data.progressions} color={accentColor} />
                </Section>

                <Section title="Extensiones posibles">
                  <BulletList items={data.extensions} color={accentColor} />
                </Section>

                {progressionAnalysis && (
                  <Section title="Contexto multiacorde">
                    <p>
                      Progresión:{" "}
                      <ColorText color={accentColor}>
                        {progressionAnalysis.normalizedSymbols.join(" – ")}
                      </ColorText>
                    </p>

                    {progressionAnalysis.detectedKey && (
                      <p>
                        Tonalidad global:{" "}
                        <ColorText color={accentColor}>
                          {progressionAnalysis.detectedKey.keyLabel}
                        </ColorText>
                      </p>
                    )}

                    {progressionAnalysis.ambiguity?.isAmbiguous && (
                      <>
                        <p>
                          Lectura:{" "}
                          <ColorText color={accentColor}>
                            {getAmbiguityLabel(progressionAnalysis.ambiguity.kind)}
                          </ColorText>
                        </p>
                        {progressionAnalysis.ambiguity.reason && (
                          <p>{progressionAnalysis.ambiguity.reason}</p>
                        )}
                      </>
                    )}

                    {progressionAnalysis.cadenceLabel && (
                      <p>
                        Cadencia / patrón:{" "}
                        <ColorText color={accentColor}>
                          {progressionAnalysis.cadenceLabel}
                        </ColorText>
                      </p>
                    )}

                    {activeProgressionStep && (
                      <p>
                        Paso actual:{" "}
                        <ColorText color={accentColor}>
                          {activeProgressionStep.symbol} ({activeProgressionStep.degree})
                        </ColorText>
                      </p>
                    )}

                    <p>{progressionAnalysis.emotionalProfile}</p>
                  </Section>
                )}

                {progressionAnalysis?.keyCandidates &&
                  progressionAnalysis.keyCandidates.length > 0 && (
                    <Section title="Ranking tonal interno">
                      <div className="space-y-2">
                        {progressionAnalysis.keyCandidates.map((candidate, index) => (
                          <div
                            key={`${candidate.keyLabel}-${index}`}
                            className="rounded-[14px] border border-white/7 bg-black/20 p-3"
                            style={{
                              boxShadow:
                                index === 0
                                  ? `0 0 0 1px ${accentColor}33 inset`
                                  : undefined,
                            }}
                          >
                            <p>
                              <ColorText color={accentColor}>
                                {candidate.keyLabel}
                              </ColorText>{" "}
                              — score {candidate.normalizedScore}
                            </p>
                            {candidate.reasons.length > 0 && (
                              <p className="text-white/68">
                                {candidate.reasons.join(" · ")}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}

                {progressionAnalysis && (
                  <Section title="Lectura paso a paso">
                    <div className="space-y-2">
                      {progressionAnalysis.steps.map((step, index) => (
                        <div
                          key={`${step.index}-${step.symbol}`}
                          className="rounded-[14px] border border-white/7 bg-black/20 p-3"
                          style={{
                            boxShadow:
                              index === progressionStepIndex
                                ? `0 0 0 1px ${accentColor}33 inset`
                                : undefined,
                          }}
                        >
                          <p>
                            <ColorText color={accentColor}>{step.symbol}</ColorText>{" "}
                            →{" "}
                            <ColorText color={accentColor}>
                              {step.degree}
                            </ColorText>{" "}
                            en la tonalidad global
                          </p>
                          <p className="text-white/68">
                            {step.functionNameEs} · {step.explanation}
                          </p>

                          {typeof step.contextualWeight === "number" && (
                            <p className="mt-1 text-xs text-white/46">
                              peso contextual: {step.contextualWeight}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}