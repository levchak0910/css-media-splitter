import postcss, { type AtRule } from "postcss"
import { kebabCase } from "case-anything"

import type { FileData } from "../models/File"
import type { MediaData, MediaManifest } from "../models/Media"

export async function extractMedia(cssFile: FileData, minSize: number): Promise<{ mediaData: MediaData[], transformedCSS: string }> {
  const ast = postcss().process(cssFile.content)
  const mq: MediaData[] = []

  const atRuleStore = new Map<string, Set<AtRule>>()

  ast.root.walkAtRules("media", (atRule) => {
    const query = atRule.params
    const name = kebabCase(query)

    const content = atRule.nodes.map(node => node.toString()).join("")

    const existingMQRecord = mq.find(data => data.filePath === cssFile.path.full && data.name === name)

    if (existingMQRecord) {
      existingMQRecord.nodeContents.push(content)
    }
    else {
      mq.push({
        filePath: cssFile.path.full,
        fileName: cssFile.base,
        name,
        query,
        nodeContents: [content],
      })
    }

    if (atRuleStore.has(query)) {
      const set = atRuleStore.get(query)!
      set.add(atRule)
    }
    else {
      atRuleStore.set(query, new Set([atRule]))
    }
  })

  atRuleStore.forEach((set, query) => {
    const existingMQRecordIndex = mq.findIndex(data => data.query === query)
    const contentLength = mq[existingMQRecordIndex].nodeContents.join("").length

    if (contentLength < minSize)
      mq.splice(existingMQRecordIndex, 1)

    else
      set.forEach(atRule => atRule.remove())
  })

  return {
    mediaData: mq,
    transformedCSS: ast.root.toString(),
  }
}

interface MediaManifestOptions {
  mediaData: MediaData[]
  assetDir: string
}

export function getMediaManifest(options: MediaManifestOptions): MediaManifest {
  const mediaManifest = options.mediaData.reduce((acc, data) => {
    const mediaFile = getMediaFile(data)
    const href = `/${options.assetDir}/${mediaFile.name}`.replace(/\/+/g, "/")
    const accRecord = [data.query, href] as const

    const recordName = data.filePath
    const existingRecord = acc[recordName]

    if (existingRecord)
      existingRecord.push(accRecord)
    else acc[recordName] = [accRecord]

    return acc
  }, {} as MediaManifest)

  return mediaManifest
}

export function getMediaFile(mediaData: MediaData): { name: string, content: string } {
  return {
    name: `${mediaData.name}__${mediaData.fileName}`,
    content: `@media ${mediaData.query}{${mediaData.nodeContents.join("")}}`,
  }
}
