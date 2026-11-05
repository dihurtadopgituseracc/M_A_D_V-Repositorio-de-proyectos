import { projects } from "@/data/projects"

import { reg, semi } from "@/constants/styles"
import ScrollExpand from "@/components/common/ScrollExpand"
import HalftoneReveal from "@/component/HalftoneReveal"

export default function LandingPage({
  onOpenRepository,
  onOpenGallery,
  onOpenEvents,
}: {
  onOpenRepository: () => void
  onOpenGallery: () => void
  onOpenEvents: () => void
}) {
  return (
    <main className="min-h-[100dvh] bg-[#f6f3ea] text-[#171827]">
      <section className="bg-[#f0cb82] px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1120px]">
          <header className="flex min-h-[180px] flex-col items-center justify-center gap-3 border-b border-[#363636]/20 py-6 sm:min-h-[156px]">
            <div className="flex justify-center">
              <img
                src={`${import.meta.env.BASE_URL}assets/branding/LogoMADV.svg`}
                alt="MADV, repositorio de videojuegos"
                width="140"
                height="126"
                className="block h-auto w-[290px] sm:w-[190px]"
              />
            </div>
          </header>

          <div className="flex min-h-[560px] flex-col justify-center py-16 sm:min-h-[600px] sm:py-20">
            <h1
              className={`${semi} mt-5 max-w-[900px] text-[42px] leading-[1.04] text-[#171827] sm:text-[56px]`}
            >
              Un repositorio abierto para que los proyectos de videojuegos
              encuentren nuevas manos.
            </h1>
            <p
              className={`${reg} mt-6 max-w-[620px] text-[15px] leading-[1.65] text-[#4f4e59] sm:text-[17px]`}
            >
              Descubre qué están creando otros equipos, conoce sus necesidades y
              encuentra una forma concreta de colaborar.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onOpenRepository}
                aria-label="Repositorio abierto"
                className={`${semi} inline-flex min-h-12 items-center justify-center gap-3 rounded-[1px] bg-[#171827] px-5 text-[13px] text-white transition hover:bg-[#287b86] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171827]`}
              >
                Repositorio abierto
                <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                onClick={onOpenGallery}
                className={`${semi} inline-flex min-h-12 items-center justify-center gap-3 rounded-[1px] border border-[#363636]/35 px-5 text-[13px] text-[#171827] transition hover:bg-white/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171827]`}
              >
                Saber más del proyecto
                <span aria-hidden="true">↓</span>
              </button>
              <button
                type="button"
                onClick={onOpenEvents}
                className={`${semi} inline-flex min-h-12 items-center justify-center gap-3 rounded-[1px] border border-[#363636]/35 px-5 text-[13px] text-[#171827] transition hover:bg-white/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171827]`}
              >
                Eventos
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-[#171827] px-5 sm:px-8 lg:px-10"
        aria-label="Presentación visual de MADV"
      >
        <ScrollExpand
          src={`${import.meta.env.BASE_URL}assets/branding/ScrollBG.jpg`}
          alt="USERBG"
          title="Baja para ver más"
          scrollHint="Desplázate"
          useWindowScroll
        >
          <h2
            className={`${semi} max-w-[620px] text-[32px] text-white sm:text-[42px]`}
          >
            Cada proyecto, una oportunidad para aportar.
          </h2>
          <p
            className={`${semi} mt-4 max-w-[560px] text-[24px] leading-[1.6] text-white/80 sm:text-[17px]`}
          >
            Encuentra proyectos y oportunidades para aportar en ellos en una
            comunidad que desea crecer y fortalecer su pasión por el medio
          </p>
        </ScrollExpand>
      </section>

      <section
        id="sobre-madv"
        className="scroll-mt-8 px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
      >
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-6 border-b border-[#171827]/15 pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div>
              <p className={`${semi} text-[11px] uppercase text-[#d9533f]`}>
                Que implica el proyecto de "Más Allá del videojuego"
              </p>
              <h2
                className={`${semi} mt-3 max-w-[520px] text-[30px] leading-[1.12] text-[#171827] sm:text-[38px]`}
              >
                Un punto de encuentro para crear en comunidad.
              </h2>
            </div>
            <p
              className={`${reg} max-w-[620px] self-end text-[24px] leading-[1.7] text-[#4f4e59]`}
            >
              MADV reúne proyectos de videojuegos en distintas etapas con
              personas que quieren aportar sus habilidades. Cada ficha muestra
              su avance, herramientas y necesidades para que puedas conocer el
              contexto antes de contactar con el equipo.
            </p>
          </div>
          <div className="mt-10">
            <div className="h-[240px] overflow-hidden rounded-[2px] bg-[#171827] sm:h-[360px]">
              <HalftoneReveal
                src={`${import.meta.env.BASE_URL}assets/branding/ColabLogo.jpg`}
                fit="contain"
                mode="duotone"
                shape="line"
                cellSize={7}
                inkColor="#171827"
                accentColor="#d9913f"
                paperColor="#f6f3ea"
                revealRadius={320}
                softness={0.25}
                intro
                className="h-full w-full"
              />
            </div>
            <h3
              className={`${semi} mt-6 max-w-[760px] text-[24px] leading-[1.2] text-[#171827] sm:text-[32px]`}
            >
              Una comunidad que crece cuando compartimos lo que sabemos.
            </h3>
          </div>
        </div>
      </section>
    </main>
  )
}
