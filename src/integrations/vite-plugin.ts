import path from "node:path"

import type { Plugin, ResolvedConfig } from "vite"

import { LIB_NAME } from "../config"

import { getBundleFiles } from "../functions/get-bundle-files"
import { writeHTMLFiles } from "../functions/write-html-files"

import processCssMediaSplitter from "../process"

export default function VitePluginCssMediaSplitter(): Plugin {
  let config: undefined | ResolvedConfig

  return {
    name: `vite-plugin-${LIB_NAME}`,
    enforce: "post",
    configResolved(_config) {
      config = _config
    },
    closeBundle: {
      order: "post",
      sequential: true,
      async handler() {
        if (!config)
          throw new Error("no config")

        const distDir = path.resolve(config.root, config.build.outDir)
        const assetDir = config.build.assetsDir

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
      },
    },
  }
}
