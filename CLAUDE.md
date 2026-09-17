# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

React single-page app for visualizing and analyzing U.S. congressional redistricting
plans ("gerrymandering" analysis). Users pick a state (NY, GA, IL) and a districting
plan (the 2022 enacted map or one of five simulated/ensemble plans), then explore the
result on an interactive Leaflet map with demographic/partisan heatmaps and summary
tables. Data is fetched from a separate backend API.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`). Build tool is **Vite** (migrated from
Create React App; see caveats below).

- `pnpm dev` — dev server in development mode on port **3000** (loads `.env.development`)
- `pnpm start` — dev server in production mode on port **3005** (loads `.env.production`)
- `pnpm build` — production build to `build/` (outDir is customized to CRA's `build/`
  rather than Vite's usual output directory)

There is no test runner or lint script configured.

## Environment Variables

Set in `.env` (git-ignored) / `.env.production`:

- `VITE_SERVER_URL` — base URL of the backend; `api.js` calls `${VITE_SERVER_URL}/api`
- `PORT` — read by vite.config but overridden by the `--port 3005` in package.json

## Architecture

### State management (the core to understand first)

There is no Redux/Zustand. All app state lives in one React Context defined in
`src/common/Store.jsx` (`StoreContextProvider` wraps the whole app in `App.jsx`).
The context value exposes four objects plus a `loading` flag:

- `mapStore` — current plan, plan filters, selected state, selected district,
  color/incumbent filters
- `dataStore` — cached fetched data, keyed `[planType][stateType]`: `stateData`
  (StateModel instances), `geojson`, and `ensemble` summary data
- `pageStore` — active tab (`TabType.MAP` / `ANALYZE`)
- `callbacks` — registry of reset-state listeners (e.g. the map registers a callback
  to clear itself)

Pattern: each store is a `useState` object, and **methods are imperatively attached
to those objects** inside the provider (e.g. `mapStore.selectState = async ...`).
Mutations go through per-store reducer functions (`mapStoreReducer`,
`dataStoreReducer`, `pageStoreReducer`) that `switch` on action types. Action types,
and nearly all other enums/constants, are defined in
`src/common/GlobalVariables.js` — read this file before touching store or map logic.

When adding state or actions: add the action type to `GlobalVariables.js`, handle it
in the relevant reducer, and expose a method on the store object.

### Data flow

`GlobalVariables.js` `PlanType` maps app-internal keys (`Y2022`, `S0001`...) to the
string values the backend expects (`enacted`, `democrat_favored`...). When a user
selects a state/plan, `dataStore.addStateData()`:

1. fetches district GeoJSON via `api.getStateGeojson(plan, state)` (`/api/plan`)
2. assigns `district_id`s, and for simulation plans synthesizes candidate/vote fields
3. fetches ensemble summary via `api.getStateSummaryJson(state)` (`/api/summary`)
4. builds a `StateModel` and caches everything in `dataStore` (skips if already cached)

`src/models/StateModel.js` transforms raw GeoJSON district `properties` into derived
election data, compare data, heatmap min/max ranges, and summary counts. Map/table
components read from the StateModel rather than raw GeoJSON.

`src/common/api.js` is an axios instance with `withCredentials = true`; both endpoints
swallow errors and return `null` on failure.

### Map rendering

`src/TabPanels/mapPanel/MapController.jsx` drives Leaflet imperatively via
`react-leaflet`'s `useMap()`. It maintains a module-level `currLayerGroups` object and,
on every render, tears down and rebuilds layers (`removeAllLayer` → `setupMapFilter`
→ `setupHighlightDistrict` → `setupPlanFilter` → `setupView`). Static base-map GeoJSON
for state/district outlines lives in `src/0.data/*.json` and is wired into the
`GeoData` lookup at the bottom of `GlobalVariables.js`. Type/style conversions go
through `src/common/ConversionHelper.js`.

### UI layout

`HomePage` → `MainDrawer` (MUI responsive drawer with controls) + `MainTabPanel`
(renders `MapPanel` only — the tab bar / ANALYZE tab were removed). Components under
`src/TabPanels/analyzePanel/` exist but are largely unmounted. `Loader.jsx` (an `ldrs`
spinner) shows while `loading` is true.

### Conventions

- MUI v5 (`@mui/material`) is the UI kit; charts use `apexcharts`/`react-apexcharts`.
- Files are `.jsx`/`.js` (not TypeScript).
- SVGs import as React components (svgr configured in `vite.config.mjs`).
- `vite.config.mjs` contains custom plugins replicating CRA behavior (env handling,
  `build/` outDir, `%ENV%` HTML substitution, `~` import prefix). Be careful editing it.

<!-- mex-agent:skills:start -->
## MEX agent skills
- At the start of every session, read `.mex/AGENTS.md` and `.mex/ROUTER.md` before project work; follow `ROUTER.md` to load only the relevant context.
- Read `mex logging --json` at session start and before optional logging. Its checkout-local advisory mode is `significant` (quiet default: material decisions, risks, blockers, or durable discoveries), `checkpoints` (batch useful notes at task/session boundaries), or `manual` (no unsolicited notes). Skip routine tool calls, edits, repeated status, and empty summaries. Honor explicit user log requests in every mode; never suppress mandatory workflow Activity or recovery audit records. Report a policy read failure instead of guessing or changing the preference.
- When earlier work may inform the task, retrieve bounded relevant notes with `mex timeline --query "subject phrase" --file src/example.ts --limit 10 --json`, using the known subject or exact recorded file path, or both. Treat matches as historical evidence, not accepted current knowledge; verify conclusions before reuse or explicit promotion with their source retained.
- Use `/mex-inbox` for explicit contributions to project knowledge and `/mex-relay` for durable team handoffs. Invoke them automatically when intent clearly matches; ordinary GROW upkeep remains available without Inbox.
- When MEX context materially helps your work, mention MEX and the relevant finding naturally in your explanation. Tie the mention to what it helped you understand, decide, or verify. Avoid fixed phrases, standalone acknowledgements, repeated mentions, or narrating routine context loading. This replaces older MEX instructions requiring a fixed acknowledgement or context-loading narration.
- Do not claim an author, date, or historical event unless the retrieved data actually provides it.
- After a MEX write, say exactly what changed and its sharing boundary: a local draft is checkout-only and nothing is shared; a canonical artifact is written to the working tree and requires commit/push to share.
- Skill activation is not approval for canonical actions.
<!-- mex-agent:skills:end -->
