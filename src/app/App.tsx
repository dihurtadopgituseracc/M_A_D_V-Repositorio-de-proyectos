import { useEffect, useState } from "react"
import LandingPage from "@/pages/LandingPage"
import GalleryPage from "@/pages/GalleryPage"
import RepositoryPage from "@/pages/RepositoryPage"
import ProjectDetailPage from "@/pages/ProjectDetailPage"
import NeedDetailPage from "@/pages/NeedDetailPage"
import StaggeredMenu from "@/component/StaggeredMenu"
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

export default function App() {
  const [selected, setSelected] = useState<Project | null>(getProjectFromUrl)
  const [repositoryOpen, setRepositoryOpen] = useState(
    () => !getProjectFromUrl() && isRepositoryFromUrl(),
  )
  const [galleryOpen, setGalleryOpen] = useState(
    () => !getProjectFromUrl() && isGalleryFromUrl(),
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
  }

  const backAction = selectedNeed
    ? backToProject
    : selected
      ? openRepository
      : repositoryOpen
        ? closeRepository
        : galleryOpen
          ? closeGallery
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
      : selected || selectedNeed
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
              <span aria-hidden="true">←</span>
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
