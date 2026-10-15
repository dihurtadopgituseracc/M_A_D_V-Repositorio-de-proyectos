const imgSegment = "/assets/15352.svg"

export default function Progress({ value }: { value: number }) {
  const active = Math.min(Math.max(value, 8), 95)
  return (
    <div className="relative h-3 w-full" role="progressbar" aria-label="Avance del proyecto" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#e8def8]" />
      <div className="absolute left-0 top-0 flex h-3 overflow-hidden" style={{ width: `${active}%` }}>
        <img alt="" src={imgSegment} className="h-[12px] w-[40px] max-w-none shrink-0" />
        <img alt="" src={imgSegment} className="h-[12px] min-w-0 flex-1 object-fill" />
      </div>
      <span className="absolute right-0 top-1/2 size-1 -translate-y-1/2 rounded-full bg-[#6750a4]" />
    </div>
  )
}

