"use client";

import type { TutorialStep } from "../../types/tutorial.types";

import styles from "./TutorialSlide.module.css";

type TutorialSlideProps = {
  step: TutorialStep;
};

export default function TutorialSlide({
  step,
}: TutorialSlideProps) {
  const isFirstStep = step.id === 1;

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}

      {isFirstStep && (
        <div className={styles.hero}>
          <h1 className={styles.title}>
            {step.title}
          </h1>

          <p className={styles.subtitle}>
            Entiende la música como un lenguaje visual y emocional
          </p>
        </div>
      )}

      {/* CONTENT */}

      <div
        className={
          isFirstStep
            ? styles.firstLayout
            : styles.stepLayout
        }
      >
        {/* LEFT SIDE */}

        <div className={styles.content}>
          {/* BUBBLE */}

          <div className={styles.bubble}>
            <p
  className={styles.description}
  dangerouslySetInnerHTML={{
    __html: step.description
      .replace(/intervalos/g, `<span class="${styles.green}">intervalos</span>`)
      .replace(/triadas/g, `<span class="${styles.purple}">triadas</span>`)
      .replace(/acordes/g, `<span class="${styles.yellow}">acordes</span>`)
      .replace(/escalas/g, `<span class="${styles.pink}">escalas</span>`)
      .replace(/teóricas/g, `<span class="${styles.pink}">teóricas</span>`)
      .replace(/composiciones/g, `<span class="${styles.green}">composiciones</span>`)
      .replace(/información/g, `<span class="${styles.yellow}">información</span>`)
      .replace(/avanzada/g, `<span class="${styles.purple}">avanzada</span>`)
      .replace(/progresiones/g, `<span class="${styles.green}">progresiones</span>`)
      .replace(/formar/g, `<span class="${styles.green}">formar</span>`)
      .replace(/dibujando/g, `<span class="${styles.pink}">dibujando</span>`)
      .replace(/diapasón/g, `<span class="${styles.purple}">diapasón</span>`)
      .replace(/ver/g, `<span class="${styles.yellow}">ver</span>`)
      .replace(/transmitir/g, `<span class="${styles.purple}">transmitir</span>`)
      .replace(/consultarlo/g, `<span class="${styles.pink}">consultarlo</span>`)
      .replace(/ficha/g, `<span class="${styles.green}">ficha</span>`)
      .replace(/antes/g, `<span class="${styles.purple}">antes</span>`),
  }}
/>

            <div className={styles.tail} />
          </div>

          {/* VIDEO */}

          {step.video && (
            <div className={styles.videoWrapper}>
              <video
                key={step.video}
                autoPlay
                muted
                loop
                playsInline
                className={styles.video}
              >
                <source
                  src={step.video}
                  type="video/mp4"
                />
              </video>
            </div>
          )}
        </div>

        {/* TONI */}

        <div className={styles.toniWrapper}>
          <img
            src="/Toni/character.png"
            alt="Toni"
            className={styles.toni}
          />
        </div>
      </div>
    </div>
  );
}