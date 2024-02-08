import path from "node:path"

import { defineNuxtModule } from "@nuxt/kit"
import type { NuxtModule } from "@nuxt/schema"

import { LIB_NAME } from "../config"

import { file } from "../utils/fs"

import type { Handler } from "../models/Handler"

import { getBundleFiles } from "../functions/get-bundle-files"
import { writeHTMLFiles } from "../functions/write-html-files"

import processCssMediaSplitter from "../process"

export default defineNuxtModule({
  meta: {
    name: `nuxt-module-${LIB_NAME}`,
    configKey: "nuxtModuleCssMediaSplitter",
  },
  async setup(_options, nuxt) {
    if (nuxt.options._prepare)
      return

    const IS_GENERATE = nuxt.options._generate
    const IS_BUILD = !nuxt.options._generate && !nuxt.options._prepare && !nuxt.options._start && !nuxt.options.dev

    const DATA_REPLACER = { id: "data" }
    const HANDLER_REPLACER = { id: "handler" }

    if (nuxt.options.app.head.script)
      nuxt.options.app.head.script.push(DATA_REPLACER, HANDLER_REPLACER)
    else
      nuxt.options.app.head.script = [DATA_REPLACER, HANDLER_REPLACER]

    if (IS_GENERATE) {
      await nuxt.hook("close", async () => {
        const distDir = path.resolve(nuxt.options.rootDir, ".output", "public")
        const assetDir = nuxt.options.app.buildAssetsDir.replaceAll("/", "")

        const { handler } = await processCssMediaSplitter({
          distDir,
          assetDir,
        })

        const { htmlFiles } = await getBundleFiles({ distDir })

        await writeHTMLFiles({
          files: htmlFiles,
          assetDir,
          html: handler.html,
        })
      })
    }

    if (IS_BUILD) {
      let handler: Handler | undefined

      await nuxt.hook("build:done", async () => {
        const distDir = path.resolve(nuxt.options.buildDir, "dist", "client")
        const assetDir = nuxt.options.app.buildAssetsDir.replaceAll("/", "")

        const result = await processCssMediaSplitter({
          distDir,
          assetDir,
        })

        handler = result.handler
      })

      await nuxt.hook("close", async () => {
        const rendererPath = path.resolve(nuxt.options.rootDir, ".output", "server", "chunks", "handlers", "renderer.mjs")
        let renderer = await file.read.plain(rendererPath)

        renderer = renderer.replace(
          JSON.stringify(DATA_REPLACER),
          JSON.stringify({ innerHTML: handler!.manifest.content, id: "<POST_BUILD: INSERT TEMPLATE ID>", type: "application/json" }),
        )
        renderer = renderer.replace(
          JSON.stringify(HANDLER_REPLACER),
          JSON.stringify({ innerHTML: handler!.script.content }),
        )

        await file.write.plain(rendererPath, renderer)
      })
    }
  },
}) as NuxtModule
