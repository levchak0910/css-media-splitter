import path from "node:path"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"
import { rimraf } from "rimraf"

import { dir, file } from "@/utils/fs"

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

describe.sequential("plain application building", () => {
  it("correctly process application building", async () => {
    const distPath = path.resolve(APP_DIR, "dist")

    await rimraf(distPath, { preserveRoot: true })
    execSync("pnpm -F=plain build")

    const files = await dir.read.files(distPath, { recursive: true })

    expect(files).toStrictEqual([
      "index.html",
      "styles/main.SandW1000px.css",
      "styles/main.SandW2000px.css",
      "styles/main.css",
    ])

    const mainContent = await file.read.plain(path.resolve(distPath, files[3]))
    expect(mainContent).not.toContain("@media screen and (min-width: 1000px)")
    expect(mainContent).not.toContain("@media screen and (min-width: 2000px)")

    const media1000Content = await file.read.plain(path.resolve(distPath, files[1]))
    expect(media1000Content).toContain("@media screen and (min-width: 1000px)")

    const media2000Content = await file.read.plain(path.resolve(distPath, files[2]))
    expect(media2000Content).toContain("@media screen and (min-width: 2000px)")
  })
})
