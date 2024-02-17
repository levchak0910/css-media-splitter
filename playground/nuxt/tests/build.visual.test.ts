import { expect, test } from "@playwright/test"

import { testLinks } from "../../../tests/e2e/common-links"

test("match screenshot", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveScreenshot()
  await testLinks(page)
})
