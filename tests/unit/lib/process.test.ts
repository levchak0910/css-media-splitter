import { describe, expect, it } from "vitest"

import { prepareFixtures } from "~/utils/fixtures"

import processCssMediaSplitter from "@/core"

describe.sequential("processCssMediaSplitter", () => {
  const { COMPILED_SMALL_APP_PATH, COMPILED_BIG_APP_PATH } = prepareFixtures()

  it("return null when all media files are smaller then 100 chars by default", async () => {
    const result = await processCssMediaSplitter({ distDir: COMPILED_SMALL_APP_PATH })

    expect(result).toBe(null)
  })

  it("return mediaData, loader and report when some media files are bigger then 100 chars by default", async () => {
    const result = (await processCssMediaSplitter({ distDir: COMPILED_BIG_APP_PATH }))!
    const mediaFilePath = "/styles/app.css"

    expect(result.manifest).toHaveProperty(mediaFilePath)
    expect(result.manifest[mediaFilePath]).toStrictEqual(["screen and (min-width: 1000px)"])

    expect(result).toHaveProperty("loader.html", expect.any(String))
    expect(result).toHaveProperty("loader.manifest.content", expect.any(String))
    expect(result).toHaveProperty("loader.manifest.html", expect.any(String))
    expect(result).toHaveProperty("loader.script.content", expect.any(String))
    expect(result).toHaveProperty("loader.script.html", expect.any(String))

    expect(result.report).toStrictEqual({
      "tests/unit/fixtures/compiled/app-big/styles/app.css": {
        content: {
          original: 310,
          transformed: 48,
        },
        mediaFiles: [
          {
            path: "tests/unit/fixtures/compiled/app-big/styles/app.SandW1000px.css",
            query: "screen and (min-width: 1000px)",
            size: 255,
          },
        ],
      },
    })
  })

  it("return mediaData, loader and report when some media files are bigger then 10 chars by user config", async () => {
    const result = (await processCssMediaSplitter({
      distDir: COMPILED_SMALL_APP_PATH,
      mediaFileMinSize: 10,
    }))!
    const mediaFilePath = "/styles/app.css"

    expect(result.manifest).toHaveProperty(mediaFilePath)
    expect(result.manifest[mediaFilePath]).toStrictEqual(["screen and (min-width: 1000px)"])

    expect(result).toHaveProperty("loader.html", expect.any(String))
    expect(result).toHaveProperty("loader.manifest.content", expect.any(String))
    expect(result).toHaveProperty("loader.manifest.html", expect.any(String))
    expect(result).toHaveProperty("loader.script.content", expect.any(String))
    expect(result).toHaveProperty("loader.script.html", expect.any(String))

    expect(result.report).toStrictEqual({
      "tests/unit/fixtures/compiled/app-small/styles/app.css": {
        content: {
          original: 153,
          transformed: 50,
        },
        mediaFiles: [
          {
            path: "tests/unit/fixtures/compiled/app-small/styles/app.SandW1000px.css",
            query: "screen and (min-width: 1000px)",
            size: 94,
          },
        ],
      },
    })
  })
})
