type TuningSelectProps = {
  instrument: "keyboard" | "guitar" | "bass";
  value: "standard" | "drop-d";
  onChange: (value: "standard" | "drop-d") => void;
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

export default function TuningSelect({
  instrument,
  value,
  onChange,
}: TuningSelectProps) {
  const disabled = instrument === "keyboard";

  return (
    <div className="relative min-w-[230px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as "standard" | "drop-d")}
        aria-label="Seleccionar afinación"
        disabled={disabled}
        className="h-full w-full appearance-none rounded-full border border-[#FF006E] bg-[#111111] px-12 py-3 text-left text-[1.05rem] text-white shadow-[0_0_0_1px_rgba(255,0,110,0.14)] outline-none transition hover:bg-[#161616] focus:border-[#FF006E] focus:ring-2 focus:ring-[#FF006E]/20 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {instrument === "keyboard" && (
          <option value="standard" className="bg-[#111111] text-white">
            afinación no aplica
          </option>
        )}

        {instrument === "guitar" && (
          <>
            <option value="standard" className="bg-[#111111] text-white">
              afinación: standard
            </option>
            <option value="drop-d" className="bg-[#111111] text-white">
              afinación: drop D
            </option>
          </>
        )}

        {instrument === "bass" && (
          <option value="standard" className="bg-[#111111] text-white">
            afinación: standard
          </option>
        )}
      </select>

      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white">
        <ChevronDown />
      </div>
    </div>
  );
}