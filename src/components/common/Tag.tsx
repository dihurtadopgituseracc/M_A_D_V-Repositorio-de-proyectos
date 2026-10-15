import { semi } from "@/constants/styles"

export default function Tag({ children }: { children: string }) {
  return (
    <span className={`${semi} rounded-full border border-[#171827]/10 bg-white/55 px-3 py-1.5 text-[11px] text-[#4f4e59]`}>
      {children}
    </span>
  )
}
