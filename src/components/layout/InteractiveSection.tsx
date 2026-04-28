"use client";
import { forwardRef } from "react";
import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/layout/SearchBar";
import InstrumentSwitch from "@/components/controls/InstrumentSwitch";
import ViewSwitch from "@/components/controls/ViewSwitch";
import ExplorerSettingsModal from "@/components/controls/ExplorerSettingsModal";
import PianoKeyboard from "@/components/instruments/PianoKeyboard";
import GuitarFretboard from "@/components/instruments/GuitarFretboard";
import BassFretboard from "@/components/instruments/BassFretboard";
import TheoryCard from "@/components/cards/TheoryCard";
import EmotionCard from "@/components/cards/EmotionCard";
import TheoryAdvancedCard from "@/components/cards/TheoryAdvancedCard";
import { useExplorerStore } from "@/features/explorer/explorerStore";
import { playChord } from "@/features/audio/playChord";
import { playNote } from "@/features/audio/playNote";
import { findPianoKeysForNotes } from "@/features/instruments/piano";
import { findGuitarPositionsForNotes } from "@/features/instruments/guitar";
import { resolveChordForInstruments } from "@/core/engine/resolve";
import type { NoteName } from "@/core/types";
import type { PreviousGuitarVoicingReference } from "@/core/voicings/guitar";
import type { GuitarRenderVoicing } from "@/core/adaptors/guitar";

type InteractiveSectionProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  instrument: "keyboard" | "guitar" | "bass";
  onInstrumentChange: (value: "keyboard" | "guitar" | "bass") => void;
  accentColor: string;
};

const KEYBOARD_NOTE_MAP: Record<string, NoteName> = {
  a: "C",
  w: "C#",
  s: "D",
  e: "D#",
  d: "E",
  f: "F",
  t: "F#",
  g: "G",
  y: "G#",
  h: "A",
  u: "A#",
  j: "B",
};

function GlowCircle({
  className,
  color,
}: {
  className: string;
  color: string;
}) {
  return (
    <div
      className={`absolute rounded-full blur-[2px] ${className}`}
      style={{
        background: `radial-gradient(circle, ${color} 0%, ${color} 52%, rgba(0,0,0,0) 76%)`,
      }}
    />
  );
}

function SettingsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
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
      return "Centro claro";
  }
}

function getVoicingCharacterLabel(tags: string[]) {
  if (tags.includes("compact")) return "compacto";
  if (tags.includes("open")) return "abierto";
  if (tags.includes("bright")) return "brillante";
  if (tags.includes("color-rich")) return "rico en color";
  if (tags.includes("stable")) return "estable";
  return "balanceado";
}

function toPreviousGuitarVoicingReference(
  renderVoicing: GuitarRenderVoicing | null
): PreviousGuitarVoicingReference | null {
  if (!renderVoicing) return null;

  return {
    baseFret: renderVoicing.baseFret,
    positions: renderVoicing.positions.map((position) => ({
      stringIndex: position.stringIndex,
      fret: position.fret,
      note: position.note,
    })),
  };
}

function guitarRenderVoicingToSelectedKeys(
  voicing: GuitarRenderVoicing,
  tuningId: "standard" | "drop-d"
) {
  return voicing.positions.map((position) => ({
    id: `guitar-${tuningId}-${position.stringIndex}-${position.fret}`,
    note: position.note,
    audioNote: position.audioNote,
  }));
}

