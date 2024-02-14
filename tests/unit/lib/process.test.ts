import { describe, expect, it } from "vitest"

import { prepareFixtures } from "~/utils/fixtures"

import processCssMediaSplitter from "@/process"

const assetDir = "styles"

describe.sequential("processCssMediaSplitter", () => {
  const { COMPILED_SMALL_APP_PATH, COMPILED_BIG_APP_PATH } = prepareFixtures()

  it("return null when all media files are smaller then 150 chars by default", async () => {
    const result = await processCssMediaSplitter({
      distDir: COMPILED_SMALL_APP_PATH,
      assetDir,
    })

    expect(result).toBe(null)
  })

  it("return mediaData, resolver and report when some media files are bigger then 150 chars by default", async () => {
    const result = (await processCssMediaSplitter({
      distDir: COMPILED_BIG_APP_PATH,
      assetDir,
    }))!
    const mediaFilePath = `/${assetDir}/app.css`

    expect(result.manifest).toHaveProperty(mediaFilePath)
    expect(result.manifest[mediaFilePath]).toStrictEqual([
      ["screen and (min-width: 1000px)", "/styles/screen-and-minwidth-1000px__app.css"],
    ])

    expect(result.report).toStrictEqual({
      "tests/unit/fixtures/compiled/app-big/styles/app.css": {
        content: {
          original: 310,
          transformed: 48,
        },
        mediaFiles: [
          {
            path: "tests/unit/fixtures/compiled/app-big/styles/screen-and-minwidth-1000px__app.css",
            query: "screen and (min-width: 1000px)",
            size: 255,
          },
        ],
      },
    })
  })

  it("return mediaData, resolver and report when some media files are bigger then 10 chars by user config", async () => {
    const result = (await processCssMediaSplitter({
      distDir: COMPILED_SMALL_APP_PATH,
      assetDir,
      mediaFileMinSize: 10,
    }))!
    const mediaFilePath = `/${assetDir}/app.css`

    expect(result.manifest).toHaveProperty(mediaFilePath)
    expect(result.manifest[mediaFilePath]).toStrictEqual([
      ["screen and (min-width: 1000px)", "/styles/screen-and-minwidth-1000px__app.css"],
    ])

    expect(result.report).toStrictEqual({
      "tests/unit/fixtures/compiled/app-small/styles/app.css": {
        content: {
          original: 153,
          transformed: 50,
        },
        mediaFiles: [
          {
            path: "tests/unit/fixtures/compiled/app-small/styles/screen-and-minwidth-1000px__app.css",
            query: "screen and (min-width: 1000px)",
            size: 94,
          },
        ],
      },
    })
  })
})
