"use client";

import styles from "./TutorialVideo.module.css";

type Props = {
  src: string;
};

export default function TutorialVideo({ src }: Props) {
  return (
    <video
      key={src}
      className={styles.video}
      autoPlay
      muted
      loop
      playsInline
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}