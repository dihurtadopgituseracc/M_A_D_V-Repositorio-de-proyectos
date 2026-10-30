import { semi } from "@/constants/styles"

export default function Tag({ children }: { children: string }) {
  return (
    <span
      className={`${semi} rounded-[4px] border border-[#171827]/15 bg-transparent px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[#4f4e59]`}
    >
      {children}
    </span>
  )
}
