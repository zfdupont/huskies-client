---
name: debug-data-loading
description: Diagnose why the map/tables load empty or the spinner behaves wrong. Use when state/plan selection doesn't produce data.
triggers:
  - "no data"
  - "map empty"
  - "spinner"
  - "loading forever"
  - "api not working"
edges:
  - target: context/architecture.md
    condition: to follow the state/plan -> api -> StateModel data flow
  - target: context/setup.md
    condition: for backend URL and env configuration
grounds_to: []
last_updated: 2026-09-17
---

# Debug Data Loading

## Context

Data path: component → `mapStore.selectState/selectPlan` → `dataStore.addStateData` →
`src/common/api.js` (`GET /api/plan`, `GET /api/summary`) → `StateModel` → cached in
`dataStore` keyed `[planType][stateType]`. `api.js` **swallows errors and returns `null`**.

## Steps

1. Confirm the backend (huskies-server) is running and reachable at `VITE_SERVER_URL`
   (dev: `http://localhost:8000`). Hit `${VITE_SERVER_URL}/api/plan?state=NY&plan=enacted`
   directly in a browser/curl.
2. Check `import.meta.env.VITE_SERVER_URL` resolved (right `.env.<mode>` for the run mode).
3. In devtools Network, verify the `/api/plan` and `/api/summary` requests and their status.
4. If requests 401/CORS-fail: note `axios.defaults.withCredentials = true` — the server must
   allow credentials for that origin.
5. If requests succeed but UI is empty: inspect the built `StateModel` / cached `dataStore`.

## Gotchas

- Because api.js returns `null` on failure, a down backend looks like "loaded, but empty" —
  not an error. Always check the network tab first.
- Endpoint naming: client calls `/api/plan` (singular) and `/api/summary`; confirm the server
  route matches (the server README also mentions `/plans`).
- `addStateData` early-returns if `isStateDataReady` is already true — stale cache can mask changes.

## Verify

- [ ] Backend reachable at `VITE_SERVER_URL`; `/api/plan` returns GeoJSON.
- [ ] Correct env file loaded for the run mode.
- [ ] Network requests return 200 with data.

## Debug

- Spinner never clears: should not happen now (`try/finally`), but if it does, an exception
  escaped `addStateData` before `setLoading(false)` — check the fetch/transform chain.
- Wrong plan/state rendered: verify enum string values match backend tokens (`PlanType`/`StateType`).

## Update Scaffold
- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
- [ ] Update any `.mex/context/` files that are now out of date
- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
