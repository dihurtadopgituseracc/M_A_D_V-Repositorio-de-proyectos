import { lazy, Suspense, useEffect, useState } from "react"
import LandingPage from "@/pages/LandingPage"
import StaggeredMenu from "@/component/StaggeredMenu"
import AngleIcon from "@/components/common/AngleIcon"
import PageLoading from "@/components/common/PageLoading"
import type { Need, Project } from "@/types/project"
import { projects } from "@/data/projects"
import { scrollToTop } from "@/utils/scroll"
import {
  trackCurrentPageView,
  trackProjectView,
  trackRepositoryView,
} from "@/services/analytics/analytics.service"

// La landing se carga de inmediato; las demás vistas se descargan bajo demanda.
const GalleryPage = lazy(() => import("@/pages/GalleryPage"))
const EventsPage = lazy(() => import("@/pages/EventsPage"))
const FaqPage = lazy(() => import("@/pages/FaqPage"))
const RepositoryPage = lazy(() => import("@/pages/RepositoryPage"))
const ProjectDetailPage = lazy(() => import("@/pages/ProjectDetailPage"))
const NeedDetailPage = lazy(() => import("@/pages/NeedDetailPage"))

function getProjectFromUrl() {
  const projectId = new URLSearchParams(window.location.search).get("proyecto")
  return projects.find((project) => project.id === projectId) ?? null
}

function getViewFromUrl() {
  return new URLSearchParams(window.location.search).get("vista")
}

// Deriva el estado de navegación desde la URL en una sola lectura.
function readNavFromUrl() {
  const project = getProjectFromUrl()
  const view = project ? null : getViewFromUrl()
  return {
    project,
    repositoryOpen: view === "repository",
    galleryOpen: view === "gallery",
    eventsOpen: view === "events",
    faqOpen: view === "faq",
  }
}

// Datos estáticos del menú: definidos una sola vez fuera del componente para
// no recrearlos en cada render.
const MENU_ACCENT_COLORS = ["#f0cb82", "#18d66d", "#171827"]

const MENU_ITEMS = [
  { label: "Inicio", ariaLabel: "Ir a la página de inicio", link: "./" },
  {
    label: "Proyectos",
    ariaLabel: "Ver proyectos abiertos",
    link: "./?vista=repository",
  },
  {
    label: "Sobre MADV",
    ariaLabel: "Conocer más sobre MADV",
    link: "./?vista=gallery",
  },
  { label: "Eventos", ariaLabel: "Ver eventos", link: "./?vista=events" },
  {
    label: "Preguntas",
    ariaLabel: "Ver preguntas frecuentes",
    link: "./?vista=faq",
  },
]

const MENU_SOCIAL_ITEMS = [
  { label: "Instagram", link: "https://www.instagram.com/gdd_col/" },
  { label: "Discord", link: "https://discord.com/invite/VZWa7wbSDg" },
  { label: "Itchio", link: "https://gdd-col.itch.io/" },

]

