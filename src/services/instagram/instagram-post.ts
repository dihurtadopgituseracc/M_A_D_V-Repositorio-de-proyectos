// Lectura de una publicación pública de Instagram a partir de su enlace.
// Este módulo no usa APIs de Node ni de navegador: lo usan el plugin de Vite (que hace las
// peticiones al compilar o al servir en desarrollo) y los tests. Sin imports con "@/" porque
// vite.config.ts también lo importa.

export type InstagramPost = {
  /** Enlace canónico del post. */
  permalink: string
  shortcode: string
  /** Usuario sin @. */
  username: string
  /** Nombre visible de la cuenta; si Instagram no lo da, se usa el usuario. */
  displayName: string
  caption: string
  /** Fecha de publicación como AAAA-MM-DD, o null si no se pudo leer. */
  publishedOn: string | null
  /** Imagen como data URL (descargada al compilar) o null si no se pudo descargar. */
  image: string | null
  /** Foto de perfil como data URL, o undefined si no se pudo descargar. */
  avatar?: string
}

export type InstagramPostResult = { status: "empty" } | {
  status: "ok"
  post: InstagramPost
} | { status: "error" url: string | null message: string }

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
    canonicalUrl: `https://www.instagram.com/${kind}/${shortcode}/`,
  }
}

export function decodeHtmlEntities(value: string): string {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: "\u00a0",
  }

  return value.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
    (match, entity: string) => {
      if (entity[0] === "#") {
        const code =
          entity[1] === "x" || entity[1] === "X"
            ? Number.parseInt(entity.slice(2), 16)
            : Number.parseInt(entity.slice(1), 10)
        return Number.isFinite(code) && code >= 0 && code <= 0x10ffff
          ? String.fromCodePoint(code)
          : match
      }
      return named[entity.toLowerCase()] ?? match
    },
  )
}

/** Lee las etiquetas <meta property|name="..." content="..."> sin importar el orden de atributos. */
export function readMetaTags(html: string): Map<string, string> {
  const tags = new Map<string, string>()

  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const key = /\b(?:property|name)\s*=\s*"([^"]+)"/i.exec(tag)?.[1]
    const content = /\bcontent\s*=\s*"([^"]*)"/i.exec(tag)?.[1]
    if (key && content !== undefined && !tags.has(key)) {
      tags.set(key.toLowerCase(), decodeHtmlEntities(content))
    }
  }

  return tags
}

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
]

function parseEnglishDate(value: string): string | null {
  const match = /^([A-Za-z]+) (\d{1,2}), (\d{4})$/.exec(value.trim())
  if (!match) return null
  const month = MONTHS.indexOf(match[1]!.toLowerCase())
  if (month < 0) return null
  return `${match[3]}-${String(month + 1).padStart(2, "0")}-${match[2]!.padStart(2, "0")}`
}

/** Datos sin imágenes descargadas: lo que el HTML público dice del post. */
export type InstagramPostMetadata = Omit<InstagramPost, "image" | "avatar"> & {
  imageUrl: string | null
}

/**
 * Interpreta el HTML que Instagram entrega a los generadores de vista previa de enlaces.
 * og:description tiene la forma:
 *   `60M likes, 4M comments - usuario on January 4, 2019: "texto del post".`
 * og:title tiene la forma: `Nombre visible on Instagram: "texto del post"`.
 */
export function parseInstagramPostHtml(
  html: string,
  parsedUrl: ParsedInstagramUrl,
): InstagramPostMetadata | null {
  const meta = readMetaTags(html)
  const description =
    meta.get("og:description") ?? meta.get("description") ?? ""
  const title = meta.get("og:title") ?? ""
  const imageUrl = meta.get("og:image") ?? null

  const described =
    /^(?:.*? - )?([A-Za-z0-9._]{1,30}) on ([A-Za-z]+ \d{1,2}, \d{4}): "([\s\S]*)"\.?\s*$/.exec(
      description,
    )
  const titled = /^([\s\S]*?) on Instagram: "([\s\S]*)"\s*$/.exec(title)

  const usernameFromUrl =
    /instagram\.com\/([A-Za-z0-9._]{1,30})\/(?:p|reel|tv)\//.exec(
      meta.get("og:url") ?? "",
    )?.[1]

  const username = described?.[1] ?? usernameFromUrl ?? null
  const caption = (described?.[3] ?? titled?.[2] ?? "").trim()

  if (!username || (!caption && !imageUrl)) return null

  return {
    permalink: parsedUrl.canonicalUrl,
    shortcode: parsedUrl.shortcode,
    username,
    displayName: titled?.[1]?.trim() || username,
    caption,
    publishedOn: described ? parseEnglishDate(described[2]!) : null,
    imageUrl,
  }
}

/** Solo se descargan imágenes de los CDN de Instagram/Meta por HTTPS. */
export function isAllowedInstagramImageUrl(raw: string): boolean {
  try {
    const url = new URL(raw)
    return (
      url.protocol === "https:" &&
      (url.hostname.endsWith(".cdninstagram.com") ||
        url.hostname.endsWith(".fbcdn.net"))
    )
  } catch {
    return false
  }
}

/** "2019-01-04" → "4 de enero de 2019". */
export function formatPostDate(isoDate: string | null): string {
  if (!isoDate) return "Instagram"
  const [year, month, day] = isoDate.split("-").map(Number)
  if (!year || !month || !day) return "Instagram"
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)))
}
