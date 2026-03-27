import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"]
    }
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./", import.meta.url)),
      "@shared": fileURLToPath(new URL("./shared", import.meta.url)),
      "@entities": fileURLToPath(new URL("./entities", import.meta.url)),
      "@features": fileURLToPath(new URL("./features", import.meta.url)),
      "@widgets": fileURLToPath(new URL("./widgets", import.meta.url)),
      "@pages": fileURLToPath(new URL("./pages", import.meta.url))
    }
  }
})
