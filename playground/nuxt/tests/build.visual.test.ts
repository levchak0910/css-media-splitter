import { expect, test } from "@playwright/test"

import { testLinks } from "../../../tests/e2e/common-links"

test("match screenshot ssr route", async ({ page }) => {
  await page.goto("/ssr")
  await expect(page).toHaveScreenshot()
  await testLinks(page)
})

test("match screenshot pre-rendered route", async ({ page }) => {
  await page.goto("/pre-rendered")
  await expect(page).toHaveScreenshot()
  await testLinks(page)
})
