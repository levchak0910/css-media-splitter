import path from "node:path"

import { describe, expect, it } from "vitest"

import { file } from "@/utils/fs"

import { prepareFixtures } from "~/utils/fixtures"

import { writeHTMLFiles } from "@/api"
import { LOADER_REPLACE_COMMENT } from "@/config"

const assetDir = "styles"

describe.sequential("write html files", async () => {
  const { COMPILED_BIG_APP_PATH } = prepareFixtures()

  it("correctly write html files when loader comment is present", async () => {
    const htmlFilePath = path.join(COMPILED_BIG_APP_PATH, "index.html")
    const htmlFileContent = "LOADER_HTML"

    await writeHTMLFiles({
      assetDir,
      html: htmlFileContent,
      files: [{
        path: {
          absolute: htmlFilePath,
          full: "/index.html",
        },
        base: "index.html",
        name: "index",
        content: `content1${LOADER_REPLACE_COMMENT}content2`,
      }],
    })

    const htmlFileChangedContent = await file.read.plain(htmlFilePath)

    expect(htmlFileChangedContent).toBe(`content1${htmlFileContent}content2`)
  })

  it("correctly write html files when loader comment is not present and link/script is preset", async () => {
    const htmlFilePath = path.join(COMPILED_BIG_APP_PATH, "index.html")
    const htmlFileContent = "LOADER_HTML"

    const linkHTML = `<link rel="ANY" href="/${assetDir}/app.ANY">`

    await writeHTMLFiles({
      assetDir,
      html: htmlFileContent,
      files: [{
        path: {
          absolute: htmlFilePath,
          full: "/index.html",
        },
        base: "index.html",
        name: "index",
        content: `content1${linkHTML}content2`,
      }],
    })

    const htmlFileChangedContent = await file.read.plain(htmlFilePath)

    expect(htmlFileChangedContent).toBe(`content1${htmlFileContent}${linkHTML}content2`)
  })
})
