import path from "node:path"

import { describe, expect, it } from "vitest"

import { file } from "@/utils/fs"

import { prepareFixtures } from "~/utils/fixtures"

import { writeMainCSSFile, writeMediaCSSFiles } from "@/api"

const assetDir = "styles"

describe.sequential("write css files", async () => {
  const { COMPILED_BIG_APP_PATH } = prepareFixtures()

  it("correctly write main css file", async () => {
    const cssFilePath = path.join(COMPILED_BIG_APP_PATH, assetDir, "app.css")
    const cssFileContent = "content"

    await writeMainCSSFile({
      path: cssFilePath,
      content: cssFileContent,
    })

    const cssFileChangedContent = await file.read.plain(cssFilePath)

    expect(cssFileChangedContent).toBe(cssFileContent)
  })

  it("correctly write media css files", async () => {
    const cssFilePath = path.join(COMPILED_BIG_APP_PATH, assetDir, "app.css")
    const mediaName = "media-name"
    const mediaQuery = "media-query"
    const mediaFileContent = "content"

    await writeMediaCSSFiles({
      assetDir,
      distDir: COMPILED_BIG_APP_PATH,
      mediaData: [{
        filePath: cssFilePath,
        fileName: "app.css",
        name: mediaName,
        query: mediaQuery,
        nodeContents: [mediaFileContent],
      }],
    })

    const cssMediaFilePath = path.join(COMPILED_BIG_APP_PATH, assetDir, `${mediaName}__app.css`)
    const cssMediaFileContent = await file.read.plain(cssMediaFilePath)

    expect(cssMediaFileContent).toContain(`@media ${mediaQuery}`)
    expect(cssMediaFileContent).toContain(mediaFileContent)
  })
})
