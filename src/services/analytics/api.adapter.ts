import type { AnalyticsAdapter, AnalyticsEvent } from "./analytics.types"

export class AnalyticsHttpError extends Error {
  constructor(readonly status: number) {
    super(`Analytics API returned HTTP ${status}`)

    this.name = "AnalyticsHttpError"
  }
}

export class ApiAnalyticsAdapter implements AnalyticsAdapter {
  private readonly endpoint: string

  constructor(
    apiBaseUrl: string,

    // Envolver `fetch` evita "Illegal invocation": el navegador exige que se
    // llame sin otro objeto como `this`.
    private readonly fetchImplementation: typeof fetch = (input, init) =>
      fetch(input, init),
  ) {
    const baseUrl = new URL(apiBaseUrl)

    if (baseUrl.protocol !== "http:" && baseUrl.protocol !== "https:") {
      throw new TypeError("Analytics API base URL must use HTTP or HTTPS")
    }

    if (baseUrl.username || baseUrl.password) {
      throw new TypeError(
        "Credentials must not be included in the API base URL",
      )
    }

    this.endpoint = `${apiBaseUrl.replace(/\/+$/, "")}/api/events`
  }

  async send(event: AnalyticsEvent): Promise<void> {
    const response = await this.fetchImplementation(this.endpoint, {
      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(event),

      keepalive: true,
    })

    if (!response.ok) {
      throw new AnalyticsHttpError(response.status)
    }
  }
}
