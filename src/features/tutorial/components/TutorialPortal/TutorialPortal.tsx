"use client";

import { createPortal } from "react-dom";

type TutorialPortalProps = {
  children: React.ReactNode;
};

export const TutorialPortal = ({
  children,
}: TutorialPortalProps) => {
  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
};