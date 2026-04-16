import Image from "next/image";

export default function AboutSection() {
  return (
    <section
      id="about-us"
      className="relative overflow-hidden bg-black px-6 py-20 text-white md:px-10 xl:px-16"
    >
      <div className="absolute inset-y-0 right-0 hidden w-[44%] lg:block">
        <Image
          src="/images/about-guitar.png"
          alt="Guitarra en blanco y negro"
          fill
          sizes="(max-width: 1024px) 0px, 44vw"
          className="object-cover object-right grayscale"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.98)_8%,rgba(0,0,0,0.9)_18%,rgba(0,0,0,0.72)_34%,rgba(0,0,0,0.42)_56%,rgba(0,0,0,0.16)_76%,rgba(0,0,0,0.02)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <p
          className="mb-7 text-[22px] font-normal tracking-[0.02em] text-[#f5f5f5]"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          About Us
        </p>

        <div className="max-w-[980px]">
          <h2 className="mb-10 text-[clamp(56px,6vw,86px)] leading-[1.05] font-extrabold tracking-[-0.04em]">
            “Deja de Memorizar Acordes. Empieza a Sentirlos”
          </h2>

          <p className="mb-9 max-w-[980px] text-[clamp(24px,2vw,28px)] leading-[1.35] text-[#f0f0f0]">
            La música no es una ciencia, es un arte para transmitir sensación y si
            no entendemos esto no vamos a poder{" "}
            <span className="relative inline-block">
              crear
              <span className="absolute right-0 -bottom-[6px] left-0 h-[6px] rounded-full bg-[#FFBE0B]" />
            </span>{" "}
            ni{" "}
            <span className="relative inline-block">
              interpretar
              <span className="absolute right-0 -bottom-[6px] left-0 h-[6px] rounded-full bg-[#06D6A0]" />
            </span>{" "}
            la música.
          </p>

          <div className="mb-14 grid gap-[18px]">
            <p className="text-[clamp(28px,2.1vw,34px)] font-bold leading-[1.2]">
              <span className="text-white">Es </span>
              <span className="text-[#8338EC]">tensión.</span>
            </p>
            <p className="text-[clamp(28px,2.1vw,34px)] font-bold leading-[1.2]">
              <span className="text-white">Es </span>
              <span className="text-[#06D6A0]">descanso.</span>
            </p>
            <p className="text-[clamp(28px,2.1vw,34px)] font-bold leading-[1.2]">
              <span className="text-white">Es </span>
              <span className="text-[#FFBE0B]">color.</span>
            </p>
          </div>
        </div>

        <div className="relative mx-auto max-w-[1180px] text-center">
          <div className="grid gap-8 md:grid-cols-3">
            <article className="relative flex flex-col items-center">
              <h3
                className="mb-6 min-h-[88px] text-center text-[clamp(28px,2vw,34px)] leading-[1.2] text-[#f0f0f0]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Música como
                <br />
                lenguaje
              </h3>

              <div className="absolute top-[92px] left-[6px] hidden h-[112px] w-[112px] rounded-tl-[26px] border-t-[5px] border-l-[5px] border-[#FF006E] lg:block" />

              <div className="mx-auto flex min-h-[188px] w-full max-w-[340px] items-center justify-center rounded-[26px] bg-[rgba(22,22,22,0.96)] px-6 py-7 text-center text-[clamp(20px,1.5vw,24px)] leading-[1.35] font-bold shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                No se trata de memorizar escalas,
                <br />
                sino de entender qué estás
                <br />
                diciendo al tocar.
              </div>
            </article>

            <article className="relative flex flex-col items-center">
              <h3
                className="mb-6 min-h-[88px] text-center text-[clamp(28px,2vw,34px)] leading-[1.2] text-[#f0f0f0]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Música como
                <br />
                Emoción
              </h3>

              <div className="mx-auto flex min-h-[188px] w-full max-w-[340px] items-center justify-center rounded-[26px] bg-[rgba(22,22,22,0.96)] px-6 py-7 text-center text-[clamp(20px,1.5vw,24px)] leading-[1.35] font-bold shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                Cada acorde tiene un color.
                <br />
                Cada progresión cuenta una
                <br />
                historia.
              </div>
            </article>

            <article className="relative flex flex-col items-center">
              <h3
                className="mb-6 min-h-[88px] text-center text-[clamp(28px,2vw,34px)] leading-[1.2] text-[#f0f0f0]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Música como
                <br />
                Sistema
              </h3>

              <div className="mx-auto flex min-h-[188px] w-full max-w-[340px] items-center justify-center rounded-[26px] bg-[rgba(22,22,22,0.96)] px-6 py-7 text-center text-[clamp(20px,1.5vw,24px)] leading-[1.35] font-bold shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                La teoría no es una regla.
                <br />
                Es un mapa para explorar.
              </div>

              <div className="absolute top-[214px] right-[6px] hidden h-[112px] w-[112px] rounded-br-[26px] border-r-[5px] border-b-[5px] border-[#3A86FF] lg:block" />
            </article>
          </div>

          <p className="mx-auto mt-14 max-w-[980px] text-center text-[clamp(28px,2.2vw,34px)] leading-[1.35] font-normal text-[#f0f0f0]">
            “ToneMap convierte la música en algo que puedes ver, entender y sentir”.
          </p>
        </div>
      </div>
    </section>
  );
}