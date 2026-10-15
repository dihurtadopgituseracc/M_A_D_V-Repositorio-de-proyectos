import type { Contact, Need, Project } from "@/types/project"

import { projects } from "@/data/projects"

export type ProjectId = Project["id"]

export type NeedId = Need["id"]

export type ContactTargetId = Contact["type"]

export type CollaborateTargetId = "project_card" | "project_interest" | "need_contribution"

export type AnalyticsEventCategory = "page_view" | "click"

type AnalyticsEventBase<EventName extends string,
Category extends AnalyticsEventCategory,> = {
  event_name: EventName

  category: Category

  occurred_at: string
}

export type RepositoryViewEvent = AnalyticsEventBase<"repository_view", "page_view">

export type ProjectViewEvent = AnalyticsEventBase<"project_view", "page_view"> & {
  project_id: ProjectId
}

export type NeedViewEvent = AnalyticsEventBase<"need_view", "page_view"> & {
  project_id: ProjectId

  need_id: NeedId
}

export type ProjectCardCollaborateClickEvent = AnalyticsEventBase<"collaborate_click", "click"> & {
  project_id: ProjectId

  target_id: "project_card"
}

export type ProjectInterestClickEvent = AnalyticsEventBase<"collaborate_click", "click"> & {
  project_id: ProjectId

  target_id: "project_interest"
}

export type NeedContributionClickEvent = AnalyticsEventBase<"collaborate_click", "click"> & {
  project_id: ProjectId

  target_id: "need_contribution"

  need_id: NeedId
}

export type CollaborateClickEvent = ProjectCardCollaborateClickEvent | ProjectInterestClickEvent | NeedContributionClickEvent

export type ContactClickEvent = AnalyticsEventBase<"contact_click", "click"> & {
  project_id: ProjectId

  target_id: ContactTargetId
}

export type AnalyticsEvent = RepositoryViewEvent | ProjectViewEvent | NeedViewEvent | CollaborateClickEvent | ContactClickEvent

type RepositoryViewInput = Pick<RepositoryViewEvent, "event_name">
type ProjectViewInput = Pick<ProjectViewEvent, "event_name" | "project_id">
type NeedViewInput = Pick<NeedViewEvent, "event_name" | "project_id" | "need_id">
type ProjectCardCollaborateInput = Pick<ProjectCardCollaborateClickEvent, "event_name" | "project_id" | "target_id">
type ProjectInterestInput = Pick<ProjectInterestClickEvent, "event_name" | "project_id" | "target_id">
type NeedContributionInput = Pick<NeedContributionClickEvent, "event_name" | "project_id" | "target_id" | "need_id">
type ContactClickInput = Pick<ContactClickEvent, "event_name" | "project_id" | "target_id">

export type AnalyticsEventInput = RepositoryViewInput | ProjectViewInput | NeedViewInput | ProjectCardCollaborateInput | ProjectInterestInput | NeedContributionInput | ContactClickInput

export interface AnalyticsAdapter {
  send(event: AnalyticsEvent): Promise<void>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function hasOnlyKeys(
  value: Record<string, unknown>,

  allowedKeys: readonly string[],
): boolean {
  return Object.keys(value).every((key) => allowedKeys.includes(key))
}

function hasValidTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false

  const timestamp = Date.parse(value)

  return (
    Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value
  )
}

function findProject(projectId: unknown): Project | undefined {
  return typeof projectId === "string"
    ? projects.find((project) => project.id === projectId)
    : undefined
}

function hasNeed(project: Project, needId: unknown): needId is NeedId {
  return (
    typeof needId === "string" &&
    project.needs.some((need) => need.id === needId)
  )
}

export function isAnalyticsEvent(value: unknown): value is AnalyticsEvent {
  if (
    !isRecord(value) ||
    !hasValidTimestamp(value.occurred_at) ||
    typeof value.event_name !== "string"
  ) {
    return false
  }

  const commonKeys = ["event_name", "category", "occurred_at"]

  switch (value.event_name) {
    case "repository_view":
      return value.category === "page_view" && hasOnlyKeys(value, commonKeys)

    case "project_view":
      return (
        value.category === "page_view" &&
        !!findProject(value.project_id) &&
        hasOnlyKeys(value, [...commonKeys, "project_id"])
      )

    case "need_view": {
      const project = findProject(value.project_id)

      return (
        value.category === "page_view" &&
        !!project &&
        hasNeed(project, value.need_id) &&
        hasOnlyKeys(value, [...commonKeys, "project_id", "need_id"])
      )
    }

    case "collaborate_click": {
      const project = findProject(value.project_id)

      if (!project || value.category !== "click") return false

      if (value.target_id === "need_contribution") {
        return (
          hasNeed(project, value.need_id) &&
          hasOnlyKeys(value, [
            ...commonKeys,
            "project_id",
            "target_id",
            "need_id",
          ])
        )
      }

      return (
        (value.target_id === "project_card" ||
          value.target_id === "project_interest") &&
        hasOnlyKeys(value, [...commonKeys, "project_id", "target_id"])
      )
    }

    case "contact_click": {
      const project = findProject(value.project_id)

      return (
        value.category === "click" &&
        !!project &&
        typeof value.target_id === "string" &&
        project.contacts.some((contact) => contact.type === value.target_id) &&
        hasOnlyKeys(value, [...commonKeys, "project_id", "target_id"])
      )
    }

    default:
      return false
  }
}
