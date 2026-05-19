import { create } from "zustand";

import type { TutorialStore } from "../types/tutorial.types";

export const useTutorialStore = create<TutorialStore>((set) => ({
  isOpen: true,

  currentStep: 0,

  hasCompleted: false,

  openTutorial: () =>
    set({
      isOpen: true,
    }),

  closeTutorial: () =>
    set({
      isOpen: false,
    }),

  nextStep: () =>
    set((state) => ({
      currentStep: state.currentStep + 1,
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  completeTutorial: () =>
    set({
      isOpen: false,
      hasCompleted: true,
    }),

  resetTutorial: () =>
    set({
      currentStep: 0,
      isOpen: true,
      hasCompleted: false,
    }),
}));