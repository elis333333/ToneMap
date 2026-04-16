import Image from "next/image";

type LogoProps = {
  compact?: boolean;
};

export default function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-14 w-14 overflow-hidden rounded-[20px] border border-white/8 bg-white/6 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.24)]">
        <Image
          src="/images/logo-tonemap.png"
          alt="ToneMap logo"
          fill
          sizes="56px"
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