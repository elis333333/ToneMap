"use client";

import { useExplorerStore } from "@/features/explorer/explorerStore";

export default function RomanModeSelect() {
  const romanMode = useExplorerStore((state) => state.romanMode);
  const setRomanMode = useExplorerStore((state) => state.setRomanMode);

  return (
    <div className="relative min-w-[200px]">
      <select
        value={romanMode}
        onChange={(e) => setRomanMode(e.target.value as "major" | "minor")}
        aria-label="Seleccionar modo tonal para progresiones romanas"
        className="h-full w-full appearance-none rounded-full border border-[#FF006E] bg-[#111111] px-5 py-3 text-left text-[0.98rem] text-white shadow-[0_0_0_1px_rgba(255,0,110,0.14)] outline-none transition hover:bg-[#161616] focus:border-[#FF006E] focus:ring-2 focus:ring-[#FF006E]/20"
      >
        <option value="major" className="bg-[#111111] text-white">
          modo: mayor
        </option>
        <option value="minor" className="bg-[#111111] text-white">
          modo: menor
        </option>
      </select>
    </div>
  );
}