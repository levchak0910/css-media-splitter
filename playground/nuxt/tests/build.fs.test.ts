import path from "node:path"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import { dir, file } from "@/utils/fs"

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

describe.sequential("plain application building", () => {
  it("correctly process application building for ssr and pre-rerendered routes", { timeout: 30000 }, async () => {
    const distPath = path.join(APP_DIR, ".output", "public", "_nuxt")

    execSync("pnpm -F=nuxt build")

    const files = await dir.read.files(distPath, { recursive: true })

    const expectedCSSFiles = [
      "ssr.css",
      "ssr.SandW1000px.css",
      "ssr.SandW2000px.css",
      "pre-rendered.css",
      "pre-rendered.SandW1000px.css",
      "pre-rendered.SandW2000px.css",
    ]

    for await (const cssFile of expectedCSSFiles) {
      expect(files).toContainEqual(cssFile)

      const cssFileContent = await file.read.plain(path.join(distPath, cssFile))

      if (cssFile.includes("1000px")) {
        expect(cssFileContent).toContain("@media screen and (min-width:1000px)")
      }
      else if (cssFile.includes("2000px")) {
        expect(cssFileContent).toContain("@media screen and (min-width:2000px)")
      }
      else {
        expect(cssFileContent).not.toContain("@media screen and (min-width:1000px)")
        expect(cssFileContent).not.toContain("@media screen and (min-width:2000px)")
      }
    }
  })
})
