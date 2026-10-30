import { useEffect, useState } from "react"

const DISMISSED_KEY = "madv-landing-popup-dismissed"

export default function LandingPopup({
  imageSrc = `${import.meta.env.BASE_URL}assets/branding/PopUp.svg`,

  imageAlt = "MADV",

  onDismiss,
}: {
  imageSrc?: string

  imageAlt?: string

  onDismiss?: () => void
}) {
  const [visible, setVisible] = useState(() => {
    try {
      return window.sessionStorage.getItem(DISMISSED_KEY) !== "true"
    } catch {
      return true
    }
  })

  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!visible) return

    const dismiss = () => {
      if (fading) return

      setFading(true)

      try {
        window.sessionStorage.setItem(DISMISSED_KEY, "true")
      } catch {
        // The popup remains dismissible when session storage is unavailable.
      }

      window.setTimeout(() => {
        setVisible(false)

        onDismiss?.()
      }, 450)
    }

    const handlePointerDown = () => dismiss()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss()
    }

    window.addEventListener("pointerdown", handlePointerDown, { once: true })

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown)

      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [fading, onDismiss, visible])

  if (!visible) return null

  return (
    <div
      aria-label="Presentación de MADV"
      className={`fixed inset-0 z-50 grid place-items-center bg-[#171827] p-5 transition-opacity duration-500 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="max-h-[90dvh] w-full max-w-[920px] object-contain"
      />
    </div>
  )
}
