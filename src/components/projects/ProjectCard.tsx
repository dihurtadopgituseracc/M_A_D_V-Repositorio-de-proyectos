import { semi, reg, instr, wdth } from "@/constants/styles"
import type { Project } from "@/types/project"
import ArtPlaceholder from "@/components/common/ArtPlaceholder"
import Tag from "@/components/common/Tag"
import { trackCollaborateClick } from "@/services/analytics/analytics.service"

export default function ProjectCard({
  project,
  onOpen,
  onCollaborate,
}: {
  project: Project
  onOpen: () => void
  onCollaborate: () => void
}) {
  const confirmedNeeds = project.needs.filter(
    (need) => need.status !== "proposed",
  )
  const hasProposedNeeds = project.needs.some(
    (need) => need.status === "proposed",
  )

  return (
    <article className="group relative isolate flex h-full flex-col rounded-[24px] border border-[#c7e8c5] bg-[#e5f3e3] p-2 shadow-[0_18px_45px_rgba(16,38,28,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(16,38,28,0.15)]">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Abrir detalles de ${project.title}`}
        className="absolute inset-0 z-0 cursor-pointer rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#126b43]"
      />
      <div className="pointer-events-none relative z-10 flex h-full flex-col">
        <div className="px-4 pb-3 pt-4 sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <p
              className={`${semi} text-[10px] uppercase tracking-[0.14em] text-[#126b43]`}
            >
              {project.stage}
            </p>
            <p className={`${reg} text-[11px] text-[#6b6a73]`}>
              {project.progress === null
                ? "Avance por confirmar"
                : `${project.progress}% completado`}
            </p>
          </div>
          <h2
            className={`${semi} mt-2 text-[24px] text-[#171827] sm:text-[26px]`}
          >
            {project.title}
          </h2>
          <p className={`${reg} mt-1 text-[12px] text-[#416451]`}>
            {project.eyebrow}
          </p>
        </div>
        <ArtPlaceholder
          project={project}
          className="transition duration-500 group-hover:brightness-105"
        />
        <div className="flex flex-1 flex-col px-3 pb-3 pt-5 sm:px-4">
          <h3 className={`${semi} text-[20px] text-[#10261c]`}>
            En pocas palabras
          </h3>
          <p
            className={`${reg} mt-2 text-pretty text-[12px] leading-[1.45] text-[#416451]`}
          >
            {project.summary}
          </p>
          <div className="mt-5">
            <p className={`${semi} text-[15px] text-[#171827]`}>Herramientas</p>
            <p
              className={`${instr} mt-1 text-[18px] text-[#6b6a73]`}
              style={wdth}
            >
              {project.tools.map((tool) => tool.detail).join(" · ")}
            </p>
          </div>
          <div className="mt-4">
            <p className={`${semi} text-[15px] text-[#171827]`}>Etiquetas</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
          <div className="mt-auto pt-5">
            <div className="flex min-h-[96px] items-center justify-between gap-4 rounded-[18px] bg-[#10261c] px-4 py-4">
              <div>
                <p className={`${semi} text-[16px] text-white`}>
                  {confirmedNeeds.length > 0
                    ? "¿Te interesa aportar?"
                    : hasProposedNeeds
                      ? "Perfiles sugeridos"
                      : "Oportunidad por confirmar"}
                </p>
                <p className={`${reg} mt-1.5 text-[12px] text-[#d9f1d4]`}>
                  {confirmedNeeds.length > 0
                    ? "Conoce el proyecto y sus necesidades"
                    : hasProposedNeeds
                      ? "Conoce el proyecto y sus necesidades"
                      : "Conoce el proyecto y sus necesidades"}
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirmedNeeds.length > 0) {
                    trackCollaborateClick(project.id, "project_card")
                  }
                  onCollaborate()
                }}
                className={`${semi} pointer-events-auto relative z-20 min-h-10 shrink-0 rounded-[8px] bg-[#b7ff3c] px-4 text-[11px] text-[#10261c] shadow-[0_5px_16px_rgba(183,255,60,0.24)] transition hover:bg-[#d0ff79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95`}
                aria-label={`Ver resumen de ${project.title}`}
              >
                {confirmedNeeds.length > 0
                  ? "VER MÁS"
                  : hasProposedNeeds
                    ? "VER MÁS"
                    : "VER MÁS"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
