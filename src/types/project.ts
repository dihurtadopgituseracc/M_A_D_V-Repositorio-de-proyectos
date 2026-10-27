export type Tool = {
  area: string
  detail: string
}

export type Need = {
  id: string
  name: string
  detail: string
  commitment: string
  tool: Tool
  description: string
  requirements: string[]
  deliverable: {
    name: string
    detail: string
  }
  status?: "proposed"
  featured?: boolean
}

export type Contact = {
  type: "whatsapp" | "instagram" | "discord"
  label: string
  handle: string
  href: string
}

export type Project = {
  id: string
  title: string
  shortTitle: string
  genre: string
  team: number | null
  progress: number | null
  stage: string
  status: string
  eyebrow: string
  summary: string
  tools: Tool[]
  tags: string[]
  needs: Need[]
  contacts: Contact[]
  accent: string
  artLabel: string
  artImage?: string
}
