import styles from "./TutorialOverlay.module.css";

type TutorialOverlayProps = {
  children: React.ReactNode;
};

export const TutorialOverlay = ({
  children,
}: TutorialOverlayProps) => {
  return (
    <div className={styles.overlay}>
      {children}
    </div>
  );
};