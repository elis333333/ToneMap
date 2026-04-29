"use client";

import { useEffect } from "react";
import { useTutorialStore } from "@/features/tutorial/tutorialStore";

export default function TutorialOverlay() {
  const { step, next, end, canContinue } = useTutorialStore();

  // 🔒 bloquear scroll global
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
return (
  <div className="fixed inset-0 z-[9998] bg-black/80 pointer-events-none">

    {/* 🔥 CAPA OSCURA (NO BLOQUEA INTERACCIÓN) */}
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

    {/* 🔥 CONTENIDO DEL TUTORIAL (SÍ INTERACTIVO) */}
    <div className="relative flex items-center justify-center h-full pointer-events-auto">

      <div className="w-[90%] max-w-[700px] rounded-2xl bg-[#111] border border-white/10 p-8 text-white relative">

        {/* TEXTO */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-semibold mb-4">
              Bienvenido a ToneMap
            </h2>
            <p className="text-white/70">
              Entiende la música como un lenguaje visual y emocional.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Busca cualquier cosa
            </h2>
            <p className="text-white/70">
              Escribe acordes, intervalos, escalas o progresiones en el buscador.
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Explora manualmente
            </h2>
            <p className="text-white/70">
              Toca el instrumento y crea tu propio acorde.
            </p>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Aprende lo que significa
            </h2>
            <p className="text-white/70">
              Revisa las fichas teórica, avanzada y emocional.
            </p>
          </>
        )}

        {/* BOTONES */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={end}
            className="text-white/40 hover:text-white/70"
          >
            Saltar
          </button>

          <button
            disabled={!canContinue}
            onClick={() => {
              if (step === 4) end();
              else next();
            }}
            className={`px-6 py-2 rounded-lg transition ${
              canContinue
                ? "bg-yellow-400 text-black"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            {step === 4 ? "Listo" : "Siguiente"}
          </button>
        </div>
      </div>

    </div>
  </div>
);
}