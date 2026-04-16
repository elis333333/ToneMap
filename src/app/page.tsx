"use client";
export const dynamic = "force-dynamic";
import { useRef, useState } from "react";
import Hero from "@/components/layout/Hero";
import InteractiveSection from "@/components/layout/InteractiveSection";
import { parseMusicQuery } from "@/core/parsing/query";
import { buildIntervalNotes } from "@/core/theory/intervals";
import { findPianoKeysForNotes } from "@/features/instruments/piano";
import { findGuitarPositionsForNotes } from "@/features/instruments/guitar";
import { useExplorerStore, type SelectedKey } from "@/features/explorer/explorerStore";
import { getSearchEmotionColor } from "@/features/music/emotion";
import { playChord } from "@/features/audio/playChord";
import { resolveChordForInstruments } from "@/core/engine/resolve";
import {
  analyzeChordProgression,
  analyzeRomanProgression,
} from "@/core/theory/progression";
import { resolveRomanProgression } from "@/core/theory/romanNumerals";
import type { ChordQuality, NoteName } from "@/core/types";

export default function HomePage() {
  const interactiveSectionRef = useRef<HTMLElement | null>(null);

  const [query, setQuery] = useState("");
  const [instrument, setInstrument] = useState<"keyboard" | "guitar" | "bass">("keyboard");

  const setSelectedKeysForInstrument = useExplorerStore(
    (state) => state.setSelectedKeysForInstrument
  );
  const setActiveInstrument = useExplorerStore((state) => state.setActiveInstrument);
  const setGuitarRenderVoicing = useExplorerStore(
    (state) => state.setGuitarRenderVoicing
  );
  const setProgressionAnalysis = useExplorerStore(
    (state) => state.setProgressionAnalysis
  );
  const romanBaseTonic = useExplorerStore((state) => state.romanBaseTonic);
  const romanMode = useExplorerStore((state) => state.romanMode);
  const detection = useExplorerStore((state) => state.detection);
  const guitarTuning = useExplorerStore((state) => state.guitarTuning);

  const accentColor = getSearchEmotionColor(detection);

  const handleSubmit = async () => {
    const parsed = parseMusicQuery(query);

    let selectedKeys: SelectedKey[] = [];

    if (parsed.kind === "note") {
      setProgressionAnalysis(null);

      const notes: NoteName[] = [parsed.root];

      selectedKeys =
        instrument === "keyboard"
          ? findPianoKeysForNotes(notes)
          : instrument === "guitar"
            ? findGuitarPositionsForNotes(notes, 24, guitarTuning)
            : [];

      setActiveInstrument(instrument);
      setSelectedKeysForInstrument(instrument, selectedKeys);
      setGuitarRenderVoicing(null);
    } else if (parsed.kind === "chord") {
      setProgressionAnalysis(null);

      const resolved = resolveChordForInstruments(
        parsed.root as NoteName,
        parsed.quality as ChordQuality,
        {
          guitarTuningId: guitarTuning,
          bassNote: parsed.bass ?? null,
        }
      );

      selectedKeys =
        instrument === "keyboard"
          ? resolved.piano.keys.map(
              (key): SelectedKey => ({
                id: key.id,
                note: key.note,
                audioNote: key.audioNote,
              })
            )
          : instrument === "guitar"
            ? (resolved.guitar?.positions.map(
                (position): SelectedKey => ({
                  id: `guitar-${guitarTuning}-${position.stringIndex}-${position.fret}`,
                  note: position.note,
                  audioNote: position.audioNote,
                })
              ) ?? [])
            : (resolved.bass?.positions.map(
                (position): SelectedKey => ({
                  id: position.id,
                  note: position.note,
                  audioNote: position.audioNote,
                })
              ) ?? []);

      setActiveInstrument(instrument);
      setSelectedKeysForInstrument(instrument, selectedKeys);
      setGuitarRenderVoicing(instrument === "guitar" ? resolved.guitar : null);
    } else if (parsed.kind === "interval") {
      setProgressionAnalysis(null);

      const notes = buildIntervalNotes(parsed.root, parsed.semitones);

      selectedKeys =
        instrument === "keyboard"
          ? findPianoKeysForNotes(notes)
          : instrument === "guitar"
            ? findGuitarPositionsForNotes(notes, 24, guitarTuning)
            : [];

      setActiveInstrument(instrument);
      setSelectedKeysForInstrument(instrument, selectedKeys);
      setGuitarRenderVoicing(null);
    } else if (parsed.kind === "progression") {
      const progression = analyzeChordProgression({
        input: parsed.raw,
        chords: parsed.chords.map((chord) => ({
          root: chord.root,
          quality: chord.quality,
          symbol: chord.symbol,
          bass: chord.bass ?? null,
        })),
      });

      setProgressionAnalysis(progression);

      const firstChord = parsed.chords[0];
      const resolved = resolveChordForInstruments(
        firstChord.root as NoteName,
        firstChord.quality as ChordQuality,
        {
          guitarTuningId: guitarTuning,
          bassNote: firstChord.bass ?? null,
        }
      );

      selectedKeys =
        instrument === "keyboard"
          ? resolved.piano.keys.map(
              (key): SelectedKey => ({
                id: key.id,
                note: key.note,
                audioNote: key.audioNote,
              })
            )
          : instrument === "guitar"
            ? (resolved.guitar?.positions.map(
                (position): SelectedKey => ({
                  id: `guitar-${guitarTuning}-${position.stringIndex}-${position.fret}`,
                  note: position.note,
                  audioNote: position.audioNote,
                })
              ) ?? [])
            : (resolved.bass?.positions.map(
                (position): SelectedKey => ({
                  id: position.id,
                  note: position.note,
                  audioNote: position.audioNote,
                })
              ) ?? []);

      setActiveInstrument(instrument);
      setSelectedKeysForInstrument(instrument, selectedKeys);
      setGuitarRenderVoicing(instrument === "guitar" ? resolved.guitar : null);
    } else if (parsed.kind === "roman-progression") {
      const romanAnalysis = analyzeRomanProgression({
        input: parsed.raw,
        tonic: romanBaseTonic,
        mode: romanMode,
      });

      const resolvedRoman = resolveRomanProgression({
        input: parsed.raw,
        tonic: romanBaseTonic,
        mode: romanMode,
      });

      if (!romanAnalysis || !resolvedRoman) {
        setProgressionAnalysis(null);
        setGuitarRenderVoicing(null);

        interactiveSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      setProgressionAnalysis(romanAnalysis);

      const firstChord = resolvedRoman.chords[0];
      const resolved = resolveChordForInstruments(
        firstChord.root,
        firstChord.quality,
        {
          guitarTuningId: guitarTuning,
          bassNote: firstChord.bass ?? null,
        }
      );

      selectedKeys =
        instrument === "keyboard"
          ? resolved.piano.keys.map(
              (key): SelectedKey => ({
                id: key.id,
                note: key.note,
                audioNote: key.audioNote,
              })
            )
          : instrument === "guitar"
            ? (resolved.guitar?.positions.map(
                (position): SelectedKey => ({
                  id: `guitar-${guitarTuning}-${position.stringIndex}-${position.fret}`,
                  note: position.note,
                  audioNote: position.audioNote,
                })
              ) ?? [])
            : (resolved.bass?.positions.map(
                (position): SelectedKey => ({
                  id: position.id,
                  note: position.note,
                  audioNote: position.audioNote,
                })
              ) ?? []);

      setActiveInstrument(instrument);
      setSelectedKeysForInstrument(instrument, selectedKeys);
      setGuitarRenderVoicing(instrument === "guitar" ? resolved.guitar : null);
    } else {
      setProgressionAnalysis(null);
      setGuitarRenderVoicing(null);

      interactiveSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    interactiveSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    if (selectedKeys.length > 0) {
      setTimeout(() => {
        void playChord(
          selectedKeys.map((key) => key.audioNote),
          instrument
        );
      }, 120);
    }
  };

  return (
    <main className="bg-black">
      <Hero
        query={query}
        onQueryChange={setQuery}
        onSubmit={() => void handleSubmit()}
        accentColor={accentColor}
      />

      <InteractiveSection
        sectionRef={interactiveSectionRef}
        query={query}
        onQueryChange={setQuery}
        onSubmit={() => void handleSubmit()}
        instrument={instrument}
        onInstrumentChange={setInstrument}
        accentColor={accentColor}
      />
    </main>
  );
}