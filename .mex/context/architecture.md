---
name: architecture
description: How the major pieces of this project connect and flow. Load when working on system design, integrations, or understanding how components interact.
triggers:
  - "architecture"
  - "system design"
  - "how does X connect to Y"
  - "integration"
  - "flow"
edges:
  - target: context/stack.md
    condition: when specific technology details are needed
  - target: context/decisions.md
    condition: when understanding why the architecture is structured this way
  - target: context/conventions.md
    condition: when writing code against the store/data flow
grounds_to: []
last_updated: 2026-09-17
---

# Architecture

## System Overview

This is the **frontend** of Huskies, a congressional redistricting / gerrymandering
analyzer. It is a single-page React app; there is no client-side router — `App.jsx`
renders one `HomePage`.

Action flow:

- `App` wraps everything in `StoreContextProvider` (`src/common/Store.jsx`), the single
  source of app state.
- User picks a **state** (NY/GA/IL) and a **plan** (2022 enacted + 5 simulated ensembles)
  from `MainDrawer` controls → calls methods on `mapStore`.
- `mapStore.selectState/selectPlan` → `dataStore.addStateData(plan, state)` → fetches via
  `src/common/api.js` (`GET /api/plan` for district GeoJSON, `GET /api/summary` for ensemble
  data), builds a `StateModel`, and caches everything keyed `[planType][stateType]`.
- `MapPanel` renders the Leaflet map (`MainMap` → `MapController`), heatmaps, and summary
  tables from the cached `StateModel`, re-rendering as `mapStore` changes.
- `Loader` shows a full-screen overlay while `dataStore` is fetching (`loading` flag).

## Key Components

- **Store (`src/common/Store.jsx`)** — one React Context exposing `mapStore`, `dataStore`,
  `pageStore`, `callbacks`, and `loading`. Methods are imperatively attached to `useState`
  objects; mutations go through per-store reducer functions switching on action types.
- **GlobalVariables (`src/common/GlobalVariables.js`)** — all enums/constants (action types,
  `PlanType`, `StateType`, `MapFilterType`, colors) plus the `GeoData` lookup of static base
  outlines. Read this before touching store or map logic.
- **StateModel (`src/models/StateModel.js`)** — transforms raw district GeoJSON `properties`
  into derived election/compare/heatmap/summary data consumed by map + tables.
- **MapController (`src/TabPanels/mapPanel/MapController.jsx`)** — drives Leaflet imperatively
  via `useMap()`; tears down and rebuilds layer groups (`currLayerGroups`) each render.
- **api (`src/common/api.js`)** — axios instance, `baseURL = ${VITE_SERVER_URL}/api`,
  `withCredentials = true`; both endpoints swallow errors and return `null`.

## External Dependencies

- **The Huskies backend** (a separate repo at `~/huskies-server`, not an npm package) — a
  Java Spring Boot HTTP server (port 8000) that serves plans + ensemble summaries from a
  database and performs no calculations. Client base URL is `VITE_SERVER_URL` (dev
  `http://localhost:8000`, prod `https://huskies.zfdupont.com`); api.js appends `/api`.
- **GerryChain Python scripts** (in the huskies-server repo) — generate the simulated
  redistricting ensembles via MCMC/ReCom and POST them to the DB. Not called by this client.
- **Leaflet tile providers** — base map tiles for the interactive map (via react-leaflet).

## What Does NOT Exist Here

- No backend, database, or plan-generation logic — all in huskies-server.
- No client-side routing (`react-router` was removed); single page, no routes.
- No test suite or lint step configured.
- No state library (Redux/Zustand) — state is the hand-rolled React Context in `Store.jsx`.
- The ANALYZE tab is not mounted; only the map view renders. `src/TabPanels/analyzePanel/`
  components mostly exist but are unused.
