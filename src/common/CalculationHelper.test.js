import { describe, it, expect } from "vitest";
import {
    roundUpToFirstDigit,
    roundDownToFirstDigit,
    calculateHeatMapFeatureValues,
    remove,
} from "./CalculationHelper";

describe("roundDownToFirstDigit", () => {
    // Note: the leading digit is Math.round-ed (not floored), so 8.7 -> 9.
    it("rounds to the magnitude of the leading digit", () => {
        expect(roundDownToFirstDigit(1234)).toBe(1000);
        expect(roundDownToFirstDigit(87)).toBe(90);
        expect(roundDownToFirstDigit(5)).toBe(5);
    });

    it("returns 0 for non-positive input", () => {
        expect(roundDownToFirstDigit(0)).toBe(0);
        expect(roundDownToFirstDigit(-50)).toBe(0);
    });
});

describe("roundUpToFirstDigit", () => {
    it("rounds up to one past the (rounded) leading digit", () => {
        expect(roundUpToFirstDigit(1234)).toBe(2000);
        expect(roundUpToFirstDigit(87)).toBe(100);
    });

    it("returns 0 for non-positive input", () => {
        expect(roundUpToFirstDigit(0)).toBe(0);
        expect(roundUpToFirstDigit(-1)).toBe(0);
    });
});

describe("calculateHeatMapFeatureValues", () => {
    it("returns six ascending bucket boundaries ending at the rounded max", () => {
        const values = calculateHeatMapFeatureValues(120, 4800);
        expect(values).toHaveLength(6);
        // strictly non-decreasing
        for (let i = 1; i < values.length; i++) {
            expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
        }
        // last bucket is the rounded-up max
        expect(values[values.length - 1]).toBe(roundUpToFirstDigit(4800));
    });
});

describe("remove", () => {
    it("mutates the array to drop the first matching element", () => {
        const arr = ["a", "b", "c"];
        remove(arr, "b");
        expect(arr).toEqual(["a", "c"]);
    });

    it("leaves the array unchanged when the element is absent", () => {
        const arr = ["a", "b"];
        remove(arr, "z");
        expect(arr).toEqual(["a", "b"]);
    });
});
