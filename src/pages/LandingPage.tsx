import { projects } from "@/data/projects"

import { reg, semi } from "@/constants/styles"

export default function LandingPage({
  onOpenRepository,
  onOpenGallery,
}: {
  onOpenRepository: () => void
  onOpenGallery: () => void
}) {
  const openNeeds = projects.reduce(
    (total, project) => total + project.needs.length,

    0,
  )

  return (
    <main className="min-h-[100dvh] bg-[#f6f3ea] text-[#171827]">
      <section className="bg-[#f0cb82] px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1120px]">
          <header className="flex min-h-[180px] flex-col items-center justify-center gap-3 border-b border-[#363636]/20 py-6 sm:min-h-[156px]">
            <a
              href="/"
              aria-label="MADV — inicio"
              className="flex justify-center"
            >
              <img
                src="/assets/images/LogoMADV.svg"
                alt="MADV, repositorio de videojuegos"
                width="140"
                height="126"
                className="block h-auto w-[290px] sm:w-[190px]"
              />
            </a>
            <span
              className={`${semi} text-center text-[10px] uppercase text-[#363636]`}
            >
              Repositorio de videojuegos
            </span>
          </header>

          <div className="flex min-h-[560px] flex-col justify-center py-16 sm:min-h-[600px] sm:py-20">
            <p className={`${semi} text-[11px] uppercase text-[#287b86]`}>
              Proyectos · comunidad · videojuegos
            </p>
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
                className={`${semi} inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] bg-[#171827] px-5 text-[13px] text-white transition hover:bg-[#287b86] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171827]`}
              >
                Repositorio abierto
                <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                onClick={onOpenGallery}
                className={`${semi} inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] border border-[#363636]/35 px-5 text-[13px] text-[#171827] transition hover:bg-white/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171827]`}
              >
                Saber más del proyecto
                <span aria-hidden="true">↓</span>
              </button>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-[#363636]/20 pt-5">
              <p className={`${reg} text-[12px] text-[#4f4e59]`}>
                <span className={`${semi} mr-2 text-[#171827]`}>
                  {String(projects.length).padStart(2, "0")}
                </span>
                proyectos abiertos
              </p>
              <p className={`${reg} text-[12px] text-[#4f4e59]`}>
                <span className={`${semi} mr-2 text-[#171827]`}>
                  {String(openNeeds).padStart(2, "0")}
                </span>
                oportunidades de colaboración
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="sobre-madv"
        className="scroll-mt-8 px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
      >
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-6 border-b border-[#171827]/15 pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div>
              <p className={`${semi} text-[11px] uppercase text-[#d9533f]`}>
                Sobre MADV
              </p>
              <h2
                className={`${semi} mt-3 max-w-[520px] text-[30px] leading-[1.12] text-[#171827] sm:text-[38px]`}
              >
                Un punto de encuentro para crear en comunidad.
              </h2>
            </div>
            <p
              className={`${reg} max-w-[620px] self-end text-[14px] leading-[1.7] text-[#4f4e59]`}
            >
              MADV reúne proyectos de videojuegos en distintas etapas con
              personas que quieren aportar sus habilidades. Cada ficha muestra
              su avance, herramientas y necesidades para que puedas conocer el
              contexto antes de contactar con el equipo.
            </p>
          </div>

          <div className="mt-8">
            <p className={`${semi} mb-2 text-[10px] uppercase text-[#6b6a73]`}>
              En el repositorio
            </p>
            {projects.map((project, index) => (
              <article
                key={project.id}
                className="grid gap-2 border-t border-[#171827]/10 py-5 sm:grid-cols-[56px_1fr_auto] sm:items-center sm:gap-5"
              >
                <span
                  className={`${semi} text-[11px] text-[#d9533f]`}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className={`${semi} text-[18px] text-[#171827]`}>
                    {project.title}
                  </h3>
                  <p className={`${reg} mt-1 text-[12px] text-[#6b6a73]`}>
                    {project.eyebrow}
                  </p>
                </div>
                <p className={`${semi} text-[11px] text-[#287b86]`}>
                  {project.stage} · {project.progress}%
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
