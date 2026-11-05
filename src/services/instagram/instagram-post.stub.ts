import type { InstagramPostResult } from "./instagram-post"

// Vitest no ejecuta el plugin de Vite que descarga el post; los tests usan este valor vacío.
const result: InstagramPostResult = { status: "empty" }

export default result
