export type TutorialStep = {
  id: number;

  title: string;

  video: string;
};

export type TutorialStore = {
  isOpen: boolean;

  currentStep: number;

  openTutorial: () => void;

  closeTutorial: () => void;

  nextStep: () => void;

  prevStep: () => void;

  completeTutorial: () => void;
};