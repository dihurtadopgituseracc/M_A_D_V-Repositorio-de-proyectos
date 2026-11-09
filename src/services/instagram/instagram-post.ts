// Validación del enlace de una publicación pública de Instagram y armado de la URL de su
// embed oficial. No descarga nada: el navegador carga el embed directamente desde Instagram.

export type ParsedInstagramUrl = {
  kind: "p" | "reel" | "tv"
  shortcode: string
  canonicalUrl: string
}

const INSTAGRAM_HOSTS = new Set([
  "instagram.com",
  "www.instagram.com",
  "m.instagram.com",
])

/** Origen desde el que el iframe del embed envía sus mensajes de altura. */
export const INSTAGRAM_ORIGIN = "https://www.instagram.com"

/** Acepta /p/<code>/, /reel/<code>/, /tv/<code>/ y la forma /<usuario>/p/<code>/. */
export function parseInstagramPostUrl(raw: string): ParsedInstagramUrl | null {
  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    return null
  }

  if (url.protocol !== "https:" || !INSTAGRAM_HOSTS.has(url.hostname))
    return null
  if (url.username || url.password || url.port) return null

  const segments = url.pathname.split("/").filter(Boolean)
  const kindIndex = segments.findIndex((segment) =>
    ["p", "reel", "tv"].includes(segment),
  )
  if (kindIndex < 0 || kindIndex > 1) return null

  const kind = segments[kindIndex] as ParsedInstagramUrl["kind"]
  const shortcode = segments[kindIndex + 1] ?? ""
  if (!/^[A-Za-z0-9_-]{5,40}$/.test(shortcode)) return null
  if (segments.length > kindIndex + 2) return null

  return {
    kind,
    shortcode,
    canonicalUrl: `${INSTAGRAM_ORIGIN}/${kind}/${shortcode}/`,
  }
}

/** URL del embed oficial con la descripción del post ("captioned"). */
export function instagramEmbedUrl(parsed: ParsedInstagramUrl): string {
  return `${parsed.canonicalUrl}embed/captioned/`
}

/**
 * Lee la altura que el embed de Instagram anuncia con postMessage
 * (`{"type":"MEASURE","details":{"height":N}}`, como texto JSON u objeto).
 * Devuelve null si el mensaje no tiene esa forma.
 */
export function readEmbedHeight(data: unknown): number | null {
  let message: unknown = data
  if (typeof data === "string") {
    try {
      message = JSON.parse(data)
    } catch {
      return null
    }
  }

  if (!message || typeof message !== "object") return null
  const { type, details } = message as { type?: unknown; details?: unknown }
  if (type !== "MEASURE" || !details || typeof details !== "object") return null

  const height = (details as { height?: unknown }).height
  return typeof height === "number" && Number.isFinite(height) && height > 0
    ? Math.ceil(height)
    : null
}
