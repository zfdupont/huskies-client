import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StoreContext from "../../common/Store";
import { StateType } from "../../common/GlobalVariables";
import AnalyzePanel from "./AnalyzePanel";

// apexcharts renders real SVG and calls DOM APIs jsdom does not implement
// (getScreenCTM, etc.). Stub the chart so we can assert AnalyzePanel wires the
// box-and-whisker chart in without exercising apexcharts' rendering internals.
vi.mock("react-apexcharts", () => ({
    default: () => <div data-testid="apexchart" />,
}));

// Renders AnalyzePanel inside a stub store context for the given selected state.
// dataStore is stubbed so the embedded SummaryEnsembleTable renders empty rather
// than reaching for real ensemble data.
function renderWithState(state, ensemble = null) {
    const value = {
        mapStore: {
            getState: () => state,
            isStateNone: () => state === StateType.NONE,
        },
        dataStore: {
            isEnsemblejsonReady: () => ensemble !== null,
            getEnsembleData: () => ensemble ?? {},
        },
    };
    return render(
        <StoreContext.Provider value={value}>
            <AnalyzePanel />
        </StoreContext.Provider>
    );
}

describe("AnalyzePanel", () => {
    it("shows the New York narrative when New York is selected", () => {
        renderWithState(StateType.NEWYORK);

        expect(screen.getByRole("heading", { name: "New York" })).toBeInTheDocument();
        expect(screen.getByText(/Jonathan Cervas/)).toBeInTheDocument();
    });

    it("shows the Georgia narrative when Georgia is selected", () => {
        renderWithState(StateType.GEORGIA);

        expect(screen.getByRole("heading", { name: "Georgia" })).toBeInTheDocument();
        expect(screen.getByText(/Lucy McBath/)).toBeInTheDocument();
    });

    it("renders the box-and-whisker variation chart when ensemble data is available", () => {
        renderWithState(StateType.NEWYORK, {
            box_w_data: { area_variations: [[0.01, 0.02, 0.03]] },
            enacted_data: { box_w_dots: { area_variation: [0.02] } },
        });

        // The chart ships a "Variation" metric selector; its presence confirms the
        // box-and-whisker chart mounted.
        expect(screen.getByLabelText("Variation")).toBeInTheDocument();
    });

    it("omits the box-and-whisker chart when ensemble data is missing", () => {
        renderWithState(StateType.NEWYORK);

        expect(screen.queryByLabelText("Variation")).not.toBeInTheDocument();
    });

    it("prompts the user to pick a state when none is selected", () => {
        renderWithState(StateType.NONE);

        expect(screen.getByText(/select a state/i)).toBeInTheDocument();
        expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
});
