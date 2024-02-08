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

  it("return mediaData and resolver when some media files are bigger then 150 chars by default", async () => {
    const result = (await processCssMediaSplitter({
      distDir: COMPILED_BIG_APP_PATH,
      assetDir,
    }))!
    const mediaFilePath = `/${assetDir}/app.css`

    expect(result.manifest).toHaveProperty(mediaFilePath)
    expect(result.manifest[mediaFilePath]).toStrictEqual([
      ["screen and (min-width: 1000px)", "/styles/screen-and-minwidth-1000px__app.css"],
    ])
  })

  it("return mediaData and resolver when some media files are bigger then 10 chars by user config", async () => {
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
  })
})
