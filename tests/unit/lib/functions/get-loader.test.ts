import { describe, expect, it } from "vitest"

import type { MediaManifest } from "@/models/Media"

import { getLoader } from "@/api"

describe.sequential("getLoader", () => {
  it("returns loader from provided media manifest", async () => {
    const manifest: MediaManifest = { "css-file-full-path": ["media-query"] }

    const result = await getLoader(manifest)

    expect(result.manifest.content).toBe(JSON.stringify(manifest))
    expect(result.manifest.html).toContain(JSON.stringify(manifest))
    expect(result.manifest.html).toContain(`type="application/json"`)
    expect(result.manifest.html).toContain("<script")

    expect(result.script.html).toContain("<script")

    expect(result.html).toContain("<script")
    expect(result.html).toContain(JSON.stringify(manifest))
  })
})
