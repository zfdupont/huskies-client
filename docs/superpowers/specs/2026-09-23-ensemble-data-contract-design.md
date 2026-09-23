# Ensemble-Analysis Data Contract — Design

Date: 2026-09-23
Status: Approved for planning
Repos: `huskies-server` (Python pipeline + Spring/Mongo) and `huskies-client` (React)

## Overview

Replace the ad-hoc, inconsistent ensemble-analysis payload with a single canonical
data contract built around one repeatable pattern: **an observed value compared
against a reference distribution** (the outlier-analysis pattern standard in
redistricting analytics). The contract is emitted by the Python pipeline, stored in
MongoDB, served by Spring at `/api/summary`, and consumed by the React client.

This restores the currently-broken incumbent-variation charts (the client expects an
`enacted_data` field the server never serves) and replaces the mismatched
`enacted_data` / `incumbent_data` blobs with one consistent, extensible shape.

The data to populate v1 already exists in the pipeline: `ensemble_analysis.py`
computes per-incumbent ensemble arrays and the observed enacted values; only the
distribution summarization (histogram, quantiles, percentile) and the reshaping are
new.

## Goals

- Define one canonical, snake_case contract for ensemble analysis, with a JSON Schema
  as the source of truth.
- Restore the incumbent-variation charts (geographic + population variation) with the
  observed value highlighted against the ensemble distribution.
- Compute all statistics once, server/pipeline-side; the client only renders.
- Make the contract generic (a metric list) so additional metrics are data-only later.

## Non-Goals

- No statewide partisan metrics (efficiency gap, mean-median, seats) in v1. The shape
  leaves room; populating them is a later effort.
