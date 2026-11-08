import { useEffect, useState } from "react"
import LandingPage from "@/pages/LandingPage"
import GalleryPage from "@/pages/GalleryPage"
import EventsPage from "@/pages/EventsPage"
import FaqPage from "@/pages/FaqPage"
import RepositoryPage from "@/pages/RepositoryPage"
import ProjectDetailPage from "@/pages/ProjectDetailPage"
import NeedDetailPage from "@/pages/NeedDetailPage"
import StaggeredMenu from "@/component/StaggeredMenu"
import AngleIcon from "@/components/common/AngleIcon"
import type { Need, Project } from "@/types/project"
import { projects } from "@/data/projects"
import { scrollToTop } from "@/utils/scroll"
import {
  trackCurrentPageView,
  trackProjectView,
  trackRepositoryView,
} from "@/services/analytics/analytics.service"

function getProjectFromUrl() {
  const projectId = new URLSearchParams(window.location.search).get("proyecto")
  return projects.find((project) => project.id === projectId) ?? null
}

function isRepositoryFromUrl() {
  return (
    new URLSearchParams(window.location.search).get("vista") === "repository"
  )
}

function isGalleryFromUrl() {
  return new URLSearchParams(window.location.search).get("vista") === "gallery"
}

function isEventsFromUrl() {
  return new URLSearchParams(window.location.search).get("vista") === "events"
}

function isFaqFromUrl() {
  return new URLSearchParams(window.location.search).get("vista") === "faq"
}

export default function App() {
  const [selected, setSelected] = useState<Project | null>(getProjectFromUrl)
  const [repositoryOpen, setRepositoryOpen] = useState(
    () => !getProjectFromUrl() && isRepositoryFromUrl(),
  )
  const [galleryOpen, setGalleryOpen] = useState(
    () => !getProjectFromUrl() && isGalleryFromUrl(),
  )
  const [eventsOpen, setEventsOpen] = useState(
    () => !getProjectFromUrl() && isEventsFromUrl(),
  )
  const [faqOpen, setFaqOpen] = useState(
    () => !getProjectFromUrl() && isFaqFromUrl(),
  )
  const [selectedNeed, setSelectedNeed] = useState<{
    need: Need
    index: number
  } | null>(null)

  useEffect(() => {
    const syncFromUrl = () => {
      const project = getProjectFromUrl()
      setSelected(project)
      setRepositoryOpen(!project && isRepositoryFromUrl())
      setGalleryOpen(!project && isGalleryFromUrl())
      setEventsOpen(!project && isEventsFromUrl())
      setFaqOpen(!project && isFaqFromUrl())
      setSelectedNeed(null)
      trackCurrentPageView()
    }

    window.addEventListener("popstate", syncFromUrl)
    return () => window.removeEventListener("popstate", syncFromUrl)
  }, [])

  const openRepository = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("proyecto")
    url.searchParams.set("vista", "repository")
    window.history.pushState({}, "", `${url.pathname}${url.search}`)
    trackRepositoryView()
    setSelected(null)
    setSelectedNeed(null)
    setRepositoryOpen(true)
    setGalleryOpen(false)
    setEventsOpen(false)
    setFaqOpen(false)
    scrollToTop()
  }

  const openGallery = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("proyecto")
    url.searchParams.set("vista", "gallery")
    window.history.pushState({}, "", `${url.pathname}${url.search}`)
    setSelected(null)
    setSelectedNeed(null)
    setRepositoryOpen(false)
    setGalleryOpen(true)
    setEventsOpen(false)
    setFaqOpen(false)
    scrollToTop()
  }

  const openEvents = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("proyecto")
    url.searchParams.set("vista", "events")
    window.history.pushState({}, "", `${url.pathname}${url.search}`)
    setSelected(null)
    setSelectedNeed(null)
    setRepositoryOpen(false)
    setGalleryOpen(false)
    setEventsOpen(true)
    setFaqOpen(false)
    scrollToTop()
  }

  const closeEvents = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("vista")
    window.history.pushState({}, "", `${url.pathname}${url.search}`)
    setEventsOpen(false)
    setFaqOpen(false)
    scrollToTop()
  }

  const closeFaq = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("vista")
    window.history.pushState({}, "", `${url.pathname}${url.search}`)
    setFaqOpen(false)
    scrollToTop()
  }

  const closeGallery = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("vista")
    window.history.pushState({}, "", `${url.pathname}${url.search}`)
    setGalleryOpen(false)
    scrollToTop()
  }

  const closeRepository = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("vista")
    window.history.pushState({}, "", `${url.pathname}${url.search}`)
    setRepositoryOpen(false)
    scrollToTop()
  }

  const navigate = (project: Project | null) => {
    if (!project) {
      openRepository()
      return
    }

    const url = new URL(window.location.href)
    url.searchParams.delete("vista")
    url.searchParams.set("proyecto", project.id)
    window.history.pushState({}, "", `${url.pathname}${url.search}`)
    trackProjectView(project.id)
    setSelected(project)
    setRepositoryOpen(false)
    setGalleryOpen(false)
    setEventsOpen(false)
    setFaqOpen(false)
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
        colors={["#f0cb82", "#18d66d", "#171827"]}
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
        items={[
          {
            label: "Inicio",
            ariaLabel: "Ir a la página de inicio",
            link: "./",
          },
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
          {
            label: "Eventos",
            ariaLabel: "Ver eventos",
            link: "./?vista=events",
          },
          {
            label: "Preguntas",
            ariaLabel: "Ver preguntas frecuentes",
            link: "./?vista=faq",
          },
        ]}
        socialItems={[
          {
            label: "Instagram",
            link: "https://www.instagram.com/gdd_col/",
          },
        ]}
      />
      {page}
    </>
  )
}
