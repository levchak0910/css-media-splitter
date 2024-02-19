import path from "node:path"

import { file } from "../utils/fs"

import type { MediaRecord } from "../models/Media"

import { getMediaFile } from "./extract-media-data"

interface WriteMainCSSFileOptions {
  path: string
  content: string
}

export async function writeMainCSSFile(options: WriteMainCSSFileOptions): Promise<void> {
  await file.write.plain(options.path, options.content)
}

interface WriteMediaCSSFilesOptions {
  mediaData: MediaRecord[]
  distDir: string
}

export async function writeMediaCSSFiles(options: WriteMediaCSSFilesOptions) {
  const mediaFilesPromises = options.mediaData.map(async (record) => {
    const mediaFile = getMediaFile(record)
    const mediaFilePath = path.join(options.distDir, mediaFile.href)
    await file.write.plain(mediaFilePath, mediaFile.content)
  })

  await Promise.all(mediaFilesPromises)
}
