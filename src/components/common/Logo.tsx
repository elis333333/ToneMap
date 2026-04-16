import Image from "next/image";

type LogoProps = {
  compact?: boolean;
};

export default function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-14 w-14 overflow-hidden">
        <Image
          src="/images/logo-tonemap.png"
          alt="ToneMap logo"
          fill
          className="object-cover"
          priority
        />
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