import type { NoteName } from "@/core/types";

type RomanKeySelectProps = {
  value: NoteName;
  onChange: (value: NoteName) => void;
};

const NOTE_OPTIONS: NoteName[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

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

export default function RomanKeySelect({
  value,
  onChange,
}: RomanKeySelectProps) {
  return (
    <div className="relative min-w-[230px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as NoteName)}
        aria-label="Seleccionar tonalidad base para progresiones romanas"
        className="h-full w-full appearance-none rounded-full border border-[#3A86FF] bg-[#111111] px-12 py-3 text-left text-[1.05rem] text-white shadow-[0_0_0_1px_rgba(58,134,255,0.14)] outline-none transition hover:bg-[#161616] focus:border-[#3A86FF] focus:ring-2 focus:ring-[#3A86FF]/20"
      >
        {NOTE_OPTIONS.map((note) => (
          <option key={note} value={note} className="bg-[#111111] text-white">
            tonalidad base: {note}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white">
        <ChevronDown />
      </div>
    </div>
  );
}