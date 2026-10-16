import { useEffect, useState } from "react"
import LandingPage from "@/pages/LandingPage"
import GalleryPage from "@/pages/GalleryPage"
import RepositoryPage from "@/pages/RepositoryPage"
import ProjectDetailPage from "@/pages/ProjectDetailPage"
import NeedDetailPage from "@/pages/NeedDetailPage"
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

  if (selected && selectedNeed) {
    return (
      <NeedDetailPage
        project={selected}
        need={selectedNeed.need}
        index={selectedNeed.index}
        onBack={backToProject}
      />
    )
  }

  if (selected) {
    return (
      <ProjectDetailPage
        project={selected}
        onBack={openRepository}
        onOpenNeed={openNeed}
      />
    )
  }

  if (repositoryOpen) {
    return <RepositoryPage onOpen={navigate} onBack={closeRepository} />
  }

  if (galleryOpen) return <GalleryPage onBack={closeGallery} />

  return (
    <LandingPage
      onOpenRepository={openRepository}
      onOpenGallery={openGallery}
    />
  )
}
