import type { MediaManifest } from "./models/Media"
import type { Loader } from "./models/Loader"
import type { Report } from "./models/Report"

import { getBundleFiles } from "./functions/get-bundle-files"
import { extractMedia, getMediaManifest } from "./functions/extract-media-data"
import { getLoader } from "./functions/get-loader"
import { writeMainCSSFile, writeMediaCSSFiles } from "./functions/write-css-files"
import { getReport } from "./functions/report"

interface Options {
  distDir: string
  assetDir: string
  mediaFileMinSize?: number
}

const DEFAULT_MEDIA_FILE_MIN_SIZE = 150

export default async function processCssMediaSplitter(options: Options): Promise<null | {
  loader: Loader
  manifest: MediaManifest
  report: Report
}> {
  const { distDir, assetDir } = options

  const mediaFileMinSize = options?.mediaFileMinSize ?? DEFAULT_MEDIA_FILE_MIN_SIZE

  const report: Report = {}

  const { cssFiles } = await getBundleFiles({ distDir })

  const mediaDataPromises = cssFiles.map(async (file) => {
    const { mediaData, transformedCSS } = await extractMedia(file, mediaFileMinSize)

    if (mediaData.length > 0) {
      await writeMainCSSFile({
        path: file.path.absolute,
        content: transformedCSS,
      })

      const fileReport = getReport({
        distDir: options.distDir,
        assetDir: options.assetDir,
        mainCSSFile: file,
        transformedCSS,
        mediaData,
      })

      Object.assign(report, fileReport)
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

  const loader = getLoader(mediaManifest)

  return {
    loader,
    manifest: mediaManifest,
    report,
  }
}