export default function InteractiveSection({
  sectionRef,
  query,
  onQueryChange,
  onSubmit,
  instrument,
  onInstrumentChange,
  accentColor,
}: InteractiveSectionProps) {
  const clearNotes = useExplorerStore((state) => state.clearNotes);
  const setActiveInstrument = useExplorerStore((state) => state.setActiveInstrument);
  const toggleKey = useExplorerStore((state) => state.toggleKey);
  const selectedKeysByInstrument = useExplorerStore(
    (state) => state.selectedKeysByInstrument
  );
  const detection = useExplorerStore((state) => state.detection);
  const activeView = useExplorerStore((state) => state.activeView);
  const setActiveView = useExplorerStore((state) => state.setActiveView);
  const guitarTuning = useExplorerStore((state) => state.guitarTuning);
  const progressionBpm = useExplorerStore((state) => state.progressionBpm);
  const progressionChordBeats = useExplorerStore(
    (state) => state.progressionChordBeats
  );
  const playbackStyle = useExplorerStore((state) => state.playbackStyle);
  const progressionAnalysis = useExplorerStore((state) => state.progressionAnalysis);
  const progressionStepIndex = useExplorerStore((state) => state.progressionStepIndex);
  const nextProgressionStep = useExplorerStore((state) => state.nextProgressionStep);
  const previousProgressionStep = useExplorerStore((state) => state.previousProgressionStep);
  const setSelectedKeysForInstrument = useExplorerStore(
    (state) => state.setSelectedKeysForInstrument
  );
  const setGuitarRenderVoicing = useExplorerStore(
    (state) => state.setGuitarRenderVoicing
  );
  const currentGuitarRenderVoicing = useExplorerStore(
    (state) => state.renderVoicingsByInstrument.guitar
  );
  const manualMode = useExplorerStore((state) => state.manualMode);
  const setManualMode = useExplorerStore((state) => state.setManualMode);
  const toggleManualMode = useExplorerStore((state) => state.toggleManualMode);

  const [guitarVariants, setGuitarVariants] = useState<GuitarRenderVoicing[]>([]);
  const [guitarVariantIndex, setGuitarVariantIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const selectedKeys = selectedKeysByInstrument[instrument];
  const activeProgressionStep =
    progressionAnalysis?.steps?.[progressionStepIndex] ?? null;

  const currentVariant =
    instrument === "guitar" && guitarVariants.length > 0
      ? guitarVariants[guitarVariantIndex] ?? guitarVariants[0]
      : null;

  const currentVariantLabel = useMemo(() => {
    if (!currentVariant) return null;
    return getVoicingCharacterLabel(currentVariant.tags ?? []);
  }, [currentVariant]);

  function handleInstrumentChange(nextInstrument: "keyboard" | "guitar" | "bass") {
    onInstrumentChange(nextInstrument);
    setActiveInstrument(nextInstrument);
  }

  function handleSearchSubmit() {
    setManualMode(false);
    onSubmit();
  }

  function getChordDurationMs() {
    const beatMs = 60000 / progressionBpm;
    return Math.round(beatMs * progressionChordBeats);
  }

  function applyGuitarVariant(voicing: GuitarRenderVoicing, index: number) {
    setGuitarVariantIndex(index);
    setGuitarRenderVoicing(voicing);

    if (!manualMode) {
      setSelectedKeysForInstrument(
        "guitar",
        guitarRenderVoicingToSelectedKeys(voicing, guitarTuning)
      );
    }
  }

  async function handlePlaySelection() {
    if (selectedKeys.length === 0) return;
    await playChord(
      selectedKeys.map((key) => key.audioNote),
      instrument,
      {
        durationMs: getChordDurationMs(),
        style: playbackStyle,
      }
    );
  }

  async function resolveCurrentGuitarContext(
    previousReference?: PreviousGuitarVoicingReference | null
  ) {
    if (instrument !== "guitar") return null;
    if (manualMode) return null;

    if (progressionAnalysis && activeProgressionStep) {
      const resolved = resolveChordForInstruments(
        activeProgressionStep.root,
        activeProgressionStep.quality,
        {
          guitarTuningId: guitarTuning,
          previousGuitarVoicing:
            previousReference ??
            toPreviousGuitarVoicingReference(currentGuitarRenderVoicing),
          guitarIntent: "stable",
        }
      );

      setGuitarVariants(resolved.guitarVariants);
      setGuitarVariantIndex(0);

      if (resolved.guitar) {
        applyGuitarVariant(resolved.guitar, 0);
      }

      return resolved.guitar
        ? toPreviousGuitarVoicingReference(resolved.guitar)
        : null;
    }

    if (detection.type === "chord") {
      const resolved = resolveChordForInstruments(
        detection.chord.root,
        detection.chord.quality,
        {
          guitarTuningId: guitarTuning,
          bassNote: detection.chord.bass ?? null,
          previousGuitarVoicing:
            previousReference ??
            toPreviousGuitarVoicingReference(currentGuitarRenderVoicing),
          guitarIntent: "stable",
        }
      );

      setGuitarVariants(resolved.guitarVariants);
      setGuitarVariantIndex(0);

      if (resolved.guitar) {
        applyGuitarVariant(resolved.guitar, 0);
      }

      return resolved.guitar
        ? toPreviousGuitarVoicingReference(resolved.guitar)
        : null;
    }

    setGuitarVariants([]);
    setGuitarVariantIndex(0);
    return null;
  }

  async function renderProgressionStep(
    stepIndex: number,
    previousGuitarVoicing?: PreviousGuitarVoicingReference | null
  ) {
    if (!progressionAnalysis) return null;

    const step = progressionAnalysis.steps[stepIndex];
    if (!step) return null;

    const resolved = resolveChordForInstruments(step.root, step.quality, {
      guitarTuningId: guitarTuning,
      previousGuitarVoicing:
        instrument === "guitar"
          ? previousGuitarVoicing ??
            toPreviousGuitarVoicingReference(currentGuitarRenderVoicing)
          : null,
      guitarIntent: "stable",
    });

    const keys =
      instrument === "keyboard"
        ? resolved.piano.keys.map((key) => ({
            id: key.id,
            note: key.note,
            audioNote: key.audioNote,
          }))
        : instrument === "guitar"
          ? (resolved.guitar?.positions.map((position) => ({
              id: `guitar-${guitarTuning}-${position.stringIndex}-${position.fret}`,
              note: position.note,
              audioNote: position.audioNote,
            })) ?? [])
          : (resolved.bass?.positions.map((position) => ({
              id: position.id,
              note: position.note,
              audioNote: position.audioNote,
            })) ?? []);

    if (!manualMode) {
      setSelectedKeysForInstrument(instrument, keys);
    }

    if (instrument === "guitar") {
      setGuitarVariants(resolved.guitarVariants);
      setGuitarVariantIndex(0);
      setGuitarRenderVoicing(resolved.guitar);
    } else {
      setGuitarRenderVoicing(null);
    }

    const notesToPlay =
      instrument === "guitar" && manualMode ? selectedKeys : keys;

    if (notesToPlay.length > 0) {
      await playChord(
        notesToPlay.map((key) => key.audioNote),
        instrument,
        {
          durationMs: getChordDurationMs(),
          style: playbackStyle,
        }
      );
    }

    return instrument === "guitar"
      ? toPreviousGuitarVoicingReference(resolved.guitar)
      : null;
  }

  async function handlePlayProgression() {
    if (!progressionAnalysis || progressionAnalysis.steps.length === 0) return;

    const waitMs = getChordDurationMs();
    let previousReference: PreviousGuitarVoicingReference | null = null;

    for (let i = 0; i < progressionAnalysis.steps.length; i += 1) {
      useExplorerStore.getState().setProgressionStepIndex(i);
      previousReference = await renderProgressionStep(i, previousReference);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  async function handlePreviousStep() {
    if (!progressionAnalysis) return;
    const nextIndex = Math.max(progressionStepIndex - 1, 0);
    previousProgressionStep();
    await renderProgressionStep(
      nextIndex,
      toPreviousGuitarVoicingReference(currentGuitarRenderVoicing)
    );
  }

  async function handleNextStep() {
    if (!progressionAnalysis) return;
    const nextIndex = Math.min(
      progressionStepIndex + 1,
      progressionAnalysis.steps.length - 1
    );
    nextProgressionStep();
    await renderProgressionStep(
      nextIndex,
      toPreviousGuitarVoicingReference(currentGuitarRenderVoicing)
    );
  }

  useEffect(() => {
    if (instrument !== "guitar") return;
    if (manualMode) return;
    void resolveCurrentGuitarContext(null);
  }, [
    instrument,
    guitarTuning,
    manualMode,
    detection.type === "chord" ? detection.chord.symbol : "none",
    progressionAnalysis ? progressionStepIndex : -1,
  ]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;
      if (event.repeat) return;

      const pressedKey = event.key.toLowerCase();

      if (pressedKey === " ") {
        event.preventDefault();

        if (progressionAnalysis && !manualMode) {
          void handlePlayProgression();
        } else {
          void handlePlaySelection();
        }
        return;
      }

      if (pressedKey === "arrowright" && progressionAnalysis && !manualMode) {
        event.preventDefault();
        void handleNextStep();
        return;
      }

      if (pressedKey === "arrowleft" && progressionAnalysis && !manualMode) {
        event.preventDefault();
        void handlePreviousStep();
        return;
      }

      if (pressedKey === "escape") {
        event.preventDefault();
        clearNotes();
        return;
      }

      const mappedNote = KEYBOARD_NOTE_MAP[pressedKey];
      if (!mappedNote) return;

      event.preventDefault();

      const matchedKeys =
        instrument === "keyboard"
          ? findPianoKeysForNotes([mappedNote])
          : instrument === "guitar"
            ? findGuitarPositionsForNotes([mappedNote], 24, guitarTuning)
            : [];

      const matchedKey = matchedKeys[0];
      if (!matchedKey) return;

      const exists = selectedKeys.some((selected) => selected.id === matchedKey.id);

      toggleKey(instrument, matchedKey);

      if (!exists) {
        void playNote(matchedKey.audioNote, instrument);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    clearNotes,
    guitarTuning,
    instrument,
    selectedKeys,
    toggleKey,
    progressionAnalysis,
    progressionStepIndex,
    progressionBpm,
    progressionChordBeats,
    playbackStyle,
    currentGuitarRenderVoicing,
    manualMode,
  ]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-black px-6 pb-20 pt-8 text-white md:px-8"
    >
      <ExplorerSettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        instrument={instrument}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <GlowCircle
          className="-right-10 -top-14 h-[240px] w-[240px]"
          color="rgba(255,0,110,0.20)"
        />
        <GlowCircle
          className="right-[240px] top-[18px] h-[120px] w-[120px]"
          color="rgba(58,134,255,0.17)"
        />
        <GlowCircle
          className="right-[26px] top-[160px] h-[62px] w-[62px]"
          color="rgba(131,56,236,0.18)"
        />
        <GlowCircle
          className="left-[22px] bottom-[210px] h-[62px] w-[62px]"
          color="rgba(6,214,160,0.18)"
        />
        <GlowCircle
          className="left-[60px] bottom-[132px] h-[124px] w-[124px]"
          color="rgba(255,0,110,0.16)"
        />
        <GlowCircle
          className="-left-[70px] bottom-[-8px] h-[190px] w-[190px]"
          color="rgba(255,190,11,0.16)"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col items-start pt-24 md:pt-28">
        <div className="mb-7 w-full max-w-[540px]">
          <SearchBar
            value={query}
            onChange={onQueryChange}
            onSubmit={handleSearchSubmit}
            accentColor={accentColor}
            compact
            className="w-full"
          />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-start gap-3">
          <InstrumentSwitch value={instrument} onChange={handleInstrumentChange} />
          <ViewSwitch value={activeView} onChange={setActiveView} />

          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white/84 transition hover:bg-[#1a1a1a]"
          >
            <SettingsIcon />
            configuración
          </button>
        </div>

        <div className="mb-6 flex flex-wrap justify-start gap-3">
          <button
            type="button"
            onClick={clearNotes}
            className="rounded-full border border-white/10 bg-[#111111] px-5 py-3 text-sm text-white/90 transition hover:bg-[#1a1a1a]"
          >
            Limpiar selección
          </button>

          <button
            type="button"
            onClick={() => void handlePlaySelection()}
            className="rounded-full border border-[#FFBE0B]/30 bg-[#111111] px-5 py-3 text-sm text-white/90 transition hover:bg-[#1a1a1a]"
          >
            Reproducir selección
          </button>

          {progressionAnalysis && !manualMode && (
            <>
              <button
                type="button"
                onClick={() => void handlePlayProgression()}
                className="rounded-full border border-[#3A86FF]/30 bg-[#111111] px-5 py-3 text-sm text-white/90 transition hover:bg-[#1a1a1a]"
              >
                Reproducir progresión
              </button>

              <button
                type="button"
                onClick={() => void handlePreviousStep()}
                className="rounded-full border border-white/10 bg-[#111111] px-5 py-3 text-sm text-white/90 transition hover:bg-[#1a1a1a]"
              >
                Paso anterior
              </button>

              <button
                type="button"
                onClick={() => void handleNextStep()}
                className="rounded-full border border-white/10 bg-[#111111] px-5 py-3 text-sm text-white/90 transition hover:bg-[#1a1a1a]"
              >
                Paso siguiente
              </button>
            </>
          )}
        </div>

        {progressionAnalysis && activeProgressionStep && !manualMode && (
          <div className="mb-5 w-full rounded-[20px] border border-white/8 bg-[#111111] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-white/42">
              Navegación de progresión
            </p>
            <p className="mt-2 text-sm text-white/86">
              Paso {progressionStepIndex + 1} de {progressionAnalysis.steps.length}:{" "}
              <span style={{ color: accentColor }}>{activeProgressionStep.symbol}</span>{" "}
              → {activeProgressionStep.degree}
            </p>
            <p className="mt-1 text-sm text-white/62">
              {activeProgressionStep.functionNameEs} · {activeProgressionStep.explanation}
            </p>

            {typeof activeProgressionStep.contextualWeight === "number" && (
              <p className="mt-1 text-xs text-white/46">
                peso contextual del paso: {activeProgressionStep.contextualWeight}
              </p>
            )}

            {progressionAnalysis.detectedKey && (
              <p className="mt-2 text-sm text-white/70">
                centro actual:{" "}
                <span style={{ color: accentColor }}>
                  {progressionAnalysis.detectedKey.keyLabel}
                </span>
              </p>
            )}

            {progressionAnalysis.ambiguity && (
              <p className="mt-1 text-sm text-white/58">
                lectura global:{" "}
                <span style={{ color: accentColor }}>
                  {progressionAnalysis.ambiguity.isAmbiguous
                    ? getAmbiguityLabel(progressionAnalysis.ambiguity.kind)
                    : "Centro claro"}
                </span>
              </p>
            )}
          </div>
        )}

        <div className="w-full rounded-[28px] border border-white/5 bg-[#131313] p-2 md:p-3">
          {instrument === "keyboard" && <PianoKeyboard />}
          {instrument === "guitar" && (
            <div className="space-y-4">
              <GuitarFretboard />

              <div className="rounded-[18px] border border-white/8 bg-[#101010] px-4 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleManualMode}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      manualMode
                        ? "border-[#06D6A0]/40 bg-[#06D6A0]/12 text-white"
                        : "border-[#3A86FF]/40 bg-[#3A86FF]/12 text-white"
                    }`}
                  >
                    {manualMode ? "modo libre" : "modo asistido"}
                  </button>

                  <p className="text-sm text-white/58">
                    {manualMode
                      ? "Construye notas manualmente sin que la app regenere el acorde."
                      : "La app puede sugerir posiciones automáticamente."}
                  </p>
                </div>

                {!manualMode && guitarVariants.length > 0 && (
                  <div className="mt-4 border-t border-white/6 pt-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const nextIndex =
                            guitarVariantIndex === 0
                              ? guitarVariants.length - 1
                              : guitarVariantIndex - 1;
                          applyGuitarVariant(guitarVariants[nextIndex], nextIndex);
                        }}
                        className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                      >
                        anterior
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const nextIndex = (guitarVariantIndex + 1) % guitarVariants.length;
                          applyGuitarVariant(guitarVariants[nextIndex], nextIndex);
                        }}
                        className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                      >
                        siguiente
                      </button>

                      <p className="text-sm text-white/58">
                        {guitarVariantIndex + 1} / {guitarVariants.length}
                        {currentVariantLabel ? ` · ${currentVariantLabel}` : ""}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {guitarVariants.map((variant, index) => {
                        const isActive = index === guitarVariantIndex;
                        return (
                          <button
                            key={`${variant.baseFret}-${index}`}
                            type="button"
                            onClick={() => applyGuitarVariant(variant, index)}
                            className={`rounded-full border px-3 py-2 text-sm transition ${
                              isActive
                                ? "border-[#3A86FF]/40 bg-[#3A86FF]/12 text-white"
                                : "border-white/10 bg-black/20 text-white/68 hover:bg-white/5"
                            }`}
                          >
                            {variant.baseFret === 0 ? "abierto" : `traste ${variant.baseFret}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {instrument === "bass" && <BassFretboard />}
        </div>

        <div className="mt-7 flex w-full items-center justify-between gap-4">
          <div>
            <h2
              className="text-[1.55rem] font-medium tracking-[-0.04em] text-white md:text-[1.8rem]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Lectura musical
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Teoría y emoción de la selección actual
            </p>
          </div>

          {detection.type !== "none" && (
            <div className="rounded-full border border-white/8 bg-[#121212] px-4 py-2 text-xs text-white/58">
              análisis activo
            </div>
          )}
        </div>

        <div className="mt-4 grid w-full gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="min-w-0">
            <div className="mb-2 pl-1">
              <h3
                className="text-[1.05rem] font-medium tracking-[-0.03em] text-white/92"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Ficha teórica
              </h3>
            </div>
            <TheoryCard />
          </div>

          <div className="min-w-0">
            <div className="mb-2 pl-1">
              <h3
                className="text-[1.05rem] font-medium tracking-[-0.03em] text-white/92"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Ficha emocional
              </h3>
            </div>
            <EmotionCard />
          </div>
        </div>

        <TheoryAdvancedCard />
      </div>
    </section>
  );
}