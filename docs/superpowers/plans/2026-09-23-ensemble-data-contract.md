# Ensemble-Analysis Data Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mismatched ensemble payload with one canonical `observed`-vs-`ensemble`-distribution contract, produced by the Python pipeline, served by Spring, and consumed by the React client — restoring the incumbent-variation charts.

**Architecture:** A JSON Schema is the source of truth. A pure Python transform turns the existing `ensemble_data.json` artifact into the contract (no GerryChain rerun); Mongo ingestion upserts it into `states` keyed by `meta.state`; `Ensemble.java` becomes typed POJOs mirroring the contract; the client reads the new shape and `IncumbentVariation` renders the server-computed histogram.

**Tech Stack:** Python 3 (numpy, jsonschema, pytest, pymongo), Java 17 / Spring Boot + MongoDB (Jackson, JUnit 5), React 18 + Vite + Vitest/Testing Library + react-apexcharts.

**Spec:** `docs/superpowers/specs/2026-09-23-ensemble-data-contract-design.md` (in `huskies-client`)

## Global Constraints

- Two repos: `huskies-server` (Tasks 1–4) and `huskies-client` (Tasks 5–7). Each task states its working directory.
- snake_case at the API boundary and in all stored/served JSON.
- `/api/summary?state=<STATE>` is **replaced in place** (breaking): server model, re-ingested data, and client land together (Tasks 3–6 must all ship before the app works end-to-end).
- v1 metrics: exactly `geographic_variation` (from `area_variations`/`area_variation`) and `population_variation` (from `vap_total_variations`/`vap_total_variation`), `unit: "fraction"` (values in [0,1]).
- Distribution: histogram of **50 fixed bins over [0,1]** (2pp) — `bin_edges` length 51, `counts` length 50; values clipped to [0,1] before binning so `counts` sums to `ensemble.n`. Plus `quantiles` (five-number summary keyed `"0","0.25","0.5","0.75","1"`) and `observed_percentile` (fraction ≤ observed, clamped [0,1]).
- Contract drops `winner_split`, `box_w_data`; v1 also omits `district`, `party`, `by_district`, `statewide` (client matches incumbents by name; those fields are deferred, data-only additions).
- Incumbent `id` is a slug of the name; client matches by `name`.
- The contract is a pure transform of the existing `generated/<state>/ensemble_data.json` — do NOT re-run GerryChain.
- No co-author / "Generated with" commit trailers. Commit directly to `main` in each repo (do not open branches).

---

### Task 1: JSON Schema for the contract (source of truth)

**Working dir:** `huskies-server`

**Files:**
- Create: `scripts/schema/ensemble_contract.v1.json`
- Create: `scripts/tests/schema_test.py`
- Modify: `scripts/requirements.txt` (add `jsonschema`)

**Interfaces:**
- Produces: the schema file at `scripts/schema/ensemble_contract.v1.json`; every later Python task validates against it via `jsonschema`.

- [ ] **Step 1: Add the dependency**

Append to `scripts/requirements.txt`:

```
jsonschema==4.21.1
```

Run: `pip install jsonschema==4.21.1`

- [ ] **Step 2: Write the schema**

