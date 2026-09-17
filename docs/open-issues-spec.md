# Open Issues — Spec Sheets

Specs for the issues surfaced during the codebase bug scan that were **not**
auto-fixed on the `bugfix` branch because they need product/data judgment or
carry behavior risk. Each is self-contained: read the one you're picking up.

Already fixed (for reference, not in this doc): `validCheck` short-circuit,
`useIsMobile` initial value, heatmap top-bucket color fallback.

Priority key: **P1** ship-blocking / data-correctness, **P2** correctness edge
case, **P3** cleanup / maintainability.

---

## ISSUE-001 — Hardcoded skip of district "10" in heatmap range

- **Priority:** P1 (data correctness)
- **File:** `src/models/StateModel.js:94`
- **Component:** `StateModel.getHeatMapData`

### Summary
The min/max scan that builds demographic and vote-margin heatmap ranges skips
the district keyed `"10"` unconditionally, via a hardcoded guard left in as a
data workaround:

```js
for (let key in geojsonStateProperties) {
    if (key === "10") continue; // TO DO: remove if error of the data district 10 is fixed.
    ...
}
```

### Current behavior
District `"10"` is excluded from `minWhite/maxWhite`, `minBlack/maxBlack`,
`minHispanic/maxHispanic`, and `minDemVoteMargin/maxDemVoteMargin`. The guard is
**state-agnostic**: it applies to NY, GA, and IL alike. Any state that has a
real district 10 has that district omitted from the range calculation, which
skews the color-bucket thresholds (`calculateHeatMapFeatureValues`) for the
entire map. If district 10 holds an extreme value, the heatmap legend and
per-district colors are computed against a truncated range.

### Expected behavior
Every district in the plan contributes to the heatmap min/max range. No
district is special-cased.

### Root cause
A one-off fix for bad backend data in a single district was committed as a
literal string comparison instead of being fixed at the data source, and it
was never scoped to the state/plan it applied to.

### Proposed fix
1. Confirm with the backend repo (`~/huskies-server`) whether district 10 data
   is still malformed and for which state/plan.
2. If the data is fixed: delete the guard.
3. If the data is still bad: fix it server-side, or — if a client guard is
   truly required — replace the string match with a validity check on the
   fields actually consumed (e.g. skip only when `vap_white`/`vap_black`/
   `vap_hisp`/vote fields are `null`/`NaN`), so the guard is data-driven rather
   than keyed to an arbitrary district id.

### Risk / considerations
Removing the guard blindly may reintroduce a `NaN`/`Infinity` range if the
underlying data is still bad (a single bad value poisons `Math.min`/`Math.max`).
Verify against live data for all three states before removing.

### Acceptance criteria
- No literal district-id comparison remains in `getHeatMapData`.
- Heatmap ranges for NY, GA, IL are computed over all districts and contain no
  `NaN`/`MAX_SAFE_INTEGER` sentinel leakage.
- Legend thresholds visibly reflect the full data range (spot-check a state
  whose district 10 previously held an extreme value).

---

## ISSUE-002 — Possible null access on `enactedData.incumbent_data`

- **Priority:** P1 (crash risk)
- **File:** `src/TabPanels/mapPanel/DistrictSummaryItem.jsx:129-130`
- **Related:** `src/TabPanels/mapPanel/DistrictSummaryTable.jsx:44-49`,
  `src/models/StateModel` gating via `dataStore.isEnsemblejsonReady()`

### Summary
When a district has an incumbent and the enacted plan is active, the component
renders `IncumbentVariation` with `enactedData={enactedData.incumbent_data}`:

```jsx
{(data.hasIncumbent && (mapStore.getMapPlan() === 'enacted')) &&
  <IncumbentVariation ... enactedData={enactedData.incumbent_data} .../> }
```

`enactedData` originates from `ensembleData.enacted_data` (passed down through
`DistrictSummaryTable`).

### Current behavior
The upstream guard is `dataStore.isEnsemblejsonReady()`, which only checks that
`ensemble['name']` is truthy. It does **not** verify `enacted_data` exists. If
the summary payload has a `name` but is missing `enacted_data` (or
`enacted_data.incumbent_data`), the expression `enactedData.incumbent_data`
throws a `TypeError`, and `IncumbentVariation`'s constructor further indexes
`enactedData[incumbent]` / `incumbentData[incumbent]` with no guards.

### Expected behavior
A missing or partial ensemble payload degrades gracefully — the incumbent
variation chart is skipped rather than crashing the district summary panel.

### Root cause
`isEnsemblejsonReady()` is a shallow readiness check that does not match the
shape actually dereferenced downstream.

### Proposed fix
Choose one (in order of preference):
1. Tighten the readiness gate so the chart only renders when the required
   nested fields exist, e.g. guard on
   `enactedData?.incumbent_data && incumbentData?.[data.incumbent]`.
2. Add optional chaining at the access sites and have `IncumbentVariation`
   render nothing when its data is absent.

