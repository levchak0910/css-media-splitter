import type { MediaManifest } from "./models/Media"
import type { Handler } from "./models/Handler"

import { getBundleFiles } from "./functions/get-bundle-files"
import { extractMedia, getMediaManifest } from "./functions/extract-media-data"
import { getHandler } from "./functions/get-handler"
import { writeMainCSSFile, writeMediaCSSFiles } from "./functions/write-css-files"

interface Options {
  distDir: string
  assetDir: string
}

export default async function processCssMediaSplitter(options: Options): Promise<{ handler: Handler, manifest: MediaManifest }> {
  const { distDir, assetDir } = options

  const { cssFiles } = await getBundleFiles({ distDir })

  const mediaDataPromises = cssFiles.map(async (file) => {
    const { mediaData, transformedCSS } = await extractMedia(file)

    await writeMainCSSFile({
      path: file.path.absolute,
      content: transformedCSS,
    })

    return mediaData
  })

  const mediaData = (await Promise.all(mediaDataPromises)).flat()

  await writeMediaCSSFiles({
    distDir,
    assetDir,
    mediaData,
  })

  const mediaManifest = getMediaManifest({
    mediaData,
    assetDir,
  })

  const handler = getHandler(mediaManifest)

  return {
    handler,
    manifest: mediaManifest,
  }
}
