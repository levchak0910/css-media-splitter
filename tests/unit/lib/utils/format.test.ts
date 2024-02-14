import { describe, expect, it } from "vitest"

import { formatBytes } from "@/utils/format"

describe("format utils", () => {
  describe("formatBytes", () => {
    it("returns formatted bytes", () => {
      const fb1 = formatBytes(999)
      const fb2 = formatBytes(1000)
      const fb3 = formatBytes(1001)
      const fb4 = formatBytes(-999)
      const fb5 = formatBytes(-1000)
      const fb6 = formatBytes(-1001)

      expect(fb1).toBe("999 B")
      expect(fb2).not.toContain(" B")
      expect(fb3).not.toContain(" B")
      expect(fb4).toBe("-999 B")
      expect(fb5).not.toContain(" B")
      expect(fb6).not.toContain(" B")
    })

    it("returns formatted kilobytes", () => {
      const fb1 = formatBytes(999)
      const fb2 = formatBytes(1000)
      const fb3 = formatBytes(1001)
      const fb4 = formatBytes(-999)
      const fb5 = formatBytes(-1000)
      const fb6 = formatBytes(-1001)

      expect(fb1).not.toContain(" kB")
      expect(fb2).toBe("1 kB")
      expect(fb3).toBe("1 kB")
      expect(fb4).not.toContain(" kB")
      expect(fb5).toBe("-1 kB")
      expect(fb6).toBe("-1 kB")
    })

    it("returns formatted megabytes", () => {
      const fb1 = formatBytes(999999)
      const fb2 = formatBytes(1000000)
      const fb3 = formatBytes(1000001)
      const fb4 = formatBytes(-999999)
      const fb5 = formatBytes(-1000000)
      const fb6 = formatBytes(-1000001)

      expect(fb1).not.toContain(" MB")
      expect(fb2).toBe("1 MB")
      expect(fb3).toBe("1 MB")
      expect(fb4).not.toContain(" MB")
      expect(fb5).toBe("-1 MB")
      expect(fb6).toBe("-1 MB")
    })
  })
})
