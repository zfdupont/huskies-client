# Dark Analytics Reskin — Phase 1 Design

Date: 2026-09-23
Status: Approved for planning
Scope: Presentation layer only. No changes to data flow, store, models, or map logic.

## Goal

Overhaul the site's aesthetics into a **modern dark analytics** look and **remove
Material UI** (and its Emotion styling engine) from the client. Styling moves to
**Tailwind CSS v4**. A **light/dark toggle** is retained. The current layout and all
interactions are preserved in this phase; layout/UX rework is explicitly deferred to a
later phase.

Approach chosen: a small **owned UI-primitives kit** under `src/ui/` styled with
Tailwind, replacing the styling *and behavior* MUI provided (collapse, drawer, switch,
tables). Icons are **inline SVG components** (no icon dependency). Accent colors: **teal
primary, violet secondary**.

## Non-Goals

- No layout or information-architecture changes (deferred to Phase 2).
- No changes to `Store.jsx`, reducers, `StateModel`, `api.js`, `MapController`,
  `GlobalVariables` logic, or the data-fetch/caching flow.
- No changes to Leaflet map rendering or ApexCharts usage.
- No accessibility component library (behaviors are hand-rolled).

## Theme System & Tokens

Replace MUI's `createTheme` / `ThemeProvider` / `CssBaseline` with **semantic CSS custom
properties that flip on `<html data-theme="light|dark">`**, exposed to Tailwind as color
utilities. Both themes define the same token names, so the toggle only swaps
`data-theme` and components use tokens like `bg-surface` / `text-muted` without needing
`dark:` prefixes.

Semantic tokens (dark = default target look; light is the mirror):

| Token | dark | light | Role |
|-------|------|-------|------|
| `--bg` | `#0f1115` | `#f7f8fa` | app background |
| `--surface` | `#171a21` | `#ffffff` | panels, drawer, tables |
| `--elevated` | `#1e222b` | `#ffffff` | cards, popovers, sheet |
| `--border` | `#2a2f3a` | `#e3e6ea` | dividers, table lines |
| `--fg` | `#e6e8ec` | `#1a1d23` | primary text |
| `--muted` | `#9aa3b2` | `#5b6472` | secondary text, subtitles |
| `--accent` | `#2dd4bf` | `#0d9488` | primary accent (teal) |
| `--accent-2` | `#8b5cf6` | `#7c3aed` | secondary accent (violet) |

Party colors (Democrat blue / Republican red) continue to come from `colorDict` in
`GlobalVariables.js` so the map, heatmap, and tables stay consistent. Those are not part
of the theme swap.

### Tailwind wiring

- Define the tokens under `:root` (light) and `[data-theme="dark"]` in a global CSS
  entry (e.g. `src/index.css`), then map them into Tailwind's theme with `@theme`
  referencing the `var(...)` values, producing utilities such as `bg-surface`,
  `text-fg`, `text-muted`, `border-border`, `bg-accent`, `text-accent-2`.
- Because the tokens themselves flip via `data-theme`, most components will not use the
  `dark:` variant at all.

### Toggle behavior

- `App.jsx` keeps the `localStorage['colorMode']` value (`'light' | 'dark'`) but, instead
  of building an MUI theme, writes `document.documentElement.dataset.theme` and toggles
  it. On first visit (no stored value) the theme falls back to `'light'`, preserving the
  current default; users reach dark via the toggle, and their choice persists.
- A tiny inline script in `index.html` reads `localStorage['colorMode']` and sets
  `data-theme` **before first paint** to avoid a flash of the wrong theme.

## UI Primitives (`src/ui/`)

Small, single-purpose components, Tailwind-styled, each replacing an MUI role. Each is
independently understandable and testable and communicates via plain props.

| File | Replaces | Notes |
|------|----------|-------|
| `Button.jsx` | `Button` | `size` (`sm`/`md`), variant (`text`/`solid`); used by resets |
| `IconButton.jsx` | `IconButton`, `Fab` | round/elevated variant covers the mobile FAB |
| `Panel.jsx` | `Paper` | surface container with border + subtle shadow |
| `Toggle.jsx` | `Switch` | controlled `checked` + `onChange`; `size="sm"` |
| `Checkbox.jsx` | `Checkbox` | only the disabled incumbent indicator; can be a plain check glyph |
| `Collapse.jsx` | `Collapse` | height animation via CSS `grid-template-rows` 0fr↔1fr |
| `NavSection.jsx` | list header pattern | shared collapsible section: star icon + title + chevron + `Collapse` body |
| `Drawer.jsx` | `Drawer` (side) | `variant="docked" | "overlay"`; overlay renders a scrim on mobile |
| `BottomSheet.jsx` | `Drawer` (anchor=bottom) | mobile data sheet with scrim + max-height scroll |
| `Table.jsx` (+ `Th`, `Td`, `Tr`) | `Table` family | compact bordered table primitives |
| `icons.jsx` | `@mui/icons-material` | inline SVGs: `Star`, `ChevronDown`, `ChevronUp`, `Sun`, `Moon`, `BarChart` |

Interfaces are intentionally minimal (props in, DOM out). No component reads the store —
data stays in the existing feature components.

## Component Migration Map

Presentation-only edits. Behavior (state selection, plan filters, incumbent filter,
highlight-scroll, mobile sheet open/close, drawer open default by breakpoint) is
preserved exactly.

