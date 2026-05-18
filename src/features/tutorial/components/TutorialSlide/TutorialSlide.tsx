import styles from "./TutorialSlide.module.css";

type TutorialSlideProps = {
  title: string;

  children: React.ReactNode;
};

export const TutorialSlide = ({
  title,
  children,
}: TutorialSlideProps) => {
  return (
    <div className={styles.slide}>
      <h1 className={styles.title}>
        {title}
      </h1>

      {children}
    </div>
  );
};