import path from "node:path"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import { dir, file } from "@/utils/fs"

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

describe.sequential("plain application building", () => {
  it("correctly process application building", async () => {
    const distPath = path.resolve(APP_DIR, ".output", "public", "_nuxt")

    execSync("pnpm -F=nuxt build")

    const files = await dir.read.files(distPath, { recursive: true })

    const entry = "entry.css"
    const entry1000 = "screen-and-minwidth1000px__entry.css"
    const entry2000 = "screen-and-minwidth2000px__entry.css"

    expect(files).toContainEqual(entry)
    expect(files).toContainEqual(entry1000)
    expect(files).toContainEqual(entry2000)

    const mainContent = await file.read.plain(path.resolve(distPath, entry))
    expect(mainContent).not.toContain("@media screen and (min-width:1000px)")
    expect(mainContent).not.toContain("@media screen and (min-width:2000px)")

    const media1000Content = await file.read.plain(path.resolve(distPath, entry1000))
    expect(media1000Content).toContain("@media screen and (min-width:1000px)")

    const media2000Content = await file.read.plain(path.resolve(distPath, entry2000))
    expect(media2000Content).toContain("@media screen and (min-width:2000px)")
  })
})
