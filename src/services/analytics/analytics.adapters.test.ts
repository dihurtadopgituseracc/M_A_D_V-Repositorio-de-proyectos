import { afterEach, describe, expect, it, vi } from "vitest"

import { projects } from "@/data/projects"

import type { AnalyticsAdapter, AnalyticsEvent } from "./analytics.types"

import { ApiAnalyticsAdapter, AnalyticsHttpError } from "./api.adapter"

import { LocalAnalyticsAdapter } from "./local.adapter"

import { createAnalyticsService } from "./analytics.service"

const project = projects[0]!

const event: AnalyticsEvent = {
  event_name: "project_view",

  category: "page_view",

  occurred_at: "2026-10-14T12:00:00.000Z",

  project_id: project.id,
}

afterEach(() => vi.restoreAllMocks())

describe("analytics adapters and service", () => {
  it("records local events in memory for development inspection", () => {
    const adapter = new LocalAnalyticsAdapter()

    const service = createAnalyticsService(
      adapter,
      () => new Date(event.occurred_at),
    )

    service.track({ event_name: "project_view", project_id: project.id })

    expect(adapter.getEvents()).toEqual([event])

    adapter.clear()

    expect(adapter.getEvents()).toEqual([])
  })

  it("rejects malformed events before sending them", () => {
    const send = vi.fn(async () => {})

    const service = createAnalyticsService(
      { send },
      () => new Date(event.occurred_at),
    )

    service.track({ event_name: "project_view", project_id: "unknown-project" })

    expect(send).not.toHaveBeenCalled()
  })

  it("does not throw or block callers when an adapter fails", async () => {
    const adapter: AnalyticsAdapter = {
      send: async () => {
        throw new Error("network unavailable")
      },
    }

    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    const service = createAnalyticsService(
      adapter,
      () => new Date(event.occurred_at),
    )

    expect(() =>
      service.track({
        event_name: "project_view",

        project_id: project.id,
      }),
    ).not.toThrow()

    await Promise.resolve()

    expect(warn).toHaveBeenCalledOnce()
  })

  it("posts the event to the configured endpoint without credentials", async () => {
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(null, { status: 202 }),
    )

    const adapter = new ApiAnalyticsAdapter(
      "https://analytics.example.test/",

      fetchMock as typeof fetch,
    )

    await adapter.send(event)

    expect(fetchMock).toHaveBeenCalledOnce()

    const [url, init] = fetchMock.mock.calls[0]!

    expect(url).toBe("https://analytics.example.test/api/events")

    expect(init).toMatchObject({
      method: "POST",

      headers: { "Content-Type": "application/json" },

      keepalive: true,
    })

    expect(JSON.parse(init?.body as string)).toEqual(event)

    expect(init).not.toHaveProperty("credentials")
  })

  it("calls the global fetch without rebinding it to the adapter", async () => {
    const browserLikeFetch = vi.fn(function (this: unknown) {
      if (this !== undefined && this !== globalThis) {
        throw new TypeError("Failed to execute 'fetch' on 'Window': Illegal invocation")
      }
      return Promise.resolve(new Response(null, { status: 202 }))
    })

    vi.stubGlobal("fetch", browserLikeFetch)

    try {
      await new ApiAnalyticsAdapter("https://analytics.example.test").send(event)
    } finally {
      vi.unstubAllGlobals()
    }

    expect(browserLikeFetch).toHaveBeenCalledOnce()
  })

  it("surfaces HTTP and connectivity errors to the service", async () => {
    const failedResponse = new ApiAnalyticsAdapter(
      "http://localhost:3000",

      (async () => new Response(null, { status: 503 })) as typeof fetch,
    )

    await expect(failedResponse.send(event)).rejects.toEqual(
      new AnalyticsHttpError(503),
    )

    const disconnected = new ApiAnalyticsAdapter(
      "http://localhost:3000",

      (async () => {
        throw new TypeError("Failed to fetch")
      }) as typeof fetch,
    )

    await expect(disconnected.send(event)).rejects.toThrow("Failed to fetch")
  })
})
