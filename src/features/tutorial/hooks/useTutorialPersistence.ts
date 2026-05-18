"use client";

import { useEffect } from "react";

import { hasCompletedTutorial } from "../utils/tutorialStorage";
import { useTutorialStore } from "../store/tutorialStore";

export const useTutorialPersistence = () => {
  const openTutorial = useTutorialStore(
    (state) => state.openTutorial
  );

  useEffect(() => {
    const completed = hasCompletedTutorial();

    if (!completed) {
      openTutorial();
    }
  }, [openTutorial]);
};