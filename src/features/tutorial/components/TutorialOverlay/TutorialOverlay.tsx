import type { ReactNode } from "react";

import styles from "./TutorialOverlay.module.css";

type Props = {
  children: ReactNode;
};

export function TutorialOverlay({ children }: Props) {
  return <div className={styles.overlay}>{children}</div>;
}