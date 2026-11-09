import { useEffect, useRef, useState } from "react"
import { FaInstagram } from "react-icons/fa6"

import { reg, semi } from "@/constants/styles"
import { instagramPostUrl } from "@/data/instagram-post"
import {
  INSTAGRAM_ORIGIN,
  instagramEmbedUrl,
  parseInstagramPostUrl,
  readEmbedHeight,
} from "@/services/instagram/instagram-post"

/** Altura inicial del iframe hasta que Instagram anuncia la real (post vertical con descripción). */
const DEFAULT_EMBED_HEIGHT = 720
const MAX_EMBED_HEIGHT = 2000

function InstagramPostLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${semi} group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-[12px] bg-tinta px-6 text-[16px] text-white shadow-[0_14px_30px_-14px_rgba(23,24,39,0.7)] transition hover:-translate-y-0.5 hover:bg-turquesa focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-tinta motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
    >
      <FaInstagram aria-hidden="true" className="size-6 shrink-0" />
      Ver publicación en Instagram
      <span
        aria-hidden="true"
        className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
      >
        {"\u2197\uFE0E"}
      </span>
      <span className="sr-only">(se abre en una pestaña nueva)</span>
    </a>
  )
}

/**
 * Embed oficial de Instagram del post configurado en `src/data/instagram-post.ts`.
 * El navegador lo carga directamente desde Instagram; el proyecto no descarga ni guarda
 * la imagen ni el texto. Instagram dibuja la imagen en su proporción real y la descripción.
 */
export default function InstagramPostCard({
  url = instagramPostUrl,
}: {
  url?: string
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(DEFAULT_EMBED_HEIGHT)
  const parsed = parseInstagramPostUrl(url)

  // El embed anuncia su altura con postMessage; solo se aceptan mensajes de este iframe.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== INSTAGRAM_ORIGIN) return
      if (event.source !== iframeRef.current?.contentWindow) return
      const next = readEmbedHeight(event.data)
      if (next) setHeight(Math.min(next, MAX_EMBED_HEIGHT))
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  if (!url.trim()) return null

  if (!parsed) {
    return import.meta.env.DEV ? (
      <p className={`${reg} text-center text-[13px] text-coral`} role="status">
        El enlace de src/data/instagram-post.ts no es un post público de
        Instagram (se espera https://www.instagram.com/p/&lt;código&gt;/).
      </p>
    ) : null
  }

  return (
    <div className="flex w-full max-w-[400px] flex-col items-center gap-4">
      <iframe
        ref={iframeRef}
        src={instagramEmbedUrl(parsed)}
        title="Publicación de Instagram del siguiente evento"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        scrolling="no"
        style={{ height }}
        className="block w-full overflow-hidden rounded-[12px] border border-tinta/15 bg-white"
      />
      <InstagramPostLink href={parsed.canonicalUrl} />
    </div>
  )
}
