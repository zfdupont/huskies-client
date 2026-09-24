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
last_updated: 2026-09-24
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

- **Tailwind CSS v4** (`tailwindcss` plus its Vite plugin, dev deps) — styling. MUI and
  Emotion were removed; UI is a hand-rolled primitives kit in `src/ui/` (Button, IconButton,
  Panel, Toggle, Checkbox, Collapse, NavSection, Drawer, BottomSheet, Table, inline SVG
  icons) styled with Tailwind. Theme via semantic CSS tokens that flip on `<html data-theme>`.
- **leaflet + react-leaflet** — the interactive map. `MapController` uses Leaflet imperatively.
- **apexcharts + react-apexcharts** — box-and-whisker charts in a focused district's detail
  (`IncumbentVariation`), built from the ensemble contract's `quantiles`.
- **axios** — HTTP client in `src/common/api.js` (non-credentialed; backend CORS has no
  credentials, so `withCredentials` was removed).
- **ldrs** — the loading spinner (`l-helix`) used by `Loader.jsx`.

## Testing

- **Vitest + @testing-library/react** — unit/component tests (`src/**/*.test.{js,jsx}`,
  jsdom, `css:false`). Run with `pnpm test`.
- **Playwright** — e2e in `e2e/` (`pnpm test:e2e`); webServer boots `pnpm dev`, no backend
  needed (API stubbed via route fixtures). Both run in CI (`.github/workflows/ci.yml`).

## What We Deliberately Do NOT Use

- **No Redux / Zustand / MobX** — app state is a hand-rolled React Context (`Store.jsx`).
- **No react-router** — single page, removed during cleanup.
- **No TypeScript** — plain JSX despite React types being available.
- **No ESLint** — not configured. (Tests DO exist now: Vitest + Playwright — see Testing.)
- **No MUI / Emotion / component library** — removed; UI is the owned `src/ui/` kit + Tailwind.

## Version Constraints

- Vite dev server port comes from the `PORT` env var (read by the `devServerPlugin` in
  `vite.config.mjs`), not a hardcoded CLI flag. Build output goes to `build/` (the CRA
  directory), overriding Vite's default output location.