export default function App() {
  const [initialNav] = useState(readNavFromUrl)
  const [selected, setSelected] = useState<Project | null>(initialNav.project)
  const [repositoryOpen, setRepositoryOpen] = useState(
    initialNav.repositoryOpen,
  )
  const [galleryOpen, setGalleryOpen] = useState(initialNav.galleryOpen)
  const [eventsOpen, setEventsOpen] = useState(initialNav.eventsOpen)
  const [faqOpen, setFaqOpen] = useState(initialNav.faqOpen)
  const [selectedNeed, setSelectedNeed] = useState<{
    need: Need
    index: number
  } | null>(null)

  useEffect(() => {
    const syncFromUrl = () => {
      const nav = readNavFromUrl()
      setSelected(nav.project)
      setRepositoryOpen(nav.repositoryOpen)
      setGalleryOpen(nav.galleryOpen)
      setEventsOpen(nav.eventsOpen)
      setFaqOpen(nav.faqOpen)
      setSelectedNeed(null)
      trackCurrentPageView()
    }

    window.addEventListener("popstate", syncFromUrl)
    return () => window.removeEventListener("popstate", syncFromUrl)
  }, [])

  // Empuja una nueva URL aplicando un mutador sobre los parámetros actuales.
  const pushUrl = (mutate: (params: URLSearchParams) => void) => {
    const url = new URL(window.location.href)
    mutate(url.searchParams)
    window.history.pushState({}, "", `${url.pathname}${url.search}`)
  }

  // Marca una única vista como abierta (o ninguna cuando es null).
  const setOpenView = (
    view: "repository" | "gallery" | "events" | "faq" | null,
  ) => {
    setRepositoryOpen(view === "repository")
    setGalleryOpen(view === "gallery")
    setEventsOpen(view === "events")
    setFaqOpen(view === "faq")
  }

  // Abre una vista secundaria: actualiza la URL, limpia selección y hace scroll.
  const openView = (
    view: "repository" | "gallery" | "events" | "faq",
    track?: () => void,
  ) => {
    pushUrl((params) => {
      params.delete("proyecto")
      params.set("vista", view)
    })
    track?.()
    setSelected(null)
    setSelectedNeed(null)
    setOpenView(view)
    scrollToTop()
  }

  // Cierra la vista actual y vuelve a la landing eliminando `vista` de la URL.
  const closeView = () => {
    pushUrl((params) => params.delete("vista"))
    setOpenView(null)
    scrollToTop()
  }

  const openRepository = () => openView("repository", trackRepositoryView)
  const openGallery = () => openView("gallery")
  const openEvents = () => openView("events")
  const closeEvents = closeView
  const closeFaq = closeView
  const closeGallery = closeView
  const closeRepository = closeView

  const navigate = (project: Project | null) => {
    if (!project) {
      openRepository()
      return
    }

    pushUrl((params) => {
      params.delete("vista")
      params.set("proyecto", project.id)
    })
    trackProjectView(project.id)
    setSelected(project)
    setOpenView(null)
    setSelectedNeed(null)
    scrollToTop()
  }

  const openNeed = (need: Need, index: number) => {
    setSelectedNeed({ need, index })
    scrollToTop()
  }

  const backToProject = () => {
    if (selected) trackProjectView(selected.id)
    setSelectedNeed(null)
    scrollToTop()
  }

  let page = (
    <LandingPage
      onOpenRepository={openRepository}
      onOpenGallery={openGallery}
      onOpenEvents={openEvents}
    />
  )

  if (selected && selectedNeed) {
    page = (
      <NeedDetailPage
        project={selected}
        need={selectedNeed.need}
        index={selectedNeed.index}
        onBack={backToProject}
      />
    )
  } else if (selected) {
    page = (
      <ProjectDetailPage
        project={selected}
        onBack={openRepository}
        onOpenNeed={openNeed}
      />
    )
  } else if (repositoryOpen) {
    page = <RepositoryPage onOpen={navigate} onBack={closeRepository} />
  } else if (galleryOpen) {
    page = <GalleryPage onBack={closeGallery} />
  } else if (eventsOpen) {
    page = <EventsPage />
  } else if (faqOpen) {
    page = <FaqPage />
  }

  const backAction = selectedNeed
    ? backToProject
    : selected
      ? openRepository
      : repositoryOpen
        ? closeRepository
        : galleryOpen
          ? closeGallery
          : eventsOpen
            ? closeEvents
            : faqOpen
              ? closeFaq
              : null
  const backLabel = selectedNeed
    ? "Resumen del proyecto"
    : selected
      ? "Proyectos"
      : "Volver a MADV"
  const navBackgroundColor = galleryOpen
    ? "#171827"
    : repositoryOpen
      ? "#b7ff3c"
      : selected || selectedNeed || eventsOpen
        ? "#f6f3ea"
        : "#f0cb82"
  const navTextColor = galleryOpen ? "#ffffff" : "#171827"

  return (
    <>
      <StaggeredMenu
        position="right"
        menuButtonColor={navTextColor}
        openMenuButtonColor="#171827"
        headerColor={navBackgroundColor}
        backButtonColor={navTextColor}
        accentColor="#38c528"
        colors={MENU_ACCENT_COLORS}
        leadingContent={
          backAction ? (
            <button
              type="button"
              onClick={backAction}
              aria-label={backLabel}
              className="sm-back-button"
            >
              <AngleIcon direction="left" className="size-5" />
              <span className="sr-only">{backLabel}</span>
            </button>
          ) : (
            <span aria-hidden="true" />
          )
        }
        items={MENU_ITEMS}
        socialItems={MENU_SOCIAL_ITEMS}
      />
      <Suspense fallback={<PageLoading />}>{page}</Suspense>
    </>
  )
}
