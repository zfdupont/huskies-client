import { test, expect } from "@playwright/test";

// Verifies the responsive behavior added for mobile: on desktop the controls
// drawer is docked and the map shares the row with the data panel; on mobile
// the controls are hidden behind the logo tap and the map fills the viewport.

test("desktop: controls always visible and map shares the row", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "desktop project only");
    await page.goto("/");

    // State picker is visible without any interaction, and the drawer is the
    // docked (persistent) variant rather than a temporary overlay.
    await expect(page.getByText("New York")).toBeVisible();
    await expect(page.locator('[data-testid="controls-drawer"][data-variant="docked"]')).toHaveCount(1);

    // Map does not fill the full width; the data column takes the rest.
    const viewport = page.viewportSize();
    const box = await page.locator("#map-container").boundingBox();
    expect(box.width).toBeLessThan(viewport.width * 0.8);
});

test("mobile: controls hide behind the logo tap and map fills the viewport", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "mobile project only");
    await page.goto("/");

    // Controls start hidden, and the drawer is a temporary overlay (no docked
    // variant) rather than the persistent desktop drawer.
    await expect(page.getByText("New York")).toBeHidden();
    await expect(page.locator('[data-testid="controls-drawer"][data-variant="docked"]')).toHaveCount(0);

    // Map fills essentially the full viewport width.
    const viewport = page.viewportSize();
    const box = await page.locator("#map-container").boundingBox();
    expect(box.width).toBeGreaterThan(viewport.width * 0.9);

    // Tapping the logo opens the overlay drawer and reveals the controls.
    await page.locator(".logo").click();
    await expect(page.getByText("New York")).toBeVisible();
});
