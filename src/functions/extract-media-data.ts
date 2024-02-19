import postcss, { type AtRule } from "postcss"

import type { FileData } from "../models/File"
import type { MediaManifest, MediaRecord } from "../models/Media"

export const getMediaName = (query: string) => query.toLowerCase().replace("screen", "S").replace("min-width", "W").replace(/\W/g, "")
export const getLinkHref = (query: string, sourceUrl: string) => `${sourceUrl.split(".").slice(0, -1).join(".")}.${getMediaName(query)}.css`

export async function extractMedia(cssFile: FileData, minSize: number): Promise<{ mediaData: MediaRecord[], transformedCSS: string }> {
  const ast = postcss().process(cssFile.content)
  const mq: MediaRecord[] = []

  const atRuleStore = new Map<string, Set<AtRule>>()

  ast.root.walkAtRules("media", (atRule) => {
    const mediaQuery = atRule.params
    const mediaName = getMediaName(mediaQuery)

    const content = atRule.nodes.map(node => node.toString()).join("")

    const existingMQRecord = mq.find(record => record.filePath === cssFile.path.full && record.mediaName === mediaName)

    if (existingMQRecord) {
      existingMQRecord.nodeContents.push(content)
    }
    else {
      mq.push({
        filePath: cssFile.path.full,
        fileBase: cssFile.base,
        mediaName,
        mediaQuery,
        nodeContents: [content],
      })
    }

    if (atRuleStore.has(mediaQuery)) {
      const set = atRuleStore.get(mediaQuery)!
      set.add(atRule)
    }
    else {
      atRuleStore.set(mediaQuery, new Set([atRule]))
    }
  })

  atRuleStore.forEach((set, query) => {
    const existingMQRecordIndex = mq.findIndex(record => record.mediaQuery === query)
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
  mediaData: MediaRecord[]
}

export function getMediaManifest(options: MediaManifestOptions): MediaManifest {
  const mediaManifest = options.mediaData.reduce<MediaManifest>((acc, record) => {
    const recordName = record.filePath
    const existingRecord = acc[recordName]

    if (existingRecord)
      existingRecord.push(record.mediaQuery)
    else acc[recordName] = [record.mediaQuery]

    return acc
  }, {})

  return mediaManifest
}

export function getMediaFile(mediaRecord: MediaRecord): { href: string, content: string } {
  return {
    href: getLinkHref(mediaRecord.mediaQuery, mediaRecord.filePath),
    content: `@media ${mediaRecord.mediaQuery}{${mediaRecord.nodeContents.join("")}}`,
  }
}
