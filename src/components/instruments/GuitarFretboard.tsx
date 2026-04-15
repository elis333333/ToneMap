"use client";

import { useMemo } from "react";
import { useExplorerStore } from "@/features/explorer/explorerStore";
import { buildGuitarFretboardPositions } from "@/features/instruments/guitar";
import { playNote } from "@/features/audio/playNote";
import { getInstrumentHighlightColor } from "@/features/music/emotion";
import { getDisplayLabel } from "@/features/instruments/display";
import type { NoteName } from "@/core/types";

const STRING_COUNT = 6;
const FRET_COUNT = 24;
const BOARD_HEIGHT = 320;
const HEADSTOCK_WIDTH = 176;
const CONTENT_PADDING_X = 26;
const CONTENT_PADDING_Y = 22;
const MIN_BOARD_WIDTH = 1700;

function getFretSpacing(count: number) {
  const scale = 1000;
  const widths: number[] = [];

  for (let fret = 0; fret < count; fret += 1) {
    const current = scale / Math.pow(2, fret / 12);
    const next = scale / Math.pow(2, (fret + 1) / 12);
    widths.push(current - next);
  }

  const total = widths.reduce((sum, width) => sum + width, 0);
  return widths.map((width) => width / total);
}

function buildFretGeometry(count: number, boardWidth: number) {
  const spacing = getFretSpacing(count);
  const cumulative: number[] = [0];

  for (let i = 0; i < spacing.length; i += 1) {
    cumulative.push(cumulative[i] + spacing[i] * boardWidth);
  }

  return {
    fretBoundaries: cumulative,
    fretCenters: Array.from({ length: count + 1 }, (_, fret) => {
      if (fret === 0) return 0;
      return (cumulative[fret - 1] + cumulative[fret]) / 2;
    }),
  };
}

function getStringTopPx(stringIndex: number, contentHeight: number) {
  return (stringIndex * contentHeight) / (STRING_COUNT - 1);
}

function getFretLabel(fret: number) {
  if (fret === 0) return "0";
  return String(fret);
}

