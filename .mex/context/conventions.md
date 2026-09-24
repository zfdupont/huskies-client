---
name: conventions
description: How code is written in this project — naming, structure, patterns, and style. Load when writing new code or reviewing existing code.
triggers:
  - "convention"
  - "pattern"
  - "naming"
  - "style"
  - "how should I"
  - "what's the right way"
edges:
  - target: context/architecture.md
    condition: when a convention depends on understanding the system structure
  - target: patterns/INDEX.md
    condition: when a recurring task has a documented step-by-step pattern
  - target: patterns/add-store-action.md
    condition: when adding shared state or a store mutation
  - target: patterns/debug-data-loading.md
    condition: when the map or tables load empty
grounds_to: []
last_updated: 2026-09-24
---

# Conventions

## Naming

- Components: `PascalCase.jsx` (`MainDrawer.jsx`, `MapPanel.jsx`); default-exported.
- Helpers/models: `PascalCase.js` for classes (`StateModel.js`), `*Helper.js` for utilities
  (`CalculationHelper.js`, `ConversionHelper.js`).
- Hooks: `use-*.hook.js` (e.g. `src/hooks/use-is-mobile.hook.js`).
- Enums/constants: `SCREAMING_CASE` keys mapping to lowercase string values, all in
  `GlobalVariables.js` (e.g. `PlanType.Y2022 = "enacted"`).
- Backend-facing values: `PlanType`/`StateType` string values are the exact tokens the API
  expects (`enacted`, `democrat_favored`, `NY`) — never send the enum key.

## Structure

- All shared state lives in `src/common/Store.jsx`. Feature components consume it via
  `useContext(StoreContext)`; never introduce a second store.
- New actions follow the reducer pattern: add an action type to `GlobalVariables.js`, handle
  it in the relevant `*StoreReducer`, expose a method on the store object.
- Panels live under `src/TabPanels/<panel>/`; shared UI/state under `src/common/`.
- Map layer logic is imperative Leaflet inside `MapController.jsx` — not JSX map layers.
- Static base-map GeoJSON is imported via the `GeoData` table in `GlobalVariables.js`.
- **Styling is Tailwind v4** utility classes (no MUI, no Emotion, no `sx`). Reusable UI
  goes through the owned primitives in `src/ui/`; add a primitive there rather than
  re-styling ad hoc. Theme-aware colors use the semantic tokens (`bg-surface`, `text-fg`,
  `bg-accent`, …) that flip on `<html data-theme>`, not hardcoded light/dark values.
- **Component tests** live beside the code as `*.test.{js,jsx}` (Vitest + Testing Library);
  e2e specs live in `e2e/` (Playwright).

## Patterns

- **Store methods mutate through reducers, not `setState` directly.** Correct:
  ```
  mapStore.selectState = async function(stateType) {
      mapStoreReducer({ type: MapActionType.SELECT_STATE, payload: { stateType } });
      await dataStore.addStateData(mapStore.plan, stateType);
  }
  ```
- **API calls return `null` on failure and callers must tolerate it.** `dataStore.addStateData`
  wraps the fetch in `try/finally` so the `loading` flag always clears.

Step-by-step procedures: see `patterns/add-store-action.md` (extending the store) and
`patterns/debug-data-loading.md` (diagnosing empty map/tables).

## Verify Checklist

Before presenting any code:
- [ ] `pnpm test` passes (Vitest) and `pnpm build` succeeds; run `pnpm test:e2e` for UI-flow changes.
- [ ] New state/actions go through `GlobalVariables.js` + a reducer, not ad-hoc `setState`.
- [ ] Any new enum value matches the exact string the backend API expects.
- [ ] No new dependency added when an existing one covers it (deps were just pruned).
- [ ] No stray `console.log` or commented-out blocks left behind.
