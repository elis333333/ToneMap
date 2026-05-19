export type TutorialStep = {
  id: number;

  title: string;

  description: string;

  video: string;
};

export type TutorialStore = {
  isOpen: boolean;

  currentStep: number;

  hasCompleted: boolean;

  openTutorial: () => void;

  closeTutorial: () => void;

  nextStep: () => void;

  previousStep: () => void;

  completeTutorial: () => void;

  resetTutorial: () => void;
};