export type AnalyticsMode = "local" | "api"

export type Environment = {
  analyticsMode: AnalyticsMode

  apiBaseUrl: string | null
}

/**
 * Acepta una URL absoluta HTTP(S) o una ruta relativa al sitio (por ejemplo `/`),
 * que se resuelve contra `relativeTo` para enviar eventos al mismo origen.
 */
function normalizeApiBaseUrl(
  value: string | undefined,

  relativeTo: string | undefined,
): string | null {
  const trimmed = value?.trim()

  if (!trimmed) return null

  const isRelativePath = trimmed.startsWith("/") && !trimmed.startsWith("//")

  if (isRelativePath && !relativeTo) return null

  try {
    const url = isRelativePath
      ? new URL(`.${trimmed}`, relativeTo)
      : new URL(trimmed)

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

  relativeTo?: string,
): Environment {
  const normalizedApiBaseUrl = normalizeApiBaseUrl(apiBaseUrl, relativeTo)

  const analyticsMode: AnalyticsMode =
    mode?.trim().toLowerCase() === "api" && normalizedApiBaseUrl
      ? "api"
      : "local"

  return {
    analyticsMode,

    apiBaseUrl: analyticsMode === "api" ? normalizedApiBaseUrl : null,
  }
}

function currentSiteUrl(): string | undefined {
  if (typeof window === "undefined") return undefined

  return new URL(import.meta.env.BASE_URL, window.location.origin).toString()
}

export const environment = resolveEnvironment(
  import.meta.env.VITE_ANALYTICS_MODE,

  import.meta.env.VITE_API_BASE_URL,

  currentSiteUrl(),
)
