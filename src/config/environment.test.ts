import { describe, expect, it } from "vitest"

import { resolveEnvironment } from "./environment"

describe("resolveEnvironment", () => {
  it("defaults safely to local mode when variables are absent", () => {
    expect(resolveEnvironment(undefined, undefined)).toEqual({
      analyticsMode: "local",

      apiBaseUrl: null,
    })
  })

  it("enables API mode only with a valid HTTP base URL", () => {
    expect(
      resolveEnvironment("api", "https://analytics.example.test/"),
    ).toEqual({
      analyticsMode: "api",

      apiBaseUrl: "https://analytics.example.test",
    })
  })

  it.each([
    ["missing URL", undefined],

    ["invalid URL", "not-a-url"],

    ["non-HTTP URL", "file:///tmp/api"],

    ["embedded credentials", "https://user:secret@example.test"],
  ])("falls back to local mode for %s", (_label, apiBaseUrl) => {
    expect(resolveEnvironment("api", apiBaseUrl)).toEqual({
      analyticsMode: "local",

      apiBaseUrl: null,
    })
  })
})
