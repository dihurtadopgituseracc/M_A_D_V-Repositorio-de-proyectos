import { useRef, useState } from "react"
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

function createQrPngBlob(svg: SVGSVGElement): Promise<Blob> {
  const svgBlob = new Blob([new XMLSerializer().serializeToString(svg)], {
    type: "image/svg+xml;charset=utf-8",
  })
  const svgUrl = URL.createObjectURL(svgBlob)

  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(svgUrl)

      const canvas = document.createElement("canvas")
      const scale = 4
      canvas.width = image.naturalWidth * scale
      canvas.height = image.naturalHeight * scale

      const context = canvas.getContext("2d")
      if (!context) {
        reject(new Error("No se pudo preparar la imagen del código QR."))
        return
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("No se pudo crear la imagen del código QR."))
        }
      }, "image/png")
    }

    image.onerror = () => {
      URL.revokeObjectURL(svgUrl)
      reject(new Error("No se pudo cargar el código QR para exportarlo."))
    }

    image.src = svgUrl
  })
}

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
  const [qrMessage, setQrMessage] = useState("")
  const confirmedNeeds = project.needs.filter(
    (need) => need.status !== "proposed",
  )
  const hasProposedNeeds = project.needs.some(
    (need) => need.status === "proposed",
  )
  const qrContainerRef = useRef<HTMLDivElement>(null)
  const shareUrl = new URL(window.location.href)
  shareUrl.search = ""
  shareUrl.searchParams.set("proyecto", project.id)
  const qrFilename = `codigo-qr-${project.id}.png`

  const getQrPng = async () => {
    const svg = qrContainerRef.current?.querySelector("svg")
    if (!svg) throw new Error("No se encontró el código QR.")
    return createQrPngBlob(svg)
  }

  const downloadQr = async () => {
    try {
      const png = await getQrPng()
      const imageUrl = URL.createObjectURL(png)
      const link = document.createElement("a")
      link.href = imageUrl
      link.download = qrFilename
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(imageUrl), 1000)
      setQrMessage("El código QR se descargó como imagen PNG.")
    } catch (error) {
      setQrMessage(
        error instanceof Error
          ? error.message
          : "No se pudo descargar la imagen del código QR.",
      )
    }
  }

  const shareQr = async () => {
    try {
      if (!navigator.share || !navigator.canShare) {
        setQrMessage(
          "Este navegador no permite compartir imágenes directamente. Descarga el QR para compartirlo.",
        )
        return
      }

      const png = await getQrPng()
      const file = new File([png], qrFilename, { type: "image/png" })
      if (!navigator.canShare({ files: [file] })) {
        setQrMessage(
          "Este navegador no permite compartir imágenes directamente. Descarga el QR para compartirlo.",
        )
        return
      }

      await navigator.share({
        files: [file],
        title: `Código QR de ${project.title}`,
        text: `Escanea para abrir ${project.shortTitle}.`,
      })
      setQrMessage("El código QR está listo para compartir.")
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      setQrMessage(
        error instanceof Error
          ? error.message
          : "No se pudo compartir la imagen del código QR.",
      )
    }
  }

  return (
    <main className="min-h-[100dvh] w-full bg-[#f6f3ea] px-3 pb-16 pt-4 sm:px-6 sm:pt-7 lg:px-10 lg:pb-20">
      <div className="mx-auto max-w-[1120px]">
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
                  {project.genre} ·{" "}
                  {project.team === null
                    ? "Equipo por confirmar"
                    : `${project.team} integrantes`}
                </p>
                <p className={`${semi} text-[22px] text-[#171827]`}>
                  {project.progress === null
                    ? "Por confirmar"
                    : `${project.progress}%`}
                </p>
              </div>
              {project.progress !== null && (
                <div className="mt-3">
                  <Progress value={project.progress} />
                </div>
              )}
              <p className={`${reg} mt-2 text-[11px] text-[#6b6a73]`}>
                {project.progress === null
                  ? "Avance general por confirmar con el equipo"
                  : "Avance general del proyecto"}
              </p>
            </div>

            <div className="mt-6 border-t border-[#171827]/10 pt-5">
              <div className="flex items-center gap-4">
                <div ref={qrContainerRef} className="shrink-0">
                  <QRCodeSVG
                    value={shareUrl.toString()}
                    size={112}
                    level="M"
                    includeMargin
                    bgColor="#ffffff"
                    fgColor="#363636"
                    title={`Código QR para ${project.title}`}
                  />
                </div>
                <div>
                  <p className={`${semi} text-[12px] text-[#171827]`}>
                    Compartir código QR
                  </p>
                  <p
                    className={`${reg} mt-1 text-[11px] leading-[1.5] text-[#6b6a73]`}
                  >
                    Descarga o comparte la imagen para que otras personas puedan
                    abrir {project.shortTitle}.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={shareQr}
                  className={`${semi} min-h-10 rounded-full bg-[#171827] px-4 text-[11px] text-white transition hover:bg-[#287b86] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287b86]`}
                >
                  Compartir QR
                </button>
                <button
                  type="button"
                  onClick={downloadQr}
                  className={`${semi} min-h-10 rounded-full border border-[#171827]/20 px-4 text-[11px] text-[#171827] transition hover:bg-[#f6f3ea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287b86]`}
                >
                  Descargar PNG
                </button>
              </div>
              {qrMessage && (
                <p
                  role="status"
                  className={`${reg} mt-3 text-[11px] leading-[1.5] text-[#287b86]`}
                >
                  {qrMessage}
                </p>
              )}
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
              {confirmedNeeds.length > 0
                ? "Colaboraciones abiertas"
                : hasProposedNeeds
                  ? "Propuestas por confirmar"
                  : "Colaboraciones"}
            </p>
            <h2 className={`${semi} mt-2 text-[22px] text-[#171827]`}>
              ¿Qué necesita el proyecto?
            </h2>
            {project.needs.length > 0 ? (
              <>
                {hasProposedNeeds && (
                  <p className={`${reg} mt-3 text-[13px] text-[#6b6a73]`}>
                    Propuestas basadas en la matriz; el equipo debe confirmar su
                    vigencia y alcance.
                  </p>
                )}
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
              </>
            ) : (
              <p className={`${reg} mt-3 text-[13px] text-[#6b6a73]`}>
                Las tareas abiertas y el tipo de apoyo están por confirmar con
                el equipo.
              </p>
            )}
          </div>
        </section>

        {confirmedNeeds.length > 0 ? (
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
        ) : hasProposedNeeds ? (
          <section className="mt-10 rounded-[22px] bg-[#171827] px-6 py-6 sm:px-8">
            <p className={`${semi} text-[18px] text-white`}>
              Propuestas por confirmar
            </p>
            <p className={`${reg} mt-1 text-[12px] text-[#e9e7df]`}>
              Estas ideas no son vacantes confirmadas. El equipo debe validar
              las necesidades antes de abrir colaboraciones.
            </p>
          </section>
        ) : (
          <section className="mt-10 rounded-[22px] bg-[#171827] px-6 py-6 sm:px-8">
            <p className={`${semi} text-[18px] text-white`}>
              Oportunidad de colaboración por confirmar
            </p>
            <p className={`${reg} mt-1 text-[12px] text-[#e9e7df]`}>
              El equipo aún debe confirmar qué tareas están abiertas y qué tipo
              de apoyo necesita.
            </p>
          </section>
        )}
      </div>
    </main>
  )
}
