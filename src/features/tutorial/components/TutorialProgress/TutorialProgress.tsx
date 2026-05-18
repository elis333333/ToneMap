import styles from "./TutorialProgress.module.css";

type TutorialProgressProps = {
  total: number;

  current: number;
};

export const TutorialProgress = ({
  total,
  current,
}: TutorialProgressProps) => {
  return (
    <div className={styles.progress}>
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`${styles.dot} ${
            current === index
              ? styles.active
              : ""
          }`}
        />
      ))}
    </div>
  );
};