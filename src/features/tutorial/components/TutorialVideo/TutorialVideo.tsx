import styles from "./TutorialVideo.module.css";

type TutorialVideoProps = {
  src: string;
};

export const TutorialVideo = ({
  src,
}: TutorialVideoProps) => {
  return (
    <video
      className={styles.video}
      src={src}
      autoPlay
      muted
      loop
      playsInline
    />
  );
};