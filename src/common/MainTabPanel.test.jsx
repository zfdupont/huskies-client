import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StoreContextProvider } from "./Store";
import MainTabPanel from "./MainTabPanel";

// The real panels pull in Leaflet / ensemble data that can't render in jsdom;
// stub them so this test exercises only the tab-routing logic against the real
// pageStore.
vi.mock("../TabPanels/mapPanel/MapPanel", () => ({
    default: () => <div data-testid="map-panel">MAP PANEL</div>,
}));
vi.mock("../TabPanels/analyzePanel/AnalyzePanel", () => ({
    default: () => <div data-testid="analyze-panel">ANALYZE PANEL</div>,
}));

function renderPanel() {
    return render(
        <StoreContextProvider>
            <MainTabPanel />
        </StoreContextProvider>
    );
}

describe("MainTabPanel", () => {
    it("shows the map panel by default", () => {
        renderPanel();

        expect(screen.getByTestId("map-panel")).toBeInTheDocument();
        expect(screen.queryByTestId("analyze-panel")).not.toBeInTheDocument();
    });

    it("switches to the analyze panel when the Analyze tab is clicked", async () => {
        const user = userEvent.setup();
        renderPanel();

        await user.click(screen.getByRole("tab", { name: /analyze/i }));

        expect(screen.getByTestId("analyze-panel")).toBeInTheDocument();
        expect(screen.queryByTestId("map-panel")).not.toBeInTheDocument();
    });

    it("switches back to the map panel when the Map tab is clicked", async () => {
        const user = userEvent.setup();
        renderPanel();

        await user.click(screen.getByRole("tab", { name: /analyze/i }));
        await user.click(screen.getByRole("tab", { name: /^map$/i }));

        expect(screen.getByTestId("map-panel")).toBeInTheDocument();
        expect(screen.queryByTestId("analyze-panel")).not.toBeInTheDocument();
    });
});
