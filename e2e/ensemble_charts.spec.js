import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

// Verifies the ensemble data contract end-to-end on the client: with /api/plan
// and /api/summary served the new contract shape, focusing an incumbent district
// renders the incumbent-variation charts (ApexCharts) built from the contract's
// server-computed histogram. Self-contained — both endpoints are stubbed with
// fixtures (real GA plan geometry + a schema-valid contract), so no backend is
// needed. Desktop only (the district detail panel is docked on desktop).

const plan = fs.readFileSync(path.join(__dirname, "fixtures/ga_plan.json"), "utf-8");
const summary = fs.readFileSync(path.join(__dirname, "fixtures/ga_summary.json"), "utf-8");

test("focusing an incumbent district renders the contract-driven variation charts", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "desktop project only");

    await page.route("**/api/plan**", (route) =>
        route.fulfill({ status: 200, contentType: "application/json", body: plan }));
    await page.route("**/api/summary**", (route) =>
        route.fulfill({ status: 200, contentType: "application/json", body: summary }));

    await page.goto("/");

    // Select Georgia; the plan defaults to 2022 enacted (PlanList mount effect).
    await page.getByText("Georgia").click();

    // The district-detail list renders one row per incumbent district. Focus the first.
    const firstDistrict = page.locator(".map-side-item").first();
    await expect(firstDistrict).toBeVisible({ timeout: 15000 });
    await firstDistrict.click();

    // The focused district expands and renders the incumbent-variation chart(s)
    // from the contract histogram (two metrics: geographic + population variation).
    await expect(page.locator(".apexcharts-canvas").first()).toBeVisible({ timeout: 15000 });

    await page.screenshot({ path: testInfo.outputPath("ensemble-charts.png"), fullPage: false });
});
