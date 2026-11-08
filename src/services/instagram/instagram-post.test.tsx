// @vitest-environment jsdom

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import InstagramPostCard from "@/components/instagram/InstagramPostCard"

import {
  formatPostDate,
  isAllowedInstagramImageUrl,
  parseInstagramPostHtml,
  parseInstagramPostUrl,
} from "./instagram-post"

// Etiquetas reales que Instagram devolvió para https://www.instagram.com/p/BsOGulcndj-/
// al user-agent de vista previa de enlaces (recortadas a lo que usa el parser).
const realPreviewHtml = `<!DOCTYPE html><html><head>
<meta property="og:type" content="article" />
<meta name="description" content="60M likes, 4M comments - world_record_egg on January 4, 2019: &quot;Let&#x2019;s set a world record together and get the most liked post on Instagram. Beating the current world record held by Kylie Jenner (18 million)! We got this &#x1f64c;\n\n#LikeTheEgg #EggSoldiers #EggGang&quot;. " />
<meta property="og:title" content="Just An Egg &#x1f95a; on Instagram: &quot;Let&#x2019;s set a world record together and get the most liked post on Instagram. Beating the current world record held by Kylie Jenner (18 million)! We got this &#x1f64c;\n\n#LikeTheEgg #EggSoldiers #EggGang&quot;" />
<meta property="og:image" content="https://scontent.cdninstagram.com/v/t51.82787-15/625727639_n.jpg?stp=dst-jpg_e35_s640x640_tt6&amp;_nc_cat=104" />
<meta property="og:url" content="https://www.instagram.com/world_record_egg/p/BsOGulcndj-/" />
<meta property="og:description" content="60M likes, 4M comments - world_record_egg on January 4, 2019: &quot;Let&#x2019;s set a world record together and get the most liked post on Instagram. Beating the current world record held by Kylie Jenner (18 million)! We got this &#x1f64c;\n\n#LikeTheEgg #EggSoldiers #EggGang&quot;. " />
</head><body></body></html>`

describe("parseInstagramPostUrl", () => {
  it.each([
    ["https://www.instagram.com/p/BsOGulcndj-/", "p"],
    ["https://www.instagram.com/p/BsOGulcndj-", "p"],
    ["https://instagram.com/p/BsOGulcndj-/?igsh=MTA2Z2V4&utm_source=qr", "p"],
    ["https://www.instagram.com/world_record_egg/p/BsOGulcndj-/", "p"],
    ["https://www.instagram.com/reel/BsOGulcndj-/", "reel"],
  ])("accepts %s", (url, kind) => {
    expect(parseInstagramPostUrl(url)).toEqual({
      kind,
      shortcode: "BsOGulcndj-",
      canonicalUrl: `https://www.instagram.com/${kind}/BsOGulcndj-/`,
    })
  })

  it.each([
    "",
    "not a url",
    "http://www.instagram.com/p/BsOGulcndj-/",
    "https://evil.example/p/BsOGulcndj-/",
    "https://www.instagram.com.evil.example/p/BsOGulcndj-/",
    "https://www.instagram.com/gdd_col/",
    "https://www.instagram.com/p/../../etc/",
    "https://user:pw@www.instagram.com/p/BsOGulcndj-/",
  ])("rejects %s", (url) => {
    expect(parseInstagramPostUrl(url)).toBeNull()
  })
})

describe("parseInstagramPostHtml", () => {
  const parsedUrl = parseInstagramPostUrl(
    "https://www.instagram.com/p/BsOGulcndj-/",
  )!

  it("reads author, date, caption and image from the public preview tags", () => {
    expect(parseInstagramPostHtml(realPreviewHtml, parsedUrl)).toEqual({
      permalink: "https://www.instagram.com/p/BsOGulcndj-/",
      shortcode: "BsOGulcndj-",
      username: "world_record_egg",
      displayName: "Just An Egg 🥚",
      caption:
        "Let’s set a world record together and get the most liked post on Instagram. Beating the current world record held by Kylie Jenner (18 million)! We got this 🙌\n\n#LikeTheEgg #EggSoldiers #EggGang",
      publishedOn: "2019-01-04",
      imageUrl:
        "https://scontent.cdninstagram.com/v/t51.82787-15/625727639_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=104",
    })
  })

  it("returns null for a login or error page without post tags", () => {
    expect(
      parseInstagramPostHtml(
        '<meta property="og:title" content="Instagram" />',
        parsedUrl,
      ),
    ).toBeNull()
  })
})

describe("helpers", () => {
  it("only allows Instagram/Meta CDN images over HTTPS", () => {
    expect(
      isAllowedInstagramImageUrl("https://scontent.cdninstagram.com/v/a.jpg"),
    ).toBe(true)
    expect(
      isAllowedInstagramImageUrl("https://scontent-bog1-1.xx.fbcdn.net/a.jpg"),
    ).toBe(true)
    expect(
      isAllowedInstagramImageUrl("http://scontent.cdninstagram.com/a.jpg"),
    ).toBe(false)
    expect(
      isAllowedInstagramImageUrl("https://cdninstagram.com.evil.example/a.jpg"),
    ).toBe(false)
  })

  it("formats the publication date in Spanish", () => {
    expect(formatPostDate("2019-01-04")).toBe("4 de enero de 2019")
    expect(formatPostDate(null)).toBe("Instagram")
  })
})

describe("InstagramPostCard", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
      configurable: true,
      value: true,
    })
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query.includes("reduce"),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    )
    container = document.createElement("div")
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  })

  it("renders nothing when no post URL is configured", async () => {
    await act(async () =>
      root.render(<InstagramPostCard result={{ status: "empty" }} />),
    )
    expect(container.innerHTML).toBe("")
  })

  it("renders the real post without a like counter and links to it", async () => {
    const metadata = parseInstagramPostHtml(
      realPreviewHtml,
      parseInstagramPostUrl("https://www.instagram.com/p/BsOGulcndj-/")!,
    )!
    const { imageUrl: _imageUrl, ...post } = metadata

    await act(async () =>
      root.render(
        <InstagramPostCard
          result={{
            status: "ok",
            post: { ...post, image: "data:image/jpeg;base64,AAAA" },
          }}
        />,
      ),
    )

    const card = container.querySelector('article[data-variant="instagram"]')
    expect(card?.textContent).toContain("world_record_egg")
    expect(card?.textContent).toContain("#LikeTheEgg")
    expect(card?.textContent).toContain("4 de enero de 2019")
    expect(card?.textContent).not.toMatch(/\blikes\b/)
    expect(card?.querySelector("img[src^='data:image/jpeg']")).not.toBeNull()

    const link = container.querySelector("a")
    expect(link?.getAttribute("href")).toBe(
      "https://www.instagram.com/p/BsOGulcndj-/",
    )
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer")
  })

  it("falls back to a plain link when the post could not be loaded", async () => {
    await act(async () =>
      root.render(
        <InstagramPostCard
          result={{
            status: "error",
            url: "https://www.instagram.com/p/BsOGulcndj-/",
            message: "HTTP 429",
          }}
        />,
      ),
    )

    expect(container.querySelector("article")).toBeNull()
    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      "https://www.instagram.com/p/BsOGulcndj-/",
    )
  })
})
