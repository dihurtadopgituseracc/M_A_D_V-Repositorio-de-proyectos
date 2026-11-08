import { semi, reg } from "@/constants/styles"
import type { Need } from "@/types/project"
import AngleIcon from "@/components/common/AngleIcon"

export default function NeedCard({
  need,
  index,
  onOpen,
}: {
  need: Need
  index: number
  onOpen: () => void
}) {
  const isProposed = need.status === "proposed"

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group grid min-h-[84px] w-full grid-cols-[32px_1fr_auto] items-center gap-x-3 rounded-[16px] border bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-turquesa/25 hover:shadow-[0_12px_30px_rgba(23,24,39,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa ${
        need.featured
          ? "border-coral/10 shadow-[0_8px_24px_rgba(23,24,39,0.04)]"
          : "border-transparent"
      }`}
      aria-label={`Ver ${
        isProposed ? "propuesta" : "solicitud"
      } de ${need.name}: ${need.detail}`}
    >
      <span className={`${semi} text-[11px] text-coral`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <p className={`${semi} text-[15px] text-tinta`}>{need.name}</p>
        <p className={`${reg} mt-1 text-[12px] text-humo`}>{need.detail}</p>
        <span
          className={`${semi} mt-2 inline-flex w-fit rounded-full bg-turquesa/[0.08] px-2.5 py-1 text-[10px] text-turquesa`}
        >
          {need.commitment}
        </span>
      </div>
      <span className="grid size-8 place-items-center rounded-full bg-crema text-[20px] text-tinta transition group-hover:translate-x-0.5 group-hover:bg-turquesa group-hover:text-white">
        <AngleIcon className="size-4" />
      </span>
    </button>
  )
}
