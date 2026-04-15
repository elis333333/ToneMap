"use client";

import { useMemo } from "react";
import { useExplorerStore } from "@/features/explorer/explorerStore";
import { playNote } from "@/features/audio/playNote";
import { getInstrumentHighlightColor } from "@/features/music/emotion";
import { BASS_STANDARD_TUNING } from "@/data/tunings/bass";
import { transposeNote } from "@/core/theory/notes";
import { getDisplayLabel } from "@/features/instruments/display";
import type { NoteName } from "@/core/types";

const STRING_COUNT = 4;
const FRET_COUNT = 20;
const BOARD_HEIGHT = 250;
const HEADSTOCK_WIDTH = 150;
const CONTENT_PADDING_X = 24;
const CONTENT_PADDING_Y = 20;
const MIN_BOARD_WIDTH = 1500;

type BassPosition = {
  id: string;
  stringIndex: number;
  fret: number;
  note: string;
  audioNote: string;
  label: string;
};

function buildAudioNote(openAudioNote: string, fret: number) {
  const match = openAudioNote.match(/^([A-G]#?)(\d)$/);
  if (!match) return openAudioNote;

  const [, note, octaveRaw] = match;
  const octave = Number(octaveRaw);

  const chromatic = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  const startIndex = chromatic.indexOf(note);
  const total = startIndex + fret;
  const nextNote = chromatic[((total % 12) + 12) % 12];
  const nextOctave = octave + Math.floor(total / 12);

  return `${nextNote}${nextOctave}`;
}

function buildBassFretboardPositions(fretCount = 20): BassPosition[] {
  const positions: BassPosition[] = [];

  BASS_STANDARD_TUNING.strings.forEach((stringInfo) => {
    for (let fret = 0; fret <= fretCount; fret += 1) {
      const note = transposeNote(stringInfo.openNote, fret);
      const audioNote = buildAudioNote(stringInfo.openAudioNote, fret);

      positions.push({
        id: `bass-${stringInfo.stringIndex}-${fret}`,
        stringIndex: stringInfo.stringIndex,
        fret,
        note,
        audioNote,
        label: `Cuerda ${4 - stringInfo.stringIndex}, traste ${fret}`,
      });
    }
  });

  return positions;
}

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

export default function BassFretboard() {
  const selectedKeys = useExplorerStore(
    (state) => state.selectedKeysByInstrument.bass
  );
  const toggleKey = useExplorerStore((state) => state.toggleKey);
  const detection = useExplorerStore((state) => state.detection);
  const activeView = useExplorerStore((state) => state.activeView);

  const positions = useMemo(() => buildBassFretboardPositions(FRET_COUNT), []);
  const highlightColor = getInstrumentHighlightColor(detection);
  const isChordDetected = detection.type === "chord";
  const detectedRoot = detection.type === "chord" ? detection.chord.root : null;

  const contentHeight = BOARD_HEIGHT - CONTENT_PADDING_Y * 2;
  const playableWidth = MIN_BOARD_WIDTH - HEADSTOCK_WIDTH - CONTENT_PADDING_X * 2;
  const { fretBoundaries, fretCenters } = useMemo(
    () => buildFretGeometry(FRET_COUNT, playableWidth),
    []
  );

  async function handlePositionClick(position: BassPosition) {
    toggleKey("bass", {
      id: position.id,
      note: position.note as NoteName,
      audioNote: position.audioNote,
    });

    await playNote(position.audioNote, "bass");
  }

  return (
    <div className="w-full rounded-[24px] bg-[#111111] p-4 shadow-[0_12px_34px_rgba(0,0,0,0.22)]">
      <div className="mb-3 flex flex-wrap items-center gap-3 px-1">
        <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-white/55">
          Modo libre del bajo
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-white/5 bg-[#181818] p-5">
        <div className="overflow-x-auto overflow-y-hidden pb-3">
          <div
            className="relative rounded-[24px] bg-[#0E131A]"
            style={{ width: `${MIN_BOARD_WIDTH}px`, height: `${BOARD_HEIGHT}px` }}
          >
            <div className="absolute left-0 top-0 h-full w-[150px] bg-[#ff2b3f] [clip-path:polygon(0_16%,72%_28%,82%_34%,82%_66%,70%_72%,0_84%)]" />

            <div
              className="absolute"
              style={{
                left: `${HEADSTOCK_WIDTH}px`,
                right: `${CONTENT_PADDING_X}px`,
                top: `${CONTENT_PADDING_Y}px`,
                bottom: `${CONTENT_PADDING_Y}px`,
              }}
            >
              {Array.from({ length: STRING_COUNT }, (_, stringIndex) => (
                <div
                  key={`string-${stringIndex}`}
                  className="absolute left-0 right-0 h-[3px] bg-[#d9d9d9]"
                  style={{
                    top: `${getStringTopPx(stringIndex, contentHeight)}px`,
                  }}
                />
              ))}

              {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => (
                <div
                  key={`fret-${fret}`}
                  className={[
                    "absolute top-0 bottom-0 bg-[#c7c7c7]",
                    fret === 0 ? "w-[5px]" : "w-[2px]",
                  ].join(" ")}
                  style={{
                    left: `${fretBoundaries[fret] ?? playableWidth}px`,
                    opacity: fret === 0 ? 1 : 0.88,
                  }}
                />
              ))}

              {positions.map((position) => {
                const active = selectedKeys.some((selected) => selected.id === position.id);
                const left = fretCenters[position.fret] ?? 0;
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}