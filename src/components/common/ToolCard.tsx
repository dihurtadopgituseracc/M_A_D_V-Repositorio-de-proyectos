import { semi, reg } from "@/constants/styles"
import type { Tool } from "@/types/project"

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="group rounded-[16px] border border-[#171827]/[0.04] bg-white px-5 py-4 transition hover:border-[#287b86]/25 hover:shadow-[0_10px_28px_rgba(23,24,39,0.06)] sm:px-6">
      <div className="flex items-center gap-4">
        <span className="h-8 w-1 rounded-full bg-[#287b86]/70 transition group-hover:bg-[#287b86]" />
        <div>
          <p className={`${semi} text-[15px] text-[#171827]`}>{tool.area}</p>
          <p className={`${reg} mt-1 text-[12px] text-[#6b6a73]`}>
            {tool.detail}
          </p>
        </div>
      </div>
    </div>
  )
}
