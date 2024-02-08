import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: [
    "src/index",
    "src/integrations/vite-plugin",
    "src/integrations/nuxt-module",
    "src/process",
    "src/api",
  ],
  clean: true,
  declaration: true,
  externals: [
    "vite",
  ],
  rollup: {
    emitCJS: true,
  },
})
