import path from "node:path"

import { describe, expect, it } from "vitest"

import { getBundleFiles } from "@/api"
import type { FileData } from "@/models/File"
import { file } from "@/utils/fs"
import { prepareFixtures } from "~/utils/fixtures"

describe.sequential("getBundleFiles", () => {
  const { SMALL_APP_PATH } = prepareFixtures()

  it("returns css files data and html files data of the provided folder", async () => {
    const htmlFilePath = path.join(SMALL_APP_PATH, "index.html")
    const htmlFileContent = await file.read.plain(htmlFilePath)
    const cssFilePath = path.join(SMALL_APP_PATH, "styles/app.css")
    const cssFileContent = await file.read.plain(cssFilePath)

    const result = await getBundleFiles({ distDir: SMALL_APP_PATH })

    expect(result.htmlFiles).toStrictEqual<FileData[]>([{
      path: {
        absolute: htmlFilePath,
        full: "/index.html",
      },
      base: "index.html",
      name: "index",
      content: htmlFileContent,
    }])

    expect(result.cssFiles).toStrictEqual<FileData[]>([{
      path: {
        absolute: cssFilePath,
        full: "/styles/app.css",
      },
      base: "app.css",
      name: "app",
      content: cssFileContent,
    }])
  })
})
