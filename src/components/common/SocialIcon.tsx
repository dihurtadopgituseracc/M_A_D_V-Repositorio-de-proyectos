import { FaDiscord, FaInstagram, FaWhatsapp } from "react-icons/fa6"
import type { Contact } from "@/types/project"

export default function SocialIcon({ type }: { type: Contact["type"] }) {
  if (type === "whatsapp") return <FaWhatsapp aria-hidden="true" className="size-5" />
  if (type === "instagram") return <FaInstagram aria-hidden="true" className="size-5" />
  return <FaDiscord aria-hidden="true" className="size-5" />
}
