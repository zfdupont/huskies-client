---
name: add-store-action
description: Add new shared state or an action to the central React Context store. Use when a component needs new global state or a new mutation.
triggers:
  - "add state"
  - "store action"
  - "new action"
  - "global state"
  - "mapStore"
edges:
  - target: context/conventions.md
    condition: for the store/reducer conventions this pattern enforces
  - target: context/architecture.md
    condition: to understand how the store feeds the map and tables
grounds_to: []
last_updated: 2026-09-17
---

# Add a Store Action

## Context

All shared state lives in `src/common/Store.jsx` as three objects (`mapStore`,
`dataStore`, `pageStore`) plus `callbacks` and `loading`. Enums and action-type
constants live in `src/common/GlobalVariables.js`. Components read state via
`useContext(StoreContext)`.

## Steps

1. Add the action-type constant to the relevant enum in `GlobalVariables.js`
   (e.g. `MapActionType.MY_ACTION = "myAction"`).
2. Handle it in the matching reducer in `Store.jsx` (`mapStoreReducer` /
   `dataStoreReducer` / `pageStoreReducer`) with a `case` that returns
   `setX((prev) => ({ ...prev, ... }))`.
3. If state was added, initialize it in that store's `useState({...})` default.
4. Expose a method on the store object (e.g. `mapStore.myAction = (arg) => mapStoreReducer({ type, payload })`).
5. If the value must be read in the JSX layer, make sure it's included in the
   `StoreContext.Provider value={{...}}` at the bottom of the provider.
6. Consume it from a component via `useContext(StoreContext)`.

## Gotchas

- Methods are attached imperatively to the `useState` objects inside the provider
  body — don't try to define them outside it.
- Data fetches belong in `dataStore.addStateData`, which wraps the work in
  `try/finally` so `loading` always clears; keep that guarantee.
- Enum string VALUES are the tokens the backend expects — don't change them casually.
- `dataStore` caches by `[planType][stateType]`; check `isStateDataReady` before refetching.

## Verify

- [ ] Action type added in `GlobalVariables.js`, handled in the correct reducer.
- [ ] New state has a default in `useState`.
- [ ] Value exposed in the Provider `value` if the UI reads it.
- [ ] `pnpm build` passes.

## Debug

- State not updating in UI: confirm the value is in the Provider `value` object and the
  component reads it from context (not a stale closure).
- Reducer no-op: verify the `case` string matches the dispatched `type` exactly.

## Update Scaffold
- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
- [ ] Update any `.mex/context/` files that are now out of date
- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
