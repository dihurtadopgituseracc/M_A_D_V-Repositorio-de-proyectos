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
  return (
    <main className="min-h-[100dvh] w-full bg-[#f6f3ea] px-3 pb-14 pt-8 sm:px-6 sm:pt-12 lg:px-10 lg:pb-20">
      <header className="-mx-3 -mt-8 mb-7 bg-[#f0cb82] px-3 pb-6 pt-8 sm:-mx-6 sm:-mt-12 sm:mb-10 sm:px-6 sm:pt-12 lg:-mx-10 lg:px-10">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#363636]/15 pb-4">
            <button
              type="button"
              onClick={onBack}
              className={`${semi} inline-flex min-h-10 items-center gap-2 text-[12px] text-[#171827] hover:text-[#287b86] focus-visible:outline-2 focus-visible:outline-offset-2`}
            >
              <span aria-hidden="true">←</span>
              Volver a MADV
            </button>
            <span className={`${semi} text-[11px] text-[#171827]`}>MADV</span>
          </div>
          <div className="flex flex-col justify-between gap-5 border-b border-[#363636]/15 pb-6 sm:flex-row sm:items-end">
            <div>
              <p
                className={`${semi} text-[11px] uppercase tracking-[0.18em] text-[#363636]`}
              >
                Repositorio abierto
              </p>
              <h1
                className={`${semi} mt-2 max-w-2xl text-[34px] tracking-[-0.03em] text-[#363636] sm:text-[44px]`}
              >
                Proyectos que buscan nuevas manos
              </h1>
            </div>
            <p
              className={`${reg} max-w-[330px] text-[13px] leading-[1.5] text-[#555555] sm:text-right`}
            >
              Explora prototipos activos, conoce su avance y encuentra una
              colaboración concreta.
            </p>
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
            onCollaborate={() => onOpen(project)}
          />
        ))}
      </section>
    </main>
  )
}


