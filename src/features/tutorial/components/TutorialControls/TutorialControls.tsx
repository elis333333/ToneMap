"use client";

import { useTutorialStore } from "../../store/tutorialStore";

import styles from "./TutorialControls.module.css";

export default function TutorialControls() {
  const {
    currentStep,
    previousStep,
    nextStep,
    completeTutorial,
  } = useTutorialStore();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === 4;

  return (
    <div className={styles.controls}>
      {!isFirstStep && (
        <button
          onClick={previousStep}
          className={styles.secondaryButton}
        >
          Atrás
        </button>
      )}

      {isFirstStep && (
        <button
          onClick={completeTutorial}
          className={styles.secondaryButton}
        >
          Saltar
        </button>
      )}

      <button
        onClick={
          isLastStep
            ? completeTutorial
            : nextStep
        }
        className={styles.primaryButton}
      >
        {isLastStep ? "¡Listo!" : "Siguiente"}
      </button>
    </div>
  );
}