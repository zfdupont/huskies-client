import { test, expect } from "@playwright/test";

// Basic smoke: the app shell mounts and the Leaflet map renders. Runs on both
// the desktop and mobile projects and does not depend on the backend API.
test("app shell and map render", async ({ page }) => {
    await page.goto("/");

    // Top navbar with the logo is always present.
    await expect(page.locator(".navbar")).toBeVisible();

    // The Leaflet map container mounts regardless of plan selection.
    await expect(page.locator("#map-container")).toBeVisible();
});
