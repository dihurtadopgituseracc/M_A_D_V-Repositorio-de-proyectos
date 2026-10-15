import { useEffect, useState } from "react"

import { reg, semi } from "@/constants/styles"

const galleryItems = Array.from({ length: 6 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0")

  return {
    number,

    src: `/assets/images/gallery/${number}.webp`,

    alt: `Imagen ${number} del proyecto MADV`,
  }
})

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
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-white/70">
        <span className={`${semi} text-[28px] text-[#f0cb82]`}>
          {item.number}
        </span>
        <span className={`${reg} text-[11px]`}>
          Añade el archivo {item.number}.webp
        </span>
        <span className={`${reg} text-[10px] text-white/45`}>
          public/assets/images/gallery/
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
    <main className="min-h-[100dvh] bg-[#f6f3ea] px-5 pb-16 pt-5 text-[#171827] sm:px-8 sm:pt-8 lg:px-10">
      <div className="mx-auto max-w-[1120px]">
        <header className="flex items-center justify-between gap-4 border-b border-[#171827]/15 pb-5">
          <button
            type="button"
            onClick={onBack}
            className={`${semi} inline-flex min-h-10 items-center gap-2 text-[12px] text-[#171827] hover:text-[#287b86] focus-visible:outline-2 focus-visible:outline-offset-2`}
          >
            <span aria-hidden="true">←</span>
            Volver a MADV
          </button>
          <span className={`${semi} text-[11px] text-[#171827]`}>MADV</span>
        </header>

        <section className="pt-10 sm:pt-14">
          <p className={`${semi} text-[10px] uppercase text-[#d9533f]`}>
            Sobre el proyecto
          </p>
          <h1
            className={`${semi} mt-2 text-[32px] leading-tight text-[#171827] sm:text-[42px]`}
          >
            Imágenes de MADV
          </h1>
          <p
            className={`${reg} mt-3 max-w-[620px] text-[13px] leading-relaxed text-[#4f4e59]`}
          >
            Un recorrido visual por los proyectos, sus mundos y las personas que
            los están creando.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {galleryItems.map((item, index) => (
              <button
                key={item.number}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Abrir imagen ${item.number}`}
                className="group overflow-hidden rounded-[6px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287b86]"
              >
                <GalleryImage item={item} />
                <span className="flex items-center justify-between gap-2 border-b border-[#171827]/15 py-3">
                  <span className={`${semi} text-[11px] text-[#171827]`}>
                    MADV · {item.number}
                  </span>
                  <span
                    className={`${reg} text-[10px] text-[#6b6a73] transition group-hover:text-[#287b86]`}
                  >
                    Ampliar ↗
                  </span>
                </span>
              </button>
            ))}
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
              MADV · {activeItem.number} / 06
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
