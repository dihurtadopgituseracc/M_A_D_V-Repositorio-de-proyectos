import { projects } from "@/data/projects"

import { environment } from "@/config/environment"

import { ApiAnalyticsAdapter } from "./api.adapter"

import { localAnalyticsAdapter } from "./local.adapter"

import {
  isAnalyticsEvent,
  type AnalyticsAdapter,
  type AnalyticsEvent,
  type AnalyticsEventInput,
  type ProjectId,
  type NeedId,
  type ContactTargetId,
  type CollaborateTargetId,
} from "./analytics.types"

export interface AnalyticsService {
  track(input: AnalyticsEventInput): void
}

function createEvent(
  input: AnalyticsEventInput,
  occurredAt: string,
): AnalyticsEvent {
  switch (input.event_name) {
    case "repository_view":
      return { ...input, category: "page_view", occurred_at: occurredAt }

    case "project_view":

    case "need_view":
      return { ...input, category: "page_view", occurred_at: occurredAt }

    case "collaborate_click":

    case "contact_click":
      return { ...input, category: "click", occurred_at: occurredAt }
  }
}

function reportError(error: unknown): void {
  if (import.meta.env.DEV) {
    console.warn(
      "[analytics] Event delivery failed; the UI will continue.",
      error,
    )
  }
}

export function createAnalyticsService(
  adapter: AnalyticsAdapter,

  now: () => Date = () => new Date(),
): AnalyticsService {
  return {
    track(input) {
      const event = createEvent(input, now().toISOString())

      if (!isAnalyticsEvent(event)) {
        if (import.meta.env.DEV) {
          console.warn("[analytics] Rejected malformed event.", event)
        }

        return
      }

      try {
        void adapter.send(event).catch(reportError)
      } catch (error) {
        reportError(error)
      }
    },
  }
}

const adapter =
  environment.analyticsMode === "api" && environment.apiBaseUrl
    ? new ApiAnalyticsAdapter(environment.apiBaseUrl)
    : localAnalyticsAdapter

export const analytics = createAnalyticsService(adapter)

export function trackRepositoryView(): void {
  analytics.track({ event_name: "repository_view" })
}

export function trackProjectView(projectId: ProjectId): void {
  analytics.track({ event_name: "project_view", project_id: projectId })
}

export function trackNeedView(projectId: ProjectId, needId: NeedId): void {
  analytics.track({
    event_name: "need_view",

    project_id: projectId,

    need_id: needId,
  })
}

export function trackCollaborateClick(
  projectId: ProjectId,

  targetId: Exclude<CollaborateTargetId, "need_contribution">,
): void

export function trackCollaborateClick(
  projectId: ProjectId,

  targetId: "need_contribution",

  needId: NeedId,
): void

export function trackCollaborateClick(
  projectId: ProjectId,

  targetId: CollaborateTargetId,

  needId?: NeedId,
): void {
  if (targetId === "need_contribution" && needId) {
    analytics.track({
      event_name: "collaborate_click",

      project_id: projectId,

      target_id: targetId,

      need_id: needId,
    })
  } else if (targetId !== "need_contribution") {
    analytics.track({
      event_name: "collaborate_click",

      project_id: projectId,

      target_id: targetId,
    })
  }
}

export function trackContactClick(
  projectId: ProjectId,

  targetId: ContactTargetId,
): void {
  analytics.track({
    event_name: "contact_click",

    project_id: projectId,

    target_id: targetId,
  })
}

export function trackCurrentPageView(search = window.location.search): void {
  const params = new URLSearchParams(search)
  const projectId = params.get("proyecto")

  const project = projects.find((candidate) => candidate.id === projectId)

  if (project) {
    trackProjectView(project.id)
  } else if (params.get("vista") === "repository") {
    trackRepositoryView()
  }
}
