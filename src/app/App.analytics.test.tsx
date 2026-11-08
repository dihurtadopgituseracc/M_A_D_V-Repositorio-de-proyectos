// @vitest-environment jsdom

import { StrictMode, act } from "react"

import { createRoot, type Root } from "react-dom/client"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { projects } from "@/data/projects"

import App from "@/app/App"

import { localAnalyticsAdapter } from "@/services/analytics/local.adapter"

import { trackCurrentPageView } from "@/services/analytics/analytics.service"

// La página de Eventos muestra el post configurado; aquí se usa uno de ejemplo
// en lugar del sustituto vacío.
vi.mock("virtual:instagram-post", () => ({
  default: {
    status: "ok",
    post: {
      permalink: "https://www.instagram.com/p/TEST12345/",
      shortcode: "TEST12345",
      username: "gdd_col",
      displayName: "Gamers, Developers & Designers",
      caption: "Taller de prueba en CYT 304",
      publishedOn: "2026-10-22",
      image: null,
    },
  },
}))

Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
  configurable: true,

  value: true,
})

let container: HTMLDivElement

let root: Root

async function renderApp(path = "/?vista=repository") {
  window.history.replaceState({}, "", path)

  trackCurrentPageView()

  await act(async () => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })

  await settleLazy()
}

// Las vistas se cargan con React.lazy; este ciclo deja que el import dinámico
// resuelva y React vuelva a renderizar, hasta que el indicador de carga
// (`data-page-loading`) desaparece del DOM.
async function settleLazy() {
  for (let i = 0; i < 50; i += 1) {
    if (!container.querySelector("[data-page-loading]")) return
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
  }
}

async function click(element: Element | null) {
  if (!element) throw new Error("Expected interactive element was not found")

  await act(async () => {
    element.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    )
  })

  await settleLazy()
}

function buttonByLabel(start: string): HTMLButtonElement | null {
  return (
    Array.from(container.querySelectorAll("button")).find((button) =>
      button.getAttribute("aria-label")?.startsWith(start),
    ) ?? null
  )
}

beforeEach(() => {
  localAnalyticsAdapter.clear()

  container = document.createElement("div")

  document.body.append(container)

  root = createRoot(container)

  vi.stubGlobal("scrollTo", vi.fn())
})

afterEach(async () => {
  await act(async () => root.unmount())

  container.remove()

  vi.unstubAllGlobals()

  localAnalyticsAdapter.clear()
})

