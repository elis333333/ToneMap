"use client";

import { useTutorialStore } from "@/features/tutorial/tutorialStore";
import TutorialOverlay from "./TutorialOverlay";

export default function TutorialController() {
  const { isActive } = useTutorialStore();

  if (!isActive) return null;

  return <TutorialOverlay />;
}