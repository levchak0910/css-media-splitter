import path from "node:path"

import type { Plugin, ResolvedConfig } from "vite"

import { LIB_NAME } from "../config"

import { getBundleFiles } from "../functions/get-bundle-files"
import { writeHTMLFiles } from "../functions/write-html-files"
import { stringifyReport } from "../functions/report"

import processCssMediaSplitter from "../process"
import { getNativeLinksHtml } from "../functions/get-native-links"

interface Options {
  mediaFileMinSize?: number,
  useNativeLinkMedia?: boolean
}

export default function VitePluginCssMediaSplitter(options?: Options): Plugin {
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

        const result = await processCssMediaSplitter({
          distDir,
          mediaFileMinSize: options?.mediaFileMinSize,
        })

        if (result === null)
          return

        const { htmlFiles } = await getBundleFiles({ distDir })

        await writeHTMLFiles({
          files: htmlFiles,
          html: options?.useNativeLinkMedia ? getNativeLinksHtml(result.mediaData) : result.loader.html,
        })

        // eslint-disable-next-line no-console
        console.log(stringifyReport(result.report, "vite"))
      },
    },
  }
}
