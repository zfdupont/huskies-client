import { buildBarModel } from "./IncumbentVariation";

const metric = {
  label: "Geographic Variation",
  observed: 0.33,
  observed_percentile: 0.5,
  unit: "fraction",
  ensemble: { histogram: {
    bin_edges: [0.0, 0.2, 0.4, 0.6, 0.8, 1.0],   // 5 bins
    counts:    [1,   2,   3,   4,   5],
  } },
};

test("categories are per-bin percent ranges", () => {
  const m = buildBarModel(metric);
  expect(m.categories).toEqual(["0-20%", "20-40%", "40-60%", "60-80%", "80-100%"]);
  expect(m.counts).toEqual([1, 2, 3, 4, 5]);
});

test("highlightIndex is the bin containing observed", () => {
  expect(buildBarModel(metric).highlightIndex).toBe(1);          // 0.33 in [0.2,0.4)
});

test("observed at the top edge clamps to the last bin", () => {
  const top = { ...metric, observed: 1.0 };
  expect(buildBarModel(top).highlightIndex).toBe(4);
});

test("observed below range clamps to the first bin", () => {
  const low = { ...metric, observed: -5 };
  expect(buildBarModel(low).highlightIndex).toBe(0);
});
