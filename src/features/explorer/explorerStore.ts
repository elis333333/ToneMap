"use client";

import { create } from "zustand";
import { detectChordFromNotes, detectIntervalFromNotes } from "@/core/detection";
import type { GuitarRenderVoicing } from "@/core/adaptors/guitar";
import type {
  ChordQuality,
  GuitarVoicingIntent,
  KeyMode,
  NoteName,
  ProgressionAnalysis,
  TonalityCandidate,
} from "@/core/types";

export type InstrumentType = "keyboard" | "guitar" | "bass";
export type ExplorerView = "notes" | "intervals" | "fingering";
export type GuitarTuningType = "standard" | "drop-d";
export type BassTuningType = "standard";
export type PlaybackStyle = "block" | "strum";
export type RomanMode = KeyMode;
export type GuitarHandedness = "right" | "left";

export type SelectedKey = {
  id: string;
  note: NoteName;
  audioNote: string;
};

type DetectionResult =
  | { type: "none" }
  | {
      type: "interval";
      semitones: number;
      shortName: string;
      nameEs: string;
      notes: NoteName[];
    }
  | {
      type: "chord";
      chord: {
        root: NoteName;
        quality: ChordQuality;
        symbol: string;
        notes: NoteName[];
        pitchClasses: number[];
        semitones: number[];
        confidence: number;
        bass: NoteName | null;
        inversion:
          | "root-position"
          | "1st-inversion"
          | "2nd-inversion"
          | "3rd-inversion"
          | "slash";
        matchedIntervals: number[];
        missingIntervals: number[];
        extraPitchClasses: number[];
        alternatives: Array<{
          root: NoteName;
          quality: ChordQuality;
          symbol: string;
          confidence: number;
          bass: NoteName | null;
          inversion:
            | "root-position"
            | "1st-inversion"
            | "2nd-inversion"
            | "3rd-inversion"
            | "slash";
        }>;
        tonalContext: {
          primary: TonalityCandidate | null;
          candidates: TonalityCandidate[];
        };
      };
    };

type RenderVoicingsByInstrument = {
  keyboard: null;
  guitar: GuitarRenderVoicing | null;
  bass: null;
};

type SelectedKeysByInstrument = {
  keyboard: SelectedKey[];
  guitar: SelectedKey[];
  bass: SelectedKey[];
};

