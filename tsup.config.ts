import { defineConfig } from "tsup"

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/integrations/vite-plugin.ts",
    "src/integrations/nuxt-module.ts",
    "src/core.ts",
    "src/api.ts",
  ],
  format: ["cjs", "esm"],
  splitting: true,
  clean: true,
  dts: true,
  external: [
    "vite",
    "acorn",
    "acorn-walk",
    "etag",
  ],
})
