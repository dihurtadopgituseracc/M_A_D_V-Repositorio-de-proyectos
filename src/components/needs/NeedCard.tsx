import { semi, reg } from "@/constants/styles"
import type { Need } from "@/types/project"

export default function NeedCard({ need, index, onOpen }: { need: Need; index: number; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className={`group grid min-h-[84px] w-full grid-cols-[32px_1fr_auto] items-center gap-x-3 rounded-[16px] border bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-[#287b86]/25 hover:shadow-[0_12px_30px_rgba(23,24,39,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287b86] ${need.featured ? "border-[#d9533f]/10 shadow-[0_8px_24px_rgba(23,24,39,0.04)]" : "border-transparent"}`} aria-label={`Ver solicitud de ${need.name}: ${need.detail}`}>
      <span className={`${semi} text-[11px] text-[#d9533f]`}>{String(index + 1).padStart(2, "0")}</span>
      <div><p className={`${semi} text-[15px] text-[#171827]`}>{need.name}</p><p className={`${reg} mt-1 text-[12px] text-[#6b6a73]`}>{need.detail}</p><span className={`${semi} mt-2 inline-flex w-fit rounded-full bg-[#287b86]/[0.08] px-2.5 py-1 text-[10px] text-[#287b86]`}>{need.commitment}</span></div>
      <span className="grid size-8 place-items-center rounded-full bg-[#f6f3ea] text-[20px] text-[#171827] transition group-hover:translate-x-0.5 group-hover:bg-[#287b86] group-hover:text-white">›</span>
    </button>
  )
}
