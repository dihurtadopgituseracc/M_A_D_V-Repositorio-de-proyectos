import { projects } from "@/data/projects"

import { reg, semi } from "@/constants/styles"
import ScrollExpand from "@/components/common/ScrollExpand"
import HalftoneReveal from "@/component/HalftoneReveal"
import AngleIcon from "@/components/common/AngleIcon"
import CurvedLoop from "@/component/CurvedLoop"
import ScrambledText from "@/component/ScrambledText"
import ScrollReveal from "@/component/ScrollReveal"

export default function LandingPage({
  onOpenRepository,
  onOpenGallery,
  onOpenEvents,
}: {
  onOpenRepository: () => void
  onOpenGallery: () => void
  onOpenEvents: () => void
}) {
  const creationThemes = [
    "momentos",
    "proyectos",
    "experiencias",
    "juegos",
    "comunidad",
    "amigos",
    "conocimientos",
    "ideas",
    "ecosistema",
    "industria",
    "colaboración ✦",
        
  ]

  return (
    <main className="min-h-[100dvh] bg-crema text-tinta">
      <section className="bg-oro px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1120px]">
          <header className="flex min-h-[180px] flex-col items-center justify-center gap-3 border-b border-tinta-suave/20 py-6 sm:min-h-[156px]">
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

          <div className="flex min-h-[560px] flex-col items-center justify-center py-16 text-center sm:min-h-[600px] sm:py-20">
            <h1
              className={`${semi} max-w-[900px] text-[42px] leading-[1.04] text-tinta sm:text-[64px]`}
            >Conectémonos para crear
            </h1>
            <div className="my-4 w-[calc(100%+2.5rem)] overflow-hidden sm:my-6 sm:w-[calc(100%+4rem)]">
              <CurvedLoop
                marqueeText={creationThemes.join(" ✦ ")}
                speed={1.4}
                curveAmount={117}
                direction="left"
                pauseOnHover
                color="#d3870d"
                edgeFade={0.25}
                shape="arc"
                fontSize={170}
                fontWeight={700}
                letterSpacing={1}
                interactive
                scrollBoost={0.7}
              />
            </div>
            <h1
              className={`${semi} max-w-[900px] text-[42px] leading-[1.04] text-tinta sm:text-[64px]`}
            >entre tod@s.
            </h1>
            <p
              className={`${reg} mt-8 max-w-[620px] text-[15px] leading-[1.65] text-grafito sm:text-[17px]`}
            >
              Descubre qué están creando otros equipos, conoce sus necesidades y
              encuentra una forma concreta de colaborar.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onOpenRepository}
                aria-label="Repositorio abierto"
                className={`${semi} inline-flex min-h-12 items-center justify-center gap-3 rounded-[1px] bg-tinta px-5 text-[13px] text-white transition hover:bg-turquesa focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta`}
              >
                Repositorio abierto
                <AngleIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={onOpenGallery}
                className={`${semi} inline-flex min-h-12 items-center justify-center gap-3 rounded-[1px] border border-tinta-suave/35 px-5 text-[13px] text-tinta transition hover:bg-white/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta`}
              >
                Saber más del proyecto
                <AngleIcon direction="down" className="size-4" />
              </button>
              <button
                type="button"
                onClick={onOpenEvents}
                className={`${semi} inline-flex min-h-12 items-center justify-center gap-3 rounded-[1px] border border-tinta-suave/35 px-5 text-[13px] text-tinta transition hover:bg-white/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta`}
              >
                Eventos
                <AngleIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-tinta px-5 sm:px-8 lg:px-10"
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

      <hr aria-hidden="true" className="m-0 h-2 border-0 bg-oro" />

      <section
        id="sobre-madv"
        aria-labelledby="sobre-madv-titulo"
        className="scroll-mt-8 px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
      >
        <div className="mx-auto grid max-w-[1120px] gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <p className={`${semi} text-[11px] uppercase text-coral`}>
              Que implica el proyecto de "Más Allá del videojuego"
            </p>
            <ScrollReveal
              as="h2"
              id="sobre-madv-titulo"
              baseOpacity={0.15}
              wordAnimationEnd="top 35%"
              rotationEnd="top 35%"
              containerClassName={`${semi} mt-3 max-w-[520px] text-[30px] leading-[1.12] text-tinta sm:text-[38px]`}
            >
              Un punto de encuentro para crear en comunidad.
            </ScrollReveal>
          </div>
          <ScrollReveal
            as="p"
            baseOpacity={0.15}
            baseRotation={0}
            wordAnimationEnd="top 35%"
            containerClassName={`${reg} max-w-[620px] self-end text-[24px] leading-[1.7] text-grafito`}
          >
            MADV reúne proyectos de videojuegos en distintas etapas con
            personas que quieren aportar sus habilidades. Cada ficha muestra su
            avance, herramientas y necesidades para que puedas conocer el
            contexto antes de contactar con el equipo.
          </ScrollReveal>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] border-t border-tinta/15 pt-10">
            <div className="h-[240px] overflow-hidden rounded-[2px] bg-tinta sm:h-[360px]">
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
              className={`${semi} mt-6 max-w-[760px] text-[24px] leading-[1.2] text-tinta sm:text-[32px]`}
            >
              Una comunidad que crece cuando compartimos lo que sabemos.
            </h3>
            <div className="mt-6 max-w-[760px] text-justify">
              <ScrambledText
                radius={90}
                duration={1.1}
                speed={0.45}
                scrambleChars=".:"
                scrambleColor="#669c09"
                effect="lift"
                clickBurst={true}
                className={`${semi} text-[17px] italic leading-[1.45] text-tinta sm:text-[22px]`}
              >
                La colaboración con el Grupo de Desarrolladores y Diseñadores
                (GDD) fue fundamental para el desarrollo de la investigación de
                MADV en el marco del componente de Proyecto de Grado de la UCMC.
              </ScrambledText>
              <ScrambledText
                radius={90}
                duration={1.1}
                speed={0.45}
                scrambleChars=".:"
                scrambleColor="#62940c"
                effect="lift"
                clickBurst={true}
                className={`${reg} mt-4 text-[15px] leading-[1.7] text-grafito sm:text-[15px]`}
              >
                Su participación permitió acceder al contexto real de estudio,
                conocer las dinámicas de trabajo de los equipos, recopilar
                información y reconocer necesidades que orientaron el proceso de
                diseño. En este sentido, el GDD no fue únicamente un contexto de
                aplicación, sino un actor esencial para la construcción de la
                investigación: sin su disposición, participación y colaboración,
                no habría sido posible desarrollar el proyecto bajo las
                condiciones y con el alcance alcanzado.
              </ScrambledText>
            </div>
        </div>
      </section>

      <section
        aria-labelledby="estadisticas-proyectos-titulo"
        className="bg-tinta px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-10"
      >
        <div className="mx-auto max-w-[1120px]">
          <h2
            id="estadisticas-proyectos-titulo"
            className={`${semi} mb-8 max-w-[720px] text-[30px] leading-[1.08] text-white sm:text-[44px]`}
          >
            Hasta el momento GDD ha tenido proyectos
          </h2>
          <div className="grid border border-white/15 sm:grid-cols-2">
            {[
              ["26", "Proyectos terminados"],
              ["3", "Proyectos en curso"],
              ["49", "Proyectos publicados"],
              ["25", "Proyectos de jams"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`relative min-h-[125px] border-white/15 p-4 sm:min-h-[150px] sm:p-5 ${
                  index < 2 ? "border-b" : ""
                } ${index % 2 === 0 ? "sm:border-r" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`${reg} absolute right-4 top-4 text-[10px] tracking-[0.12em] text-white/45 sm:right-6 sm:top-6`}
                >
                  [{String(index + 1).padStart(2, "0")}]
                </span>
                <strong
                  className={`${semi} block text-[48px] leading-none text-white sm:text-[64px]`}
                >
                  {value}
                </strong>
                <span
                  className={`${semi} mt-2 block text-[10px] uppercase tracking-[0.18em] text-white/60 sm:text-[11px]`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <a
            href="https://gdd-col.itch.io/"
            target="_blank"
            rel="noreferrer"
            className={`${semi} mt-8 inline-flex min-h-12 items-center gap-8 border border-white/25 px-5 text-[12px] uppercase tracking-[0.12em] text-white transition hover:border-lima hover:text-lima focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lima`}
          >
            Visitar el itchi.io de GDD
            <AngleIcon className="size-4" />
          </a>
        </div>
      </section>

      <section
        aria-labelledby="colaborar-titulo"
        className="bg-tinta px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-10"
      >
        <div className="mx-auto max-w-[1120px]">
          <p
            className={`${semi} flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-lima`}
          >
            <span aria-hidden="true" className="text-[18px] leading-none">
              *
            </span>
            Proyectos abiertos a colaboración
          </p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div className="max-w-[720px]">
              <div
                id="colaborar-titulo"
                role="heading"
                aria-level={2}
              >
                <ScrambledText
                  radius={120}
                  duration={1.1}
                  speed={0.45}
                  scrambleChars="✦"
                  scrambleColor="#7fb622"
                  effect="lift"
                  clickBurst
                  className={`${semi} text-[44px] leading-[0.98] text-white sm:text-[72px]`}
                >
                  Hagamos del ecosistema local un espacio increíble para crear
                  videojuegos.
                </ScrambledText>
              </div>
              <p
                className={`${reg} mt-8 max-w-[580px] text-[16px] leading-[1.65] text-white/65 sm:text-[18px]`}
              >
                Hay proyectos, ideas y equipos buscando nuevas habilidades.
                Encuentra dónde aportar y hagamos crecer la comunidad entre
                tod@s.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenRepository}
              className={`${semi} inline-flex min-h-14 items-center justify-between gap-8 border border-white/25 px-5 text-left text-[12px] uppercase tracking-[0.12em] text-white transition hover:border-lima hover:text-lima focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lima sm:min-w-[280px]`}
            >
              Colaborar en un proyecto
              <AngleIcon className="size-4 shrink-0" />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
