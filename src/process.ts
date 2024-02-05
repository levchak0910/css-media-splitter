import type { MediaManifest } from "./models/Media"
import type { Handler } from "./models/Handler"

import { getBundleFiles } from "./functions/get-bundle-files"
import { extractMedia, getMediaManifest } from "./functions/extract-media-data"
import { getHandler } from "./functions/get-handler"
import { writeMainCSSFile, writeMediaCSSFiles } from "./functions/write-css-files"

interface Options {
  distDir: string
  assetDir: string
  mediaFileMinSize?: number
}

const DEFAULT_MEDIA_FILE_MIN_SIZE = 150

export default async function processCssMediaSplitter(options: Options): Promise<null | { handler: Handler, manifest: MediaManifest }> {
  const { distDir, assetDir } = options

  const mediaFileMinSize = options?.mediaFileMinSize ?? DEFAULT_MEDIA_FILE_MIN_SIZE

  const { cssFiles } = await getBundleFiles({ distDir })

  const mediaDataPromises = cssFiles.map(async (file) => {
    const { mediaData, transformedCSS } = await extractMedia(file, mediaFileMinSize)

    if (mediaData.length > 0) {
      await writeMainCSSFile({
        path: file.path.absolute,
        content: transformedCSS,
      })
    }

    return mediaData
  })

  const mediaData = (await Promise.all(mediaDataPromises)).flat()

  if (mediaData.length === 0)
    return null

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
