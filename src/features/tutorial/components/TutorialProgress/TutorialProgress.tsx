import styles from "./TutorialProgress.module.css";

type Props = {
  total: number;
  current: number;
};

const colors = [
  "#3A86FF",
  "#FF006E",
  "#06D6A0",
  "#8338EC",
  "#FFBE0B",
];

export function TutorialProgress({
  total,
  current,
}: Props) {
  return (
    <div className={styles.dots}>
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`${styles.dot} ${
            current === index ? styles.active : ""
          }`}
          style={{
            background:
              current === index
                ? "#FFFFFF"
                : colors[index],
          }}
        />
      ))}
    </div>
  );
}