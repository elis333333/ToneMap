"use client";

import type { GuitarVoicingIntent } from "@/core/types";

type GuitarVoicingIntentSelectProps = {
  value: GuitarVoicingIntent;
  onChange: (value: GuitarVoicingIntent) => void;
};

const OPTIONS: Array<{
  value: GuitarVoicingIntent;
  label: string;
}> = [
  { value: "balanced", label: "balanceado" },
  { value: "compact", label: "compacto" },
  { value: "open", label: "abierto" },
  { value: "bright", label: "brillante" },
  { value: "stable", label: "estable" },
  { value: "color-rich", label: "más color" },
];

export default function GuitarVoicingIntentSelect({
  value,
  onChange,
}: GuitarVoicingIntentSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              isActive
                ? "border-[#8338EC]/40 bg-[#8338EC]/12 text-white"
                : "border-white/10 bg-[#111111] text-white/72 hover:bg-[#1a1a1a]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}