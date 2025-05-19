import { expect } from "@playwright/test"
import type { Page } from "@playwright/test"

export async function testLinks(page: Page) {
  const links = await page.$$("link[rel=stylesheet]")
  const urls = await Promise.all(links.map(link => link.getAttribute("href")))
  const amount = urls.filter(url => url?.includes(".SandW")).length

  const width = page.viewportSize()?.width

  if (width === 500)
    expect(amount).toBe(0)

  if (width === 1500)
    expect(amount).toBe(1)

  if (width === 2500)
    expect(amount).toBe(2)
}
