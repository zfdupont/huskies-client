import { defineConfig, devices } from "@playwright/test";

// E2E tests live in e2e/ (unit tests are Vitest under src/). Playwright boots
// the Vite dev server itself via `webServer` so `pnpm test:e2e` is one command.
const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: "list",
    use: {
        baseURL,
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "desktop-chromium",
            use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
        },
        {
            name: "mobile-chromium",
            use: { ...devices["Pixel 5"] },
        },
    ],
    webServer: {
        command: "pnpm dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },
});
