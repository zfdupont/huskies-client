import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

// On mobile the district detail lives in a bottom sheet. Tapping a district on the
// map should pop the sheet open (not require hunting for the FAB). Mobile only.
const plan = fs.readFileSync(path.join(__dirname, "fixtures/ga_plan.json"), "utf-8");
const summary = fs.readFileSync(path.join(__dirname, "fixtures/ga_summary.json"), "utf-8");

test("mobile: tapping a district on the map opens the detail sheet", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "mobile project only");

    await page.route("**/api/plan**", (r) =>
        r.fulfill({ status: 200, contentType: "application/json", body: plan }));
    await page.route("**/api/summary**", (r) =>
        r.fulfill({ status: 200, contentType: "application/json", body: summary }));

    await page.goto("/");

    // Open the overlay drawer (logo tap), select Georgia, then close the drawer by
    // tapping the scrim (the logo is covered by the scrim while the drawer is open).
    await page.locator(".logo").click();
    await page.getByText("Georgia").click();
    await page.mouse.click(340, 420); // scrim area, right of the 200px drawer
    await expect(page.getByText("Georgia")).toBeHidden();

    // The sheet is closed, so its district rows are present but not visible.
    await expect(page.locator(".map-side-item").first()).toBeHidden();

    // Tap an actual Georgia district polygon on the map.
    const districts = page.locator("#map-container path.leaflet-interactive");
    await expect(districts.first()).toBeVisible({ timeout: 10000 });
    const n = await districts.count();
    await districts.nth(Math.floor(n / 2)).click({ force: true });

    // The bottom sheet pops open with the district detail — no FAB tap needed.
    await expect(page.locator(".map-side-item").first()).toBeVisible({ timeout: 10000 });

    // ...and it can be closed via the visible close control (no reset needed).
    await page.getByRole("button", { name: "Close district data" }).click();
    await expect(page.locator(".map-side-item").first()).toBeHidden();
});
