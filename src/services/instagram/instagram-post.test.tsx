// @vitest-environment jsdom

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import InstagramPostCard from "@/components/instagram/InstagramPostCard"

import {
  instagramEmbedUrl,
  parseInstagramPostUrl,
  readEmbedHeight,
} from "./instagram-post"

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

describe("embed helpers", () => {
  it("builds the official captioned embed URL", () => {
    expect(
      instagramEmbedUrl(
        parseInstagramPostUrl("https://www.instagram.com/p/BsOGulcndj-/?x=1")!,
      ),
    ).toBe("https://www.instagram.com/p/BsOGulcndj-/embed/captioned/")
  })

  it("reads the height announced by the embed", () => {
    expect(
      readEmbedHeight('{"type":"MEASURE","details":{"height":812.4}}'),
    ).toBe(813)
    expect(readEmbedHeight({ type: "MEASURE", details: { height: 640 } })).toBe(
      640,
    )
    expect(readEmbedHeight('{"type":"OTHER","details":{"height":10}}')).toBe(
      null,
    )
    expect(readEmbedHeight("not json")).toBeNull()
    expect(readEmbedHeight({ type: "MEASURE", details: { height: -5 } })).toBe(
      null,
    )
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
    container = document.createElement("div")
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
  })

  it("renders nothing when no post URL is configured", async () => {
    await act(async () => root.render(<InstagramPostCard url="" />))
    expect(container.innerHTML).toBe("")
  })

  it("embeds the post from Instagram and links to it", async () => {
    await act(async () =>
      root.render(
        <InstagramPostCard url="https://www.instagram.com/p/BsOGulcndj-/?igsh=abc" />,
      ),
    )

    const iframe = container.querySelector("iframe")
    expect(iframe?.getAttribute("src")).toBe(
      "https://www.instagram.com/p/BsOGulcndj-/embed/captioned/",
    )
    expect(iframe?.getAttribute("title")).toBeTruthy()
    expect(container.querySelector("img")).toBeNull()

    const link = container.querySelector("a")
    expect(link?.getAttribute("href")).toBe(
      "https://www.instagram.com/p/BsOGulcndj-/",
    )
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer")
  })

  it("only resizes for height messages from its own Instagram iframe", async () => {
    await act(async () =>
      root.render(
        <InstagramPostCard url="https://www.instagram.com/p/BsOGulcndj-/" />,
      ),
    )
    const iframe = container.querySelector("iframe")!
    const initial = iframe.style.height
    const measure = '{"type":"MEASURE","details":{"height":900}}'

    await act(async () =>
      window.dispatchEvent(
        new MessageEvent("message", {
          data: measure,
          origin: "https://evil.example",
          source: iframe.contentWindow,
        }),
      ),
    )
    expect(iframe.style.height).toBe(initial)

    await act(async () =>
      window.dispatchEvent(
        new MessageEvent("message", {
          data: measure,
          origin: "https://www.instagram.com",
          source: iframe.contentWindow,
        }),
      ),
    )
    expect(iframe.style.height).toBe("900px")
  })
})
