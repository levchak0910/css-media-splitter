import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

function patchCjs(cjsModulePath: string, name: string) {
  const cjsModule = readFileSync(cjsModulePath, "utf-8")
  writeFileSync(
    cjsModulePath,
    cjsModule
      .replace(`'use strict';`, `'use strict';Object.defineProperty(exports, '__esModule', {value: true});`)
      .replace(`module.exports = ${name};`, `exports.default = ${name};`),
    { encoding: "utf-8" },
  )
}

patchCjs(resolve("./dist/integrations/vite-plugin.cjs"), "VitePluginCssMediaSplitter")
patchCjs(resolve("./dist/integrations/nuxt-module.cjs"), "nuxtModule")
patchCjs(resolve("./dist/process.cjs"), "processCssMediaSplitter")
