import { describe, expect, it } from "vitest"

import { projects } from "@/data/projects"

import type { AnalyticsEvent } from "./analytics.types"

import {
  buildVisitsReport,
  parseStoredEvents,
  renderVisitsReportHtml,
  toStoredLine,
} from "./visits-report"

const project = projects.find((candidate) => candidate.needs.length > 0)!
const need = project.needs[0]!

const at = (minute: number) =>
  `2026-11-05T03:${String(minute).padStart(2, "0")}:00.000Z`

const events: AnalyticsEvent[] = [
  { event_name: "repository_view", category: "page_view", occurred_at: at(1) },
  {
    event_name: "project_view",
    category: "page_view",
    occurred_at: at(2),
    project_id: project.id,
  },
  {
    event_name: "project_view",
    category: "page_view",
    occurred_at: at(3),
    project_id: project.id,
  },
  {
    event_name: "need_view",
    category: "page_view",
    occurred_at: at(4),
    project_id: project.id,
    need_id: need.id,
  },
  {
    event_name: "collaborate_click",
    category: "click",
    occurred_at: at(5),
    project_id: project.id,
    target_id: "project_interest",
  },
]

const jsonl = events
  .map((event, index) => toStoredLine(event, new Date(at(10 + index))))
  .join("")

describe("visits report", () => {
  it("round-trips stored lines and skips corrupt or invalid ones", () => {
    const content = `${jsonl}not json\n{"event_name":"project_view","category":"page_view","occurred_at":"${at(1)}","project_id":"unknown","received_at":"${at(1)}"}\n\n`

    const parsed = parseStoredEvents(content)

    expect(parsed.events).toHaveLength(events.length)
    expect(parsed.events[0]).toEqual({ ...events[0], received_at: at(10) })
    expect(parsed.skippedLines).toBe(2)
  })

  it("counts page views and clicks by project, need and target", () => {
    const { events: stored } = parseStoredEvents(jsonl)
    const report = buildVisitsReport(stored, projects)

    expect(report.totalPageViews).toBe(4)
    expect(report.totalClicks).toBe(1)
    expect(report.repositoryViews).toBe(1)
    expect(report.projectViews).toEqual([
      { projectId: project.id, title: project.title, count: 2 },
    ])
    expect(report.needViews).toEqual([
      {
        projectId: project.id,
        needId: need.id,
        label: `${project.title} / ${need.name}`,
        count: 1,
      },
    ])
    expect(report.clicks).toEqual([
      {
        label: `collaborate_click / project_interest / ${project.title}`,
        count: 1,
      },
    ])
    expect(report.firstReceivedAt).toBe(at(10))
    expect(report.lastReceivedAt).toBe(at(14))
  })

  it("renders an escaped plain-text HTML page, including the empty state", () => {
    const empty = renderVisitsReportHtml(buildVisitsReport([], []))

    expect(empty).toContain("Vistas de pagina totales: 0")
    expect(empty).toContain("sin registros")

    const malicious = buildVisitsReport([], [])
    malicious.clicks.push({ label: "<script>x</script>", count: 1 })

    const html = renderVisitsReportHtml(malicious)

    expect(html).not.toContain("<script>")
    expect(html).toContain("&lt;script&gt;")
  })
})