| File | Change |
|------|--------|
| `App.jsx` | Remove `ThemeProvider`/`createTheme`/`CssBaseline`/MUI icons. Theme via `data-theme` + `localStorage`. Toggle uses `ui/IconButton` + `Sun`/`Moon`. |
| `common/HomePage.jsx` | `Box` → `div` + Tailwind classes; keep the absolute/relative structure and `64px` top offset. |
| `common/MainDrawer.jsx` | MUI `Drawer`/`Toolbar`/`Divider`/`Box` → `ui/Drawer` (docked on desktop, overlay on mobile). Keep `.navbar` + `.logo` + logo-tap toggle. Add `data-testid="controls-drawer"` and `data-variant` for tests. |
| `common/DrawerLists.jsx` | No structural change (composes children); minor class cleanup only. |
| `common/StateList.jsx` | Rewrite on `NavSection` + `ui` list rows; drop absolute-positioned title/chevron hacks. |
| `common/PlanList.jsx` | Same; keep `useEffect` default-plan selection and collapsed-title behavior. |
| `common/MultiPlanList.jsx` | Same; keep reset-callback registration and per-plan filter toggling. |
| `common/MapFilterList.jsx` | Rewrite rows using `NavSection` + `Toggle`; keep the mutually-exclusive filter logic unchanged. |
| `TabPanels/mapPanel/ResetButtonGroup.jsx` | `Stack`/`Button` → flex column + `ui/Button`. |
| `TabPanels/mapPanel/MapPanel.jsx` | `Paper`→`Panel`; mobile `Fab`+`BarChartIcon`→`ui/IconButton`+`BarChart`; bottom `Drawer`→`ui/BottomSheet`. Keep desktop/mobile branches and `#map-container` id. |
| `TabPanels/mapPanel/StateInfoTable.jsx` | MUI table family → `ui/Table`. |
| `TabPanels/analyzePanel/SummaryEnsembleTable.jsx` | MUI table family → `ui/Table`. |
| `TabPanels/mapPanel/DistrictSummaryTable.jsx` | `Switch` → `ui/Toggle`; keep highlight-scroll `useEffect` and incumbent filter. |
| `TabPanels/mapPanel/DistrictSummaryItem.jsx` | `Checkbox` → `ui/Checkbox`; comparison `Table` → `ui/Table`; keep inline flex layout and party-color bars. |

`IncumbentVariation.jsx` (ApexCharts) is untouched except possibly passing theme-aware
colors later; not required for Phase 1.

## Dependencies

- **Remove:** `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`.
- **Add (dev):** `tailwindcss` (v4) and `@tailwindcss/vite`.
- **Untouched:** `leaflet`, `react-leaflet`, `apexcharts`, `react-apexcharts`, `ldrs`,
  `axios`, `prop-types`.
- `vite.config.mjs`: add the `@tailwindcss/vite` plugin to the existing `plugins` array,
  leaving the custom CRA-compat plugins (env handling, `build/` outDir, `%ENV%` HTML
  substitution, `~` prefix, svgr) intact. This is a careful, additive edit.
- Global CSS: import Tailwind (`@import "tailwindcss";`) and declare the token layers in
  `src/index.css`. Remove dead CRA leftovers in `App.css` (`.App`, `.App-logo`, etc.) as
  a targeted cleanup; keep `.map-side-item` and `.logo:hover`.

## Error Handling / Edge Cases

- **Theme flash:** prevented by the pre-paint inline script in `index.html`.
- **Missing stored theme:** falls back to `'light'`.
- **Mobile drawer z-index:** the overlay drawer must sit above the fixed `.navbar`
  (`zIndex 10000`); `ui/Drawer` overlay uses a higher stacking context, matching current
  behavior.
- **Leaflet CSS:** unchanged; still loaded via `index.html` link + `leaflet/dist/leaflet.css`.

## Testing & Verification

Existing tests:
- **Vitest units** (`StateModel.test.js`, `ConversionHelper.test.js`,
  `CalculationHelper.test.js`) do not render MUI → expected to stay green. Run
  `pnpm test`.
- **Playwright e2e** (`e2e/responsive.spec.js`) asserts on `.MuiDrawer-docked`
  (count 1 desktop / 0 mobile). These selectors disappear with MUI. Update the specs to
  assert on the new stable hooks: `page.locator('[data-testid="controls-drawer"][data-variant="docked"]')`
  for desktop and its absence on mobile. `e2e/smoke.spec.js` relies on `.navbar`,
  `.logo`, and `#map-container`, all of which are preserved — no change needed there.
  `getByText("New York")` continues to work (nav text preserved).

Manual verification checklist:
- Light/dark toggle flips theme, persists across reload, and shows no flash on load.
- Desktop: drawer docked, controls visible, map shares the row (map width < 80% viewport).
- Mobile: drawer hidden, map fills viewport (> 90%), logo tap opens overlay drawer.
- All four nav sections expand/collapse.
- Map filter toggles (incumbent, victory margin, population) drive the map; mutual
  exclusivity preserved.
- Selecting a district scrolls the district summary item into view.
- Mobile bottom sheet opens via the FAB and scrolls.

Completion gates:
- `pnpm build` completes with no errors.
- `grep -r "@mui" src` returns nothing; `@mui/*` and `@emotion/*` absent from
  `package.json`.
- `pnpm test` green; Playwright specs updated and passing.

## Rollout / Sequencing (for the implementation plan)

1. Add Tailwind (deps, Vite plugin, `index.css` tokens, `index.html` pre-paint script).
2. Build `src/ui/` primitives + `icons.jsx`.
3. Migrate `App.jsx` theme + toggle.
4. Migrate shell: `HomePage`, `MainDrawer` (+ test hooks).
5. Migrate the four nav lists onto `NavSection`.
6. Migrate `MapPanel`, tables, `DistrictSummaryTable`, `DistrictSummaryItem`,
   `ResetButtonGroup`.
7. Remove MUI/Emotion deps; clean dead CSS.
8. Update Playwright selectors; run `pnpm test`, `pnpm test:e2e`, `pnpm build`; manual
   pass.
