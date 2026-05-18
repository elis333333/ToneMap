import styles from "./TutorialModal.module.css";

type TutorialModalProps = {
  children: React.ReactNode;
};

export const TutorialModal = ({
  children,
}: TutorialModalProps) => {
  return (
    <div className={styles.modal}>
      {children}
    </div>
  );
};