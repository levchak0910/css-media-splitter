import { expect, test } from "@playwright/test"

test("match screenshot", async ({ page }) => {
  await page.goto("http://localhost:3000")
  await expect(page).toHaveScreenshot()
})
