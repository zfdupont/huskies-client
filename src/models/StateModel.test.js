import { describe, it, expect } from "vitest";
import StateModel from "./StateModel";
import { PartyType, PlanType, StateType } from "../common/GlobalVariables";

// Minimal district-properties fixture keyed by district id, matching the raw
// GeoJSON `properties` shape StateModel consumes. Three districts: one Dem win
// with a Dem incumbent, two Rep wins (one with a Rep incumbent, one with none).
const district = (overrides) => ({
    democrat_candidate: "Dem",
    republican_candidate: "Rep",
    democrat_votes: 0,
    republican_votes: 0,
    incumbent: null,
    vap_white: 100,
    vap_black: 50,
    vap_hisp: 25,
    POPTOT: 1000,
    VAPTOTAL: 800,
    area_variation: "1.2345",
    democrat_variation: "0.5",
    republican_variation: "0.5",
    vap_total_variation: "0.1",
    vap_white_variation: "0.2",
    vap_black_variation: "0.3",
    vap_hisp_variation: "0.4",
    ...overrides,
});

const props = {
    "1": district({ democrat_votes: 100, republican_votes: 50, incumbent: "Dem" }),
    "2": district({ democrat_votes: 30, republican_votes: 70, incumbent: null }),
    "3": district({ democrat_votes: 20, republican_votes: 80, incumbent: "Rep" }),
};

const model = new StateModel(PlanType.Y2022, StateType.NEWYORK, props);

describe("StateModel election data", () => {
    it("derives the winner party from the vote totals", () => {
        expect(model.electionDataDict["1"].winnerParty).toBe(PartyType.DEMOCRATIC);
        expect(model.electionDataDict["2"].winnerParty).toBe(PartyType.REPUBLICAN);
    });

    it("computes the Democratic vote margin", () => {
        expect(model.electionDataDict["1"].demVoteMargin).toBe(50);
        expect(model.electionDataDict["3"].demVoteMargin).toBe(-60);
    });

    it("computes winner vote percentage (rounded up)", () => {
        // 100 of 150 votes -> ceil(66.6) = 67
        expect(model.electionDataDict["1"].winVotePercent).toBe(67);
        expect(model.electionDataDict["1"].loseVotePercent).toBe(33);
    });

    it("flags incumbency from the incumbent field", () => {
        expect(model.electionDataDict["1"].hasIncumbent).toBe(true);
        expect(model.electionDataDict["2"].hasIncumbent).toBe(false);
    });
});

describe("StateModel summary data", () => {
    it("counts districts, incumbents, and winners by party", () => {
        expect(model.summaryData.numOfDistrics).toBe(3);
        expect(model.summaryData.numOfIncumbents).toBe(2);
        expect(model.summaryData.numOfDemocratWinners).toBe(1);
        expect(model.summaryData.numOfRepublicanWinners).toBe(2);
    });
});

describe("StateModel heat map ranges", () => {
    it("tracks min/max Dem vote margin across districts", () => {
        expect(model.heatMapData.minDemVoteMargin).toBe(-60);
        expect(model.heatMapData.maxDemVoteMargin).toBe(50);
    });
});

describe("StateModel compare data", () => {
    it("formats variation figures to three decimals", () => {
        expect(model.compareDataDict["1"].area).toBe("1.234");
    });
});
