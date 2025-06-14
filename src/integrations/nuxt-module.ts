import path from "node:path"

import { defineNuxtModule } from "@nuxt/kit"
import type { NuxtModule } from "@nuxt/schema"

import { LIB_NAME } from "../config"

import { file } from "../utils/fs"

import type { Loader } from "../models/Loader"

import { getBundleFiles } from "../functions/get-bundle-files"
import { writeHTMLFiles } from "../functions/write-html-files"
import { stringifyReport } from "../functions/report"
import { extractAssets, rewriteAssets } from "../functions/nuxt-assets"

import processCssMediaSplitter from "../core"

interface Options {
  mediaFileMinSize?: number
}

export default defineNuxtModule<Options>({
  meta: {
    name: `nuxt-module-${LIB_NAME}`,
    configKey: "nuxtModuleCssMediaSplitter",
  },
  async setup(options, nuxt) {
    if (nuxt.options._prepare)
      return

    // Prevent style inlining
    nuxt.options.features.inlineStyles = false

    const IS_GENERATE = nuxt.options.nitro.static || (nuxt.options as any)._generate /* TODO: remove in future */
    const IS_BUILD = !IS_GENERATE && !nuxt.options._prepare && !nuxt.options._start && !nuxt.options.dev

    if (IS_GENERATE) {
      await nuxt.hook("close", async () => {
        const distDir = path.resolve(nuxt.options.rootDir, ".output", "public")

        const result = await processCssMediaSplitter({
          distDir,
          mediaFileMinSize: options.mediaFileMinSize,
        })

        if (result === null)
          return

        const { htmlFiles } = await getBundleFiles({ distDir })

        await writeHTMLFiles({
          files: htmlFiles,
          html: result.loader.html,
        })
      })
    }

    if (IS_BUILD) {
      const MANIFEST_REPLACER = { id: `${LIB_NAME}--nuxt-manifest` }
      const LOADER_REPLACER = { id: `${LIB_NAME}--nuxt-loader` }

      if (nuxt.options.app.head.script)
        nuxt.options.app.head.script.push(MANIFEST_REPLACER, LOADER_REPLACER)
      else
        nuxt.options.app.head.script = [MANIFEST_REPLACER, LOADER_REPLACER]

      let loader: Loader | null = null

      await nuxt.hook("build:done", async () => {
        const distDir = path.resolve(nuxt.options.buildDir, "dist", "client")

        const result = await processCssMediaSplitter({
          distDir,
          mediaFileMinSize: options.mediaFileMinSize,
        })

        if (result === null)
          return

        loader = result.loader

        // eslint-disable-next-line no-console
        console.log(stringifyReport(result.report, "nuxt"))
      })

      await nuxt.hook("close", async () => {
        if (loader === null)
          return

        const SERVER_CHUNKS_DIR = path.resolve(nuxt.options.rootDir, ".output", "server", "chunks")
        const distDir = path.resolve(nuxt.options.rootDir, ".output", "public")

        const potentialRendererPaths = [
          path.join(SERVER_CHUNKS_DIR, "routes", "renderer.mjs"),
          path.join(SERVER_CHUNKS_DIR, "handlers", "renderer.mjs"),
        ]

        let renderer = ""
        let rendererPath = ""

        for await (const chunkPath of potentialRendererPaths) {
          try {
            renderer = await file.read.plain(chunkPath)
            rendererPath = chunkPath
            break
          }
          catch { continue }
        }

        renderer = renderer.replace(
          JSON.stringify(MANIFEST_REPLACER),
          JSON.stringify({
            id: "<POST_BUILD: INSERT TEMPLATE MANIFEST ID>",
            type: "application/json",
            innerHTML: loader.manifest.content,
            // https://github.com/unjs/unhead/blob/cda1045f2af93af3b4a2e3b4b834c18048e246a8/packages/unhead/src/types/tags.ts#L48
            tagPriority: 0,
          }),
        )
        renderer = renderer.replace(
          JSON.stringify(LOADER_REPLACER),
          JSON.stringify({
            innerHTML: loader.script.content,
            // https://github.com/unjs/unhead/blob/cda1045f2af93af3b4a2e3b4b834c18048e246a8/packages/unhead/src/types/tags.ts#L48
            tagPriority: 0,
          }),
        )

        await file.write.plain(rendererPath, renderer)

        const { htmlFiles } = await getBundleFiles({ distDir })

        if (htmlFiles.length === 0)
          return

        const scripts = [MANIFEST_REPLACER.id, LOADER_REPLACER.id].map(id => new RegExp(`<script id="${id}"></script>\n?`))

        await writeHTMLFiles({
          files: htmlFiles,
          html: loader.html,
          replace: scripts.map(s => [s, ""] as const),
        })

        const potentialAssetsFilePaths = [
          path.join(SERVER_CHUNKS_DIR, "nitro", "nitro.mjs"),
          path.join(SERVER_CHUNKS_DIR, "runtime.mjs"),
          path.join(SERVER_CHUNKS_DIR, "nitro", "node-server.mjs"),
        ]

        let assetsFileContent = ""
        let assetsFilePath = ""

        for await (const potentialAssetsFilePath of potentialAssetsFilePaths) {
          try {
            assetsFileContent = await file.read.plain(potentialAssetsFilePath)
            assetsFilePath = potentialAssetsFilePath
            break
          }
          catch { continue }
        }

        const result = extractAssets(assetsFileContent)
        await rewriteAssets({
          assets: result.assets,
          distDir,
          assetsFilePath,
          assetsFileContent,
          assetsPosition: result.pos,
        })
      })
    }
  },
}) as NuxtModule<Options>
