import { buildBoxModel } from "./IncumbentVariation";

const metric = {
  label: "Geographic Variation",
  observed: 0.33,
  observed_percentile: 0.6,
  unit: "fraction",
  ensemble: {
    quantiles: { "0": 0.05, "0.25": 0.12, "0.5": 0.2, "0.75": 0.28, "1": 0.45 },
  },
};

test("box is [min, Q1, median, Q3, max] from quantiles", () => {
  expect(buildBoxModel(metric).box).toEqual([0.05, 0.12, 0.2, 0.28, 0.45]);
});

test("carries category label, observed value, and percentile", () => {
  const m = buildBoxModel(metric);
  expect(m.category).toBe("Geographic Variation");
  expect(m.observed).toBe(0.33);
  expect(m.observedPercentile).toBe(0.6);
});
