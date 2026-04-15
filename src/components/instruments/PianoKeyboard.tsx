"use client";

import { useExplorerStore } from "@/features/explorer/explorerStore";
import { playNote } from "@/features/audio/playNote";
import { PIANO_WHITE_KEYS, PIANO_BLACK_KEYS } from "@/features/instruments/piano";
import { getInstrumentHighlightColor } from "@/features/music/emotion";
import { getDisplayLabel } from "@/features/instruments/display";
import type { NoteName } from "@/core/types";

export default function PianoKeyboard() {
  const selectedKeys = useExplorerStore(
    (state) => state.selectedKeysByInstrument.keyboard
  );
  const toggleKey = useExplorerStore((state) => state.toggleKey);
  const detection = useExplorerStore((state) => state.detection);
  const activeView = useExplorerStore((state) => state.activeView);

  const whiteKeyWidth = 100 / PIANO_WHITE_KEYS.length;
  const highlightColor = getInstrumentHighlightColor(detection);
  const isChordDetected = detection.type === "chord";
  const detectedRoot = detection.type === "chord" ? detection.chord.root : null;

  async function handleKeyPress(key: (typeof PIANO_WHITE_KEYS)[number]) {
    toggleKey("keyboard", {
      id: key.id,
      note: key.note,
      audioNote: key.audioNote,
    });

    await playNote(key.audioNote, "keyboard");
  }

  return (
    <div className="w-full rounded-[24px] bg-[#111111] p-4 shadow-[0_12px_34px_rgba(0,0,0,0.22)]">
      <div className="relative overflow-hidden rounded-[20px] border border-white/5 bg-[#181818] px-4 py-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent)]" />

        <div className="relative flex">
          {PIANO_WHITE_KEYS.map((key) => {
            const active = selectedKeys.some((selected) => selected.id === key.id);
            const label = getDisplayLabel({
              note: key.note as NoteName,
              root: detectedRoot,
              view: activeView,
            });

            return (
              <button
                key={key.id}
                type="button"
                onClick={() => void handleKeyPress(key)}
                title={key.id}
                className={[
                  "group relative h-[230px] flex-1 overflow-hidden rounded-b-[14px] border border-black/15 transition-all duration-200",
                  active ? "" : "bg-[#F3F3F3] hover:bg-[#FAFAFA]",
                ].join(" ")}
                style={
                  active
                    ? {
                        background: isChordDetected
                          ? highlightColor
                          : `linear-gradient(180deg, ${highlightColor} 0%, rgba(255,255,255,0.92) 100%)`,
                        boxShadow: isChordDetected
                          ? `inset 0 1px 0 rgba(255,255,255,0.18), 0 0 24px ${highlightColor}40, 0 10px 20px rgba(0,0,0,0.18)`
                          : `inset 0 1px 0 rgba(255,255,255,0.35), 0 0 18px rgba(255,190,11,0.18), 0 8px 18px rgba(0,0,0,0.14)`,
                      }
                    : undefined
                }
              >
                {!active && (
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[32%] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.35),transparent)]" />
                )}

                {active && !isChordDetected && (
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.42),transparent)]" />
                )}

                <span
                  className={[
                    "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.72rem] font-medium tracking-[0.08em] transition",
                    active
                      ? isChordDetected
                        ? "text-white/90"
                        : "text-black/72"
                      : "text-black/28 group-hover:text-black/36",
                  ].join(" ")}
                >
                  {label}
                </span>
              </button>
            );
          })}

          {PIANO_BLACK_KEYS.map((key) => {
            const active = selectedKeys.some((selected) => selected.id === key.id);
            const leftPercent = ((key.afterWhiteIndex ?? 0) + 1) * whiteKeyWidth;
            const label = getDisplayLabel({
              note: key.note as NoteName,
              root: detectedRoot,
              view: activeView,
            });

            return (
              <button
                key={key.id}
                type="button"
                onClick={() => void handleKeyPress(key)}
                title={key.id}
                className={[
                  "group absolute top-0 h-[118px] w-[2.9%] -translate-x-1/2 overflow-hidden rounded-b-[10px] border transition-all duration-200",
                  active ? "" : "border-black/40 bg-[#050505] hover:bg-[#101010]",
                ].join(" ")}
                style={{
                  left: `${leftPercent}%`,
                  ...(active
                    ? {
                        borderColor: isChordDetected ? `${highlightColor}` : "#FFBE0B",
                        background: isChordDetected
                          ? highlightColor
                          : `linear-gradient(180deg, ${highlightColor} 0%, #6E5200 100%)`,
                        boxShadow: isChordDetected
                          ? `0 0 20px ${highlightColor}55, 0 10px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.12)`
                          : `0 0 16px rgba(255,190,11,0.32), 0 8px 14px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.12)`,
                      }
                    : {}),
                }}
              >
                {!active && (
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[36%] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent)]" />
                )}

                <span
                  className={[
                    "pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[0.58rem] font-medium tracking-[0.06em]",
                    active ? "text-white/86" : "text-white/18 group-hover:text-white/28",
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
  );
}