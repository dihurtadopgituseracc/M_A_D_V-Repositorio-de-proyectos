export default function Progress({ value }: { value: number }) {
  const active = Math.min(Math.max(value, 0), 100)

  return (
    <div
      className="relative h-3 w-full"
      role="progressbar"
      aria-label="Avance del proyecto"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={active}
      aria-valuetext={`${active}%`}
    >
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#e8def8]" />
      <div
        className="progress__fill absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#287b86] transition-[width] duration-300"
        style={{ width: `${active}%` }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full border-2 border-white bg-[#287b86] shadow-sm"
        style={{ left: `calc(${active}% - 4px)` }}
        aria-hidden="true"
      />
    </div>
  )
}
