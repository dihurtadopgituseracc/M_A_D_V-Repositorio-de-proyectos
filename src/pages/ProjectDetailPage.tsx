import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { semi, reg } from "@/constants/styles"
import ArtPlaceholder from "@/components/common/ArtPlaceholder"
import Progress from "@/components/common/Progress"
import Tag from "@/components/common/Tag"
import ToolCard from "@/components/common/ToolCard"
import NeedCard from "@/components/needs/NeedCard"
import type { Need, Project } from "@/types/project"
import {
  trackCollaborateClick,
  trackNeedView,
} from "@/services/analytics/analytics.service"
export default function ProjectDetailPage({
  project,
  onBack,
  onOpenNeed,
}: {
  project: Project
  onBack: () => void
  onOpenNeed: (need: Need, index: number) => void
}) {
  const [interestSent, setInterestSent] = useState(false)
  const shareUrl = new URL(window.location.href)
  shareUrl.search = ""
  shareUrl.searchParams.set("proyecto", project.id)

  return (
    <main className="min-h-[100dvh] w-full bg-[#f6f3ea] px-3 pb-16 pt-4 sm:px-6 sm:pt-7 lg:px-10 lg:pb-20">
      <div className="mx-auto max-w-[1120px]">
        <button
          onClick={onBack}
          className={`${semi} group inline-flex min-h-10 items-center gap-2 rounded-full pr-4 text-[14px] text-[#171827] transition hover:bg-white hover:text-[#287b86] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287b86]`}
        >
          <span className="grid size-8 place-items-center rounded-full bg-white text-[20px] shadow-sm transition group-hover:-translate-x-0.5">
            ‹
          </span>
          Proyectos
        </button>

        <div className="mt-3 flex flex-col justify-between gap-3 border-b border-[#171827]/10 pb-5 sm:flex-row sm:items-end">
          <div>
            <p
              className={`${semi} text-[10px] uppercase tracking-[0.16em] text-[#287b86]`}
            >
              {project.eyebrow}
            </p>
            <h1
              className={`${semi} mt-2 text-[30px] tracking-[-0.02em] text-[#171827] sm:text-[40px]`}
            >
              {project.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_0.75fr] lg:gap-7">
          <div>
            <ArtPlaceholder
              project={project}
              className="min-h-[230px] sm:min-h-[320px]"
            />
            <div className="px-2 pt-5 sm:px-3">
              <h2 className={`${semi} text-[22px] text-[#171827]`}>
                Proyecto en 6 líneas
              </h2>
              <p
                className={`${reg} mt-3 max-w-[760px] text-pretty text-[13px] leading-[1.6] text-[#6b6a73]`}
              >
                {project.summary}
              </p>
            </div>
          </div>

          <aside className="h-fit rounded-[20px] border border-[#171827]/[0.04] bg-white p-5 shadow-[0_16px_40px_rgba(23,24,39,0.05)] sm:p-6 lg:sticky lg:top-6">
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-1">
              <div>
                <p
                  className={`${semi} text-[10px] tracking-[0.12em] text-[#6b6a73]`}
                >
                  ETAPA ACTUAL
                </p>
                <p className={`${semi} mt-1 text-[16px] text-[#171827]`}>
                  {project.stage}
                </p>
              </div>
              <div>
                <p
                  className={`${semi} text-[10px] tracking-[0.12em] text-[#6b6a73]`}
                >
                  ESTADO ACTUAL
                </p>
                <p
                  className={`${semi} mt-1 text-[15px] leading-snug text-[#171827]`}
                >
                  {project.status}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-[#171827]/10 pt-5">
              <div className="flex items-end justify-between gap-3">
                <p className={`${reg} text-[12px] text-[#6b6a73]`}>
                  {project.genre} · {project.team} integrantes
                </p>
                <p className={`${semi} text-[22px] text-[#171827]`}>
                  {project.progress}%
                </p>
              </div>
              <div className="mt-3">
                <Progress value={project.progress} />
              </div>
              <p className={`${reg} mt-2 text-[11px] text-[#6b6a73]`}>
                Avance general del proyecto
              </p>
            </div>

            <div className="mt-6 border-t border-[#171827]/10 pt-5">
              <div className="flex items-center gap-4">
                <QRCodeSVG
                  value={shareUrl.toString()}
                  size={112}
                  level="M"
                  includeMargin
                  bgColor="#ffffff"
                  fgColor="#363636"
                  title={`Código QR para ${project.title}`}
                />
                <div>
                  <p className={`${semi} text-[12px] text-[#171827]`}>
                    Compartir proyecto
                  </p>
                  <p
                    className={`${reg} mt-1 text-[11px] leading-[1.5] text-[#6b6a73]`}
                  >
                    Escanea para abrir {project.shortTitle} directamente.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-9 lg:grid-cols-[0.75fr_1.25fr] lg:gap-7">
          <div>
            <p
              className={`${semi} text-[10px] uppercase tracking-[0.16em] text-[#d9533f]`}
            >
              Flujo de trabajo
            </p>
            <h2 className={`${semi} mt-2 text-[22px] text-[#171827]`}>
              Herramientas
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {project.tools.map((tool) => (
                <ToolCard key={tool.area} tool={tool} />
              ))}
            </div>
          </div>

          <div>
            <p
              className={`${semi} text-[10px] uppercase tracking-[0.16em] text-[#d9533f]`}
            >
              Colaboraciones abiertas
            </p>
            <h2 className={`${semi} mt-2 text-[22px] text-[#171827]`}>
              ¿Qué necesita el proyecto?
            </h2>
            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              {project.needs.map((need, index) => (
                <NeedCard
                  key={`${need.name}-${need.detail}`}
                  need={need}
                  index={index}
                  onOpen={() => {
                    trackNeedView(project.id, need.id)
                    onOpenNeed(need, index)
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="mt-10 flex flex-col justify-between gap-5 rounded-[22px] bg-[#171827] px-6 py-6 sm:flex-row sm:items-center sm:px-8"
          aria-live="polite"
        >
          <div>
            <p className={`${semi} text-[18px] text-white`}>
              {interestSent
                ? "Tu interés quedó registrado"
                : "¿Tu perfil encaja con el proyecto?"}
            </p>
            <p className={`${reg} mt-1 text-[12px] text-[#e9e7df]`}>
              {interestSent
                ? `El equipo de ${project.title} ya puede revisar tu solicitud.`
                : "Comparte tu interés y el equipo podrá ponerse en contacto."}
            </p>
          </div>
          <button
            onClick={() => {
              trackCollaborateClick(project.id, "project_interest")
              setInterestSent(true)
            }}
            disabled={interestSent}
            className={`${semi} min-h-11 rounded-[9px] px-5 text-[12px] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              interestSent
                ? "cursor-default bg-white/15 text-white"
                : "bg-[#d9533f] text-[#171827] hover:bg-[#e5634d] active:scale-95"
            }`}
          >
            {interestSent ? "INTERÉS REGISTRADO" : "MOSTRAR INTERÉS"}
          </button>
        </section>
      </div>
    </main>
  )
}
