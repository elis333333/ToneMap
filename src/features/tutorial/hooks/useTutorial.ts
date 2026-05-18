"use client";

import { useTutorialStore } from "../store/tutorialStore";

export const useTutorial = () => {
  return useTutorialStore();
};