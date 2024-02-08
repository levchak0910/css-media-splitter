import { describe, expect, it } from "vitest"

import type { MediaManifest } from "@/models/Media"

import { getHandler } from "@/api"

describe.sequential("getHandler", () => {
  it("returns handler from provided media manifest", async () => {
    const manifest: MediaManifest = { "css-file-base": [["media-query", "media-css file-base"]] }

    const result = await getHandler(manifest)

    expect(result.manifest.content).toBe(JSON.stringify(manifest))
    expect(result.manifest.html).toContain(JSON.stringify(manifest))
    expect(result.manifest.html).toContain(`type="application/json"`)
    expect(result.manifest.html).toContain("<script")

    expect(result.script.html).toContain("<script")

    expect(result.html).toContain("<script")
    expect(result.html).toContain(JSON.stringify(manifest))
  })
})