export default function GuitarFretboard() {
  const selectedKeys = useExplorerStore(
    (state) => state.selectedKeysByInstrument.guitar
  );
  const guitarRenderVoicing = useExplorerStore(
    (state) => state.renderVoicingsByInstrument.guitar
  );
  const toggleKey = useExplorerStore((state) => state.toggleKey);
  const detection = useExplorerStore((state) => state.detection);
  const activeView = useExplorerStore((state) => state.activeView);
  const guitarTuning = useExplorerStore((state) => state.guitarTuning);
  const guitarHandedness = useExplorerStore((state) => state.guitarHandedness);

  const positions = useMemo(
    () => buildGuitarFretboardPositions(FRET_COUNT, guitarTuning),
    [guitarTuning]
  );
  const highlightColor = getInstrumentHighlightColor(detection);
  const isChordDetected = detection.type === "chord";

  const contentHeight = BOARD_HEIGHT - CONTENT_PADDING_Y * 2;
  const playableWidth = MIN_BOARD_WIDTH - HEADSTOCK_WIDTH - CONTENT_PADDING_X * 2;
  const { fretBoundaries, fretCenters } = useMemo(
    () => buildFretGeometry(FRET_COUNT, playableWidth),
    []
  );

  const detectedRoot = detection.type === "chord" ? detection.chord.root : null;
  const isLeftHanded = guitarHandedness === "left";

  function projectX(value: number) {
    return isLeftHanded ? playableWidth - value : value;
  }

  async function handlePositionClick(position: (typeof positions)[number]) {
    toggleKey("guitar", {
      id: position.id,
      note: position.note,
      audioNote: position.audioNote,
    });

    await playNote(position.audioNote, "guitar");
  }

  const stringLines = Array.from({ length: STRING_COUNT }, (_, i) => i);
  const fretNumbers = Array.from({ length: FRET_COUNT + 1 }, (_, i) => i);

  const barreVisual = guitarRenderVoicing?.barre
    ? {
        fret: guitarRenderVoicing.barre.fret,
        left: projectX(fretCenters[guitarRenderVoicing.barre.fret] ?? 0),
        top:
          getStringTopPx(6 - guitarRenderVoicing.barre.toString, contentHeight) +
          CONTENT_PADDING_Y,
        bottom:
          getStringTopPx(6 - guitarRenderVoicing.barre.fromString, contentHeight) +
          CONTENT_PADDING_Y,
      }
    : null;

  const neckContainerStyle = isLeftHanded
    ? {
        left: `${CONTENT_PADDING_X}px`,
        right: `${HEADSTOCK_WIDTH}px`,
        top: `${CONTENT_PADDING_Y}px`,
        bottom: `${CONTENT_PADDING_Y}px`,
      }
    : {
        left: `${HEADSTOCK_WIDTH}px`,
        right: `${CONTENT_PADDING_X}px`,
        top: `${CONTENT_PADDING_Y}px`,
        bottom: `${CONTENT_PADDING_Y}px`,
      };

  const headstockStyle = isLeftHanded
    ? {
        right: 0,
        left: "auto",
        width: `${HEADSTOCK_WIDTH}px`,
        clipPath: "polygon(100% 18%,28% 28%,18% 34%,18% 66%,30% 72%,100% 82%)",
      }
    : {
        left: 0,
        right: "auto",
        width: `${HEADSTOCK_WIDTH}px`,
        clipPath: "polygon(0 18%,72% 28%,82% 34%,82% 66%,70% 72%,0 82%)",
      };

  return (
    <div className="w-full rounded-[24px] bg-[#111111] p-4 shadow-[0_12px_34px_rgba(0,0,0,0.22)]">
      <div className="mb-3 flex flex-wrap items-center gap-3 px-1">
        {guitarRenderVoicing ? (
          <>
            <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-white/72">
              Voicing: <span className="text-white">{guitarRenderVoicing.chordSymbol}</span>
            </div>

            <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-white/60">
              Posición base:{" "}
              <span className="text-white">{guitarRenderVoicing.baseFret || 0}</span>
            </div>

            <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-white/60">
              Dificultad:{" "}
              <span className="text-white">{guitarRenderVoicing.difficulty}</span>
            </div>

            <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-white/60">
              Afinación: <span className="text-white">{guitarTuning}</span>
            </div>

            <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-white/60">
              Orientación:{" "}
              <span className="text-white">
                {isLeftHanded ? "zurdo" : "diestro"}
              </span>
            </div>

            {guitarRenderVoicing.usesBarre && (
              <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-white/60">
                Técnica: <span className="text-white">cejilla</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-white/55">
              Modo libre del mástil
            </div>
            <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-white/60">
              Afinación: <span className="text-white">{guitarTuning}</span>
            </div>
            <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-white/60">
              Orientación:{" "}
              <span className="text-white">
                {isLeftHanded ? "zurdo" : "diestro"}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="overflow-hidden rounded-[20px] border border-white/5 bg-[#181818] p-5">
        <div className="overflow-x-auto overflow-y-hidden pb-3">
          <div
            className="relative rounded-[24px] bg-[#0E131A] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            style={{ width: `${MIN_BOARD_WIDTH}px`, height: `${BOARD_HEIGHT}px` }}
          >
            <div
              className="absolute top-0 h-full bg-[#ff2b3f]"
              style={headstockStyle}
            />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_42%)]" />

            <div className="absolute" style={neckContainerStyle}>
              {stringLines.map((stringIndex) => (
                <div
                  key={`string-${stringIndex}`}
                  className="absolute left-0 right-0 h-[2px] bg-[#d9d9d9]"
                  style={{
                    top: `${getStringTopPx(stringIndex, contentHeight)}px`,
                    boxShadow: "0 0 2px rgba(255,255,255,0.08)",
                  }}
                />
              ))}

              {fretNumbers.map((fret) => (
                <div
                  key={`fret-${fret}`}
                  className={[
                    "absolute top-0 bottom-0 bg-[#c7c7c7]",
                    fret === 0 ? "w-[5px]" : "w-[2px]",
                  ].join(" ")}
                  style={{
                    left: `${projectX(fretBoundaries[fret] ?? playableWidth)}px`,
                    opacity: fret === 0 ? 1 : 0.88,
                  }}
                />
              ))}

              {fretNumbers.slice(1).map((fret) => (
                <div
                  key={`fret-number-${fret}`}
                  className="pointer-events-none absolute -top-6 -translate-x-1/2 text-[10px] tracking-[0.08em] text-white/24"
                  style={{
                    left: `${projectX(fretCenters[fret] ?? 0)}px`,
                  }}
                >
                  {getFretLabel(fret)}
                </div>
              ))}

              {barreVisual && (
                <div
                  className="pointer-events-none absolute -translate-x-1/2 rounded-full"
                  style={{
                    left: `${barreVisual.left}px`,
                    top: `${barreVisual.top - 12}px`,
                    width: "16px",
                    height: `${Math.max(26, barreVisual.bottom - barreVisual.top + 24)}px`,
                    background: `linear-gradient(180deg, ${highlightColor} 0%, ${highlightColor}dd 100%)`,
                    boxShadow: `0 0 18px ${highlightColor}45, inset 0 1px 0 rgba(255,255,255,0.18)`,
                    opacity: 0.75,
                  }}
                />
              )}

              {positions.map((position) => {
                const active = selectedKeys.some((selected) => selected.id === position.id);
                const left = projectX(fretCenters[position.fret] ?? 0);
                const top = getStringTopPx(position.stringIndex, contentHeight);

                const label = getDisplayLabel({
                  note: position.note as NoteName,
                  root: detectedRoot,
                  view: activeView,
                });

                return (
                  <button
                    key={position.id}
                    type="button"
                    title={`${position.note} • ${position.label}`}
                    onClick={() => void handlePositionClick(position)}
                    className={[
                      "group absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-200",
                      active
                        ? "scale-[1.05]"
                        : "border-white/14 bg-white/[0.015] hover:bg-white/[0.06]",
                    ].join(" ")}
                    style={{
                      left: `${left}px`,
                      top: `${top}px`,
                      ...(active
                        ? {
                            borderColor: isChordDetected ? highlightColor : "#FFBE0B",
                            background: isChordDetected
                              ? highlightColor
                              : `radial-gradient(circle at 30% 30%, #FFD65A 0%, #FFBE0B 58%, #D79800 100%)`,
                            boxShadow: isChordDetected
                              ? `0 0 22px ${highlightColor}55, 0 8px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.18)`
                              : `0 0 18px rgba(255,190,11,0.34), 0 8px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.18)`,
                          }
                        : {}),
                    }}
                  >
                    <span
                      className={[
                        "pointer-events-none text-[0.58rem] font-medium tracking-[0.03em]",
                        active ? "text-white/92" : "text-white/18 group-hover:text-white/28",
                      ].join(" ")}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}

              {guitarRenderVoicing?.mutedStrings.map((stringIndex) => (
                <div
                  key={`muted-${stringIndex}`}
                  className="pointer-events-none absolute -translate-y-1/2 text-[11px] font-semibold tracking-[0.08em] text-white/36"
                  style={{
                    left: isLeftHanded ? `${playableWidth + 10}px` : "-16px",
                    top: `${getStringTopPx(stringIndex, contentHeight)}px`,
                  }}
                >
                  X
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}