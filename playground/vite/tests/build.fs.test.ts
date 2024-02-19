import path from "node:path"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import { dir, file } from "@/utils/fs"

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

describe.sequential("plain application building", () => {
  it("correctly process application building", async () => {
    const distPath = path.resolve(APP_DIR, "dist")

    execSync("pnpm -F=vite build")

    let files = await dir.read.files(distPath, { recursive: true })
    files = files.filter(f => !f.endsWith(".js"))

    expect(files).toStrictEqual([
      "index.SandW1000px.css",
      "index.SandW2000px.css",
      "index.css",
      "index.html",
    ])

    const mainContent = await file.read.plain(path.resolve(distPath, files[2]))
    expect(mainContent).not.toContain("@media screen and (min-width: 1000px)")
    expect(mainContent).not.toContain("@media screen and (min-width: 2000px)")

    const media1000Content = await file.read.plain(path.resolve(distPath, files[0]))
    expect(media1000Content).toContain("@media screen and (min-width: 1000px)")

    const media2000Content = await file.read.plain(path.resolve(distPath, files[1]))
    expect(media2000Content).toContain("@media screen and (min-width: 2000px)")
  })
})
