import { useEffect, useState } from "react"

import { reg, semi } from "@/constants/styles"
import DepthCarousel from "@/component/DepthCarousel"

const galleryAssetUrl = (fileName: string) =>
  `${import.meta.env.BASE_URL}assets/gallery/${fileName}`

const galleryItems = [
  {
    number: "01",
    src: galleryAssetUrl("Titulo.svg"),
    alt: "Título y portada de MADV",
    description:
      "	Identificar el proyecto y establecer su identidad visual.",
  },
  {
    number: "02",
    src: galleryAssetUrl("Contexto1.svg"),
    alt: "Contexto del proyecto MADV",
    description:
      "Introducir el contexto general en el que surge MADV.",
  },
  {
    number: "03",
    src: galleryAssetUrl("Objetivos.svg"),
    alt: "Objetivos del proyecto MADV",
    description:
      "	Comunicar el propósito y los objetivos del proyecto.",
  },
  {
    number: "04",
    src: galleryAssetUrl("Problemas.svg"),
    alt: "Problemas que aborda MADV",
    description:
      "Sintetizar la situación problemática identificada.",
  },
  {
    number: "05",
    src: galleryAssetUrl("Roadmap.svg"),
    alt: "Roadmap del proyecto MADV",
    description:
      "El roadmap resume las etapas previstas para hacer crecer la plataforma y su comunidad.",
  },
  {
    number: "06",
    src: galleryAssetUrl("Usuario.svg"),
    alt: "Perfil de usuario de MADV",
    description:
      "El perfil de usuario muestra a las personas que buscan descubrir proyectos y aportar sus habilidades, 	Presentar los usuarios y sus características relevantes.",
  },
  {
    number: "07",
    src: galleryAssetUrl("Contexto2.svg"),
    alt: "Continuación del contexto del proyecto MADV",
    description:
      "Esta segunda parte amplía el contexto y las oportunidades que existen alrededor de los proyectos.",
  },
  {
    number: "08",
    src: galleryAssetUrl("Entornos.svg"),
    alt: "Entornos del proyecto Stewart",
    description:
      "La exploración de entornos muestra referencias visuales del proyecto Stewart.",
  },
  {
    number: "09",
    src: galleryAssetUrl("EntornoEsp.svg"),
    alt: "Entorno especial del proyecto Stewart",
    description:
      "Un acercamiento a la ambientación y al entorno especial planteado para Stewart.",
  },
  {
    number: "10",
    src: galleryAssetUrl("Propuesta.svg"),
    alt: "Propuesta del proyecto MADV",
    description:
      "La propuesta reúne la solución visual y funcional para organizar proyectos abiertos.",
  },
  {
    number: "11",
    src: galleryAssetUrl("ArbolProb.svg"),
    alt: "Árbol con problema del proyecto Stewart",
    description:
      "El árbol de problemas ordena las causas y consecuencias que afectan al proyecto Stewart.",
  },
  {
    number: "12",
    src: galleryAssetUrl("ArbustoProb.svg"),
    alt: "Arbusto con problema del proyecto Stewart",
    description:
      "El arbusto de problemas desglosa situaciones concretas que la propuesta busca atender.",
  },
]

function GalleryImage({
  item,

  expanded = false,
}: {
  item: typeof galleryItems[number]

  expanded?: boolean
}) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[#171827] ${
        expanded ? "aspect-video" : "aspect-[16/10]"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-white/70"
      >
        <span className={`${semi} text-[28px] text-[#f0cb82]`}>
          {item.number}
        </span>
        <span className={`${reg} text-[11px]`}>
          No se pudo cargar {item.src.split("/").at(-1)}
        </span>
        <span className={`${reg} text-[10px] text-white/45`}>
          public/assets/gallery/
        </span>
      </div>
      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none"
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}

