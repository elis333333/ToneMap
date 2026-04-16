"use client";

import { useEffect, useRef, useState } from "react";

type AudioPreviewPillProps = {
  src?: string | null;
  label: string;
};

const PLAY_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-black">
    <path d="M8 5.5v13l10-6.5-10-6.5z" />
  </svg>
);

const PAUSE_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-black">
    <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
  </svg>
);

export default function AudioPreviewPill({
  src,
  label,
}: AudioPreviewPillProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    const handleTimeUpdate = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const stopOtherPlayers = () => {
    const allAudios = document.querySelectorAll("audio[data-tonemap-preview='true']");
    allAudios.forEach((node) => {
      const other = node as HTMLAudioElement;
      if (other !== audioRef.current) {
        other.pause();
      }
    });
  };

  const togglePlayback = async () => {
    if (!src) return;

    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      stopOtherPlayers();
      try {
        await audio.play();
      } catch (error) {
        console.error("[ToneMap] No se pudo reproducir el audio preview.", error);
      }
    } else {
      audio.pause();
    }
  };

  return (
    <div className="mt-4 flex h-[60px] w-full items-center gap-3 overflow-hidden rounded-full bg-[#1d1d1d] px-3">
      <button
        type="button"
        onClick={togglePlayback}
        disabled={!src}
        aria-label={
          !src
            ? `${label} no disponible`
            : isPlaying
              ? `Pausar ${label}`
              : `Reproducir ${label}`
        }
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-transparent disabled:opacity-45"
      >
        {isPlaying ? PAUSE_ICON : PLAY_ICON}
      </button>

      <div className="relative h-7 flex-1 overflow-hidden rounded-full">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #050505 0 3px, transparent 3px 9px), repeating-linear-gradient(90deg, transparent 0 6px, #050505 6px 9px, transparent 9px 15px)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 62%, transparent 100%)",
            maskImage:
              "radial-gradient(circle at center, black 62%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 left-0 opacity-95 transition-[width] duration-150"
          style={{
            width: `${progress}%`,
            background:
              "repeating-linear-gradient(90deg, #ffffff 0 3px, transparent 3px 9px), repeating-linear-gradient(90deg, transparent 0 6px, #ffffff 6px 9px, transparent 9px 15px)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 62%, transparent 100%)",
            maskImage:
              "radial-gradient(circle at center, black 62%, transparent 100%)",
          }}
        />
      </div>

      {src ? (
        <audio
          ref={audioRef}
          data-tonemap-preview="true"
          preload="metadata"
          src={src}
        />
      ) : null}
    </div>
  );
}