### Risk / considerations
Behavior change only in the currently-crashing path; the happy path is
unaffected. Confirm the exact contract of `/api/summary` in the backend repo so
the guard matches reality (fields: `enacted_data`, `incumbent_data`, keyed by
incumbent name).

### Acceptance criteria
- Loading the enacted plan for a state whose summary payload lacks
  `enacted_data` does not throw; the district summary list still renders.
- With a complete payload, the incumbent variation charts render exactly as
  before.

---

## ISSUE-003 — Orphaned `hispanicVotesFeatureValues` field

- **Priority:** P3 (maintainability)
- **File:** `src/models/StateModel.js:87` (declared), `:108` (real field)

### Summary
`getHeatMapData` initializes `hispanicVotesFeatureValues: []` in the result
object, but the computed values are written to a **differently named** field:

```js
result.hispanicFeatureValues = calculateHeatMapFeatureValues(result.minHispanic, result.maxHispanic);
```

and read back via `result.hispanicFeatureValues` in
`getFeatureValuesByPopulationType`.

### Current behavior
Works by accident: `hispanicVotesFeatureValues` is never read and stays `[]`;
`hispanicFeatureValues` is created ad hoc and is the one actually used. The
white and black equivalents (`whiteFeatureValues`, `blackFeatureValues`) are
named consistently — only hispanic is mismatched.

### Expected behavior
The declared field name matches the assigned/read field name, consistent with
the white/black pattern.

### Root cause
Typo/rename drift; the initializer key was never updated to match usage.

### Proposed fix
Rename the initializer key `hispanicVotesFeatureValues` → `hispanicFeatureValues`
(or drop the initializer entirely, matching how the object is otherwise built).
No behavior change.

### Risk / considerations
None functional. Grep for `hispanicVotesFeatureValues` first to confirm zero
external readers (scan showed none).

### Acceptance criteria
- Only one hispanic feature-values field name exists in the file.
- Hispanic population heatmap renders identically after the change.

---

## ISSUE-004 — `setState` during render into never-read state

- **Priority:** P3 (fragility / dead state)
- **File:** `src/TabPanels/mapPanel/DistrictSummaryTable.jsx:18-37`

### Summary
`selectedDistrictIdSetup()` is called in the render body and conditionally calls
`setState` during render:

```js
selectedDistrictIdSetup();
...
function selectedDistrictIdSetup() {
    if (state.selectedDistrictId !== mapStore.getHighlightDistrictId()) {
        setState((prev) => ({...prev, selectedDistrictId: mapStore.getHighlightDistrictId()}))
    }
}
```

`state.selectedDistrictId` (and `state.selectedTableMenu`, aside from a dead
`getTitles` compare branch) is not read to drive any output.

### Current behavior
Triggers an extra render pass to sync a value that nothing consumes. It
converges (next render the values match, so no further `setState`), so there is
no infinite loop, but it is a render-phase side effect and dead state.

### Expected behavior
No render-phase `setState`; no state that isn't used.

### Root cause
Leftover scaffolding from the removed compare/tab UI. Highlight tracking is
already owned by `mapStore.districtId`; this local mirror is redundant.

### Proposed fix
Remove `selectedDistrictId` from the `useState` initializer, delete
`selectedDistrictIdSetup()` and its call site. If `selectedTableMenu` /
`TableButtonType.COMPARE` / `getCompareInfoTitle()` are also confirmed dead
(the compare view was removed), collapse `getTitles()` to just return
`getSubTitles()` and drop the unused branch.

### Risk / considerations
Verify no other effect depends on the re-render that this `setState` currently
forces (scroll-into-view is handled by a separate `useEffect` and reads
`mapStore` directly, so it should be unaffected).

### Acceptance criteria
- No `setState` call in the render path of `DistrictSummaryTable`.
- District highlight + scroll-into-view still work when clicking a district.
- No unused state fields remain in the component.

---

## ISSUE-005 — Dead fully-commented file `DistrictCompareTable.js`

- **Priority:** P3 (cleanup)
- **File:** `src/TabPanels/mapPanel/DistrictCompareTable.js`

### Summary
The entire 166-line file is commented out and imported nowhere.

### Current behavior
Dead weight in the tree; no runtime effect. The compare feature it implemented
was removed from the UI.

### Expected behavior
The file is deleted (its content is recoverable from git history if the compare
feature is ever revived).

### Root cause
Feature was disabled by commenting rather than removing.

### Proposed fix
`git rm src/TabPanels/mapPanel/DistrictCompareTable.js`.

### Risk / considerations
Confirm no import references remain (scan showed none). Purely additive-safe
deletion.

### Acceptance criteria
- File removed; `pnpm build` still succeeds.
- No dangling import errors.

---

## Suggested sequencing

1. **ISSUE-001** and **ISSUE-002** first — both are correctness/crash risks and
   both need a look at the backend `/api/summary` and `/api/plan` contracts, so
   batch that investigation.
2. **ISSUE-004**, **ISSUE-003**, **ISSUE-005** as a cleanup pass — low risk, no
   backend dependency.
