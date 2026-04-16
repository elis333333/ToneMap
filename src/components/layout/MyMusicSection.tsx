import Image from "next/image";
import AudioPreviewPill from "@/components/common/AudioPreviewPill";
import SiteFooter from "@/components/layout/SiteFooter";

const FALLBACK_IMAGE = "/images/logo-tonemap.png";
const INTRO_VIDEO_SRC: string | null = null;

const covers = [
  {
    title: "On the Way - by AiNA THE END",
    image: FALLBACK_IMAGE,
    href: "https://www.youtube.com/",
  },
  {
    title: "That Band - by kosuko band",
    image: FALLBACK_IMAGE,
    href: "https://www.youtube.com/",
  },
  {
    title: "Aizo - King Gnu",
    image: FALLBACK_IMAGE,
    href: "https://www.youtube.com/",
  },
  {
    title: "Hyper ventilation -",
    image: FALLBACK_IMAGE,
    href: "https://www.youtube.com/",
  },
];

const compositions = [
  {
    title: "Rain of Broken Hearts",
    image: FALLBACK_IMAGE,
    href: "https://www.youtube.com/",
  },
  {
    title: "La casa de mis recuerdos",
    image: FALLBACK_IMAGE,
    href: "https://www.youtube.com/",
  },
  {
    title: "Estamos hechos de los mismos átomos",
    image: FALLBACK_IMAGE,
    href: "https://www.youtube.com/",
  },
  {
    title: "hate tec...",
    image: FALLBACK_IMAGE,
    href: "https://www.youtube.com/",
  },
];

const experiments = [
  {
    image: FALLBACK_IMAGE,
    audio: null,
    href: "https://www.youtube.com/",
    alt: "Preview de experimento 1",
  },
  {
    image: FALLBACK_IMAGE,
    audio: null,
    href: "https://www.youtube.com/",
    alt: "Preview de experimento 2",
  },
  {
    image: FALLBACK_IMAGE,
    audio: null,
    href: "https://www.youtube.com/",
    alt: "Preview de experimento 3",
  },
  {
    image: FALLBACK_IMAGE,
    audio: null,
    href: "https://www.youtube.com/",
    alt: "Preview de experimento 4",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-6 text-[22px] font-normal tracking-[0.02em] text-[#f5f5f5]"
      style={{ fontFamily: "var(--font-space-grotesk)" }}
    >
      {children}
    </p>
  );
}

function CategoryHeader({
  icon,
  title,
  colorClass,
}: {
  icon: string;
  title: string;
  colorClass: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-[18px]">
      <span className="inline-flex h-11 w-11 items-center justify-center shrink-0">
        <Image src={icon} alt="" width={44} height={44} className="object-contain" />
      </span>
      <h2
        className={`text-[clamp(42px,3vw,56px)] leading-none font-medium ${colorClass}`}
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {title}
      </h2>
    </div>
  );
}

function MediaCard({
  title,
  image,
  href,
}: {
  title: string;
  image: string;
  href: string;
}) {
  return (
    <article className="min-w-0">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-[24px] bg-[#111] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_24px_rgba(0,0,0,0.35)]"
      >
        <Image
          src={image}
          alt={title}
          width={560}
          height={430}
          className="aspect-[1.12/0.86] w-full object-cover"
        />
      </a>
      <p className="mt-4 min-h-[52px] text-center text-[18px] leading-[1.35] font-normal text-[#f4f4f4] md:text-center">
        {title}
      </p>
    </article>
  );
}

export default function MyMusicSection() {
  return (
    <>
      <section
        id="my-music"
        className="relative overflow-hidden bg-black px-6 py-20 text-white md:px-10 xl:px-16"
      >
        <div className="mx-auto max-w-[1280px]">
          <SectionLabel>My Music</SectionLabel>

          <div className="mb-14 grid items-start gap-12 xl:grid-cols-[520px_1fr]">
            <div className="relative w-full max-w-[520px]">
              <div className="pointer-events-none absolute -top-[18px] -left-[18px] z-10 h-32 w-32 rounded-tl-[28px] border-t-[5px] border-l-[5px] border-[#8338EC]" />
              <div className="pointer-events-none absolute -right-[18px] -bottom-[18px] z-10 h-32 w-32 rounded-br-[28px] border-r-[5px] border-b-[5px] border-[#3A86FF]" />

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden bg-[#111]"
              >
                {INTRO_VIDEO_SRC ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={FALLBACK_IMAGE}
                    className="aspect-[1.27/1] w-full object-cover"
                  >
                    <source src={INTRO_VIDEO_SRC} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={FALLBACK_IMAGE}
                    alt="Preview principal de My Music"
                    width={700}
                    height={560}
                    className="aspect-[1.27/1] w-full object-cover"
                  />
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.12)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex h-[84px] w-[84px] items-center justify-center rounded-full border-2 border-white/90 bg-[rgba(0,0,0,0.18)] text-[30px] text-white backdrop-blur-[6px]">
                    ▶
                  </span>
                </div>
              </a>
            </div>

            <div className="relative max-w-[860px] pt-2 xl:pl-8 xl:pr-11">
              <p className="max-w-[760px] text-[clamp(22px,1.75vw,31px)] leading-[1.35] text-[#f2f2f2]">
                &quot;Este es mi laboratorio musical.
                <br />
                Aquí experimento, interpreto y construyo música
                <br />
                desde una perspectiva distinta:
                <br />
                entender lo que suena, no solo tocarlo.
                <br />
                Cada pieza es parte de ese proceso,
                <br />
                inspirándome en distintas canciones y
                <br />
                usando herramientas muy útiles para facilitar
                <br />
                el &quot;proceso&quot;
              </p>
            </div>
          </div>

          <section className="mt-9">
            <CategoryHeader
              icon="/images/icon-cover.png"
              title="Covers"
              colorClass="text-[#FFBE0B]"
            />

            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
              {covers.map((item) => (
                <MediaCard key={item.title} {...item} />
              ))}
            </div>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-5 block w-fit text-[18px] text-[#5d5d5d] underline underline-offset-[3px] transition hover:text-[#d8d8d8]"
            >
              Ver más
            </a>
          </section>

          <section className="mt-14">
            <CategoryHeader
              icon="/images/icon-composition.png"
              title="Composiciones"
              colorClass="text-[#FF006E]"
            />

            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
              {compositions.map((item) => (
                <MediaCard key={item.title} {...item} />
              ))}
            </div>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-5 block w-fit text-[18px] text-[#5d5d5d] underline underline-offset-[3px] transition hover:text-[#d8d8d8]"
            >
              Ver más
            </a>
          </section>

          <section className="mt-14">
            <CategoryHeader
              icon="/images/icon-experiment.png"
              title="Experimentos"
              colorClass="text-[#06D6A0]"
            />

            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
              {experiments.map((item, index) => (
                <article key={`experiment-${index}`} className="min-w-0">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-[24px] bg-[#111] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_24px_rgba(0,0,0,0.35)]"
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={560}
                      height={430}
                      className="aspect-[1.12/0.86] w-full object-cover"
                    />
                  </a>

                  <AudioPreviewPill
                    src={item.audio}
                    label={`experimento ${index + 1}`}
                  />
                </article>
              ))}
            </div>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-5 block w-fit text-[18px] text-[#5d5d5d] underline underline-offset-[3px] transition hover:text-[#d8d8d8]"
            >
              Ver más
            </a>
          </section>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}