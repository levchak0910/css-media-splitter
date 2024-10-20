import path from "node:path"

import { parse, type VariableDeclarator } from "acorn"
import * as walk from "acorn-walk"
import createEtag from "etag"

import { file } from "../utils/fs"

interface Asset {
  type: string
  etag: string
  mtime: string
  size: number
  path: string
}

type Assets = Record<string, Asset>

interface AssetsPosition { start: number, end: number }

export function extractAssets(code: string): { assets: Assets, pos: AssetsPosition } {
  let assets: Record<string, Asset> = {}
  let start = 0
  let end = 0

  const program = parse(code, { ecmaVersion: "latest", sourceType: "module" })

  walk.simple(program, {
    VariableDeclarator(node: VariableDeclarator) {
      if (node.id.type !== "Identifier" || node.id.name !== "assets")
        return

      start = node.init!.start
      end = node.init!.end

      const jsonObj = code.slice(start, end)
      assets = JSON.parse(jsonObj)
    },
  })

  return { assets, pos: { start, end } }
}

interface RewriteAssetsOptions {
  assets: Record<string, Asset>
  distDir: string
  assetsFileContent: string
  assetsFilePath: string
  assetsPosition: AssetsPosition
}

export async function rewriteAssets(options: RewriteAssetsOptions): Promise<void> {
  const recalculatedAssets = structuredClone(options.assets)
  const files = Object.keys(options.assets)

  const fileProcesses = files
    .filter(f => f.endsWith(".html"))
    .map(async (fileRelativePath) => {
      const filePath = path.join(options.distDir, fileRelativePath)
      const fileContent = await file.read.plain(filePath)
      const etag = createEtag(fileContent)

      recalculatedAssets[fileRelativePath].etag = etag
      recalculatedAssets[fileRelativePath].size = fileContent.length
    })

  await Promise.all(fileProcesses)

  const newAssetsFileContent = [
    options.assetsFileContent.slice(0, options.assetsPosition.start),
    JSON.stringify(recalculatedAssets, null, 2),
    options.assetsFileContent.slice(options.assetsPosition.end),
  ].join("")

  await file.write.plain(options.assetsFilePath, newAssetsFileContent)
}
