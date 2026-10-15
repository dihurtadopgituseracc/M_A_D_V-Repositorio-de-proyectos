import type { Project } from "@/types/project"
import { semi } from "@/constants/styles"

export default function ArtPlaceholder({
  project,
  className = "",
}: {
  project: Project
  className?: string
}) {
  return (
    <div
      className={`project-art relative flex min-h-[190px] items-center justify-center overflow-hidden rounded-[20px] ${className}`}
      style={{ backgroundColor: project.accent }}
      aria-label={`Espacio para el arte de ${project.title}`}
    >
      <div className="project-art__orb project-art__orb--one" />
      <div className="project-art__orb project-art__orb--two" />
      <div className="relative z-10 max-w-[260px] px-6 text-center">
        <span className={`${semi} block text-[10px] tracking-[0.18em] text-white/60`}>
          PROYECTO
        </span>
        <p className={`${semi} mt-2 text-[14px] text-white`}>{project.artLabel}</p>
      </div>
    </div>
  )
}
