"use client";

import type { ExplorerView } from "@/features/explorer/explorerStore";

type ViewSwitchProps = {
  value: ExplorerView;
  onChange: (value: ExplorerView) => void;
};

function ChevronDown() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none shrink-0"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function ViewSwitch({ value, onChange }: ViewSwitchProps) {
  return (
    <div className="relative min-w-[230px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ExplorerView)}
        aria-label="Seleccionar vista"
        className="h-full w-full appearance-none rounded-full border border-[#FFBE0B] bg-[#111111] px-12 py-3 text-left text-[1.05rem] text-white shadow-[0_0_0_1px_rgba(255,190,11,0.14)] outline-none transition hover:bg-[#161616] focus:border-[#FFBE0B] focus:ring-2 focus:ring-[#FFBE0B]/20"
      >
        <option value="notes" className="bg-[#111111] text-white">
          vista: notas
        </option>
        <option value="intervals" className="bg-[#111111] text-white">
          vista: intervalos
        </option>
        <option value="fingering" className="bg-[#111111] text-white">
          vista: digitación
        </option>
      </select>

      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white">
        <ChevronDown />
      </div>
    </div>
  );
}