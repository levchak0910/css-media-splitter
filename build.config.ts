import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: [
    "src/index",
    "src/integrations/vite-plugin",
    "src/integrations/nuxt-module",
    "src/core",
    "src/api",
  ],
  clean: true,
  declaration: true,
  externals: [
    "vite",
    "acorn",
    "acorn-walk",
    "etag",
  ],
  rollup: {
    emitCJS: true,
  },
})
