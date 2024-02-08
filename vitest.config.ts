import path from "node:path"

import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: [
      "tests/**/*.test.ts",
    ],
    exclude: [
      "playground/**/*",
      ...configDefaults.exclude,
    ],
    alias: {
      "@": path.join(__dirname, "src"),
      "~": path.join(__dirname, "tests"),
    },
    fileParallelism: false,
  },
})
