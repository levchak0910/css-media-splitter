import path from "node:path"

import pc from "picocolors"

import { LIB_NAME } from "../config"

import type { Report } from "../models/Report"
import type { FileData } from "../models/File"
import type { MediaData } from "../models/Media"

import { formatBytes, formatFloat } from "../utils/format"

import { getMediaFile } from "../functions/extract-media-data"

interface Options {
  mainCSSFile: FileData
  transformedCSS: string
  mediaData: MediaData[]
  distDir: string
  assetDir: string
}

const relativizePath = (p: string) => path.relative(path.resolve("."), p)

export function getReport(options: Options): Report {
  const report: Report = {}

  const reportKey = path.isAbsolute(options.mainCSSFile.path.absolute) ? options.mainCSSFile.path.absolute : path.resolve(options.mainCSSFile.path.absolute)

  report[relativizePath(reportKey)] = {
    content: {
      original: options.mainCSSFile.content.length,
      transformed: options.transformedCSS.length,
    },
    mediaFiles: options.mediaData.map((data) => {
      const mediaFile = getMediaFile(data)

      return {
        path: relativizePath(path.resolve(path.join(options.distDir, options.assetDir, mediaFile.name))),
        query: data.query,
        size: mediaFile.content.length,
      }
    }),
  }

  return report
}

export function stringifyReport(report: Report, reporterName: string = ""): string {
  const lines: string[] = []

  lines.push(`${pc.blue(pc.bold(`${LIB_NAME}${reporterName ? `:${reporterName}` : ""}`))}`)

  const filesAmount = Object.keys(report).length
  lines.push(`${pc.green("✓")} ${filesAmount} css file${filesAmount > 1 ? "s" : ""} transformed.`)

  Object.entries(report).forEach(([mainCSSFilePath, data]) => {
    const diff = data.content.transformed - data.content.original
    const ratio = diff / data.content.original * 100

    const tMainFilePath = pc.black(mainCSSFilePath)
    const tMainFileOSize = pc.yellow(formatBytes(data.content.original))
    const tMainFileTSize = pc.green(formatBytes(data.content.transformed))
    const tDiff = pc.gray(formatBytes(diff))
    const tRatio = pc.bold(pc.green(`${formatFloat(ratio)}%`))

    lines.push(`${tMainFilePath} | ${tMainFileOSize} => ${tMainFileTSize} (${tDiff}, ${tRatio})`)

    data.mediaFiles.forEach((mf, ind) => {
      const pref = pc.gray(data.mediaFiles.length - 1 === ind ? "└─" : "├─")
      lines.push(` ${pref} ${pc.cyan(pc.bold(mf.query))}: ${pc.gray(mf.path)} (${pc.yellow(formatBytes(mf.size))})`)
    })
  })

  return `\n${lines.join("\n")}\n`
}