- No `by_district` metrics in v1 (shape leaves room).
- No dedicated "Analyze" tab/view. Charts render where they do today (inside a focused
  district's detail).
- No re-running of GerryChain ensembles. v1 reshapes and summarizes data the pipeline
  already produces.
- No change to the `/api/plan` (GeoJSON) endpoint or the Leaflet map.

## Decisions (settled during brainstorming)

- **v1 scope:** restore-parity — per-incumbent geographic + population variation, plus
  the statewide summary counts. Generic shape.
- **Spec span:** all three sides in this one spec (Python output, Spring/Mongo model +
  ingestion, client consumption).
- **Casing:** snake_case at the API boundary (matches the Python pipeline, the
  existing `@JsonProperty` mappings, and the snake_case GeoJSON keys the client already
  reads from `/api/plan`).
- **Rollout:** replace `/api/summary` in place (breaking change; server + client +
  re-ingested data land together).
- **Distribution representation:** histogram (`bin_edges` + `counts`) + quantiles +
  `observed` + `observed_percentile`.
- **Server model:** typed POJOs (not untyped passthrough).
- **JSON Schema** is the contract's source of truth.

## The Contract

`GET /api/summary?state=<STATE>` returns:

```jsonc
{
  "schema_version": "1.0",
  "meta": {
    "state": "GA",                       // postal key the client uses; FIPS is a future swap
    "plan": "enacted",                   // the subject plan compared against the ensemble
    "ensemble": {
      "size": 4000,                      // number of plans in the ensemble
      "method": "recom",
      "generated": "2024-11-02T00:00:00Z" // ISO-8601 UTC
    }
  },
  "summary": {                           // statewide scalar summary (was `ensemble_summary`)
    "num_plans": 4000,
    "num_incumbents": 14,
    "avg_incumbent_winners": 11.9,
    "avg_geo_var": 0.11,
    "avg_pop_var": 0.09
  },
  "metrics": {
    "by_incumbent": [
      {
        "id": "austin-scott",           // stable slug; never key by display name
        "name": "Austin Scott",
        "district": 8,                  // the incumbent's district in the subject plan
        "party": "R",
        "metrics": [
          {
            "id": "geographic_variation",
            "label": "Geographic Variation",
            "unit": "fraction",          // values in [0, 1]
            "observed": 0.29,            // the subject (enacted) plan's value
            "observed_percentile": 0.94, // rank of observed within the ensemble, [0, 1]
            "ensemble": {
              "n": 4000,
              "quantiles": { "0": 0.03, "0.25": 0.08, "0.5": 0.11, "0.75": 0.15, "1": 0.41 },
              "histogram": {
                "bin_edges": [0.0, 0.02, 0.04, "…", 1.0], // length 51
                "counts":    [3, 17, 42, "…"]             // length 50; 2pp bins over [0,1]
              }
            }
          },
          {
            "id": "population_variation",
            "label": "Population Variation",
            "unit": "fraction",
            "observed": 0.14,
            "observed_percentile": 0.71,
            "ensemble": { "n": 4000, "quantiles": { "...": "..." }, "histogram": { "...": "..." } }
          }
        ]
      }
    ]
  }
}
```

### The comparison unit

`{ observed, observed_percentile, ensemble: { n, quantiles, histogram } }` is the one
repeatable object. Every current and future metric uses it. `by_incumbent[].metrics[]`
is a generic list; adding a metric requires no schema or code change, only data.

### Histogram

Fixed 50 bins of width 0.02 over `[0, 1]` (2 percentage points), matching the current
chart's range buckets. `bin_edges` has 51 entries, `counts` has 50. `counts` sums to
the ensemble size for that metric.

### Quantiles

Five-number summary keyed by fraction (`"0"`, `"0.25"`, `"0.5"`, `"0.75"`, `"1"`).
Carried for a future box-plot view; not rendered in v1.

### JSON Schema

A JSON Schema file (`schema/ensemble_contract.v1.json`, shared reference; lives in
`huskies-server`) is the contract's source of truth. The Python emitter validates
against it; a Java/integration test may validate the served response against it.

### Identity and units

- `meta.state`: postal code (e.g. `"GA"`), matching the request param and client keys.
- `by_incumbent[].id`: a slug derived from the incumbent name (e.g. `austin-scott`).
  `name` is the display label. (The incumbents CSV `geoid20` is a more robust id and
  may replace the slug later without a shape change.)
- All variation values are fractions in `[0, 1]`, declared per metric via `unit`.

## Python Pipeline (`huskies-server/scripts`)

`ensemble_analysis.py` already computes:
- `incumbent_summary_data[incumbent]` → `area_variations` / `vap_total_variations`
  (the full per-plan ensemble arrays).
- `enacted_data.incumbent_data[incumbent]` → `area_variation` / `vap_total_variation`
  (the observed enacted values).
- `ensemble_summary` (the statewide scalars).
- incumbent `party`, and the new-plan district id (`id_new`) via `map_incumbents`.

**New:** a contract-emitter module (`scripts/build_contract.py`) that, per state,
transforms the above into the contract. For each incumbent × metric
(`geographic_variation` ← `area`, `population_variation` ← `vap_total`):
- `observed` = the enacted value.
- `observed_percentile` = rank of `observed` within the ensemble array, clamped to
  `[0, 1]` (e.g. `numpy.searchsorted` / `scipy.stats.percentileofscore`, normalized).
- `histogram` = `numpy.histogram(arr, bins=50, range=(0.0, 1.0))` → `bin_edges`
  (as list, length 51) and `counts` (as list, length 50).
- `quantiles` = `numpy.percentile(arr, [0, 25, 50, 75, 100])` keyed by fraction.

The emitter assembles `meta`, `summary`, and `metrics.by_incumbent`, validates against
the JSON Schema, and writes one contract JSON per state. Existing analysis files are
untouched; this is additive and wired into the emit step.

## Server (`huskies-server`, Spring + MongoDB)

- **Ingestion:** the contract JSON per state is upserted into the Mongo `states`
  collection, keyed by `meta.state`. The existing load mechanism is located and
  adapted during planning; if none exists, a small loader is added. (This is a breaking
  re-ingestion: the stored document shape changes.)
- **Model:** replace the five flat fields on `Ensemble.java` with typed POJOs mirroring
  the contract: `Ensemble { schema_version, meta, summary, metrics }`, with
  `Meta { state, plan, ensemble: EnsembleMeta }`,
  `Summary { num_plans, num_incumbents, avg_incumbent_winners, avg_geo_var, avg_pop_var }`,
  `Metrics { by_incumbent: List<IncumbentMetrics> }`,
  `IncumbentMetrics { id, name, district, party, metrics: List<Metric> }`,
  `Metric { id, label, unit, observed, observed_percentile, ensemble: Distribution }`,
  `Distribution { n, quantiles: Map<String, Double>, histogram: Histogram }`,
  `Histogram { bin_edges: List<Double>, counts: List<Integer> }`.
  Use `@JsonProperty` snake_case throughout (matches existing style).
- **Endpoint:** `/api/summary?state=` is unchanged in signature; `EnsembleService.getSummary`
  still does `findOne(name == state)` (matching `meta.state`), and returns the new shape.
  This is an in-place breaking replacement.

## Client (`huskies-client`)

- `src/common/api.js`: unchanged (same endpoint, returns the new shape).
- `src/common/Store.jsx`: `dataStore.ensemble` = response as-is. `isEnsemblejsonReady()`
  checks `dataStore.ensemble?.schema_version` (or `dataStore.ensemble?.meta`) instead of
  `ensemble['name']`.
- `src/TabPanels/analyzePanel/SummaryEnsembleTable.jsx`: read `ensemble.summary`
  (field names `num_plans`, `num_incumbents`, `avg_incumbent_winners`, `avg_geo_var`,
  `avg_pop_var` are unchanged).
- `src/TabPanels/mapPanel/DistrictSummaryTable.jsx`: look up each district's incumbent
  bundle in `ensemble.metrics.by_incumbent` by name — the district's `data.incumbent`
  (a display name) equals `by_incumbent[].name` — and pass the bundle to
  `DistrictSummaryItem`. (`id`/slug is carried for future use but the client only has
  the incumbent name to match on.)
- `src/TabPanels/mapPanel/DistrictSummaryItem.jsx`: `canShowIncumbentVariation` = a
  matching `by_incumbent` bundle exists AND the plan is enacted AND the district has an
  incumbent. Render one `IncumbentVariation` per metric in the bundle.
- `src/TabPanels/analyzePanel/IncumbentVariation.jsx`: **simplified** to consume
  `{ label, observed, observed_percentile, unit, ensemble: { histogram } }`. It renders
  an ApexCharts bar chart directly from `histogram.counts` (x = bin ranges derived from
  `bin_edges`), highlighting the bin containing `observed` in the accent color. All
  client-side binning (`calculateDifferences`, `buildData`, the hardcoded 1-2…99-100
  label map) is deleted — the pipeline produces the bins now.

## Error Handling / Edge Cases

- District has an incumbent but no matching `by_incumbent` bundle → render no charts for
  that district (graceful; matches current behavior).
- `observed` outside the ensemble range → `observed_percentile` clamped to `0`/`1`; the
  highlighted bin clamps to the first/last bin.
- A metric with a missing/empty distribution → omit that metric from the bundle.
- State not found → `/api/summary` returns 404 (existing behavior via
  `ResourceNotFoundException`).
- Client sees an unrecognized `schema_version` → log a warning and render what it can.
- `counts` for a metric should sum to `ensemble.n`; a Python test asserts this.

## Testing

- **JSON Schema** (`schema/ensemble_contract.v1.json`): validates the Python emitter
  output (a Python test), and optionally the served response (a Java/integration test).
- **Python** (`build_contract.py`): unit tests — given known ensemble arrays + observed
  value, assert exact `counts`, `bin_edges`, `quantiles`, and `observed_percentile`,
  including out-of-range clamping and the `counts` sum invariant.
- **Java:** deserialize a sample contract document into the POJOs; a controller/service
  test asserts `/api/summary` returns the expected JSON for a seeded state.
- **Client:**
  - the `by_incumbent` lookup/adapter in `DistrictSummaryTable` (matches the right
    incumbent, handles missing bundles),
  - `IncumbentVariation` renders bars from `counts` and highlights the correct bin for a
    given `observed`,
  - `SummaryEnsembleTable` reads `ensemble.summary`.
  Run under the existing Vitest + Testing Library setup (`css:false`).

## Rollout / Sequencing (for the implementation plan)

1. Author the JSON Schema (`ensemble_contract.v1.json`) — the source of truth.
2. Python: `build_contract.py` emitter + tests, validated against the schema; wire into
   the emit step; regenerate the contract JSON for GA/NY/IL.
3. Server: locate/adapt Mongo ingestion; upsert the new-shape documents into `states`.
4. Server: restructure `Ensemble.java` into typed POJOs; update `EnsembleService`;
   deserialization + endpoint tests.
5. Client: update `Store` readiness check + `SummaryEnsembleTable` (summary).
6. Client: `DistrictSummaryTable` incumbent lookup + `DistrictSummaryItem` guard.
7. Client: simplify `IncumbentVariation` to consume the histogram; delete client-side
   binning; tests.
8. End-to-end verification: charts render for an incumbent district with the observed
   bar highlighted; summary table populates; existing unit + e2e suites green.

Because `/api/summary` is replaced in place, steps 3–6 must land together (server shape,
re-ingested data, and client consumption) to avoid a broken window.
