import Logo from "@/components/common/Logo";
import SearchBar from "@/components/layout/SearchBar";

type HeroProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  accentColor: string;
};

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "My Music", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Course", href: "#" },
];

export default function Hero({
  query,
  onQueryChange,
  onSubmit,
  accentColor,
}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[rgba(0,0,0,0.56)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.16),rgba(0,0,0,0.68))]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-start justify-between px-10 pt-9 md:px-14">
          <Logo />

          <nav className="hidden items-center gap-12 pt-3 md:flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                className="text-[1.15rem] text-white/92 underline underline-offset-4 transition-opacity hover:opacity-80"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pt-14 md:pt-10">
          <div className="w-full max-w-[720px]">
            <SearchBar
              value={query}
              onChange={onQueryChange}
              onSubmit={onSubmit}
              accentColor={accentColor}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}