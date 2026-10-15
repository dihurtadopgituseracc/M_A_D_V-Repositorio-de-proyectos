export type AnalyticsMode = "local" | "api"

export type Environment = {
  analyticsMode: AnalyticsMode

  apiBaseUrl: string | null
}

function normalizeApiBaseUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null

  try {
    const url = new URL(value.trim())

    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      return null
    }

    return url.toString().replace(/\/+$/, "")
  } catch {
    return null
  }
}

export function resolveEnvironment(
  mode: string | undefined,

  apiBaseUrl: string | undefined,
): Environment {
  const normalizedApiBaseUrl = normalizeApiBaseUrl(apiBaseUrl)

  const analyticsMode: AnalyticsMode =
    mode?.trim().toLowerCase() === "api" && normalizedApiBaseUrl
      ? "api"
      : "local"

  return {
    analyticsMode,

    apiBaseUrl: analyticsMode === "api" ? normalizedApiBaseUrl : null,
  }
}

export const environment = resolveEnvironment(
  import.meta.env.VITE_ANALYTICS_MODE,

  import.meta.env.VITE_API_BASE_URL,
)
