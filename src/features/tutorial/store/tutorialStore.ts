"use client";

import { create } from "zustand";

import { TOTAL_TUTORIAL_STEPS } from "../constants/tutorial.constants";
import { saveTutorialCompletion } from "../utils/tutorialStorage";

import type { TutorialStore } from "../types/tutorial.types";

export const useTutorialStore = create<TutorialStore>((set, get) => ({
  isOpen: false,

  currentStep: 0,

  openTutorial: () => {
    set({
      isOpen: true,
    });
  },

  closeTutorial: () => {
    set({
      isOpen: false,
    });
  },

  nextStep: () => {
    const currentStep = get().currentStep;

    if (currentStep < TOTAL_TUTORIAL_STEPS - 1) {
      set({
        currentStep: currentStep + 1,
      });
    }
  },

  prevStep: () => {
    const currentStep = get().currentStep;

    if (currentStep > 0) {
      set({
        currentStep: currentStep - 1,
      });
    }
  },

  completeTutorial: () => {
    saveTutorialCompletion();

    set({
      isOpen: false,
    });
  },
}));