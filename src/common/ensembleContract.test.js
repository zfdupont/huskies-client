import { indexIncumbentsByName } from "./ensembleContract";

test("indexes by_incumbent by display name", () => {
  const ensemble = { metrics: { by_incumbent: [
    { id: "austin-scott", name: "Austin Scott", metrics: [{ id: "geographic_variation" }] },
    { id: "jane-doe", name: "Jane Doe", metrics: [] },
  ] } };
  const byName = indexIncumbentsByName(ensemble);
  expect(byName["Austin Scott"].id).toBe("austin-scott");
  expect(byName["Jane Doe"].metrics).toEqual([]);
});

test("returns an empty map when metrics are absent", () => {
  expect(indexIncumbentsByName({})).toEqual({});
  expect(indexIncumbentsByName(null)).toEqual({});
});
