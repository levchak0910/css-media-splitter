import { describe, expect, it } from "vitest"

import * as api from "@/api"

describe("api", () => {
  it("returns needed stuff for external usage", () => {
    const stuff = Object.keys(api).sort((k1, k2) => k1 > k2 ? 1 : -1)

    expect(stuff).toStrictEqual([
      "LOADER_REPLACE_COMMENT",
      "extractMedia",
      "getBundleFiles",
      "getLoader",
      "getMediaManifest",
      "getReport",
      "stringifyReport",
      "writeHTMLFiles",
      "writeMainCSSFile",
      "writeMediaCSSFiles",
    ])
  })
})
