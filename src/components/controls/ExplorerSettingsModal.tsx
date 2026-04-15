"use client";

import { useEffect, useState } from "react";
import PlaybackControls from "@/components/controls/PlaybackControls";
import TuningSelect from "@/components/controls/TuningSelect";
import RomanKeySelect from "@/components/controls/RomanKeySelect";
import RomanModeSelect from "@/components/controls/RomanModeSelect";
import { useExplorerStore } from "@/features/explorer/explorerStore";

type ExplorerSettingsModalProps = {
  open: boolean;
  onClose: () => void;
  instrument: "keyboard" | "guitar" | "bass";
};

type SettingsTab = "basic" | "advanced";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-white/[0.02] p-4">
      <div className="mb-3">
        <p className="text-sm font-medium text-white/90">{title}</p>
        {subtitle ? <p className="mt-1 text-xs text-white/46">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active
          ? "border-[#3A86FF]/40 bg-[#3A86FF]/12 text-white"
          : "border-white/10 bg-[#111111] text-white/70 hover:bg-[#1a1a1a]"
      }`}
    >
      {children}
    </button>
  );
}

export default function ExplorerSettingsModal({
  open,
  onClose,
  instrument,
}: ExplorerSettingsModalProps) {
  const guitarTuning = useExplorerStore((state) => state.guitarTuning);
  const setGuitarTuning = useExplorerStore((state) => state.setGuitarTuning);
  const romanBaseTonic = useExplorerStore((state) => state.romanBaseTonic);
  const setRomanBaseTonic = useExplorerStore((state) => state.setRomanBaseTonic);
  const guitarHandedness = useExplorerStore((state) => state.guitarHandedness);
  const setGuitarHandedness = useExplorerStore(
    (state) => state.setGuitarHandedness
  );

  const [tab, setTab] = useState<SettingsTab>("basic");

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setTab("basic");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/72 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[900px] rounded-[28px] border border-white/10 bg-[#0F0F0F] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3
              className="text-[1.3rem] font-medium tracking-[-0.04em] text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Configuración
            </h3>
            <p className="mt-1 text-sm text-white/52">
              Ajusta reproducción, contexto tonal y preferencias del instrumento sin recargar la pantalla principal.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/78 transition hover:bg-white/[0.06]"
          >
            cerrar
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <TabButton active={tab === "basic"} onClick={() => setTab("basic")}>
            básico
          </TabButton>
          <TabButton active={tab === "advanced"} onClick={() => setTab("advanced")}>
            avanzado
          </TabButton>
        </div>

        {tab === "basic" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <Section
              title="Instrumento"
              subtitle="Opciones visuales y de afinación para tocar más cómodo."
            >
              <div className="flex flex-wrap gap-3">
                <TuningSelect
                  instrument={instrument}
                  value={instrument === "guitar" ? guitarTuning : "standard"}
                  onChange={setGuitarTuning}
                />
              </div>

              {instrument === "guitar" && (
                <div className="mt-4">
                  <p className="mb-2 text-sm text-white/68">Orientación del mástil</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setGuitarHandedness("right")}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        guitarHandedness === "right"
                          ? "border-[#3A86FF]/40 bg-[#3A86FF]/12 text-white"
                          : "border-white/10 bg-[#111111] text-white/70 hover:bg-[#1a1a1a]"
                      }`}
                    >
                      diestro
                    </button>

                    <button
                      type="button"
                      onClick={() => setGuitarHandedness("left")}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        guitarHandedness === "left"
                          ? "border-[#3A86FF]/40 bg-[#3A86FF]/12 text-white"
                          : "border-white/10 bg-[#111111] text-white/70 hover:bg-[#1a1a1a]"
                      }`}
                    >
                      zurdo
                    </button>
                  </div>
                </div>
              )}
            </Section>

            <Section
              title="Contexto tonal"
              subtitle="Útil para progresiones, análisis funcional y lectura armónica."
            >
              <div className="flex flex-wrap gap-3">
                <RomanKeySelect
                  value={romanBaseTonic}
                  onChange={setRomanBaseTonic}
                />
                <RomanModeSelect />
              </div>
            </Section>

            <Section
              title="Reproducción"
              subtitle="Controla tempo, duración por acorde y forma de ejecución."
            >
              <PlaybackControls />
            </Section>

            <Section
              title="Consejo"
              subtitle="Una guía rápida para aprovechar mejor la herramienta."
            >
              <div className="space-y-2 text-sm text-white/68">
                <p>• Usa la pantalla principal para explorar rápido sin distraerte con demasiados controles.</p>
                <p>• Abre esta ventana cuando quieras ajustar reproducción, afinación o contexto tonal.</p>
                <p>• En guitarra, las posiciones sugeridas aparecen junto al instrumento para que el flujo sea más natural.</p>
              </div>
            </Section>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <Section
              title="Ajustes avanzados"
              subtitle="Espacio reservado para controles más específicos en futuras versiones."
            >
              <div className="space-y-2 text-sm text-white/68">
                <p>• Aquí más adelante podrán entrar filtros de voicing, preferencias de inversión y rangos por instrumento.</p>
                <p>• También puede crecer la parte de análisis contextual o de reproducción más detallada.</p>
              </div>
            </Section>

            <Section
              title="Estado actual"
              subtitle="Cómo está organizada hoy la experiencia."
            >
              <div className="space-y-2 text-sm text-white/68">
                <p>• La pantalla principal prioriza rapidez y claridad.</p>
                <p>• La configuración secundaria vive en esta ventana para no saturar la vista principal.</p>
                <p>• En guitarra, el mástil y sus posiciones sugeridas ahora comparten una misma zona visual.</p>
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}