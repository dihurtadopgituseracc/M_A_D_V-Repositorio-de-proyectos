type AngleIconProps = {
  direction?: "left" | "right" | "down"

  className?: string
}

export default function AngleIcon({
  direction = "right",

  className,
}: AngleIconProps) {
  const rotation =
    direction === "left"
      ? "rotate(180 12 12)"
      : direction === "down"
        ? "rotate(90 12 12)"
        : undefined

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <path
        d="M8 4l7.2 7.2c.45.45.45 1.15 0 1.6L8 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
        strokeLinejoin="round"
        transform={rotation}
      />
    </svg>
  )
}