Create `scripts/schema/ensemble_contract.v1.json`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://huskies/ensemble_contract.v1.json",
  "title": "Ensemble Analysis Contract v1",
  "type": "object",
  "required": ["schema_version", "meta", "summary", "metrics"],
  "additionalProperties": false,
  "properties": {
    "schema_version": { "const": "1.0" },
    "meta": {
      "type": "object",
      "required": ["state", "plan", "ensemble"],
      "additionalProperties": false,
      "properties": {
        "state": { "type": "string" },
        "plan": { "type": "string" },
        "ensemble": {
          "type": "object",
          "required": ["size", "method", "generated"],
          "additionalProperties": false,
          "properties": {
            "size": { "type": "integer", "minimum": 0 },
            "method": { "type": "string" },
            "generated": { "type": "string" }
          }
        }
      }
    },
    "summary": {
      "type": "object",
      "required": ["num_plans", "num_incumbents", "avg_incumbent_winners", "avg_geo_var", "avg_pop_var"],
      "additionalProperties": false,
      "properties": {
        "num_plans": { "type": "integer" },
        "num_incumbents": { "type": "integer" },
        "avg_incumbent_winners": { "type": "number" },
        "avg_geo_var": { "type": "number" },
        "avg_pop_var": { "type": "number" }
      }
    },
    "metrics": {
      "type": "object",
      "required": ["by_incumbent"],
      "additionalProperties": false,
      "properties": {
        "by_incumbent": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "name", "metrics"],
            "additionalProperties": false,
            "properties": {
              "id": { "type": "string" },
              "name": { "type": "string" },
              "metrics": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["id", "label", "unit", "observed", "observed_percentile", "ensemble"],
                  "additionalProperties": false,
                  "properties": {
                    "id": { "type": "string" },
                    "label": { "type": "string" },
                    "unit": { "type": "string" },
                    "observed": { "type": "number" },
                    "observed_percentile": { "type": "number", "minimum": 0, "maximum": 1 },
                    "ensemble": {
                      "type": "object",
                      "required": ["n", "quantiles", "histogram"],
                      "additionalProperties": false,
                      "properties": {
                        "n": { "type": "integer", "minimum": 0 },
                        "quantiles": {
                          "type": "object",
                          "required": ["0", "0.25", "0.5", "0.75", "1"],
                          "additionalProperties": false,
                          "properties": {
                            "0": { "type": "number" }, "0.25": { "type": "number" },
                            "0.5": { "type": "number" }, "0.75": { "type": "number" },
                            "1": { "type": "number" }
                          }
                        },
                        "histogram": {
                          "type": "object",
                          "required": ["bin_edges", "counts"],
                          "additionalProperties": false,
                          "properties": {
                            "bin_edges": { "type": "array", "items": { "type": "number" }, "minItems": 51, "maxItems": 51 },
                            "counts": { "type": "array", "items": { "type": "integer" }, "minItems": 50, "maxItems": 50 }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

- [ ] **Step 3: Write the failing test**

Create `scripts/tests/schema_test.py`:

```python
import json, os
from jsonschema import Draft202012Validator

SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "..", "schema", "ensemble_contract.v1.json")

def load_schema():
    with open(SCHEMA_PATH) as f:
        return json.load(f)

def test_schema_is_itself_valid():
    Draft202012Validator.check_schema(load_schema())

def test_minimal_valid_document_passes():
    doc = {
        "schema_version": "1.0",
        "meta": {"state": "GA", "plan": "enacted",
                 "ensemble": {"size": 2, "method": "recom", "generated": "2024-01-01T00:00:00Z"}},
        "summary": {"num_plans": 2, "num_incumbents": 1, "avg_incumbent_winners": 1.0,
                    "avg_geo_var": 0.1, "avg_pop_var": 0.1},
        "metrics": {"by_incumbent": [
            {"id": "jane-doe", "name": "Jane Doe", "metrics": [
                {"id": "geographic_variation", "label": "Geographic Variation", "unit": "fraction",
                 "observed": 0.2, "observed_percentile": 0.5,
                 "ensemble": {"n": 2,
                    "quantiles": {"0": 0.0, "0.25": 0.1, "0.5": 0.2, "0.75": 0.3, "1": 0.4},
                    "histogram": {"bin_edges": [i/50 for i in range(51)], "counts": [0]*50}}}]}]}
    }
    Draft202012Validator(load_schema()).validate(doc)

def test_extra_field_is_rejected():
    import pytest
    from jsonschema import ValidationError
    doc = {"schema_version": "1.0", "meta": {}, "summary": {}, "metrics": {}, "bogus": 1}
    with pytest.raises(ValidationError):
        Draft202012Validator(load_schema()).validate(doc)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd scripts && python -m pytest tests/schema_test.py -v`
Expected: 3 passed. (If `test_schema_is_itself_valid` fails, fix the schema JSON.)

- [ ] **Step 5: Commit**

```bash
git add scripts/schema/ensemble_contract.v1.json scripts/tests/schema_test.py scripts/requirements.txt
git commit -m "Add ensemble contract v1 JSON Schema"
```

---

### Task 2: Python contract transform

**Working dir:** `huskies-server`

**Files:**
- Create: `scripts/build_contract.py`
- Create: `scripts/tests/build_contract_test.py`

**Interfaces:**
- Consumes: the JSON Schema (Task 1) for validation in tests.
- Produces:
  - `transform_ensemble(ensemble_data: dict, generated: str | None = None) -> dict` — the contract.
  - Helpers: `slugify(name) -> str`, `percentile_of(value, samples) -> float`, `histogram_50(samples) -> {"bin_edges": list, "counts": list}`, `quantiles_5(samples) -> dict`.

- [ ] **Step 1: Write the failing test**

Create `scripts/tests/build_contract_test.py`:

```python
import json, os
from jsonschema import Draft202012Validator
from build_contract import transform_ensemble, percentile_of, histogram_50, quantiles_5, slugify

SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "..", "schema", "ensemble_contract.v1.json")

def sample_ensemble_data():
    return {
        "name": "GA",
        "ensemble_summary": {"num_plans": 4, "num_incumbents": 1,
                             "avg_incumbent_winners": 1.0, "avg_geo_var": 0.25, "avg_pop_var": 0.15},
        "winner_split": {"1/0": 4},
        "box_w_data": {},
        "incumbent_data": {"Austin Scott": {
            "area_variations": [0.10, 0.20, 0.30, 0.40],
            "vap_total_variations": [0.05, 0.15, 0.25, 0.35]}},
        "enacted_data": {"incumbent_data": {"Austin Scott": {
            "area_variation": 0.30, "vap_total_variation": 0.05}}},
    }

def test_slugify():
    assert slugify("Austin Scott") == "austin-scott"
    assert slugify("Nikema Williams") == "nikema-williams"

def test_percentile_is_fraction_leq_observed_and_clamped():
    assert percentile_of(0.30, [0.1, 0.2, 0.3, 0.4]) == 0.75   # 3 of 4 <= 0.30
    assert percentile_of(-1.0, [0.1, 0.2]) == 0.0
    assert percentile_of(9.9, [0.1, 0.2]) == 1.0

def test_histogram_has_51_edges_50_counts_summing_to_n():
    h = histogram_50([0.01, 0.99, 1.5, -0.5])   # out-of-range clipped into end bins
    assert len(h["bin_edges"]) == 51
    assert len(h["counts"]) == 50
    assert sum(h["counts"]) == 4

def test_quantiles_keys():
    q = quantiles_5([0.0, 0.25, 0.5, 0.75, 1.0])
    assert set(q.keys()) == {"0", "0.25", "0.5", "0.75", "1"}
    assert q["0.5"] == 0.5

def test_transform_produces_schema_valid_contract():
    contract = transform_ensemble(sample_ensemble_data(), generated="2024-01-01T00:00:00Z")
    with open(SCHEMA_PATH) as f:
        Draft202012Validator(json.load(f)).validate(contract)
    assert contract["meta"]["state"] == "GA"
    assert contract["meta"]["ensemble"]["size"] == 4
    inc = contract["metrics"]["by_incumbent"][0]
    assert inc["id"] == "austin-scott" and inc["name"] == "Austin Scott"
    geo = next(m for m in inc["metrics"] if m["id"] == "geographic_variation")
    assert geo["observed"] == 0.30
    assert geo["observed_percentile"] == 0.75
    assert geo["ensemble"]["n"] == 4

def test_transform_omits_metric_when_observed_missing():
    data = sample_ensemble_data()
    del data["enacted_data"]["incumbent_data"]["Austin Scott"]["vap_total_variation"]
    contract = transform_ensemble(data, generated="2024-01-01T00:00:00Z")
    ids = [m["id"] for m in contract["metrics"]["by_incumbent"][0]["metrics"]]
    assert ids == ["geographic_variation"]
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd scripts && python -m pytest tests/build_contract_test.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'build_contract'`.

- [ ] **Step 3: Implement `scripts/build_contract.py`**

```python
"""Pure transform: existing generated/<state>/ensemble_data.json -> ensemble contract v1.

No GerryChain, no DB. Input is the dict produced by ensemble_analysis.py.
"""
from datetime import datetime, timezone
import re
import numpy as np

SCHEMA_VERSION = "1.0"
HIST_BINS = 50
HIST_RANGE = (0.0, 1.0)

# metric id -> (ensemble-array key, observed key, label)
METRICS = [
    ("geographic_variation", "area_variations", "area_variation", "Geographic Variation"),
    ("population_variation", "vap_total_variations", "vap_total_variation", "Population Variation"),
]


def slugify(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def percentile_of(value, samples):
    arr = np.asarray(samples, dtype=float)
    if arr.size == 0:
        return 0.0
    pct = float((arr <= value).sum()) / arr.size
    return max(0.0, min(1.0, pct))


def histogram_50(samples):
    arr = np.clip(np.asarray(samples, dtype=float), HIST_RANGE[0], HIST_RANGE[1])
    counts, edges = np.histogram(arr, bins=HIST_BINS, range=HIST_RANGE)
    return {"bin_edges": [float(e) for e in edges], "counts": [int(c) for c in counts]}


def quantiles_5(samples):
    q = np.percentile(np.asarray(samples, dtype=float), [0, 25, 50, 75, 100])
    return {"0": float(q[0]), "0.25": float(q[1]), "0.5": float(q[2]),
            "0.75": float(q[3]), "1": float(q[4])}


def _metric(metric_id, label, observed, samples):
    return {
        "id": metric_id,
        "label": label,
        "unit": "fraction",
        "observed": float(observed),
        "observed_percentile": percentile_of(observed, samples),
        "ensemble": {
            "n": len(samples),
            "quantiles": quantiles_5(samples),
            "histogram": histogram_50(samples),
        },
    }


def transform_ensemble(ensemble_data, generated=None):
    if generated is None:
        generated = datetime.now(timezone.utc).isoformat()
    summary = ensemble_data["ensemble_summary"]
    incumbent_arrays = ensemble_data["incumbent_data"]
    enacted = ensemble_data.get("enacted_data", {}).get("incumbent_data", {})

    by_incumbent = []
    for name in sorted(incumbent_arrays.keys()):
        arrays = incumbent_arrays[name]
        observed_all = enacted.get(name, {})
        metrics = []
        for metric_id, arr_key, obs_key, label in METRICS:
            samples = arrays.get(arr_key)
            observed = observed_all.get(obs_key)
            if samples is None or observed is None:
                continue
            metrics.append(_metric(metric_id, label, observed, samples))
        if metrics:
            by_incumbent.append({"id": slugify(name), "name": name, "metrics": metrics})

    return {
        "schema_version": SCHEMA_VERSION,
        "meta": {
            "state": ensemble_data["name"],
            "plan": "enacted",
            "ensemble": {"size": summary["num_plans"], "method": "recom", "generated": generated},
        },
        "summary": {
            "num_plans": summary["num_plans"],
            "num_incumbents": summary["num_incumbents"],
            "avg_incumbent_winners": summary["avg_incumbent_winners"],
            "avg_geo_var": summary["avg_geo_var"],
            "avg_pop_var": summary["avg_pop_var"],
        },
        "metrics": {"by_incumbent": by_incumbent},
    }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd scripts && python -m pytest tests/build_contract_test.py -v`
Expected: all passed.

- [ ] **Step 5: Commit**

```bash
git add scripts/build_contract.py scripts/tests/build_contract_test.py
git commit -m "Add pure transform from ensemble_data to contract v1"
```

---

### Task 3: Pipeline emit CLI + Mongo ingestion

**Working dir:** `huskies-server`

**Files:**
- Modify: `scripts/build_contract.py` (add file/CLI wrapper)
- Modify: `scripts/mongo_engine.py` (`update_ensemble` keys on `meta.state`)
- Modify: `scripts/fill_database.py` (load the contract file; drop `states` on full re-ingest)
- Create: `scripts/tests/update_ensemble_test.py`

**Interfaces:**
- Consumes: `transform_ensemble` (Task 2).
- Produces: `build_contract.build_contract_file(state) -> str` (writes `generated/<state>/contract_<state>.json`, returns path); `MongoEngine.update_ensemble(contract)` upserts into `states` keyed by `meta.state`.

- [ ] **Step 1: Write the failing test for ingestion keying**

Create `scripts/tests/update_ensemble_test.py`:

```python
from mongo_engine import MongoEngine

class FakeCollection:
    def __init__(self): self.calls = []
    def update_one(self, query, update, upsert=False):
        self.calls.append({"query": query, "update": update, "upsert": upsert})

class FakeDB:
    def __init__(self): self.collections = {}
    def __getitem__(self, name):
        return self.collections.setdefault(name, FakeCollection())

def test_update_ensemble_keys_on_meta_state(monkeypatch):
    # MongoEngine is a singleton; build one and swap its db for a fake.
    engine = MongoEngine.__new__(MongoEngine)
    engine.db = FakeDB()
    contract = {"meta": {"state": "GA"}, "summary": {}, "metrics": {"by_incumbent": []}}
    engine.update_ensemble(contract)
    call = engine.db["states"].calls[0]
    assert call["query"] == {"meta.state": "GA"}
    assert call["upsert"] is True
    assert call["update"] == {"$set": contract}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd scripts && python -m pytest tests/update_ensemble_test.py -v`
Expected: FAIL — current `update_ensemble` reads `ensemble_data['name']` and queries `{'name': ...}`, so the assertions fail (KeyError or wrong query).

- [ ] **Step 3: Update `update_ensemble` in `scripts/mongo_engine.py`**

Replace the body of `update_ensemble` with:

```python
    def update_ensemble(self, contract : dict):
        """Upsert a contract document into the 'states' collection, keyed by meta.state."""
        collection = self.db['states']
        state = contract['meta']['state']
        collection.update_one({'meta.state': state}, {'$set': contract}, upsert=True)
```

- [ ] **Step 4: Add the file/CLI wrapper to `scripts/build_contract.py`**

Append:

```python
def build_contract_file(state):
    """Read generated/<state>/ensemble_data.json, transform, write contract_<state>.json."""
    import json
    from settings import HUSKIES_HOME
    with open(f"{HUSKIES_HOME}/generated/{state}/ensemble_data.json") as f:
        ensemble_data = json.load(f)
    contract = transform_ensemble(ensemble_data)
    dst = f"{HUSKIES_HOME}/generated/{state}/contract_{state}.json"
    with open(dst, "w") as f:
        json.dump(contract, f)
    return dst


if __name__ == "__main__":
    for _state in ("GA", "NY", "IL"):
        print(build_contract_file(_state))
```

- [ ] **Step 5: Update `scripts/fill_database.py` to load the contract and drop stale states**

Change `fill_ensemble_data` to read the contract file:

```python
def fill_ensemble_data(state, engine):
    contract_path = f'{HUSKIES_HOME}/generated/{state}/contract_{state}.json'
    with open(contract_path, 'r') as f:
        contract = json.load(f)
    engine.update_ensemble(contract)
```

And in `fill_database_all`, drop `states` too (the query key changed from `name` to `meta.state`, so old-shape docs would otherwise linger):

```python
def fill_database_all():
    MongoEngine('huskies', uri=DATABASE_URI).drop_collection('plans')
    MongoEngine('huskies', uri=DATABASE_URI).drop_collection('states')
    fill_database("GA")
    fill_database("NY")
    fill_database("IL")
```

- [ ] **Step 6: Run the ingestion test**

Run: `cd scripts && python -m pytest tests/update_ensemble_test.py -v`
Expected: PASS.

- [ ] **Step 7: Regenerate the contract files (requires existing generated artifacts)**

Run: `cd scripts && python build_contract.py`
Expected: prints `generated/GA/contract_GA.json`, `.../NY/...`, `.../IL/...`. (Requires `generated/<state>/ensemble_data.json` to exist — a build artifact of the analysis pipeline. If absent for a state, that state's contract can't be produced until the pipeline is run.)

- [ ] **Step 8: Commit**

```bash
git add scripts/build_contract.py scripts/mongo_engine.py scripts/fill_database.py scripts/tests/update_ensemble_test.py
git commit -m "Emit contract file and ingest into states keyed by meta.state"
```

Note: actually loading the documents into MongoDB is an operational step (`python fill_database.py`, needs `DATABASE_URI`), run when deploying — not part of the committed code.

---

### Task 4: Restructure `Ensemble.java` into typed POJOs + query by `meta.state`

**Working dir:** `huskies-server`

**Files:**
- Modify (rewrite): `server/src/main/java/com/huskies/server/state/Ensemble.java`
- Modify: `server/src/main/java/com/huskies/server/state/EnsembleService.java:18-22`
- Create: `server/src/test/java/com/huskies/server/state/EnsembleDeserializeTest.java`

**Interfaces:**
- Consumes: the contract JSON shape (Tasks 1–3).
- Produces: `Ensemble` POJO tree matching the contract; `EnsembleService.getSummary(state)` queries `meta.state`.

- [ ] **Step 1: Write the failing test**

Create `server/src/test/java/com/huskies/server/state/EnsembleDeserializeTest.java`:

```java
package com.huskies.server.state;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EnsembleDeserializeTest {

    private static final String CONTRACT = """
        {
          "schema_version": "1.0",
          "meta": { "state": "GA", "plan": "enacted",
                    "ensemble": { "size": 2, "method": "recom", "generated": "2024-01-01T00:00:00Z" } },
          "summary": { "num_plans": 2, "num_incumbents": 1, "avg_incumbent_winners": 1.0,
                       "avg_geo_var": 0.1, "avg_pop_var": 0.2 },
          "metrics": { "by_incumbent": [
            { "id": "jane-doe", "name": "Jane Doe", "metrics": [
              { "id": "geographic_variation", "label": "Geographic Variation", "unit": "fraction",
                "observed": 0.3, "observed_percentile": 0.75,
                "ensemble": { "n": 2,
                  "quantiles": { "0": 0.0, "0.25": 0.1, "0.5": 0.2, "0.75": 0.3, "1": 0.4 },
                  "histogram": { "bin_edges": [0.0, 0.5, 1.0], "counts": [1, 1] } } } ] } ] }
        }
        """;

    @Test
    void deserializesContractAndRoundTrips() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Ensemble e = mapper.readValue(CONTRACT, Ensemble.class);

        assertEquals("1.0", e.getSchemaVersion());
        assertEquals("GA", e.getMeta().getState());
        assertEquals(2, e.getMeta().getEnsemble().getSize());
        assertEquals(1, e.getSummary().getNumIncumbents());

        Ensemble.IncumbentMetrics inc = e.getMetrics().getByIncumbent().get(0);
        assertEquals("jane-doe", inc.getId());
        assertEquals("Jane Doe", inc.getName());
        Ensemble.Metric m = inc.getMetrics().get(0);
        assertEquals("geographic_variation", m.getId());
        assertEquals(0.3, m.getObserved());
        assertEquals(0.75, m.getObservedPercentile());
        assertEquals(2, m.getEnsemble().getHistogram().getCounts().size());

        // round-trips back to the same snake_case keys
        String out = mapper.writeValueAsString(e);
        assertTrue(out.contains("\"observed_percentile\":0.75"));
        assertTrue(out.contains("\"by_incumbent\""));
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd server && ./mvnw test -Dtest=EnsembleDeserializeTest` (or `./gradlew test --tests EnsembleDeserializeTest`)
Expected: FAIL/compile error — the current `Ensemble` has no `getSchemaVersion`/`getMeta`/nested types.

- [ ] **Step 3: Rewrite `Ensemble.java`**

Replace the whole file with:

```java
package com.huskies.server.state;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document("states")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Ensemble {

    @JsonProperty("schema_version")
    private String schemaVersion;
    private Meta meta;
    private Summary summary;
    private Metrics metrics;

    public String getSchemaVersion() { return schemaVersion; }
    public void setSchemaVersion(String schemaVersion) { this.schemaVersion = schemaVersion; }
    public Meta getMeta() { return meta; }
    public void setMeta(Meta meta) { this.meta = meta; }
    public Summary getSummary() { return summary; }
    public void setSummary(Summary summary) { this.summary = summary; }
    public Metrics getMetrics() { return metrics; }
    public void setMetrics(Metrics metrics) { this.metrics = metrics; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Meta {
        private String state;
        private String plan;
        private EnsembleMeta ensemble;
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getPlan() { return plan; }
        public void setPlan(String plan) { this.plan = plan; }
        public EnsembleMeta getEnsemble() { return ensemble; }
        public void setEnsemble(EnsembleMeta ensemble) { this.ensemble = ensemble; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EnsembleMeta {
        private int size;
        private String method;
        private String generated;
        public int getSize() { return size; }
        public void setSize(int size) { this.size = size; }
        public String getMethod() { return method; }
        public void setMethod(String method) { this.method = method; }
        public String getGenerated() { return generated; }
        public void setGenerated(String generated) { this.generated = generated; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Summary {
        @JsonProperty("num_plans") private int numPlans;
        @JsonProperty("num_incumbents") private int numIncumbents;
        @JsonProperty("avg_incumbent_winners") private double avgIncumbentWinners;
        @JsonProperty("avg_geo_var") private double avgGeoVar;
        @JsonProperty("avg_pop_var") private double avgPopVar;
        public int getNumPlans() { return numPlans; }
        public void setNumPlans(int v) { this.numPlans = v; }
        public int getNumIncumbents() { return numIncumbents; }
        public void setNumIncumbents(int v) { this.numIncumbents = v; }
        public double getAvgIncumbentWinners() { return avgIncumbentWinners; }
        public void setAvgIncumbentWinners(double v) { this.avgIncumbentWinners = v; }
        public double getAvgGeoVar() { return avgGeoVar; }
        public void setAvgGeoVar(double v) { this.avgGeoVar = v; }
        public double getAvgPopVar() { return avgPopVar; }
        public void setAvgPopVar(double v) { this.avgPopVar = v; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Metrics {
        @JsonProperty("by_incumbent") private List<IncumbentMetrics> byIncumbent;
        public List<IncumbentMetrics> getByIncumbent() { return byIncumbent; }
        public void setByIncumbent(List<IncumbentMetrics> v) { this.byIncumbent = v; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class IncumbentMetrics {
        private String id;
        private String name;
        private List<Metric> metrics;
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public List<Metric> getMetrics() { return metrics; }
        public void setMetrics(List<Metric> v) { this.metrics = v; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Metric {
        private String id;
        private String label;
        private String unit;
        private double observed;
        @JsonProperty("observed_percentile") private double observedPercentile;
        private Distribution ensemble;
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
        public double getObserved() { return observed; }
        public void setObserved(double v) { this.observed = v; }
        public double getObservedPercentile() { return observedPercentile; }
        public void setObservedPercentile(double v) { this.observedPercentile = v; }
        public Distribution getEnsemble() { return ensemble; }
        public void setEnsemble(Distribution v) { this.ensemble = v; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Distribution {
        private int n;
        private Map<String, Double> quantiles;
        private Histogram histogram;
        public int getN() { return n; }
        public void setN(int n) { this.n = n; }
        public Map<String, Double> getQuantiles() { return quantiles; }
        public void setQuantiles(Map<String, Double> v) { this.quantiles = v; }
        public Histogram getHistogram() { return histogram; }
        public void setHistogram(Histogram v) { this.histogram = v; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Histogram {
        @JsonProperty("bin_edges") private List<Double> binEdges;
        private List<Integer> counts;
        public List<Double> getBinEdges() { return binEdges; }
        public void setBinEdges(List<Double> v) { this.binEdges = v; }
        public List<Integer> getCounts() { return counts; }
        public void setCounts(List<Integer> v) { this.counts = v; }
    }
}
```

- [ ] **Step 4: Update the query in `EnsembleService.java`**

Replace the `getSummary` query line:

```java
        Query query = new Query(Criteria.where("name").is(planName));
```

with:

```java
        Query query = new Query(Criteria.where("meta.state").is(planName));
```

(Method signature and caching unchanged; the `@RequestParam String state` still flows in as `planName`.)

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd server && ./mvnw test -Dtest=EnsembleDeserializeTest`
Expected: PASS. Also run the full server test suite to catch fallout: `./mvnw test` → green.

- [ ] **Step 6: Commit**

```bash
git add server/src/main/java/com/huskies/server/state/Ensemble.java server/src/main/java/com/huskies/server/state/EnsembleService.java server/src/test/java/com/huskies/server/state/EnsembleDeserializeTest.java
git commit -m "Restructure Ensemble into typed contract POJOs; query by meta.state"
```

---

### Task 5: Client — readiness check + summary table

**Working dir:** `huskies-client`

**Files:**
- Modify: `src/common/Store.jsx` (`isEnsemblejsonReady`)
- Modify: `src/TabPanels/analyzePanel/SummaryEnsembleTable.jsx`
- Test: `src/TabPanels/analyzePanel/SummaryEnsembleTable.test.jsx`

**Interfaces:**
- Consumes: the contract (`ensemble.schema_version`, `ensemble.summary`).
- Produces: `dataStore.isEnsemblejsonReady()` true when a contract is loaded; `SummaryEnsembleTable` renders `ensemble.summary`.

- [ ] **Step 1: Update `isEnsemblejsonReady` in `src/common/Store.jsx`**

Replace:

```js
        if(!(dataStore.ensemble['name'])) return false;
```

with:

```js
        if(!(dataStore.ensemble && dataStore.ensemble.schema_version)) return false;
```

- [ ] **Step 2: Write the failing test**

Create `src/TabPanels/analyzePanel/SummaryEnsembleTable.test.jsx`:

```jsx
import { render, screen } from "@testing-library/react";
import StoreContext from "../../common/Store";
import SummaryEnsembleTable from "./SummaryEnsembleTable";

function renderWith(summary) {
  const dataStore = {
    isEnsemblejsonReady: () => true,
    getEnsembleData: () => ({ schema_version: "1.0", summary }),
  };
  return render(
    <StoreContext.Provider value={{ dataStore }}>
      <SummaryEnsembleTable />
    </StoreContext.Provider>
  );
}

test("renders the summary row from ensemble.summary", () => {
  renderWith({ num_plans: 4000, num_incumbents: 14, avg_incumbent_winners: 11.9,
               avg_geo_var: 0.11, avg_pop_var: 0.09 });
  expect(screen.getByText("4000")).toBeInTheDocument();
  expect(screen.getByText("14")).toBeInTheDocument();
  expect(screen.getByText("12")).toBeInTheDocument();       // Math.round(11.9)
  expect(screen.getByText("11%")).toBeInTheDocument();      // 0.11 as percent
  expect(screen.getByText("9%")).toBeInTheDocument();       // 0.09 as percent
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test src/TabPanels/analyzePanel/SummaryEnsembleTable.test.jsx`
Expected: FAIL — component still reads `getEnsembleData().ensemble_summary` (undefined here).

- [ ] **Step 4: Update `SummaryEnsembleTable.jsx`**

Change the data source line from:

```js
  const data = dataStore.getEnsembleData().ensemble_summary;
```

to:

```js
  const data = dataStore.getEnsembleData().summary;
```

(The rest — the `num_plans` / `num_incumbents` / `Math.round(avg_incumbent_winners)` / `avg_geo_var`/`avg_pop_var` percent formatting — is unchanged; field names match the contract's `summary`.)

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test src/TabPanels/analyzePanel/SummaryEnsembleTable.test.jsx`
Expected: PASS. Then `pnpm test` → full suite green.

- [ ] **Step 6: Commit**

```bash
git add src/common/Store.jsx src/TabPanels/analyzePanel/SummaryEnsembleTable.jsx src/TabPanels/analyzePanel/SummaryEnsembleTable.test.jsx
git commit -m "Client reads contract summary + schema_version readiness"
```

---

### Task 6: Client — incumbent lookup + district-item guard

**Working dir:** `huskies-client`

**Files:**
- Create: `src/common/ensembleContract.js` (pure lookup helper)
- Test: `src/common/ensembleContract.test.js`
- Modify: `src/TabPanels/mapPanel/DistrictSummaryTable.jsx`
- Modify: `src/TabPanels/mapPanel/DistrictSummaryItem.jsx`

**Interfaces:**
- Consumes: the contract (`ensemble.metrics.by_incumbent`).
- Produces: `indexIncumbentsByName(ensemble) -> { [name]: bundle }` where `bundle = { id, name, metrics }`. `DistrictSummaryItem` receives an `incumbentBundle` prop.

- [ ] **Step 1: Write the failing test**

Create `src/common/ensembleContract.test.js`:

```js
import { indexIncumbentsByName } from "./ensembleContract";

test("indexes by_incumbent by display name", () => {
  const ensemble = { metrics: { by_incumbent: [
    { id: "austin-scott", name: "Austin Scott", metrics: [{ id: "geographic_variation" }] },
    { id: "jane-doe", name: "Jane Doe", metrics: [] },
  ] } };
  const byName = indexIncumbentsByName(ensemble);
  expect(byName["Austin Scott"].id).toBe("austin-scott");
  expect(byName["Jane Doe"].metrics).toEqual([]);
});

test("returns an empty map when metrics are absent", () => {
  expect(indexIncumbentsByName({})).toEqual({});
  expect(indexIncumbentsByName(null)).toEqual({});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/common/ensembleContract.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/common/ensembleContract.js`**

```js
// Helpers for reading the ensemble analysis contract (v1).

export function indexIncumbentsByName(ensemble) {
  const list = ensemble?.metrics?.by_incumbent;
  if (!Array.isArray(list)) return {};
  const byName = {};
  for (const bundle of list) byName[bundle.name] = bundle;
  return byName;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/common/ensembleContract.test.js`
Expected: PASS.

- [ ] **Step 5: Wire the lookup into `DistrictSummaryTable.jsx`**

At the top of `getDistrictSummaryInfo` (where `ensembleData` is fetched), replace the enacted/incumbent extraction and the `DistrictSummaryItem` props. Change:

```js
        let ensembleData = dataStore.getEnsembleData();
```

to:

```js
        let ensembleData = dataStore.getEnsembleData();
        let incumbentsByName = indexIncumbentsByName(ensembleData);
```

and change the `DistrictSummaryItem` element from:

```jsx
            districtSummaryInfo.push(<DistrictSummaryItem key={id} electionData={stateModelData.electionDataDict[id]} enactedData={ensembleData.enacted_data} incumbentData={ensembleData.incumbent_data}/>);
```

to:

```jsx
            districtSummaryInfo.push(<DistrictSummaryItem key={id} electionData={stateModelData.electionDataDict[id]} incumbentBundle={incumbentsByName[stateModelData.electionDataDict[id].incumbent]}/>);
```

Add the import at the top of the file:

```js
import { indexIncumbentsByName } from "../../common/ensembleContract";
```

- [ ] **Step 6: Update the guard + render in `DistrictSummaryItem.jsx`**

Replace the `enactedData`/`incumbentData` reads and `canShowIncumbentVariation` with a bundle-based guard. Change:

```js
    let enactedData = props.enactedData;
    let incumbentData = props.incumbentData;
```
```js
    const canShowIncumbentVariation = data.hasIncumbent
        && (mapStore.getMapPlan() === 'enacted')
        && !!enactedData?.incumbent_data?.[data.incumbent]
        && !!incumbentData?.[data.incumbent];
```

to:

```js
    let incumbentBundle = props.incumbentBundle;
```
```js
    const canShowIncumbentVariation = data.hasIncumbent
        && (mapStore.getMapPlan() === 'enacted')
        && !!incumbentBundle
        && Array.isArray(incumbentBundle.metrics)
        && incumbentBundle.metrics.length > 0;
```

Then replace the two chart cells:

```jsx
                                {canShowIncumbentVariation && <IncumbentVariation incumbent={data.incumbent} enactedData={enactedData.incumbent_data} incumbentData={incumbentData} type={'area_variations'}/> }
                                {canShowIncumbentVariation && <IncumbentVariation incumbent={data.incumbent} enactedData={enactedData.incumbent_data} incumbentData={incumbentData} type={'vap_variations'}/> }
```

with:

```jsx
                                {canShowIncumbentVariation && incumbentBundle.metrics.map((metric) => (
                                    <IncumbentVariation key={metric.id} metric={metric} />
                                ))}
```

(Leave all other markup/data logic in the file unchanged.)

- [ ] **Step 7: Run tests**

Run: `pnpm test src/common/ensembleContract.test.js`
Expected: PASS.
Run: `pnpm build`
Expected: succeeds (note: `IncumbentVariation`'s new `metric` prop is delivered in Task 7; after this task the app builds and the guard is false-safe — charts simply don't render until Task 7 lands. This is the expected intermediate state since `/api/summary` is replaced together.)

- [ ] **Step 8: Commit**

```bash
git add src/common/ensembleContract.js src/common/ensembleContract.test.js src/TabPanels/mapPanel/DistrictSummaryTable.jsx src/TabPanels/mapPanel/DistrictSummaryItem.jsx
git commit -m "Client looks up incumbent metric bundle by name"
```

---

### Task 7: Client — rewrite `IncumbentVariation` to render the contract histogram

**Working dir:** `huskies-client`

**Files:**
- Modify (rewrite): `src/TabPanels/analyzePanel/IncumbentVariation.jsx`
- Test: `src/TabPanels/analyzePanel/IncumbentVariation.test.jsx`

**Interfaces:**
- Consumes: a `metric` object `{ label, observed, observed_percentile, unit, ensemble: { histogram: { bin_edges, counts } } }` (from Task 6 / the contract).
- Produces: `buildBarModel(metric) -> { categories: string[], counts: number[], highlightIndex: number }` and a thin chart component. `DistrictSummaryItem` (Task 6) renders `<IncumbentVariation metric={metric} />`.

- [ ] **Step 1: Write the failing test**

Create `src/TabPanels/analyzePanel/IncumbentVariation.test.jsx`:

```jsx
import { buildBarModel } from "./IncumbentVariation";

const metric = {
  label: "Geographic Variation",
  observed: 0.33,
  observed_percentile: 0.5,
  unit: "fraction",
  ensemble: { histogram: {
    bin_edges: [0.0, 0.2, 0.4, 0.6, 0.8, 1.0],   // 5 bins
    counts:    [1,   2,   3,   4,   5],
  } },
};

test("categories are per-bin percent ranges", () => {
  const m = buildBarModel(metric);
  expect(m.categories).toEqual(["0-20%", "20-40%", "40-60%", "60-80%", "80-100%"]);
  expect(m.counts).toEqual([1, 2, 3, 4, 5]);
});

test("highlightIndex is the bin containing observed", () => {
  expect(buildBarModel(metric).highlightIndex).toBe(1);          // 0.33 in [0.2,0.4)
});

test("observed at the top edge clamps to the last bin", () => {
  const top = { ...metric, observed: 1.0 };
  expect(buildBarModel(top).highlightIndex).toBe(4);
});

test("observed below range clamps to the first bin", () => {
  const low = { ...metric, observed: -5 };
  expect(buildBarModel(low).highlightIndex).toBe(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/TabPanels/analyzePanel/IncumbentVariation.test.jsx`
Expected: FAIL — `buildBarModel` is not exported.

- [ ] **Step 3: Rewrite `IncumbentVariation.jsx`**

Replace the whole file with:

```jsx
import Chart from "react-apexcharts";

const OBSERVED_COLOR = "#fc0345";
const ENSEMBLE_COLOR = "#185a87";

// Pure: derive the bar-chart model from a contract metric's histogram.
export function buildBarModel(metric) {
  const { bin_edges: edges, counts } = metric.ensemble.histogram;
  const pct = (x) => Math.round(x * 100);
  const categories = counts.map((_, i) => `${pct(edges[i])}-${pct(edges[i + 1])}%`);

  // bin containing `observed`: last edge whose left bound <= observed, clamped.
  let highlightIndex = 0;
  for (let i = 0; i < counts.length; i++) {
    if (metric.observed >= edges[i]) highlightIndex = i;
  }
  if (metric.observed < edges[0]) highlightIndex = 0;
  if (metric.observed >= edges[edges.length - 1]) highlightIndex = counts.length - 1;

  return { categories, counts, highlightIndex };
}

export default function IncumbentVariation({ metric }) {
  const { categories, counts, highlightIndex } = buildBarModel(metric);
  const data = counts.map((y, i) => ({
    x: categories[i],
    y,
    fillColor: i === highlightIndex ? OBSERVED_COLOR : ENSEMBLE_COLOR,
  }));

  const options = {
    chart: { type: "bar", height: 350, width: 400, toolbar: { show: false } },
    grid: { show: false },
    plotOptions: { bar: { columnWidth: "60%" } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 1, colors: ["#fff"] },
    tooltip: { shared: false, intersect: true },
    title: { text: metric.label, align: "center" },
    xaxis: { title: { text: "Change range (%)" }, labels: { rotate: -60 } },
    yaxis: { title: { text: "# plans" } },
  };

  return (
    <Chart options={options} series={[{ name: "Plans", data }]} type="bar" height={350} width={400} />
  );
}
```

All the old client-side statistics (`calculateDifferences`, `buildData`, `calculatePercentVariation`, the hardcoded 1-2…99-100 label map, the class component) are deleted — the pipeline computes the bins now.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/TabPanels/analyzePanel/IncumbentVariation.test.jsx`
Expected: PASS.

- [ ] **Step 5: Run the full suite + build**

Run: `pnpm test` → green. `pnpm build` → succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/TabPanels/analyzePanel/IncumbentVariation.jsx src/TabPanels/analyzePanel/IncumbentVariation.test.jsx
git commit -m "Render incumbent variation from contract histogram; drop client-side binning"
```

---

## End-to-End Verification (after all tasks + a data load)

Not a code task — the operational checkout:
1. In `huskies-server`: `cd scripts && python build_contract.py` then `python fill_database.py` (needs `DATABASE_URI`, and existing `generated/<state>/ensemble_data.json`). This drops+reloads `states` in the new shape.
2. Start the server; `curl 'http://localhost:8090/api/summary?state=GA'` returns the contract shape (`schema_version`, `meta`, `summary`, `metrics.by_incumbent`).
3. In `huskies-client`: `pnpm dev`, select Georgia + 2022 enacted, focus an incumbent district → the summary table populates and the incumbent-variation bar charts render with the bin containing the enacted value highlighted red.
4. `pnpm test` (client) and `./mvnw test` (server) green.

## Self-Review Notes

- **Spec coverage:** contract schema (T1); pipeline transform incl. percentile/histogram/quantiles (T2); emit + ingestion keyed on `meta.state`, drop stale `states` (T3); typed POJOs + `meta.state` query, `/api/summary` replaced in place (T4); client readiness + summary (T5); incumbent lookup by name + guard (T6); `IncumbentVariation` histogram render + client-binning deletion (T7). Error cases (missing observed → metric omitted, out-of-range clamping, counts-sum invariant, missing bundle → no charts) covered by T2 and T6/T7 tests.
- **Deviations from spec (noted in the spec file):** v1 drops `district`/`party` from `by_incumbent` (client matches by name; not needed); `winner_split`/`box_w_data` dropped (unused by client). These keep the emitter a pure transform of the existing `ensemble_data.json` (no GerryChain rerun).
- **Type/name consistency:** contract keys are identical across schema (T1), Python emitter (T2), Java `@JsonProperty` (T4), and client reads (T5–T7): `schema_version`, `meta.state`, `summary.*`, `metrics.by_incumbent[].{id,name,metrics[]}`, `metric.{id,label,unit,observed,observed_percentile,ensemble{n,quantiles,histogram{bin_edges,counts}}}`. Metric ids `geographic_variation`/`population_variation` are consistent. `indexIncumbentsByName` (T6) matches `IncumbentVariation`'s `metric` prop (T7).
- **Ordering risk:** because `/api/summary` is replaced in place, the app is only end-to-end working once T4 (server), the data load, and T5–T7 (client) are all in. T6 leaves the client build green with charts simply not rendering until T7 — an acceptable intermediate.
