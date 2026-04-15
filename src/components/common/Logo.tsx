type LogoProps = {
  compact?: boolean;
};

export default function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/8 bg-white/8 backdrop-blur-sm">
        <span className="text-lg font-semibold text-white">T</span>
      </div>

      {!compact && (
        <div className="leading-none">
          <p
            className="text-[2rem] font-semibold tracking-[-0.04em] text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            ToneMap
          </p>
          <p className="mt-2 text-sm text-white/72">
            Visual + emotional music learning
          </p>
        </div>
      )}
    </div>
  );
}