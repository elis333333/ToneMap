import styles from "./TutorialControls.module.css";

type TutorialControlsProps = {
  isFirstStep: boolean;

  isLastStep: boolean;

  onNext: () => void;

  onPrev: () => void;

  onComplete: () => void;
};

export const TutorialControls = ({
  isFirstStep,
  isLastStep,
  onNext,
  onPrev,
  onComplete,
}: TutorialControlsProps) => {
  return (
    <div className={styles.controls}>
      {isFirstStep ? (
        <button onClick={onComplete}>
          Saltar
        </button>
      ) : (
        <button onClick={onPrev}>
          Atrás
        </button>
      )}

      {isLastStep ? (
        <button onClick={onComplete}>
          ¡Listo!
        </button>
      ) : (
        <button onClick={onNext}>
          Siguiente
        </button>
      )}
    </div>
  );
};