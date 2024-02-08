import path from "node:path"

import { file } from "../utils/fs"

import type { MediaData } from "../models/Media"

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
    const mediaFilePath = path.resolve(rootPath, `${data.name}__${data.fileName}`)
    const rulesContent = data.nodeContents.join("")
    const content = `@media ${data.query}{${rulesContent}}`
    await file.write.plain(mediaFilePath, content)
  })

  await Promise.all(mediaFilesPromises)
}
