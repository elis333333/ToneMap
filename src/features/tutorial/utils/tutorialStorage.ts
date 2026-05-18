import { TUTORIAL_STORAGE_KEY } from "../constants/tutorial.constants";

export const hasCompletedTutorial = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(TUTORIAL_STORAGE_KEY) === "true";
};

export const saveTutorialCompletion = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
};