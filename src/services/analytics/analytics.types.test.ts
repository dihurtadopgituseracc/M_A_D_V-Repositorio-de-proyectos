import { describe, expect, it } from "vitest"

import { projects } from "@/data/projects"

import { isAnalyticsEvent } from "./analytics.types"

const occurredAt = "2026-10-14T12:00:00.000Z"

const project = projects[0]!

const need = project.needs[0]!

function event(overrides: Record<string, unknown> = {}) {
  return {
    event_name: "project_view",

    category: "page_view",

    occurred_at: occurredAt,

    project_id: project.id,

    ...overrides,
  }
}

describe("isAnalyticsEvent", () => {
  it("accepts each supported event category and validates catalog IDs", () => {
    expect(
      isAnalyticsEvent({
        event_name: "repository_view",

        category: "page_view",

        occurred_at: occurredAt,
      }),
    ).toBe(true)

    expect(isAnalyticsEvent(event())).toBe(true)

    expect(
      isAnalyticsEvent(
        event({
          event_name: "need_view",

          need_id: need.id,
        }),
      ),
    ).toBe(true)

    expect(
      isAnalyticsEvent(
        event({
          event_name: "collaborate_click",

          category: "click",

          target_id: "need_contribution",

          need_id: need.id,
        }),
      ),
    ).toBe(true)

    expect(
      isAnalyticsEvent(
        event({
          event_name: "contact_click",

          category: "click",

          target_id: project.contacts[0]!.type,
        }),
      ),
    ).toBe(true)
  })

  it.each([
    ["unknown project", event({ project_id: "invented-project" })],

    [
      "unknown need",
      event({ event_name: "need_view", need_id: "invented-need" }),
    ],

    [
      "need belonging to another project",
      event({
        event_name: "need_view",

        need_id: projects[1]!.needs[0]!.id,
      }),
    ],

    ["invalid timestamp", event({ occurred_at: "yesterday" })],

    ["wrong category", event({ category: "click" })],

    ["unsupported event", event({ event_name: "conversion" })],

    ["unexpected personal data", event({ email: "person@example.test" })],

    [
      "missing need ID",
      event({
        event_name: "collaborate_click",

        category: "click",

        target_id: "need_contribution",
      }),
    ],
  ])("rejects %s", (_label, candidate) => {
    expect(isAnalyticsEvent(candidate)).toBe(false)
  })
})
