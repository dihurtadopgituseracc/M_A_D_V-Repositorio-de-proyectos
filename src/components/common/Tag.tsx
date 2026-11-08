import { semi } from "@/constants/styles"

export default function Tag({ children }: { children: string }) {
  return (
    <span
      className={`${semi} rounded-[4px] border border-tinta/15 bg-transparent px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-grafito`}
    >
      {children}
    </span>
  )
}
