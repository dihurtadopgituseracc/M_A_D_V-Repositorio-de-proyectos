/// <reference types="vite/client" />

declare module "virtual:instagram-post" {
  import type { InstagramPostResult } from "@/services/instagram/instagram-post"

  const result: InstagramPostResult
  export default result
}
