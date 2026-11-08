import type { Project } from "@/types/project"

import { isAnalyticsEvent, type AnalyticsEvent } from "./analytics.types"

/** Evento persistido por el servidor: el evento del cliente más la hora de recepción. */
export type StoredAnalyticsEvent = AnalyticsEvent & { received_at: string }

export type VisitsReport = {
  totalPageViews: number
  totalClicks: number
  repositoryViews: number
  projectViews: { projectId: string title: string count: number }[]
  needViews: { projectId: string needId: string label: string count: number }[]
  clicks: { label: string count: number }[]
  firstReceivedAt: string | null
  lastReceivedAt: string | null
  skippedLines: number
}

/** Convierte un evento validado en la línea JSONL que se guarda en disco. */
export function toStoredLine(event: AnalyticsEvent, receivedAt: Date): string {
  return `${JSON.stringify({ ...event, received_at: receivedAt.toISOString() })}\n`
}

/** Lee el contenido JSONL y descarta líneas corruptas o que ya no cumplen el contrato. */
export function parseStoredEvents(
  content: string,
): {
  events: StoredAnalyticsEvent[]
  skippedLines: number
} {
  const events: StoredAnalyticsEvent[] = []
  let skippedLines = 0

  for (const line of content.split("\n")) {
    if (!line.trim()) continue

    try {
      const { received_at: receivedAt, ...event } = JSON.parse(
        line,
      ) as Record<string, unknown>

      if (typeof receivedAt === "string" && isAnalyticsEvent(event)) {
        events.push({ ...event, received_at: receivedAt })
      } else {
        skippedLines++
      }
    } catch {
      skippedLines++
    }
  }

  return { events, skippedLines }
}

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1)
}

function byCountDesc<T extends { count: number }>(a: T, b: T): number {
  return b.count - a.count
}

export function buildVisitsReport(
  events: readonly StoredAnalyticsEvent[],
  catalog: readonly Project[],
  skippedLines = 0,
): VisitsReport {
  const projectCounts = new Map<string, number>()
  const needCounts = new Map<string, number>()
  const clickCounts = new Map<string, number>()
  let repositoryViews = 0
  let totalPageViews = 0
  let totalClicks = 0

  const projectTitle = (id: string) =>
    catalog.find((project) => project.id === id)?.title ?? id

  const needName = (projectId: string, needId: string) =>
    catalog
      .find((project) => project.id === projectId)
      ?.needs.find((need) => need.id === needId)?.name ?? needId

  for (const event of events) {
    switch (event.event_name) {
      case "repository_view":
        totalPageViews++
        repositoryViews++
        break
      case "project_view":
        totalPageViews++
        increment(projectCounts, event.project_id)
        break
      case "need_view":
        totalPageViews++
        increment(needCounts, `${event.project_id}\u0000${event.need_id}`)
        break
      case "collaborate_click":
      case "contact_click":
        totalClicks++
        increment(
          clickCounts,
          `${event.event_name} / ${event.target_id} / ${projectTitle(event.project_id)}`,
        )
        break
    }
  }

  const receivedTimes = events.map((event) => event.received_at).sort()

  return {
    totalPageViews,
    totalClicks,
    repositoryViews,
    projectViews: [...projectCounts]
      .map(([projectId, count]) => ({
        projectId,
        title: projectTitle(projectId),
        count,
      }))
      .sort(byCountDesc),
    needViews: [...needCounts]
      .map(([key, count]) => {
        const [projectId = "", needId = ""] = key.split("\u0000")
        return {
          projectId,
          needId,
          label: `${projectTitle(projectId)} / ${needName(projectId, needId)}`,
          count,
        }
      })
      .sort(byCountDesc),
    clicks: [...clickCounts]
      .map(([label, count]) => ({ label, count }))
      .sort(byCountDesc),
    firstReceivedAt: receivedTimes[0] ?? null,
    lastReceivedAt: receivedTimes[receivedTimes.length - 1] ?? null,
    skippedLines,
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function renderVisitsReportText(report: VisitsReport): string {
  const lines: string[] = [
    "DASHBOARD DE VISITAS - MADV",
    "",
    `Vistas de pagina totales: ${report.totalPageViews}`,
    `Clics totales:            ${report.totalClicks}`,
    `Primer registro:          ${report.firstReceivedAt ?? "sin registros"}`,
    `Ultimo registro:          ${report.lastReceivedAt ?? "sin registros"}`,
    "",
    `Repositorio (listado):    ${report.repositoryViews}`,
    "",
    "Vistas por proyecto:",
  ]

  const list = (rows: { label: string count: number }[]) => {
    if (rows.length === 0) lines.push("  (ninguna)")
    for (const row of rows)
      lines.push(`  ${String(row.count).padStart(5)}  ${row.label}`)
  }

  list(
    report.projectViews.map((row) => ({ label: row.title, count: row.count })),
  )
  lines.push("", "Vistas por necesidad:")
  list(report.needViews)
  lines.push("", "Clics (evento / destino / proyecto):")
  list(report.clicks)

  if (report.skippedLines > 0) {
    lines.push(
      "",
      `Lineas descartadas por formato invalido: ${report.skippedLines}`,
    )
  }

  return lines.join("\n")
}

export function renderVisitsReportHtml(report: VisitsReport): string {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="robots" content="noindex, nofollow" />
<title>Dashboard de visitas</title>
</head>
<body>
<pre>${escapeHtml(renderVisitsReportText(report))}</pre>
</body>
</html>
`
}
