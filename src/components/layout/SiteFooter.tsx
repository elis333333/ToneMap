import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="relative mt-12 border-t border-white/6 bg-[linear-gradient(180deg,#040404_0%,#090909_100%)] px-6 py-12 text-white md:px-10 xl:px-16">
      <div className="mx-auto grid max-w-[1280px] gap-10 xl:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex items-start gap-[18px]">
          <Image
            src="/images/logo-tonemap.png"
            alt="Logo ToneMap"
            width={64}
            height={64}
            className="shrink-0 rounded-[18px] object-contain"
          />

          <div>
            <h3 className="mb-2 text-[30px] font-bold">ToneMap</h3>
            <p className="max-w-[420px] text-[15px] leading-[1.5] text-[#cfcfcf]">
              Entender la música como un lenguaje visual y emocional. Una
              experiencia para explorar acordes, canciones e ideas desde lo que
              transmiten, no solo desde lo que dicen en teoría.
            </p>
          </div>
        </div>

        <div>
          <h4
            className="mb-4 text-[20px] text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Navegación
          </h4>

          <div className="grid gap-[10px]">
            <a href="#about-us" className="text-[15px] text-[#cfcfcf] transition hover:text-white">
              Sobre Nosotros
            </a>
            <a href="#my-music" className="text-[15px] text-[#cfcfcf] transition hover:text-white">
              Mi Música
            </a>
            <a href="#course" className="text-[15px] text-[#cfcfcf] transition hover:text-white">
              Curso
            </a>
            <a href="#home" className="text-[15px] text-[#cfcfcf] transition hover:text-white">
              Home
            </a>
          </div>
        </div>

        <div>
          <h4
            className="mb-4 text-[20px] text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Conecta
          </h4>

          <div className="grid gap-[10px]">
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] text-[#cfcfcf] transition hover:text-white"
            >
              YouTube
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] text-[#cfcfcf] transition hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] text-[#cfcfcf] transition hover:text-white"
            >
              TikTok
            </a>
            <a
              href="mailto:tuemail@correo.com"
              className="text-[15px] text-[#cfcfcf] transition hover:text-white"
            >
              Contacto
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-7 flex max-w-[1280px] flex-col items-start justify-between gap-5 border-t border-white/6 pt-6 text-[14px] text-[#8e8e8e] md:flex-row md:items-center">
        <p>© 2026 ToneMap. Todos los derechos reservados.</p>

        <div className="flex items-center gap-[10px]" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#3A86FF]" />
          <span className="h-3 w-3 rounded-full bg-[#FF006E]" />
          <span className="h-3 w-3 rounded-full bg-[#FFBE0B]" />
          <span className="h-3 w-3 rounded-full bg-[#8338EC]" />
          <span className="h-3 w-3 rounded-full bg-[#06D6A0]" />
        </div>
      </div>
    </footer>
  );
}