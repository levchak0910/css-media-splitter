import { defineConfig, devices } from "@playwright/test"

export default ({ url }: { url: string }) => defineConfig({
  testMatch: "tests/**/*.visual.test.ts",
  fullyParallel: true,
  reporter: "list",
  use: {
    trace: "on-first-retry",
    baseURL: url,
  },
  projects: [
    { name: "chromium-small", use: { ...devices["Desktop Chrome"], viewport: { height: 150, width: 500 } } },
    { name: "chromium-medium", use: { ...devices["Desktop Chrome"], viewport: { height: 150, width: 1500 } } },
    { name: "chromium-large", use: { ...devices["Desktop Chrome"], viewport: { height: 150, width: 2500 } } },
  ],
  webServer: {
    command: "pnpm build && pnpm preview",
    url,
  },
  expect: {
    toHaveScreenshot: {
      threshold: 0,
    },
  },
})
