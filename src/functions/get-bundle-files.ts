import path from "node:path"

import { dir, file } from "../utils/fs"

import type { FileData } from "../models/File"

interface Options {
  distDir: string
}

export async function getBundleFiles(options: Options): Promise<Record<"cssFiles" | "htmlFiles", FileData[]>> {
  const files = await dir.read.files(options.distDir, { recursive: true, absolute: true })

  const [cssFiles, htmlFiles] = await Promise.all([
    getFilesByType("css", files, options.distDir),
    getFilesByType("html", files, options.distDir),
  ])

  return { cssFiles, htmlFiles }
}

async function getFilesByType(type: "html" | "js" | "css", files: string[], distDir: string) {
  const filteredFiles = files.filter(f => path.parse(f).ext === `.${type}`)

  const filesDataPromises = filteredFiles.map(async (filePath) => {
    const filePathParsed = path.parse(filePath)
    const fileFullPath = path.relative(path.resolve(distDir), filePath)

    const content = await file.read.plain(filePath)

    return {
      path: {
        absolute: filePath,
        full: `/${fileFullPath}`,
      },
      name: filePathParsed.name,
      base: filePathParsed.base,
      content,
    }
  })

  const filesData = await Promise.all(filesDataPromises)
  return filesData
}
