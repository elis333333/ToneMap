"use client";

import { useEffect } from "react";

export const useTutorialLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) {
      document.body.style.overflow = "";

      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLocked]);
};