type ExplorerStore = {
  activeInstrument: InstrumentType;
  activeView: ExplorerView;
  guitarTuning: GuitarTuningType;
  bassTuning: BassTuningType;
  guitarHandedness: GuitarHandedness;

  romanBaseTonic: NoteName;
  romanMode: RomanMode;

  progressionBpm: number;
  progressionChordBeats: number;
  playbackStyle: PlaybackStyle;
  loopEnabled: boolean;

  manualMode: boolean;
  guitarVoicingIntent: GuitarVoicingIntent;
  generatedChordQuery: string | null;

  selectedKeysByInstrument: SelectedKeysByInstrument;
  renderVoicingsByInstrument: RenderVoicingsByInstrument;
  detection: DetectionResult;
  progressionAnalysis: ProgressionAnalysis | null;
  progressionStepIndex: number;

  setActiveInstrument: (instrument: InstrumentType) => void;
  setActiveView: (view: ExplorerView) => void;
  setGuitarTuning: (tuning: GuitarTuningType) => void;
  setBassTuning: (tuning: BassTuningType) => void;
  setGuitarHandedness: (value: GuitarHandedness) => void;

  setRomanBaseTonic: (tonic: NoteName) => void;
  setRomanMode: (mode: RomanMode) => void;

  setProgressionBpm: (bpm: number) => void;
  setProgressionChordBeats: (beats: number) => void;
  setPlaybackStyle: (style: PlaybackStyle) => void;
  setLoopEnabled: (enabled: boolean) => void;

  setManualMode: (value: boolean) => void;
  toggleManualMode: () => void;

  setGuitarVoicingIntent: (intent: GuitarVoicingIntent) => void;
  setGeneratedChordQuery: (query: string | null) => void;

  setProgressionAnalysis: (analysis: ProgressionAnalysis | null) => void;
  setProgressionStepIndex: (index: number) => void;
  nextProgressionStep: () => void;
  previousProgressionStep: () => void;

  setDetection: (detection: DetectionResult) => void;
  toggleKey: (instrument: InstrumentType, key: SelectedKey) => void;
  addKey: (instrument: InstrumentType, key: SelectedKey) => void;
  setSelectedKeysForInstrument: (
    instrument: InstrumentType,
    keys: SelectedKey[]
  ) => void;
  setGuitarRenderVoicing: (voicing: GuitarRenderVoicing | null) => void;
  clearNotes: () => void;

  getSelectedKeysForInstrument: (instrument: InstrumentType) => SelectedKey[];
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function resolveDetection(keys: SelectedKey[]): DetectionResult {
  const notes = keys.map((key) => key.note) as NoteName[];
  const uniqueNotes = [...new Set(notes)];
  const uniqueNoteCount = uniqueNotes.length;

  if (uniqueNoteCount < 2) {
    return { type: "none" };
  }

  if (uniqueNoteCount === 2) {
    const interval = detectIntervalFromNotes(uniqueNotes);
    if (!interval) return { type: "none" };

    return {
      type: "interval",
      semitones: interval.semitones,
      shortName: interval.shortName,
      nameEs: interval.nameEs,
      notes: interval.notes,
    };
  }

  const chord = detectChordFromNotes(uniqueNotes);
  if (!chord) {
    return { type: "none" };
  }

  const confidenceTooLow = chord.confidence < 58;
  const tooManyMissingCoreTones =
    chord.missingIntervals.length > 1 && uniqueNoteCount < 4;
  const tooNoisyForSmallSet =
    chord.extraPitchClasses.length > 1 && uniqueNoteCount < 4;

  if (confidenceTooLow || tooManyMissingCoreTones || tooNoisyForSmallSet) {
    return { type: "none" };
  }

  return {
    type: "chord",
    chord: {
      root: chord.root,
      quality: chord.quality,
      symbol: chord.symbol,
      notes: chord.notes,
      pitchClasses: chord.pitchClasses,
      semitones: chord.semitones,
      confidence: chord.confidence,
      bass: chord.bass,
      inversion: chord.inversion,
      matchedIntervals: chord.matchedIntervals,
      missingIntervals: chord.missingIntervals,
      extraPitchClasses: chord.extraPitchClasses,
      alternatives: chord.alternatives,
      tonalContext: chord.tonalContext,
    },
  };
}

function withUpdatedInstrumentKeys(
  state: ExplorerStore,
  instrument: InstrumentType,
  keys: SelectedKey[]
): SelectedKeysByInstrument {
  return {
    ...state.selectedKeysByInstrument,
    [instrument]: keys,
  };
}

export const useExplorerStore = create<ExplorerStore>((set, get) => ({
  activeInstrument: "keyboard",
  activeView: "notes",
  guitarTuning: "standard",
  bassTuning: "standard",
  guitarHandedness: "right",

  romanBaseTonic: "C",
  romanMode: "major",

  progressionBpm: 92,
  progressionChordBeats: 2,
  playbackStyle: "block",
  loopEnabled: false,

  manualMode: false,
  guitarVoicingIntent: "balanced",
  generatedChordQuery: null,

  selectedKeysByInstrument: {
    keyboard: [],
    guitar: [],
    bass: [],
  },

  renderVoicingsByInstrument: {
    keyboard: null,
    guitar: null,
    bass: null,
  },

  detection: { type: "none" },
  progressionAnalysis: null,
  progressionStepIndex: 0,

  setActiveInstrument: (instrument) => {
    set({ activeInstrument: instrument });
  },

  setActiveView: (view) => {
    set({ activeView: view });
  },

  setGuitarTuning: (tuning) => {
    set({ guitarTuning: tuning });
  },

  setBassTuning: (tuning) => {
    set({ bassTuning: tuning });
  },

  setGuitarHandedness: (value) => {
    set({ guitarHandedness: value });
  },

  setRomanBaseTonic: (tonic) => {
    set({ romanBaseTonic: tonic });
  },

  setRomanMode: (mode) => {
    set({ romanMode: mode });
  },

  setProgressionBpm: (bpm) => {
    set({ progressionBpm: clamp(Number.isFinite(bpm) ? bpm : 92, 40, 220) });
  },

  setProgressionChordBeats: (beats) => {
    set({
      progressionChordBeats: clamp(
        Number.isFinite(beats) ? beats : 2,
        1,
        8
      ),
    });
  },

  setPlaybackStyle: (style) => {
    set({ playbackStyle: style });
  },

  setLoopEnabled: (enabled) => {
    set({ loopEnabled: enabled });
  },

  setManualMode: (value) => {
    set({ manualMode: value });
  },

  toggleManualMode: () => {
    set((state) => ({
      manualMode: !state.manualMode,
    }));
  },

  setGuitarVoicingIntent: (intent) => {
    set({ guitarVoicingIntent: intent });
  },

  setGeneratedChordQuery: (query) => {
    set({ generatedChordQuery: query });
  },

  setProgressionAnalysis: (analysis) => {
    set({
      progressionAnalysis: analysis,
      progressionStepIndex: 0,
    });
  },

  setProgressionStepIndex: (index) => {
    const analysis = get().progressionAnalysis;

    if (!analysis) {
      set({ progressionStepIndex: 0 });
      return;
    }

    set({
      progressionStepIndex: clamp(index, 0, Math.max(analysis.steps.length - 1, 0)),
    });
  },

  nextProgressionStep: () => {
    const state = get();
    const total = state.progressionAnalysis?.steps.length ?? 0;
    if (total <= 0) return;

    set({
      progressionStepIndex: Math.min(state.progressionStepIndex + 1, total - 1),
    });
  },

  previousProgressionStep: () => {
    const state = get();
    set({
      progressionStepIndex: Math.max(state.progressionStepIndex - 1, 0),
    });
  },

  setDetection: (detection) => {
    set({ detection });
  },

  toggleKey: (instrument, key) => {
    const state = get();
    const current = state.selectedKeysByInstrument[instrument];
    const exists = current.some((item) => item.id === key.id);

    const nextKeys = exists
      ? current.filter((item) => item.id !== key.id)
      : [...current, key];

    const nextDetection = resolveDetection(nextKeys);

    set({
      manualMode: true,
      progressionAnalysis: null,
      progressionStepIndex: 0,
      selectedKeysByInstrument: withUpdatedInstrumentKeys(state, instrument, nextKeys),
      detection: nextDetection,
      renderVoicingsByInstrument: {
        ...state.renderVoicingsByInstrument,
        guitar:
          instrument === "guitar" ? null : state.renderVoicingsByInstrument.guitar,
      },
    });
  },

  addKey: (instrument, key) => {
    const state = get();
    const current = state.selectedKeysByInstrument[instrument];
    const exists = current.some((item) => item.id === key.id);

    if (exists) return;

    const nextKeys = [...current, key];
    const nextDetection = resolveDetection(nextKeys);

    set({
      manualMode: true,
      progressionAnalysis: null,
      progressionStepIndex: 0,
      selectedKeysByInstrument: withUpdatedInstrumentKeys(state, instrument, nextKeys),
      detection: nextDetection,
      renderVoicingsByInstrument: {
        ...state.renderVoicingsByInstrument,
        guitar:
          instrument === "guitar" ? null : state.renderVoicingsByInstrument.guitar,
      },
    });
  },

  setSelectedKeysForInstrument: (instrument, keys) => {
    const state = get();
    const nextDetection = resolveDetection(keys);

    set({
      selectedKeysByInstrument: withUpdatedInstrumentKeys(state, instrument, keys),
      detection: nextDetection,
    });
  },

  setGuitarRenderVoicing: (voicing) => {
    set((state) => ({
      renderVoicingsByInstrument: {
        ...state.renderVoicingsByInstrument,
        guitar: voicing,
      },
    }));
  },

  clearNotes: () => {
    set((state) => ({
      selectedKeysByInstrument: {
        keyboard: [],
        guitar: [],
        bass: [],
      },
      renderVoicingsByInstrument: {
        ...state.renderVoicingsByInstrument,
        guitar: null,
      },
      detection: { type: "none" },
      progressionAnalysis: null,
      progressionStepIndex: 0,
    }));
  },

  getSelectedKeysForInstrument: (instrument) => {
    return get().selectedKeysByInstrument[instrument];
  },
}));