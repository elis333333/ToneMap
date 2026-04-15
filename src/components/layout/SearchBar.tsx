type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  compact?: boolean;
  className?: string;
  accentColor?: string;
};

export default function SearchBar({
  placeholder = "Escribe un acorde, nota o intervalo...",
  value = "",
  onChange,
  onSubmit,
  compact = false,
  className = "",
  accentColor = "#FFFFFF",
}: SearchBarProps) {
  return (
    <div
      className={[
        "flex w-full items-center rounded-full border bg-black/88 backdrop-blur-md transition-all duration-300",
        compact ? "px-6 py-[10px]" : "px-10 py-5",
        className,
      ].join(" ")}
      style={{
        borderColor: `${accentColor}66`,
        boxShadow: compact
          ? `0 8px 20px rgba(0,0,0,0.30)`
          : `0 18px 60px rgba(0,0,0,0.45)`,
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit?.();
        }}
        placeholder={placeholder}
        className={[
          "w-full bg-transparent text-white outline-none placeholder:text-white/48",
          compact ? "text-[0.98rem]" : "text-[1.2rem]",
        ].join(" ")}
      />

      <button
        type="button"
        aria-label="Buscar"
        onClick={onSubmit}
        className={[
          "ml-4 flex items-center justify-center rounded-full transition",
          compact ? "h-8 w-8" : "h-12 w-12",
        ].join(" ")}
        style={{
          color: accentColor,
          backgroundColor: "transparent",
        }}
      >
        <svg
          width={compact ? "20" : "28"}
          height={compact ? "20" : "28"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4.2-4.2" />
        </svg>
      </button>
    </div>
  );
}