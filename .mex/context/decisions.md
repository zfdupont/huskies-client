---
name: decisions
description: Key architectural and technical decisions with reasoning. Load when making design choices or understanding why something is built a certain way.
triggers:
  - "why do we"
  - "why is it"
  - "decision"
  - "alternative"
  - "we chose"
edges:
  - target: context/architecture.md
    condition: when a decision relates to system structure
  - target: context/stack.md
    condition: when a decision relates to technology choice
grounds_to: []
last_updated: 2026-09-24
---

# Decisions

## Decision Log

### Migrate from Create React App to Vite
**Date:** 2024-07-17
**Status:** Active
**Decision:** Build with Vite; keep CRA-compatible behavior via custom plugins in `vite.config.mjs`.
**Reasoning:** Faster dev server/builds; CRA (react-scripts) was unmaintained.
**Alternatives considered:** Staying on CRA (rejected — slow, unmaintained); Next.js (rejected — no SSR need, it's a pure SPA).
**Consequences:** `vite.config.mjs` replicates CRA (`build/` outDir, `%ENV%` HTML substitution, `~` prefix, svgr, `PORT`/`REACT_APP_` handling). Env vars use `import.meta.env.VITE_*`. Edit the config carefully.

### Single hand-rolled React Context for all state
**Date:** 2024-07-17
**Status:** Active
**Decision:** All app state lives in `src/common/Store.jsx` (mapStore/dataStore/pageStore/callbacks/loading), with methods imperatively attached to `useState` objects and mutations via per-store reducers.
**Reasoning:** App scope is small; avoids a state-library dependency.
**Alternatives considered:** Redux (rejected — overkill); Zustand (not adopted).
**Consequences:** No external state lib. New state/actions must follow the reducer + action-type-in-`GlobalVariables.js` pattern; direct `setState` outside the store is off-pattern.

### Per-mode Vite env files, port from PORT
**Date:** 2026-09-16
**Status:** Active
**Decision:** Split config into git-ignored `.env.development` (localhost:8000, port 3000) and `.env.production` (huskies.zfdupont.com, port 3005) with committed `*.example` templates; the dev-server port comes from `PORT`, not a hardcoded `--port`.
**Reasoning:** One ambiguous `.env` conflated dev/prod; a hardcoded `--port` overrode env.
**Alternatives considered:** Committing real `.env` files (rejected — repo policy keeps env files git-ignored, examples committed).
**Consequences:** `pnpm dev` = development mode; `pnpm start` = `vite --mode production`.

### Remove test tooling; no tests
**Date:** 2026-09-17
**Status:** Superseded (2026-09-24 — Vitest + Playwright added; see "Add Vitest + Playwright test suite")
**Decision:** Removed `react-scripts` and `@testing-library/*`; deleted the boilerplate test files. No test runner is configured.
**Reasoning:** The `react-scripts test` script was broken post-Vite migration and only CRA boilerplate tests existed; react-scripts was a very heavy unused dependency.
**Alternatives considered:** Wiring up Vitest (deferred — additive, not cleanup).
**Consequences:** `pnpm build` is the only verification gate. Adding tests means setting up Vitest first.

### Keep large GeoJSON bundled (deferred)
**Date:** 2026-09-17
**Status:** Active
**Decision:** The imported district GeoJSON (NYD/GAD/ILD, ~31MB) is still `import`ed into the bundle via `GeoData`, not fetched at runtime.
**Reasoning:** Moving it out is a real refactor — `GeoData` is read synchronously in `MapController`.
**Alternatives considered:** Moving files to `public/` + runtime fetch (deferred to its own branch — higher risk of breaking the map).
**Consequences:** JS bundle is ~12MB (Vite warns on chunk size). Tackle separately when addressing bundle size.

### Add Vitest + Playwright test suite
**Date:** 2026-09-24
**Status:** Active
**Decision:** Vitest (+ @testing-library/react, jsdom) for unit/component tests co-located as `*.test.{js,jsx}`; Playwright for e2e in `e2e/`. Both run in CI.
**Reasoning:** The reskin and data-contract work were high-risk with no tests; the earlier "no tests" stance was cleanup-era, not permanent.
**Consequences:** `pnpm test` / `pnpm test:e2e` are gates alongside `pnpm build`. Playwright stubs `/api/*` via route fixtures, so e2e needs no backend.

### Remove MUI/Emotion; Tailwind v4 + owned `src/ui/` kit
**Date:** 2026-09-24
**Status:** Active
**Decision:** Drop MUI and Emotion; style with Tailwind v4 (its Vite plugin) and a small owned primitives kit in `src/ui/`. Light/dark theme via semantic CSS tokens that flip on `<html data-theme>`.
**Reasoning:** Aesthetic overhaul + remove the heaviest dependency; own the component layer for control and a cheaper future layout rework.
**Alternatives considered:** Headless UI lib + Tailwind (rejected — adds a dep, against the removal spirit); inline Tailwind everywhere (rejected — duplication).
**Consequences:** No component library. New UI goes through `src/ui/`; theme-aware colors use tokens, not hardcoded values.

### Ensemble analysis data contract (observed vs. distribution)
**Date:** 2026-09-24
**Status:** Active
**Decision:** `/api/summary` returns a canonical contract built on one repeatable comparison unit — `{observed, observed_percentile, ensemble:{n, quantiles, histogram}}` — under `metrics.by_incumbent[]`, plus `meta`/`summary`/`schema_version` (snake_case). JSON Schema (in huskies-server) is the source of truth. Replaced the mismatched `enacted_data`/`incumbent_data` blobs that had left the incumbent-variation charts broken.
**Reasoning:** The client expected an `enacted_data` field the server never sent; a generic, extensible contract fixes it and matches redistricting outlier-analysis norms.
**Alternatives considered:** raw per-plan samples (rejected — heavy, pushes stats to client); quantiles-only (deferred). Chose histogram + quantiles.
**Consequences:** Breaking, in-place `/api/summary` change — server + Mongo re-ingest + client must ship together. Client reads it via `ensembleContract.js`; v1 renders per-incumbent **box-and-whisker** charts from `quantiles` (`IncumbentVariation`).
