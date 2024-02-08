import { describe, expect, it } from "vitest"

import type { MediaData, MediaManifest } from "@/models/Media"
import type { FileData } from "@/models/File"

import { extractMedia, getMediaManifest } from "@/functions/extract-media-data"

import { compressCSS } from "~/utils/css"

const defaultCSS = /* css */`
  #some {
    background: red;
    color: white;
  }
`
const smallMediaCSS = /* css */`
  @media screen and (min-width: 1000px) {
    #some {
      background: white;
      color: red;
    }  
  }
`
const bigMediaCSS = /* css */`
  @media screen and (min-width: 2000px) {
    #some {
      background: white;
      color: red;
      display: flex;
      justify-content: center;
      align-items: center;
    }  
  }
`

function getCSSFile(content: string): FileData {
  return {
    path: {
      absolute: "/path/to/dist/style.css",
      full: "/dist/style.css",
    },
    base: "style.css",
    name: "style",
    content,
  }
}
function getMediaData(css: string, width: number): MediaData {
  return {
    filePath: "/dist/style.css",
    fileName: "style.css",
    name: `screen-and-minwidth-${width}px`,
    query: `screen and (min-width: ${width}px)`,
    nodeContents: [compressCSS(css.split("\n").filter(l => l.startsWith(" ".repeat(4))).join(""))],
  }
}
function getManifest(width: number): MediaManifest {
  return {
    "/dist/style.css": [
      [`screen and (min-width: ${width}px)`, `/dist/screen-and-minwidth-${width}px__style.css`],
    ],
  }
}

describe.sequential("extract media data", () => {
  describe.sequential("extractMedia", () => {
    it("return unchanged cssFile content and empty media data when cssFile.content is smaller then provided minSize", async () => {
      const finalCSS = compressCSS([defaultCSS, smallMediaCSS].join(""))
      const result = await extractMedia(getCSSFile(finalCSS), 150)

      expect(result.mediaData).toStrictEqual([])
      expect(result.transformedCSS).toBe(finalCSS)
    })

    it("extract all media data that bigger than provided minSize", async () => {
      const finalCSS = compressCSS([defaultCSS, smallMediaCSS, bigMediaCSS].join(""))
      const result = await extractMedia(getCSSFile(finalCSS), 100)

      expect(result.mediaData).toStrictEqual<MediaData[]>([getMediaData(bigMediaCSS, 2000)])
      expect(result.transformedCSS).toBe(compressCSS([defaultCSS, smallMediaCSS].join("")))
    })
  })

  describe.sequential("getMediaManifest", () => {
    it("return empty object", async () => {
      const manifest = await getMediaManifest({
        mediaData: [],
        assetDir: "dist",
      })

      expect(manifest).toStrictEqual({})
    })

    it("return media manifest", async () => {
      const manifest = await getMediaManifest({
        mediaData: [getMediaData(bigMediaCSS, 2000)],
        assetDir: "dist",
      })

      expect(manifest).toStrictEqual<MediaManifest>(getManifest(2000))
    })

    it("auto remove extra slashes", async () => {
      const manifest = await getMediaManifest({
        mediaData: [getMediaData(bigMediaCSS, 2000)],
        assetDir: "/dist///",
      })

      expect(manifest).toStrictEqual<MediaManifest>(getManifest(2000))
    })
  })
})
