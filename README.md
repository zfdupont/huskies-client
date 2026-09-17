# Huskies Client

React single-page app for visualizing and analyzing U.S. congressional redistricting
plans. Pick a state (NY, GA, IL) and a districting plan (the 2022 enacted map or one of
five simulated/ensemble plans), then explore it on an interactive Leaflet map with
demographic/partisan heatmaps and summary tables. Data is served by a separate backend API.

Built with React 18, Vite, MUI, and Leaflet. Package manager: **pnpm**.

## Getting Started

Install dependencies:

```sh
pnpm install
```

Create your local env file from the template:

```sh
cp .env.development.example .env.development
```

Then start the dev server:

```sh
pnpm dev
```

This runs the app in development mode on [http://localhost:3000](http://localhost:3000)
and talks to the backend at `http://localhost:8090/api`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run the dev server in development mode (port 3000, loads `.env.development`). |
| `pnpm start` | Run in production mode (port 3005, loads `.env.production`). |
| `pnpm build` | Build for production into `build/`. |

## Environment

Configuration is per-mode using Vite's env files. These are git-ignored; copy from the
committed `*.example` templates and fill in values.

| File | Used by | Purpose |
|------|---------|---------|
| `.env.development` | `pnpm dev` | Local development. |
| `.env.production` | `pnpm start`, `pnpm build` | Production. |

Variables:

- `VITE_SERVER_URL` — backend base URL. `src/common/api.js` appends `/api`.
- `PORT` — port the Vite client serves on.

## Architecture

See [CLAUDE.md](./CLAUDE.md) for a detailed overview of the state management, data flow,
and map rendering.
