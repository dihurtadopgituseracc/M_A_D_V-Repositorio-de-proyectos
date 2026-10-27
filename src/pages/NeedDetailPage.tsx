import { useState } from "react"
import { semi, reg } from "@/constants/styles"
import SocialIcon from "@/components/common/SocialIcon"
import ToolCard from "@/components/common/ToolCard"
import type { Need, Project } from "@/types/project"
import {
  trackCollaborateClick,
  trackContactClick,
} from "@/services/analytics/analytics.service"
export default function NeedDetailPage({
  project,
  need,
  index,
  onBack,
}: {
  project: Project
  need: Need
  index: number
  onBack: () => void
}) {
  const [contributionSent, setContributionSent] = useState(false)
  const isProposed = need.status === "proposed"

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
          Resumen del proyecto
        </button>

        <header className="mt-3 border-b border-[#171827]/10 pb-6">
          <p
            className={`${semi} text-[10px] uppercase tracking-[0.16em] text-[#287b86]`}
          >
            {project.eyebrow}
          </p>
          <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className={`${semi} text-[15px] text-[#6b6a73]`}>
                {project.title}
              </p>
              <h1
                className={`${semi} mt-1 text-[30px] tracking-[-0.02em] text-[#171827] sm:text-[40px]`}
              >
                ¿Qué necesita el proyecto?
              </h1>
            </div>
            <span
              className={`${semi} w-fit rounded-full bg-[#287b86]/[0.08] px-3 py-2 text-[11px] text-[#287b86]`}
            >
              {need.commitment}
            </span>
          </div>
        </header>

        {isProposed && (
          <p
            className={`${reg} mt-4 rounded-xl bg-[#f0cb82]/40 px-4 py-3 text-[12px] leading-[1.5] text-[#555555]`}
            role="note"
          >
            Propuesta inferida de la matriz; el equipo debe confirmar su
            disponibilidad y alcance. Expresar interés aquí no envía una
            solicitud al equipo.
          </p>
        )}

        <div className="mt-8 grid gap-9 lg:grid-cols-[1.25fr_0.75fr] lg:items-start lg:gap-10">
          <div className="space-y-10">
            <section>
              <p
                className={`${semi} text-[10px] uppercase tracking-[0.16em] text-[#d9533f]`}
              >
                {isProposed ? "Propuesta inferida" : "Solicitud"}
              </p>
              <h2 className={`${semi} mt-2 text-[22px] text-[#171827]`}>
                Herramientas
              </h2>
              <div className="mt-4">
                <ToolCard tool={need.tool} />
              </div>
            </section>

            <section>
              <p
                className={`${semi} text-[10px] uppercase tracking-[0.16em] text-[#d9533f]`}
              >
                Descripción
              </p>
              <div className="mt-4 grid min-h-[92px] grid-cols-[36px_1fr] items-center gap-3 rounded-[16px] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(23,24,39,0.04)] sm:grid-cols-[42px_1fr_auto]">
                <span className={`${semi} text-[11px] text-[#d9533f]`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className={`${semi} text-[15px] text-[#171827]`}>
                    {need.name}
                  </p>
                  <p className={`${reg} mt-1 text-[12px] text-[#6b6a73]`}>
                    {need.detail}
                  </p>
                </div>
                <span
                  className={`${semi} col-start-2 mt-1 w-fit rounded-full bg-[#287b86]/[0.08] px-2.5 py-1 text-[10px] text-[#287b86] sm:col-start-auto sm:mt-0`}
                >
                  {need.commitment}
                </span>
              </div>

              <div className="mt-6">
                <p
                  className={`${semi} text-[10px] uppercase tracking-[0.16em] text-[#d9533f]`}
                >
                  Detalle
                </p>
                <p
                  className={`${reg} mt-3 max-w-[720px] text-pretty text-[13px] leading-[1.6] text-[#6b6a73]`}
                >
                  {need.description}
                </p>

                <div className="mt-6 rounded-[18px] border border-[#171827]/[0.05] bg-white/55 p-5">
                  <p className={`${semi} text-[15px] text-[#171827]`}>
                    Requerimientos
                  </p>
                  <ul className="mt-4 space-y-3">
                    {need.requirements.map((requirement, requirementIndex) => (
                      <li
                        key={requirement}
                        className="grid grid-cols-[26px_1fr] items-start gap-3"
                      >
                        <span
                          className={`${semi} grid size-[22px] place-items-center rounded-full bg-[#d9533f]/10 text-[9px] text-[#d9533f]`}
                        >
                          {requirementIndex + 1}
                        </span>
                        <span
                          className={`${reg} pt-0.5 text-[13px] leading-[1.45] text-[#6b6a73]`}
                        >
                          {requirement}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-6">
            <section>
              <p
                className={`${semi} text-[10px] uppercase tracking-[0.16em] text-[#d9533f]`}
              >
                Colaborar
              </p>
              <h2 className={`${semi} mt-2 text-[22px] text-[#171827]`}>
                Entregables
              </h2>
              <div className="mt-4 rounded-[16px] border border-[#171827]/[0.04] bg-white px-5 py-4">
                <div className="flex items-center gap-4">
                  <span className="h-8 w-1 rounded-full bg-[#287b86]/70" />
                  <div>
                    <p className={`${semi} text-[15px] text-[#171827]`}>
                      {need.deliverable.name}
                    </p>
                    <p className={`${reg} mt-1 text-[12px] text-[#6b6a73]`}>
                      {need.deliverable.detail}
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  trackCollaborateClick(
                    project.id,
                    "need_contribution",
                    need.id,
                  )
                  setContributionSent(true)
                }}
                disabled={contributionSent}
                className={`${semi} mt-5 min-h-11 w-full rounded-[9px] px-5 text-[12px] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171827] ${
                  contributionSent
                    ? "cursor-default bg-[#171827] text-white"
                    : "bg-[#d9533f] text-[#171827] hover:bg-[#e5634d] active:scale-[0.99]"
                }`}
              >
                {contributionSent
                  ? "INTERÉS REGISTRADO"
                  : isProposed
                    ? "EXPRESAR INTERÉS"
                    : "APORTAR"}
              </button>
              {contributionSent && (
                <p
                  className={`${reg} mt-3 text-center text-[11px] text-[#6b6a73]`}
                  role="status"
                >
                  {isProposed
                    ? "El interés quedó marcado en esta interfaz; el equipo aún debe validar la propuesta."
                    : "El equipo recibió tu interés en esta colaboración."}
                </p>
              )}
            </section>

            <section>
              <p
                className={`${semi} text-[10px] uppercase tracking-[0.16em] text-[#d9533f]`}
              >
                Contactos
              </p>
              <h2
                className={`${semi} mt-2 max-w-[410px] text-[22px] leading-tight text-[#171827]`}
              >
                Quiero comunicarme con los responsables del proyecto
              </h2>
              <div className="mt-4 space-y-2 rounded-[18px] border border-[#171827]/[0.04] bg-white p-3 shadow-[0_10px_30px_rgba(23,24,39,0.04)]">
                {project.contacts.map((contact) => (
                  <a
                    key={contact.type}
                    href={contact.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackContactClick(project.id, contact.type)}
                    className="group flex min-h-[62px] items-center gap-4 rounded-[13px] px-3 transition hover:bg-[#f6f3ea] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#287b86]"
                    aria-label={`Contactar por ${contact.label}`}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#287b86]/[0.09] text-[#287b86] transition group-hover:bg-[#287b86] group-hover:text-white">
                      <SocialIcon type={contact.type} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`${semi} block text-[14px] text-[#171827]`}
                      >
                        {contact.label}
                      </span>
                      <span
                        className={`${reg} mt-0.5 block truncate text-[11px] text-[#6b6a73]`}
                      >
                        {contact.handle}
                      </span>
                    </span>
                    <span className="text-[18px] text-[#6b6a73] transition group-hover:translate-x-0.5 group-hover:text-[#171827]">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}
