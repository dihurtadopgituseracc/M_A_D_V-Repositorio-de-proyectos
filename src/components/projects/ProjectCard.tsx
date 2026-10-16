import { semi, reg, instr, wdth } from "@/constants/styles"
import type { Project } from "@/types/project"
import ArtPlaceholder from "@/components/common/ArtPlaceholder"
import Tag from "@/components/common/Tag"
import { trackCollaborateClick } from "@/services/analytics/analytics.service"

export default function ProjectCard({
  project,
  onCollaborate,
}: {
  project: Project
  onCollaborate: () => void
}) {
  return (
    <article className="group flex h-full flex-col rounded-[24px] border border-white/70 bg-[#dededc] p-2 shadow-[0_18px_45px_rgba(23,24,39,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(23,24,39,0.12)]">
      <div className="px-4 pb-3 pt-4 sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <p
            className={`${semi} text-[10px] uppercase tracking-[0.14em] text-[#287b86]`}
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
        <p className={`${reg} mt-1 text-[12px] text-[#6b6a73]`}>
          {project.eyebrow}
        </p>
      </div>
      <ArtPlaceholder
        project={project}
        className="transition duration-500 group-hover:brightness-105"
      />
      <div className="flex flex-1 flex-col px-3 pb-3 pt-5 sm:px-4">
        <h3 className={`${semi} text-[20px] text-[#171827]`}>
          Proyecto en 6 líneas
        </h3>
        <p
          className={`${reg} mt-2 text-pretty text-[12px] leading-[1.45] text-[#6b6a73]`}
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
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="mt-auto pt-5">
          <div className="flex min-h-[96px] items-center justify-between gap-4 rounded-[18px] bg-[#171827] px-4 py-4">
            <div>
              <p className={`${semi} text-[16px] text-white`}>
                {project.needs.length > 0
                  ? "¿Te interesa aportar?"
                  : "Oportunidad por confirmar"}
              </p>
              <p className={`${reg} mt-1.5 text-[12px] text-[#e9e7df]`}>
                {project.needs.length > 0
                  ? "Conoce el proyecto y sus necesidades"
                  : "El equipo confirmará las tareas abiertas"}
              </p>
            </div>
            <button
              onClick={() => {
                if (project.needs.length > 0) {
                  trackCollaborateClick(project.id, "project_card")
                }
                onCollaborate()
              }}
              className={`${semi} min-h-10 shrink-0 rounded-[8px] bg-[#d9533f] px-4 text-[11px] text-[#171827] shadow-[0_5px_16px_rgba(217,83,63,0.24)] transition hover:bg-[#e5634d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95`}
              aria-label={`Ver resumen de ${project.title}`}
            >
              {project.needs.length > 0 ? "COLABORAR" : "VER PROYECTO"}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
