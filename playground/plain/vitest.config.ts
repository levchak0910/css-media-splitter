import path from "node:path"
import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

const dirname = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  test: {
    include: [
      "tests/*.fs.test.ts",
    ],
    alias: {
      "@": path.resolve(dirname, "..", "..", "src"),
    },
  },
})
