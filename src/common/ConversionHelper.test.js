import { describe, it, expect } from "vitest";
import {
    convertMapFilterTypeToPopulationType,
    convertBoundSizeToZoomLevel,
    convertNumToPlace,
    convertPlanTypeToColorType,
} from "./ConversionHelper";
import {
    MapFilterType,
    PopulationType,
    PlanType,
    zoomLevelDict,
    colorDict,
} from "./GlobalVariables";

describe("convertMapFilterTypeToPopulationType", () => {
    it("maps demographic filters to their population type", () => {
        expect(convertMapFilterTypeToPopulationType(MapFilterType.WHITE)).toBe(PopulationType.WHITE);
        expect(convertMapFilterTypeToPopulationType(MapFilterType.BLACK)).toBe(PopulationType.BLACK);
        expect(convertMapFilterTypeToPopulationType(MapFilterType.HISPANIC)).toBe(PopulationType.HISPANIC);
    });

    it("falls back to NONE for non-demographic filters", () => {
        expect(convertMapFilterTypeToPopulationType(MapFilterType.VICTORYMARGIN)).toBe(PopulationType.NONE);
        expect(convertMapFilterTypeToPopulationType(MapFilterType.NONE)).toBe(PopulationType.NONE);
    });
});

describe("convertBoundSizeToZoomLevel", () => {
    it("returns coarser zoom for larger bounds", () => {
        expect(convertBoundSizeToZoomLevel(300000)).toBe(zoomLevelDict.level6);
        expect(convertBoundSizeToZoomLevel(60000)).toBe(zoomLevelDict.level4);
    });

    it("returns the most zoomed-in level for the smallest bounds", () => {
        expect(convertBoundSizeToZoomLevel(0)).toBe(zoomLevelDict.level6);
    });
});

describe("convertNumToPlace", () => {
    it("applies English ordinal suffixes", () => {
        expect(convertNumToPlace(1)).toBe("1st");
        expect(convertNumToPlace(2)).toBe("2nd");
        expect(convertNumToPlace(3)).toBe("3rd");
        expect(convertNumToPlace(4)).toBe("4th");
        expect(convertNumToPlace(10)).toBe("10th");
    });
});

describe("convertPlanTypeToColorType", () => {
    it("maps each simulation plan to its outline color", () => {
        expect(convertPlanTypeToColorType(PlanType.S0001)).toBe(colorDict.outlineLevel1);
        expect(convertPlanTypeToColorType(PlanType.S0005)).toBe(colorDict.outlineLevel5);
    });

    it("uses black for the enacted plan", () => {
        expect(convertPlanTypeToColorType(PlanType.Y2022)).toBe(colorDict.black);
    });
});