export default function GalleryPage({ onBack }: { onBack: () => void }) {
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const activeItem = activeIndex === null ? null : galleryItems[activeIndex]!

  useEffect(() => {
    if (activeIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null)

      if (event.key === "ArrowRight") {
        setActiveIndex((index) =>
          index === null ? null : (index + 1) % galleryItems.length,
        )
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          index === null
            ? null
            : (index - 1 + galleryItems.length) % galleryItems.length,
        )
      }
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow

      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeIndex])

  return (
    <main className="min-h-[100dvh] bg-[#171827] px-5 pb-16 pt-5 text-white sm:px-8 sm:pt-8 lg:px-10">
      <div className="mx-auto max-w-[1120px]">
        <section className="pt-10 sm:pt-14">
          <p className={`${semi} text-[22px] uppercase text-white/65`}>
            Sobre el proyecto
          </p>
          
          <p
            className={`${reg} mt-3 max-w-[620px] text-[13px] leading-relaxed text-white/70`}
          >MADV es un proyecto académico desarrollado en el componente de Proyecto de Grado del programa de Diseño Digital y Multimedia. Investiga las dinámicas de colaboración y articulación de capacidades en el Grupo de Desarrolladores y Diseñadores (GDD) de la Universidad Nacional de Colombia, en el contexto del desarrollo colectivo de videojuegos.

Como resultado, propone una mediación físico-digital para visibilizar proyectos, sus avances y necesidades de colaboración, materializada en un prototipo web que facilita la consulta de información y la conexión entre equipos y posibles colaboradores.

El proyecto integra investigación, metodología y diseño, desde el análisis del contexto hasta el desarrollo y evaluación de la propuesta.
          </p>

          <div className="mt-8 overflow-hidden rounded-[10px] bg-[#171827] px-2 py-4 sm:px-6 sm:py-6">
            <DepthCarousel
              items={galleryItems.map((item) => ({
                image: item.src,
                alt: item.alt,
              }))}
              cardWidth={500}
              cardHeight={290}
              radius={6}
              depth={180}
              spread={72}
              visibleCards={3}
              showControls
              showIndicators
              onChange={setCarouselIndex}
              onCardClick={setActiveIndex}
            />
          </div>
          <div className="mt-5 border-b border-white/15 pb-6">
            <p className={`${semi} text-[11px] text-white/65`}>
              MADV · {galleryItems[carouselIndex]?.number}
            </p>
            <p
              className={`${reg} mt-2 max-w-[680px] text-[14px] leading-relaxed text-white/75`}
            >
              {galleryItems[carouselIndex]?.description}
            </p>
          </div>
        </section>
      </div>

      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-[#101116]/[0.97] p-4 text-white sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Visor de imagen ${activeItem.number}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null)
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <p className={`${semi} text-[12px]`}>
              MADV · {activeItem.number} /{" "}
              {String(galleryItems.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => setActiveIndex(null)}
              aria-label="Cerrar visor"
              className="grid size-10 place-items-center rounded-full text-[24px] text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              ×
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center gap-2 sm:gap-5">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((index) =>
                  index === null
                    ? null
                    : (index - 1 + galleryItems.length) % galleryItems.length,
                )
              }
              aria-label="Imagen anterior"
              className="grid size-9 shrink-0 place-items-center rounded-full text-[24px] text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white sm:size-11"
            >
              ‹
            </button>
            <div className="aspect-video max-h-full w-full max-w-[1100px] overflow-hidden">
              <GalleryImage item={activeItem} expanded />
            </div>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((index) =>
                  index === null ? null : (index + 1) % galleryItems.length,
                )
              }
              aria-label="Imagen siguiente"
              className="grid size-9 shrink-0 place-items-center rounded-full text-[24px] text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white sm:size-11"
            >
              ›
            </button>
          </div>

          <p className={`${reg} pb-1 text-center text-[10px] text-white/55`}>
            Usa las flechas para recorrer las imágenes · Esc para cerrar
          </p>
        </div>
      )}
    </main>
  )
}
