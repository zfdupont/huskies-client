---
name: deploy-release
description: Ship huskies-client (and coordinate huskies-server) to production via the release branch + watchtower. Use when deploying or when a deploy doesn't take effect.
triggers:
  - "deploy"
  - "redeploy"
  - "release"
  - "ship to prod"
  - "production"
  - "watchtower"
edges:
  - target: context/setup.md
    condition: for the build/deploy commands and env
  - target: context/architecture.md
    condition: to understand the client/server/DB boundary a deploy crosses
grounds_to: []
last_updated: 2026-09-24
---

# Deploy via the release branch

## Context

Deploys are driven by the **`release`** branch, not `main`. Pushing `release` triggers a CI
image build+push to GHCR (`ghcr.io/zfdupont/huskies-{client,server}:release`); a **watchtower**
container on the host polls (~120s) and auto-restarts with the new image. Live at
`https://huskies.zfdupont.com` (client on the host, server internal on `:8090`, MongoDB Atlas).

- Client image: built by `.github/workflows/ci.yml` (docker job, `if ref == release`).
- Server image: built by huskies-server `.github/workflows/docker.yml` (`on: push: release`).

## Steps

1. Land the change on `main` (tests + build green).
2. Advance `release` to `main` and push:
   ```
   git checkout release && git merge main && git push origin release
   ```
   `release` is squash-merged history, so it diverges — expect merge conflicts on files this
   change touched. Resolve by taking main's version: `git checkout --theirs <file>` (main is
   the tested source of truth), `git add`, commit, push.
3. CI builds (~3-5 min) → watchtower swaps (~2 min). Then verify (below).

## Breaking `/api` contract changes

If the change alters an API response shape (e.g. `/api/summary`), the server + a MongoDB
re-ingest + the client must ship **together** — a new server against old-shape docs (or vice
versa) 404s / renders empty. In huskies-server: `python scripts/build_contract.py` then
`python scripts/fill_database.py` (drops+reloads `plans`/`states` on Atlas; needs
`DATABASE_URI` + `generated/<state>/ensemble_data.json` artifacts). Accept a short downtime.

## Verify

- Public API: `curl -s https://huskies.zfdupont.com/api/summary?state=GA` → expected shape.
- Client deployed? The API is unchanged for pure-client changes, so watch the bundle hash:
  `curl -s https://huskies.zfdupont.com/ | grep -oE 'assets/index-[^"]+\.js'` — it changes when
  the new image is live.
- **Browser cache lies:** a normal reload can serve the old `index-*.js`. Hard-verify by
  loading `https://huskies.zfdupont.com/?nocache=<ts>` and confirming the loaded bundle name
  matches the freshly-deployed hash.

## Gotchas

- CI `docker/build-push` can fail transiently (GHCR push). If it fails but the code builds,
  reproduce locally (`docker build .` from the repo root) and re-trigger with an empty commit:
  `git commit --allow-empty -m "ci: re-trigger" && git push origin release`.
- Check run status without `gh`: `curl -s "https://api.github.com/repos/zfdupont/<repo>/actions/runs?branch=release&per_page=1"`.
- Spring Data Mongo POJOs need **`@Field("snake_case")`** (not just Jackson `@JsonProperty`)
  or snake_case Mongo keys deserialize to null — a class of bug the `/api/summary` contract hit.
