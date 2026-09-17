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
last_updated: 2026-09-17
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
**Status:** Active
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