describe("analytics interface instrumentation", () => {
  it("shows the landing and opens the repository from its CTA", async () => {
    await renderApp("/")

    expect(container.querySelector("h1")?.textContent).toContain(
      "Un repositorio abierto",
    )
    expect(localAnalyticsAdapter.getEvents()).toEqual([])

    await click(
      Array.from(container.querySelectorAll("button")).find((button) =>
        button.textContent?.includes("Saber más del proyecto"),
      ) ?? null,
    )

    expect(window.location.search).toBe("?vista=gallery")
    expect(container.querySelector("h1")?.textContent).toBe("Imágenes de MADV")
    expect(
      container.querySelectorAll('button[aria-label^="Abrir imagen"]'),
    ).toHaveLength(14)
    expect(
      Array.from(container.querySelectorAll("img")).map((image) =>
        image.getAttribute("src"),
      ),
    ).toEqual([
      "/assets/gallery/Titulo.svg",
      "/assets/gallery/Contexto1.svg",
      "/assets/gallery/Objetivos.svg",
      "/assets/gallery/Problemas.svg",
      "/assets/gallery/Metodologia.svg",
      "/assets/gallery/Testeos y desarrollo.svg",
      "/assets/gallery/Roadmap.svg",
      "/assets/gallery/Usuario.svg",
      "/assets/gallery/Contexto2.svg",
      "/assets/gallery/Entornos.svg",
      "/assets/gallery/EntornoEsp.svg",
      "/assets/gallery/Propuesta.svg",
      "/assets/gallery/ArbolProb.svg",
      "/assets/gallery/ArbustoProb.svg",
    ])
    await click(container.querySelector('button[aria-label="Abrir imagen 01"]'))
    expect(container.querySelector('[role="dialog"]')).not.toBeNull()
    expect(
      container.querySelector('[role="dialog"] .aspect-video'),
    ).not.toBeNull()
    await click(container.querySelector('button[aria-label="Cerrar visor"]'))
    expect(container.querySelector('[role="dialog"]')).toBeNull()

    await click(
      Array.from(container.querySelectorAll("button")).find((button) =>
        button.textContent?.includes("Volver a MADV"),
      ) ?? null,
    )
    expect(window.location.search).toBe("")
    expect(container.querySelector("h1")?.textContent).toContain(
      "Un repositorio abierto",
    )

    await click(buttonByLabel("Repositorio abierto"))

    expect(window.location.search).toBe("?vista=repository")
    expect(container.querySelector("h1")?.textContent).toBe(
      "Encuentra dónde aportar",
    )
    expect(localAnalyticsAdapter.getEvents()).toMatchObject([
      { event_name: "repository_view" },
    ])
    expect(localAnalyticsAdapter.getEvents()).toHaveLength(1)
  })

  it("shows the FAQ only on its own page and returns to the landing", async () => {
    await renderApp("/")

    expect(container.querySelector("details")).toBeNull()
    expect(container.textContent).not.toContain("Preguntas frecuentes")

    await act(async () => {
      root.unmount()
    })
    root = createRoot(container)
    await renderApp("/?vista=faq")

    expect(container.querySelector("h1")?.textContent).toBe(
      "Todo lo que necesitas saber para participar.",
    )
    expect(container.querySelectorAll("details")).toHaveLength(9)
    expect(localAnalyticsAdapter.getEvents()).toEqual([])

    await click(container.querySelector('button[aria-label="Volver a MADV"]'))

    expect(window.location.search).toBe("")
    expect(container.querySelector("details")).toBeNull()
  })

  it("shows where to attend GDD, the next event heading and the Instagram post", async () => {
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

    await renderApp("/?vista=events")

    expect(container.querySelector("h1")?.textContent).toBe("Eventos")
    expect(
      Array.from(container.querySelectorAll("main h2")).map(
        (h) => h.textContent,
      ),
    ).toEqual(["¿Y en dónde puedo asistir a GDD?", "El siguiente evento es:"])
    expect(container.textContent).toContain("Lugar: El salón nº 304 - CYT")
    expect(container.querySelector("main p h2")).toBeNull()

    const ids = Array.from(container.querySelectorAll("main [id]")).map(
      (el) => el.id,
    )
    expect(new Set(ids).size).toBe(ids.length)

    const card = container.querySelector('article[data-variant="instagram"]')
    expect(card?.textContent).toContain("gdd_col")
    expect(card?.textContent).toContain("Taller de prueba")
    expect(card?.textContent).not.toMatch(/\blikes\b/)
    expect(
      container.querySelectorAll('article[data-variant="instagram"]'),
    ).toHaveLength(1)
    expect(
      container.querySelector(
        'a[href="https://www.instagram.com/p/TEST12345/"]',
      )?.textContent,
    ).toContain("Ver publicación en Instagram")
    expect(localAnalyticsAdapter.getEvents()).toEqual([])
  })

  it("returns to the landing from the repository", async () => {
    await renderApp("/?vista=repository")

    expect(container.querySelector("h1")?.textContent).toBe(
      "Encuentra dónde aportar",
    )

    await click(
      Array.from(container.querySelectorAll("button")).find((button) =>
        button.textContent?.includes("Volver a MADV"),
      ) ?? null,
    )

    expect(window.location.search).toBe("")
    expect(container.querySelector("h1")?.textContent).toContain(
      "Un repositorio abierto",
    )
  })

  it("opens a project from anywhere on its repository card", async () => {
    await renderApp()
    await click(buttonByLabel("Abrir detalles de Stewart"))

    expect(window.location.search).toBe("?proyecto=ecos-de-umbra")
    expect(container.querySelector("h1")?.textContent).toBe("Stewart")
    expect(localAnalyticsAdapter.getEvents()).toMatchObject([
      { event_name: "repository_view" },
      { event_name: "project_view", project_id: "ecos-de-umbra" },
    ])
    expect(localAnalyticsAdapter.getEvents()).toHaveLength(2)
  })

  it("shows Beat The World using the concise project detail layout", async () => {
    await renderApp()
    await click(buttonByLabel("Abrir detalles de Beat The World"))

    expect(window.location.search).toBe("?proyecto=beat-the-world")
    expect(container.querySelector("h1")?.textContent).toBe("Beat The World")
    expect(container.textContent).toContain("15%")
    expect(container.textContent).toContain("1 integrantes")
    expect(container.textContent).toContain("Unity 6000.3.9f1")
    expect(container.textContent).not.toContain("Información ampliada")
    expect(container.textContent).not.toContain("Referentes y evolución futura")
    expect(container.textContent).toContain(
      "Propuestas basadas en la matriz; el equipo debe confirmar su vigencia y alcance.",
    )
    expect(
      container.querySelectorAll('button[aria-label^="Ver propuesta"]'),
    ).toHaveLength(2)
    expect(localAnalyticsAdapter.getEvents()).toMatchObject([
      { event_name: "repository_view" },
      { event_name: "project_view", project_id: "beat-the-world" },
    ])
  })

  it("shows Beast Card Clash with concise, verified project information", async () => {
    await renderApp()
    await click(buttonByLabel("Abrir detalles de Beast Card Clash (BCC)"))

    expect(window.location.search).toBe("?proyecto=beast-card-clash")
    expect(container.querySelector("h1")?.textContent).toBe(
      "Beast Card Clash (BCC)",
    )
    expect(container.textContent).toContain("Desarrollo de demo")
    expect(container.textContent).toContain("4 integrantes")
    expect(
      container
        .querySelector('[role="progressbar"]')
        ?.getAttribute("aria-valuenow"),
    ).toBe("30")
    expect(container.textContent).toContain("Veritas Académica")
    expect(container.textContent).toContain("Godot · GDScript")
    expect(container.textContent).toContain("Veld Bears · PC Windows")
    expect(container.textContent).toContain("Point-and-click")
    expect(container.textContent).toContain(
      "Necesidades de arte, sonido, programación y organización por confirmar.",
    )
    expect(container.textContent).not.toContain("Información ampliada")
    expect(
      container.querySelectorAll('button[aria-label^="Ver propuesta"]'),
    ).toHaveLength(2)
    expect(localAnalyticsAdapter.getEvents()).toMatchObject([
      { event_name: "repository_view" },
      { event_name: "project_view", project_id: "beast-card-clash" },
    ])
  })

  it("labels inferred needs as proposals and does not report them as sent requests", async () => {
    await renderApp()
    await click(buttonByLabel("Abrir detalles de Beat The World"))
    await click(
      container.querySelector(
        'button[aria-label^="Ver propuesta de Programación de gameplay rítmico"]',
      ),
    )

    expect(container.textContent).toContain("Propuesta inferida de la matriz")
    expect(
      Array.from(container.querySelectorAll("button")).some((button) =>
        button.textContent?.includes("EXPRESAR INTERÉS"),
      ),
    ).toBe(true)
    await click(
      Array.from(container.querySelectorAll("button")).find((button) =>
        button.textContent?.includes("EXPRESAR INTERÉS"),
      ) ?? null,
    )
    expect(container.textContent).toContain(
      "El interés quedó marcado en esta interfaz",
    )
    expect(container.textContent).not.toContain("SOLICITUD ENVIADA")
    expect(localAnalyticsAdapter.getEvents().at(-1)).toMatchObject({
      event_name: "collaborate_click",
      project_id: "beat-the-world",
      target_id: "need_contribution",
      need_id: "beat-the-world-gameplay",
    })
  })

  it("offers QR sharing and PNG download on a project page", async () => {
    await renderApp()
    await click(buttonByLabel("Ver resumen de Stewart"))

    const buttonTexts = Array.from(container.querySelectorAll("button")).map(
      (button) => button.textContent,
    )
    expect(buttonTexts).toContain("Compartir QR")
    expect(buttonTexts).toContain("Descargar PNG")
  })

  it("tracks Stewart without inventing needs and tracks confirmed need interactions", async () => {
    await renderApp()

    expect(
      localAnalyticsAdapter.getEvents().map((event) => event.event_name),
    ).toEqual(["repository_view"])

    await click(buttonByLabel("Ver resumen de Stewart"))

    expect(container.querySelector("h1")?.textContent).toBe("Stewart")
    expect(
      container
        .querySelector('img[alt="Arte conceptual de Stewart"]')
        ?.getAttribute("src"),
    ).toBe("/assets/projects/StewartCard.svg")
    expect(container.textContent).toContain("2 integrantes")
    expect(container.textContent).toContain(
      "Oportunidad de colaboración por confirmar",
    )
    const projectButtons = Array.from(container.querySelectorAll("button")).map(
      (button) => button.textContent,
    )
    expect(projectButtons).toContain("Compartir QR")
    expect(projectButtons).toContain("Descargar PNG")
    expect(
      container.querySelectorAll('button[aria-label^="Ver solicitud"]'),
    ).toHaveLength(0)
    expect(container.querySelector("button")?.textContent).not.toContain(
      "MOSTRAR INTERÉS",
    )

    expect(localAnalyticsAdapter.getEvents()).toMatchObject([
      { event_name: "repository_view" },
      { event_name: "project_view", project_id: "ecos-de-umbra" },
    ])
    expect(localAnalyticsAdapter.getEvents()).toHaveLength(2)

    await click(
      Array.from(container.querySelectorAll("button")).find((button) =>
        button.textContent?.includes("Proyectos"),
      ) ?? null,
    )
    await click(buttonByLabel("Ver resumen de Frecuencia Cero"))
    await click(
      container.querySelector(
        'button[aria-label^="Ver solicitud de Diseño sonoro"]',
      ),
    )

    expect(container.querySelector("h1")?.textContent).toBe(
      "¿Qué necesita el proyecto?",
    )
    expect(localAnalyticsAdapter.getEvents().at(-1)).toMatchObject({
      event_name: "need_view",
      project_id: "frecuencia-cero",
      need_id: projects[1]!.needs[0]!.id,
    })
    expect(
      localAnalyticsAdapter
        .getEvents()
        .filter((event) => event.event_name === "need_view"),
    ).toHaveLength(1)

    const contact = container.querySelector<HTMLAnchorElement>(
      'a[href^="https://wa.me/"]',
    )
    expect(contact?.target).toBe("_blank")
    expect(contact?.href).toContain("https://wa.me/")
    await click(contact)
    expect(localAnalyticsAdapter.getEvents().at(-1)).toMatchObject({
      event_name: "contact_click",
      project_id: "frecuencia-cero",
      target_id: "whatsapp",
    })

    await click(
      Array.from(container.querySelectorAll("button")).find((button) =>
        button.textContent?.includes("APORTAR"),
      ) ?? null,
    )
    expect(localAnalyticsAdapter.getEvents().at(-1)).toMatchObject({
      event_name: "collaborate_click",
      project_id: "frecuencia-cero",
      target_id: "need_contribution",
      need_id: projects[1]!.needs[0]!.id,
    })
    expect(
      localAnalyticsAdapter
        .getEvents()
        .some(
          (event) =>
            (event as { event_name: string }).event_name === "conversion",
        ),
    ).toBe(false)
  })

  it("tracks the project interest button and separates projects", async () => {
    await renderApp()

    await click(buttonByLabel("Ver resumen de Stewart"))

    await click(
      Array.from(container.querySelectorAll("button")).find((button) =>
        button.textContent?.includes("Proyectos"),
      ) ?? null,
    )

    await click(buttonByLabel("Ver resumen de Frecuencia Cero"))

    const progressBar = container.querySelector('[role="progressbar"]')
    expect(progressBar?.getAttribute("aria-valuenow")).toBe("38")
    expect(
      progressBar?.querySelector<HTMLElement>(".progress__fill")?.style.width,
    ).toBe("38%")

    const events = localAnalyticsAdapter.getEvents()

    expect(
      events.filter((event) => event.event_name === "project_view"),
    ).toEqual([
      expect.objectContaining({ project_id: "ecos-de-umbra" }),

      expect.objectContaining({ project_id: "frecuencia-cero" }),
    ])

    expect(
      events.filter((event) => event.event_name === "collaborate_click"),
    ).toEqual([
      expect.objectContaining({
        project_id: "frecuencia-cero",
        target_id: "project_card",
      }),
    ])

    const interestButton = Array.from(
      container.querySelectorAll("button"),
    ).find((button) => button.textContent?.includes("MOSTRAR INTERÉS"))

    await click(interestButton ?? null)

    expect(localAnalyticsAdapter.getEvents().at(-1)).toMatchObject({
      event_name: "collaborate_click",

      project_id: "frecuencia-cero",

      target_id: "project_interest",
    })

    expect(interestButton?.textContent).toBe("INTERÉS REGISTRADO")
  })

  it("resolves a direct project URL and records the matching page view", async () => {
    await renderApp("/?proyecto=frecuencia-cero")

    expect(container.querySelector("h1")?.textContent).toBe("Frecuencia Cero")

    expect(localAnalyticsAdapter.getEvents()).toMatchObject([
      { event_name: "project_view", project_id: "frecuencia-cero" },
    ])
  })

  it("records the destination once when browser history changes", async () => {
    await renderApp()
    window.history.pushState({}, "", "/?proyecto=ecos-de-umbra")
    await act(async () => {
      window.dispatchEvent(new PopStateEvent("popstate"))
    })

    expect(container.querySelector("h1")?.textContent).toBe("Stewart")
    expect(localAnalyticsAdapter.getEvents()).toMatchObject([
      { event_name: "repository_view" },
      { event_name: "project_view", project_id: "ecos-de-umbra" },
    ])
    expect(localAnalyticsAdapter.getEvents()).toHaveLength(2)
  })
})
