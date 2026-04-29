import { create } from "zustand";

type TutorialStep = 1 | 2 | 3 | 4;

type TutorialState = {
  isActive: boolean;
  step: TutorialStep;

  canType: boolean;
  canInteractFretboard: boolean;
  canContinue: boolean;

  start: () => void;
  next: () => void;
  end: () => void;

  setCanContinue: (value: boolean) => void;
};

export const useTutorialStore = create<TutorialState>((set, get) => ({
  isActive: true,
  step: 1,

  canType: false,
  canInteractFretboard: false,
  canContinue: true, // paso 1 puede avanzar

  start: () =>
    set({
      isActive: true,
      step: 1,
      canType: false,
      canInteractFretboard: false,
      canContinue: true,
    }),

  next: () => {
    const current = get().step;
    const nextStep = (current + 1) as TutorialStep;

    if (nextStep > 4) return;

    set({
      step: nextStep,
      canType: nextStep === 2,
      canInteractFretboard: nextStep === 3,
      canContinue: nextStep === 1, // solo paso 1 empieza activo
    });
  },

  end: () =>
    set({
      isActive: false,
    }),

  setCanContinue: (value) =>
    set({
      canContinue: value,
    }),
}));