"use client";

import { tutorialSteps } from "../../data/tutorialSteps";

import { useTutorial } from "../../hooks/useTutorial";

import { TutorialPortal } from "../TutorialPortal";
import { TutorialOverlay } from "../TutorialOverlay";
import { TutorialModal } from "../TutorialModal";
import { TutorialSlide } from "../TutorialSlide";
import { TutorialVideo } from "../TutorialVideo";
import { TutorialProgress } from "../TutorialProgress";
import { TutorialControls } from "../TutorialControls";
import { TutorialCharacter } from "../TutorialCharacter";

export const TutorialRoot = () => {
  const {
    isOpen,
    currentStep,
    nextStep,
    prevStep,
    completeTutorial,
  } = useTutorial();

  if (!isOpen) {
    return null;
  }

  const currentTutorialStep =
    tutorialSteps[currentStep];

  const isFirstStep = currentStep === 0;

  const isLastStep =
    currentStep === tutorialSteps.length - 1;

  return (
    <TutorialPortal>
      <TutorialOverlay>
        <TutorialModal>
          <TutorialSlide
            title={currentTutorialStep.title}
          >
            <TutorialCharacter />

            <TutorialVideo
              src={currentTutorialStep.video}
            />

            <TutorialProgress
              total={tutorialSteps.length}
              current={currentStep}
            />

            <TutorialControls
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              onNext={nextStep}
              onPrev={prevStep}
              onComplete={completeTutorial}
            />
          </TutorialSlide>
        </TutorialModal>
      </TutorialOverlay>
    </TutorialPortal>
  );
};