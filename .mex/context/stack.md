---
name: stack
description: Technology stack, library choices, and the reasoning behind them. Load when working with specific technologies or making decisions about libraries and tools.
triggers:
  - "library"
  - "package"
  - "dependency"
  - "which tool"
  - "technology"
edges:
  - target: context/decisions.md
    condition: when the reasoning behind a tech choice is needed
  - target: context/conventions.md
    condition: when understanding how to use a technology in this codebase
grounds_to: []
last_updated: 2026-09-17
---

# Stack

## Core Technologies

- **React 18** — UI, function components + hooks only.
- **Vite 5** — build tool and dev server (migrated from Create React App). Config in
  `vite.config.mjs` has custom plugins replicating CRA behavior (env handling, `build/`
  outDir, `%ENV%` HTML substitution, `~` import prefix, svgr).
- **JavaScript (JSX/JS)** — not TypeScript. No `.ts`/`.tsx`, no tsconfig.
- **pnpm** — package manager (`pnpm-lock.yaml`; pnpm v12). Node 24 in use locally.

## Key Libraries

- **@mui/material v5** (+ `@mui/icons-material`) — UI kit. `@emotion/react` + `@emotion/styled`
  are its required styling peers (kept even though not directly imported).
- **leaflet + react-leaflet** — the interactive map. `MapController` uses Leaflet imperatively.
- **apexcharts + react-apexcharts** — charts in the (currently unmounted) analyze panel.
- **axios** — HTTP client in `src/common/api.js`.
- **ldrs** — the loading spinner (`l-helix`) used by `Loader.jsx`.

## What We Deliberately Do NOT Use

- **No Redux / Zustand / MobX** — app state is a hand-rolled React Context (`Store.jsx`).
- **No react-router** — single page, removed during cleanup.
- **No TypeScript** — plain JSX despite React types being available.
- **No test runner or ESLint** — none configured (react-scripts/testing-library removed).
- **Not MUI v4** (`@material-ui/core`) — removed; use `@mui/*` only.

## Version Constraints

- Vite dev server port comes from the `PORT` env var (read by the `devServerPlugin` in
  `vite.config.mjs`), not a hardcoded CLI flag. Build output goes to `build/` (the CRA
  directory), overriding Vite's default output location.
