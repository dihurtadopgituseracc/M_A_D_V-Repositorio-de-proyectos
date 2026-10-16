// @vitest-environment jsdom

import { StrictMode, act } from "react"

import { createRoot, type Root } from "react-dom/client"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { projects } from "@/data/projects"

import App from "@/app/App"

import { localAnalyticsAdapter } from "@/services/analytics/local.adapter"

import { trackCurrentPageView } from "@/services/analytics/analytics.service"

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
}

async function click(element: Element | null) {
  if (!element) throw new Error("Expected interactive element was not found")

  await act(async () => {
    element.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    )
  })
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
    ).toHaveLength(6)
    expect(
      Array.from(container.querySelectorAll("img")).map((image) =>
        image.getAttribute("src"),
      ),
    ).toEqual([
      "/assets/Titulo.svg",
      "/assets/Contexto1.svg",
      "/assets/Objetivos.svg",
      "/assets/Problemas.svg",
      "/assets/Roadmap.svg",
      "/assets/Usuario.svg",
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
      "Proyectos que buscan nuevas manos",
    )
    expect(localAnalyticsAdapter.getEvents()).toMatchObject([
      { event_name: "repository_view" },
    ])
    expect(localAnalyticsAdapter.getEvents()).toHaveLength(1)
  })

  it("returns to the landing from the repository", async () => {
    await renderApp("/?vista=repository")

    expect(container.querySelector("h1")?.textContent).toBe(
      "Proyectos que buscan nuevas manos",
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
    ).toBe("/assets/StewartCard.png")
    expect(container.textContent).toContain("Equipo por confirmar")
    expect(container.textContent).toContain(
      "Oportunidad de colaboración por confirmar",
    )
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
