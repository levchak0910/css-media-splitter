import path from "node:path"

import { file } from "../utils/fs"

import type { MediaData } from "../models/Media"

import { getMediaFile } from "./extract-media-data"

interface MainOptions {
  path: string
  content: string
}

export async function writeMainCSSFile(options: MainOptions): Promise<void> {
  await file.write.plain(options.path, options.content)
}

interface MediaOptions {
  mediaData: MediaData[]
  distDir: string
  assetDir: string
}

export async function writeMediaCSSFiles(options: MediaOptions) {
  const rootPath = path.resolve(options.distDir, options.assetDir)

  const mediaFilesPromises = options.mediaData.map(async (data) => {
    const mediaFile = getMediaFile(data)
    const mediaFilePath = path.resolve(rootPath, mediaFile.name)
    await file.write.plain(mediaFilePath, mediaFile.content)
  })

  await Promise.all(mediaFilesPromises)
}
