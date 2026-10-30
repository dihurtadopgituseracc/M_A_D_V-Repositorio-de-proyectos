import { semi, reg } from "@/constants/styles"
import { projects } from "@/data/projects"
import ProjectCard from "@/components/projects/ProjectCard"
import type { Project } from "@/types/project"
export default function RepositoryPage({
  onOpen,
  onBack,
}: {
  onOpen: (project: Project) => void
  onBack: () => void
}) {
  const openNeeds = projects.reduce(
    (total, project) =>
      total + project.needs.filter((need) => need.status !== "proposed").length,
    0,
  )

  return (
    <main className="min-h-[100dvh] w-full bg-[#eff8ee] px-3 pb-14 pt-8 sm:px-6 sm:pt-12 lg:px-10 lg:pb-20">
      <header className="-mx-3 -mt-8 mb-7 bg-[#b7ff3c] px-3 pb-6 pt-8 sm:-mx-6 sm:-mt-12 sm:mb-10 sm:px-6 sm:pt-12 lg:-mx-10 lg:px-10">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#363636]/15 pb-4">
            <button
              type="button"
              onClick={onBack}
              className={`${semi} inline-flex min-h-10 items-center gap-2 text-[12px] text-[#10261c] hover:text-[#126b43] focus-visible:outline-2 focus-visible:outline-offset-2`}
            >
              <span aria-hidden="true">←</span>
              Volver a MADV
            </button>
            <span className={`${semi} text-[11px] text-[#10261c]`}>
              PROYECTOS
            </span>
          </div>
          <div className="flex flex-col justify-between gap-5 border-b border-[#10261c]/20 pb-6 sm:flex-row sm:items-end">
            <div>
              <p
                className={`${semi} text-[12px] uppercase tracking-[0.18em] text-[#126b43]`}
              >
                Proyectos abiertos a colaboración
              </p>
              <h1
                className={`${semi} mt-4 max-w-2xl text-[34px] tracking-[-0.03em] text-[#10261c] sm:text-[44px]`}
              >
                Encuentra dónde aportar
              </h1>
            </div>
            <p
              className={`${reg} max-w-[360px] text-[16px] leading-[1.5] text-[#244b38] sm:text-right`}
            >
              Explora proyectos de videojuegos, conoce qué necesitan y descubre
              una forma concreta de sumarte.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-3 rounded-[10px] border border-[#d6ead2] bg-white px-3 py-2.5 shadow-[0_4px_14px_rgba(16,38,28,0.08)]">
              <span
                className="flex shrink-0 gap-1"
                aria-label={`${projects.length} proyectos abiertos`}
              >
                {String(projects.length)
                  .padStart(2, "0")
                  .split("")
                  .map((digit, index) => (
                    <span
                      key={`${digit}-${index}`}
                      className={`${semi} grid size-12 place-items-center rounded-[6px] bg-[#eff8ee] text-[28px] text-[#10261c]`}
                    >
                      {digit}
                    </span>
                  ))}
              </span>
              <span
                className={`${reg} max-w-[150px] text-[14px] leading-[1.25] text-[#244b38]`}
              >
                proyectos abiertos
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-[10px] border border-[#d6ead2] bg-white px-3 py-2.5 shadow-[0_4px_14px_rgba(16,38,28,0.08)]">
              <span
                className="flex shrink-0 gap-1"
                aria-label={`${openNeeds} oportunidades para aportar`}
              >
                {String(openNeeds)
                  .padStart(2, "0")
                  .split("")
                  .map((digit, index) => (
                    <span
                      key={`${digit}-${index}`}
                      className={`${semi} grid size-12 place-items-center rounded-[6px] bg-[#eff8ee] text-[28px] text-[#10261c]`}
                    >
                      {digit}
                    </span>
                  ))}
              </span>
              <span
                className={`${reg} max-w-[180px] text-[14px] leading-[1.25] text-[#244b38]`}
              >
                oportunidades para aportar
              </span>
            </div>
          </div>
        </div>
      </header>

      <section
        className="mx-auto grid max-w-[1120px] grid-cols-1 gap-7 lg:grid-cols-2"
        aria-label="Proyectos activos"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={() => onOpen(project)}
            onCollaborate={() => onOpen(project)}
          />
        ))}
      </section>
    </main>
  )
}
