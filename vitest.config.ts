import path from "node:path"
import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

const dirname = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  test: {
    include: [
      "playground/**/tests/**/*.fs.test.ts",
      "tests/**/*.test.ts",
    ],
    alias: {
      "@": path.join(dirname, "src"),
      "~": path.join(dirname, "tests"),
    },
    fileParallelism: false,
  },
})
