---
name: setup
description: Dev environment setup and commands. Load when setting up the project for the first time or when environment issues arise.
triggers:
  - "setup"
  - "install"
  - "environment"
  - "getting started"
  - "how do I run"
  - "local development"
edges:
  - target: context/stack.md
    condition: when specific technology versions or library details are needed
  - target: context/architecture.md
    condition: when understanding how components connect during setup
grounds_to: []
last_updated: 2026-09-17
---

# Setup

## Prerequisites

- Node.js (v24 in use locally; v18+ works)
- pnpm (`npm install -g pnpm`)
- The backend (huskies-server) running on `http://localhost:8000` for data to load

## First-time Setup

1. Install dependencies with pnpm.
2. `cp .env.development.example .env.development`
3. `pnpm dev` (serves on http://localhost:3000)

## Environment Variables

Per-mode via Vite env files (git-ignored; copy from the committed `*.example` templates):

- `VITE_SERVER_URL` (required) — backend base URL; `src/common/api.js` appends `/api`.
- `PORT` (required) — port the Vite client serves on.

Files: `.env.development` (dev: `http://localhost:8000`, port 3000) and `.env.production`
(prod: `https://huskies.zfdupont.com`, port 3005).

## Common Commands

- `pnpm dev` — dev server in development mode, port 3000 (loads `.env.development`)
- `pnpm start` — dev server in production mode, port 3005 (loads `.env.production`)
- `pnpm build` — production build to `build/`

No test or lint scripts are configured.

## Common Issues

- **Map/tables never load, spinner clears with empty data:** the backend isn't reachable at
  `VITE_SERVER_URL`. api.js swallows errors and returns `null`. Start huskies-server on :8000.
- **Port already in use:** `lsof -i :3000` then `kill -9 <PID>`, or change `PORT` in the env file.
- **`ERR_PNPM_IGNORED_BUILDS` on install:** expected/benign; acknowledged in `pnpm-workspace.yaml`
  (`allowBuilds` set false for core-js/esbuild). esbuild works via its prebuilt platform binary.
