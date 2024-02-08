import path from "node:path"
import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  test: {
    include: [
      "tests/*.fs.test.ts",
    ],
    alias: {
      "@": path.resolve(__dirname, "..", "..", "src"),
    },
  },
})
