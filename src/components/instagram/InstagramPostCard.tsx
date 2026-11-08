import instagramPost from "virtual:instagram-post"
import { FaInstagram } from "react-icons/fa6"

import { SocialCard } from "@/components/dimaac/social-card"
import { reg, semi } from "@/constants/styles"
import {
  formatPostDate,
  type InstagramPostResult,
} from "@/services/instagram/instagram-post"

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
 * Publicación real de Instagram en formato SocialCard. El enlace se configura en
 * `src/data/instagram-post.ts`; los datos llegan ya descargados por el plugin de Vite.
 */
export default function InstagramPostCard({
  result = instagramPost,
}: {
  result?: InstagramPostResult
}) {
  if (result.status === "empty") return null

  if (result.status === "error") {
    return (
      <div className="flex w-full max-w-[380px] flex-col items-center gap-2 text-center">
        {import.meta.env.DEV && (
          <p className={`${reg} text-[13px] text-coral`} role="status">
            No se pudo cargar el post de Instagram: {result.message}
          </p>
        )}
        {result.url && <InstagramPostLink href={result.url} />}
      </div>
    )
  }

  const { post } = result

  return (
    <div className="flex w-full max-w-[380px] flex-col items-center gap-4">
      <SocialCard
        variant="instagram"
        author={{
          name: post.displayName,
          handle: post.username,
          avatar: post.avatar,
        }}
        content={post.caption}
        image={post.image ?? undefined}
        imageAlt={`Publicación de @${post.username} en Instagram`}
        imageRatio={1}
        showLikes={false}
        timestamp={formatPostDate(post.publishedOn)}
      />
      <InstagramPostLink href={post.permalink} />
    </div>
  )
}
