"use client";

import { tutorialSteps } from "../../data/tutorialSteps";

import { useTutorialStore } from "../../store/tutorialStore";

import { TutorialPortal } from "../TutorialPortal";
import { TutorialOverlay } from "../TutorialOverlay";
import TutorialSlide from "../TutorialSlide/TutorialSlide";
import TutorialControls from "../TutorialControls/TutorialControls";
import { TutorialProgress } from "../TutorialProgress";

import styles from "./TutorialRoot.module.css";

export function TutorialRoot() {
  const {
  isOpen,
  currentStep,
} = useTutorialStore();

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];

  
  return (
    <TutorialPortal>
      <TutorialOverlay>
        <div className={styles.container}>
  <TutorialSlide step={step} />

  <div className={styles.navigation}>
    <TutorialProgress
      total={tutorialSteps.length}
      current={currentStep}
    />
  </div>

  <div className={styles.controls}>
  <TutorialControls />
</div>
</div>
      </TutorialOverlay>
    </TutorialPortal>
  );
}