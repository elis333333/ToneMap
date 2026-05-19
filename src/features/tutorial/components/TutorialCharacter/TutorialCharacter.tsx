import Image from "next/image";
import styles from "./TutorialCharacter.module.css";

export function TutorialCharacter() {
  return (
    <div className={styles.container}>
      <Image
        src="/Toni/character.png"
        alt="Toni"
        width={140}
        height={140}
        priority
        className={styles.image}
      />
    </div>
  );
}