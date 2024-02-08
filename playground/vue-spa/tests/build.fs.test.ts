import path from "node:path"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import { dir, file } from "@/utils/fs"

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

describe.sequential("plain application building", () => {
  it("correctly process application building", async () => {
    const distPath = path.resolve(APP_DIR, "dist")

    execSync("pnpm -F=vue-spa build")

    let files = await dir.read.files(distPath, { recursive: true })
    files = files.filter(f => !f.endsWith(".js"))

    expect(files).toStrictEqual([
      "index.css",
      "index.html",
      "assets/screen-and-minwidth-2000px__index.css",
    ])

    const mainContent = await file.read.plain(path.resolve(distPath, files[0]))
    expect(mainContent).toContain("@media screen and (min-width: 1000px)")
    expect(mainContent).not.toContain("@media screen and (min-width: 2000px)")

    const mediaContent = await file.read.plain(path.resolve(distPath, files[2]))
    expect(mediaContent).toContain("@media screen and (min-width: 2000px)")
  })
})
