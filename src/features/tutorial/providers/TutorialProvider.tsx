"use client";

import { useTutorial } from "../hooks/useTutorial";
import { useTutorialLock } from "../hooks/useTutorialLock";
import { useTutorialPersistence } from "../hooks/useTutorialPersistence";

import { TutorialRoot } from "../components/TutorialRoot";

type TutorialProviderProps = {
  children: React.ReactNode;
};

export const TutorialProvider = ({
  children,
}: TutorialProviderProps) => {
  const { isOpen } = useTutorial();

  useTutorialPersistence();

  useTutorialLock(isOpen);

  return (
    <>
      {children}

      <TutorialRoot />
    </>
  );
};