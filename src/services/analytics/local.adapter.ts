import type { AnalyticsAdapter, AnalyticsEvent } from "./analytics.types"

export class LocalAnalyticsAdapter implements AnalyticsAdapter {
  private readonly events: AnalyticsEvent[] = []

  async send(event: AnalyticsEvent): Promise<void> {
    this.events.push(event)

    if (import.meta.env.DEV) {
      console.info("[analytics:local]", event)
    }
  }

  getEvents(): readonly AnalyticsEvent[] {
    return this.events.map((event) => ({ ...event }))
  }

  clear(): void {
    this.events.length = 0
  }
}

export const localAnalyticsAdapter = new LocalAnalyticsAdapter()
