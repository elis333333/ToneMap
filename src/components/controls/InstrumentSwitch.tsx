type Instrument = "keyboard" | "guitar" | "bass";

type InstrumentSwitchProps = {
  value: Instrument;
  onChange: (value: Instrument) => void;
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

export default function InstrumentSwitch({
  value,
  onChange,
}: InstrumentSwitchProps) {
  return (
    <div className="relative min-w-[230px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Instrument)}
        aria-label="Seleccionar instrumento"
        className="h-full w-full appearance-none rounded-full border border-[#06D6A0] bg-[#111111] px-12 py-3 text-left text-[1.05rem] text-white shadow-[0_0_0_1px_rgba(6,214,160,0.14)] outline-none transition hover:bg-[#161616] focus:border-[#06D6A0] focus:ring-2 focus:ring-[#06D6A0]/20"
      >
        <option value="keyboard" className="bg-[#111111] text-white">
          piano
        </option>
        <option value="guitar" className="bg-[#111111] text-white">
          guitarra
        </option>
        <option value="bass" className="bg-[#111111] text-white">
          bajo
        </option>
      </select>

      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white">
        <ChevronDown />
      </div>
    </div>
  );
}