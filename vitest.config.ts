import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "virtual:instagram-post": fileURLToPath(
        new URL("./src/services/instagram/instagram-post.stub.ts", import.meta.url),
      ),
    },
  },

  test: {
    include: ["src/**/*.test.{ts,tsx}"],
  },
})
