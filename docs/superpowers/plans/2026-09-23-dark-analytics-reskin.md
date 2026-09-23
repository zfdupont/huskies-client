# Dark Analytics Reskin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Material UI + Emotion from the client, restyle it into a modern dark analytics look with Tailwind CSS v4, and keep a working light/dark toggle — without changing layout, data flow, or map logic.

**Architecture:** Introduce Tailwind v4 with semantic CSS custom-property tokens that flip on `<html data-theme>`. Build a small owned UI-primitives kit under `src/ui/` (styled with Tailwind, behavior hand-rolled) that replaces the MUI components in use, then migrate the 13 feature files onto those primitives. Presentation only — `Store`, reducers, `StateModel`, `api`, `MapController`, and `GlobalVariables` logic are untouched.

**Tech Stack:** React 18, Vite 5, Tailwind CSS v4 (`@tailwindcss/vite`), Vitest + Testing Library, Playwright. Leaflet + ApexCharts unchanged.

**Spec:** `docs/superpowers/specs/2026-09-23-dark-analytics-reskin-design.md`

## Global Constraints

- No changes to `src/common/Store.jsx`, the reducers, `src/models/StateModel.js`, `src/common/api.js`, `src/TabPanels/mapPanel/MapController.jsx`, or the logic/enums in `src/common/GlobalVariables.js`. Party colors continue to come from `colorDict` in `GlobalVariables.js`.
- No new runtime dependencies. Only `tailwindcss` + `@tailwindcss/vite` are added, both dev. Icons are inline SVG (no icon library).
- Remove `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` by the end.
- Accent colors: teal primary (`--accent`), violet secondary (`--accent-2`).
- Theme swaps via `document.documentElement.dataset.theme` (`'light' | 'dark'`), persisted in `localStorage['colorMode']`, default `'light'` on first visit.
- Preserve the top navbar (`.navbar`), logo (`.logo`), and Leaflet map container id (`#map-container`).
- Package manager is `pnpm`. Build tool is Vite; output dir stays `build/`. Do not remove the existing custom Vite plugins.
- Component tests live at `src/**/*.test.{js,jsx}`; `css: false` in Vitest means assert on attributes/roles/text, not computed styles.
- No co-author / "Generated with" trailers in commit messages.

---

### Task 1: Add Tailwind v4 + theme tokens + pre-paint script

**Files:**
- Modify: `package.json` (devDependencies)
- Modify: `vite.config.mjs:9-18` (plugins array)
- Modify: `src/index.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind utilities backed by semantic tokens — `bg-bg`, `bg-surface`, `bg-elevated`, `text-fg`, `text-muted`, `border-border`, `bg-accent`, `text-accent`, `bg-accent-2`, `text-accent-2` — that flip on `<html data-theme="dark">`. Pre-paint theme applied before React mounts.

- [ ] **Step 1: Install Tailwind**

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 2: Register the Vite plugin**

In `vite.config.mjs`, add the import near the other imports (top of file, after line 3) and add the plugin to the `plugins` array (currently `[react(), ..., svgrPlugin()]` around lines 9-18). Do not remove any existing plugin.

```js
import tailwindcss from "@tailwindcss/vite";
```

```js
        plugins: [
            react(),
            tailwindcss(),
            // ...existing plugins unchanged...
            svgrPlugin(),
```

- [ ] **Step 3: Define tokens and Tailwind import in `src/index.css`**

Prepend to `src/index.css` (keep the existing `body`, `.leaflet-container`, scrollbar, and layout rules that follow):

```css
@import "tailwindcss";

/* Map semantic tokens to Tailwind color utilities. `inline` keeps the
   var() reference in generated utilities so runtime data-theme swaps cascade. */
@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-elevated: var(--elevated);
  --color-border: var(--border);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-accent-2: var(--accent-2);
}

:root {
  --bg: #f7f8fa;
  --surface: #ffffff;
  --elevated: #ffffff;
  --border: #e3e6ea;
  --fg: #1a1d23;
  --muted: #5b6472;
  --accent: #0d9488;
  --accent-2: #7c3aed;
}

[data-theme="dark"] {
  --bg: #0f1115;
  --surface: #171a21;
  --elevated: #1e222b;
  --border: #2a2f3a;
  --fg: #e6e8ec;
  --muted: #9aa3b2;
  --accent: #2dd4bf;
  --accent-2: #8b5cf6;
}

body { background-color: var(--bg); color: var(--fg); }
```

- [ ] **Step 4: Add the pre-paint theme script in `index.html`**

Inside `<head>` of `index.html`, before `<title>`, add:

```html
    <script>
      (function () {
        try {
          document.documentElement.dataset.theme =
            localStorage.getItem('colorMode') || 'light';
        } catch (e) {
          document.documentElement.dataset.theme = 'light';
        }
      })();
    </script>
```

- [ ] **Step 5: Verify the build compiles with Tailwind**

Run: `pnpm build`
Expected: build succeeds, no errors, output in `build/`.

- [ ] **Step 6: Verify a utility renders (temporary smoke check)**

Run: `pnpm dev` and load `http://localhost:3000`. Confirm the page background reflects `--bg` (light default). Then in devtools set `document.documentElement.dataset.theme = 'dark'` and confirm the background darkens. Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml vite.config.mjs src/index.css index.html
git commit -m "Add Tailwind v4 with data-theme token system"
```

---

### Task 2: Inline SVG icon set

**Files:**
- Create: `src/ui/icons.jsx`
- Test: `src/ui/icons.test.jsx`

**Interfaces:**
- Produces: named exports `Star`, `ChevronDown`, `ChevronUp`, `Sun`, `Moon`, `BarChart`, `Check`, each a function component accepting `className` (default `"h-4 w-4"`) and forwarding other props to `<svg>`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/ui/icons.test.jsx
import { render } from "@testing-library/react";
import { Star, ChevronDown, ChevronUp, Sun, Moon, BarChart, Check } from "./icons";

test("icons render an svg and accept a className", () => {
  for (const Icon of [Star, ChevronDown, ChevronUp, Sun, Moon, BarChart, Check]) {
    const { container, unmount } = render(<Icon className="custom-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("custom-class");
    unmount();
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/ui/icons.test.jsx`
Expected: FAIL — cannot resolve `./icons`.

- [ ] **Step 3: Implement `src/ui/icons.jsx`**

```jsx
function Svg({ className = "h-4 w-4", children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Star(props) {
  return (
    <Svg {...props}>
      <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.8 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function ChevronDown(props) {
  return (<Svg {...props}><path d="M6 9l6 6 6-6" /></Svg>);
}

export function ChevronUp(props) {
  return (<Svg {...props}><path d="M18 15l-6-6-6 6" /></Svg>);
}

export function Sun(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Svg>
  );
}

export function Moon(props) {
  return (<Svg {...props}><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" /></Svg>);
}

export function BarChart(props) {
  return (<Svg {...props}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Svg>);
}

export function Check(props) {
  return (<Svg {...props}><path d="M20 6L9 17l-5-5" /></Svg>);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/ui/icons.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ui/icons.jsx src/ui/icons.test.jsx
git commit -m "Add inline SVG icon set"
```

---

### Task 3: Button, IconButton, Panel primitives

**Files:**
- Create: `src/ui/Button.jsx`, `src/ui/IconButton.jsx`, `src/ui/Panel.jsx`
- Test: `src/ui/Button.test.jsx`

**Interfaces:**
- Produces:
  - `Button({ size='md'|'sm', variant='text'|'solid', className, ...props })` — renders `<button>`, forwards `onClick`/children.
  - `IconButton({ variant='plain'|'elevated', className, children, ...props })` — renders `<button>`, forwards `onClick`/`aria-label`.
  - `Panel({ className, children, ...props })` — renders `<div>` surface container, forwards props (e.g. `style`, `data-*`).

- [ ] **Step 1: Write the failing test**

```jsx
// src/ui/Button.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";
import IconButton from "./IconButton";
import Panel from "./Panel";

test("Button fires onClick and renders children", async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Reset</Button>);
  await userEvent.click(screen.getByRole("button", { name: "Reset" }));
  expect(onClick).toHaveBeenCalledTimes(1);
});

test("IconButton forwards aria-label and onClick", async () => {
  const onClick = vi.fn();
  render(<IconButton aria-label="toggle" onClick={onClick}>x</IconButton>);
  await userEvent.click(screen.getByRole("button", { name: "toggle" }));
  expect(onClick).toHaveBeenCalledTimes(1);
});

test("Panel forwards style and renders children", () => {
  render(<Panel style={{ minHeight: 240 }}>content</Panel>);
  expect(screen.getByText("content")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/ui/Button.test.jsx`
Expected: FAIL — cannot resolve `./Button`.

- [ ] **Step 3: Implement the three files**

```jsx
// src/ui/Button.jsx
export default function Button({ size = "md", variant = "text", className = "", ...props }) {
  const base = "inline-flex items-center justify-center rounded font-medium transition-colors";
  const sizes = { sm: "text-xs px-2 py-1", md: "text-sm px-3 py-1.5" };
  const variants = {
    text: "text-accent hover:bg-accent/10",
    solid: "bg-accent text-bg hover:bg-accent/90",
  };
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />;
}
```

```jsx
// src/ui/IconButton.jsx
export default function IconButton({ variant = "plain", className = "", children, ...props }) {
  const base = "inline-flex items-center justify-center rounded-full transition-colors";
  const variants = {
    plain: "p-2 text-fg hover:bg-fg/10",
    elevated: "p-3 bg-accent text-bg shadow-lg hover:bg-accent/90",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
```

```jsx
// src/ui/Panel.jsx
export default function Panel({ className = "", children, ...props }) {
  return (
    <div className={`bg-surface border border-border rounded-lg shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/ui/Button.test.jsx`
Expected: PASS (all three tests).

- [ ] **Step 5: Commit**

```bash
git add src/ui/Button.jsx src/ui/IconButton.jsx src/ui/Panel.jsx src/ui/Button.test.jsx
git commit -m "Add Button, IconButton, Panel primitives"
```

---

### Task 4: Toggle and Checkbox primitives

**Files:**
- Create: `src/ui/Toggle.jsx`, `src/ui/Checkbox.jsx`
- Test: `src/ui/Toggle.test.jsx`

**Interfaces:**
- Produces:
  - `Toggle({ checked, onChange, size='md'|'sm', 'aria-label' })` — `role="switch"` button. On click calls `onChange({ target: { checked: !checked } })` (mimics the MUI Switch event shape callers already read via `e.target.checked`).
  - `Checkbox({ checked=false, className })` — non-interactive check indicator (used only for the disabled incumbent marker). Renders the `Check` icon when `checked`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/ui/Toggle.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toggle from "./Toggle";
import Checkbox from "./Checkbox";

test("Toggle reports the new checked value via onChange event shape", async () => {
  const onChange = vi.fn();
  render(<Toggle checked={false} onChange={onChange} aria-label="incumbent" />);
  const sw = screen.getByRole("switch", { name: "incumbent" });
  expect(sw).toHaveAttribute("aria-checked", "false");
  await userEvent.click(sw);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][0].target.checked).toBe(true);
});

test("Checkbox shows a check svg only when checked", () => {
  const { container, rerender } = render(<Checkbox checked={false} />);
  expect(container.querySelector("svg")).toBeNull();
  rerender(<Checkbox checked={true} />);
  expect(container.querySelector("svg")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/ui/Toggle.test.jsx`
Expected: FAIL — cannot resolve `./Toggle`.

- [ ] **Step 3: Implement the two files**

```jsx
// src/ui/Toggle.jsx
export default function Toggle({ checked = false, onChange, size = "md", ...props }) {
  const track = size === "sm" ? "h-4 w-7" : "h-5 w-9";
  const knob = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const shift = checked
    ? size === "sm" ? "translate-x-3.5" : "translate-x-4"
    : "translate-x-0.5";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.({ target: { checked: !checked } })}
      className={`relative inline-flex ${track} shrink-0 items-center rounded-full transition-colors ${checked ? "bg-accent" : "bg-fg/25"}`}
      {...props}
    >
      <span className={`inline-block ${knob} transform rounded-full bg-white shadow transition-transform ${shift}`} />
    </button>
  );
}
```

```jsx
// src/ui/Checkbox.jsx
import { Check } from "./icons";

export default function Checkbox({ checked = false, className = "" }) {
  return (
    <span
      className={`inline-flex h-4 w-4 items-center justify-center rounded border border-border ${checked ? "bg-accent text-bg" : "bg-transparent"} ${className}`}
    >
      {checked && <Check className="h-3 w-3" />}
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/ui/Toggle.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ui/Toggle.jsx src/ui/Checkbox.jsx src/ui/Toggle.test.jsx
git commit -m "Add Toggle and Checkbox primitives"
```

---

### Task 5: Collapse, NavSection, NavItem primitives

**Files:**
- Create: `src/ui/Collapse.jsx`, `src/ui/NavSection.jsx`
- Test: `src/ui/NavSection.test.jsx`

**Interfaces:**
- Produces:
  - `Collapse({ open, children })` — animated show/hide via `grid-template-rows`. Children stay mounted; inner wrapper has `overflow-hidden`.
  - `NavSection({ title, open, onToggle, children })` (default export of `NavSection.jsx`) — header button (Star + title + Chevron) wrapping a `Collapse`. The header button has accessible name = `title`.
  - `NavItem({ selected, onClick, children, className })` (named export of `NavSection.jsx`) — a selectable row button.

- [ ] **Step 1: Write the failing test**

```jsx
// src/ui/NavSection.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavSection, { NavItem } from "./NavSection";

test("NavSection header toggles via onToggle", async () => {
  const onToggle = vi.fn();
  render(
    <NavSection title="States" open={true} onToggle={onToggle}>
      <div>body</div>
    </NavSection>
  );
  await userEvent.click(screen.getByRole("button", { name: /States/ }));
  expect(onToggle).toHaveBeenCalledTimes(1);
  expect(screen.getByText("body")).toBeInTheDocument();
});

test("NavItem fires onClick", async () => {
  const onClick = vi.fn();
  render(<NavItem onClick={onClick}>New York</NavItem>);
  await userEvent.click(screen.getByRole("button", { name: "New York" }));
  expect(onClick).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/ui/NavSection.test.jsx`
Expected: FAIL — cannot resolve `./NavSection`.

- [ ] **Step 3: Implement the two files**

```jsx
// src/ui/Collapse.jsx
export default function Collapse({ open, children }) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
```

```jsx
// src/ui/NavSection.jsx
import { Star, ChevronDown, ChevronUp } from "./icons";
import Collapse from "./Collapse";

export default function NavSection({ title, open, onToggle, children }) {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-fg hover:bg-fg/5"
      >
        <Star className="h-4 w-4 text-accent-2" />
        <span className="flex-1 text-left">{title}</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      <Collapse open={open}>{children}</Collapse>
    </div>
  );
}

export function NavItem({ selected = false, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center px-6 py-1.5 text-left text-xs transition-colors ${selected ? "bg-accent/15 text-accent" : "text-fg hover:bg-fg/5"} ${className}`}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/ui/NavSection.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ui/Collapse.jsx src/ui/NavSection.jsx src/ui/NavSection.test.jsx
git commit -m "Add Collapse, NavSection, NavItem primitives"
```

---

### Task 6: Drawer and BottomSheet primitives

**Files:**
- Create: `src/ui/Drawer.jsx`, `src/ui/BottomSheet.jsx`
- Test: `src/ui/Drawer.test.jsx`

**Interfaces:**
- Produces:
  - `Drawer({ variant='docked'|'overlay', open, onClose, width=200, className, children, ...props })` — fixed left drawer. Renders `<aside data-variant={variant}>` and forwards extra props (e.g. `data-testid`) to the `<aside>`. Overlay variant renders a click-to-close scrim above the navbar; docked variant has no scrim.
  - `BottomSheet({ open, onClose, children })` — bottom sheet with scrim; slides via `translate-y`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/ui/Drawer.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Drawer from "./Drawer";
import BottomSheet from "./BottomSheet";

test("Drawer exposes its variant and forwards data-testid", () => {
  render(
    <Drawer variant="docked" open={true} data-testid="controls-drawer">
      <div>controls</div>
    </Drawer>
  );
  const el = screen.getByTestId("controls-drawer");
  expect(el).toHaveAttribute("data-variant", "docked");
  expect(screen.getByText("controls")).toBeInTheDocument();
});

test("BottomSheet scrim calls onClose", async () => {
  const onClose = vi.fn();
  render(<BottomSheet open={true} onClose={onClose}><div>sheet</div></BottomSheet>);
  // scrim is the first fixed-inset element; click it
  await userEvent.click(document.querySelector(".fixed.inset-0"));
  expect(onClose).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/ui/Drawer.test.jsx`
Expected: FAIL — cannot resolve `./Drawer`.

- [ ] **Step 3: Implement the two files**

```jsx
// src/ui/Drawer.jsx
export default function Drawer({
  variant = "docked",
  open = false,
  onClose,
  width = 200,
  className = "",
  children,
  ...props
}) {
  const panel = (
    <aside
      data-variant={variant}
      style={{ width }}
      className={`fixed left-0 top-0 h-full overflow-y-auto bg-surface transition-transform ${variant === "docked" ? "border-r border-border" : "z-[13000]"} ${open ? "translate-x-0" : "-translate-x-full"} ${className}`}
      {...props}
    >
      {children}
    </aside>
  );

  if (variant === "docked") return panel;

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 z-[12999] bg-black/50" />}
      {panel}
    </>
  );
}
```

```jsx
// src/ui/BottomSheet.jsx
export default function BottomSheet({ open = false, onClose, children }) {
  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 z-[1099] bg-black/50" />}
      <div
        className={`fixed inset-x-0 bottom-0 z-[1100] flex max-h-[75vh] flex-col items-center overflow-auto rounded-t-xl bg-elevated p-3 transition-transform ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        {children}
      </div>
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/ui/Drawer.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ui/Drawer.jsx src/ui/BottomSheet.jsx src/ui/Drawer.test.jsx
git commit -m "Add Drawer and BottomSheet primitives"
```

---

### Task 7: Table primitives

**Files:**
- Create: `src/ui/Table.jsx`
- Test: `src/ui/Table.test.jsx`

**Interfaces:**
- Produces named exports `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td`. Each forwards `className` and other props; render the matching HTML table element with dark-theme styling.

- [ ] **Step 1: Write the failing test**

```jsx
// src/ui/Table.test.jsx
import { render, screen } from "@testing-library/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Table";

test("Table primitives compose a real table", () => {
  render(
    <Table>
      <Thead><Tr><Th>Districts</Th></Tr></Thead>
      <Tbody><Tr><Td>26</Td></Tr></Tbody>
    </Table>
  );
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getByRole("columnheader", { name: "Districts" })).toBeInTheDocument();
  expect(screen.getByRole("cell", { name: "26" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/ui/Table.test.jsx`
Expected: FAIL — cannot resolve `./Table`.

- [ ] **Step 3: Implement `src/ui/Table.jsx`**

```jsx
export function Table({ className = "", children, ...props }) {
  return (
    <table className={`w-full border-collapse text-xs text-fg ${className}`} {...props}>
      {children}
    </table>
  );
}

export function Thead({ children }) {
  return <thead>{children}</thead>;
}

export function Tbody({ children }) {
  return <tbody>{children}</tbody>;
}

export function Tr({ className = "", children, ...props }) {
  return (
    <tr className={`border-b border-border last:border-0 ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function Th({ className = "", children, ...props }) {
  return (
    <th className={`px-2 py-1 text-center font-bold text-fg ${className}`} {...props}>
      {children}
    </th>
  );
}

export function Td({ className = "", children, ...props }) {
  return (
    <td className={`px-2 py-1 text-center text-muted ${className}`} {...props}>
      {children}
    </td>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/ui/Table.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ui/Table.jsx src/ui/Table.test.jsx
git commit -m "Add Table primitives"
```

---

### Task 8: Migrate App.jsx theme + toggle off MUI

**Files:**
- Modify: `src/App.jsx`
- Test: `src/App.test.jsx`

**Interfaces:**
- Consumes: `IconButton` (Task 3), `Sun`/`Moon` (Task 2), `StoreContextProvider`, `HomePage`.
- Produces: theme toggle that flips `document.documentElement.dataset.theme` and persists `localStorage['colorMode']`. No MUI imports remain in this file.

- [ ] **Step 1: Write the failing test**

```jsx
// src/App.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.dataset.theme = "light";
});

test("toggle flips data-theme and persists colorMode", async () => {
  render(<App />);
  const btn = screen.getByRole("button", { name: /toggle dark mode/i });
  await userEvent.click(btn);
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(localStorage.getItem("colorMode")).toBe("dark");
  await userEvent.click(btn);
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(localStorage.getItem("colorMode")).toBe("light");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/App.test.jsx`
Expected: FAIL — App still builds an MUI theme; `data-theme` not driven by the toggle (or MUI import error surfaces).

- [ ] **Step 3: Rewrite `src/App.jsx`**

Replace the entire file with:

```jsx
import "./App.css";
import { useState } from "react";
import { StoreContextProvider } from "./common/Store";
import HomePage from "./common/HomePage";
import IconButton from "./ui/IconButton";
import { Sun, Moon } from "./ui/icons";

function App() {
  const [mode, setMode] = useState(
    () => document.documentElement.dataset.theme || localStorage.getItem("colorMode") || "light"
  );

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("colorMode", next);
      document.documentElement.dataset.theme = next;
      return next;
    });
  };

  return (
    <StoreContextProvider>
      <HomePage />
      <IconButton
        onClick={toggleColorMode}
        aria-label="toggle dark mode"
        className="fixed top-3 right-3 z-[20000] bg-surface shadow-md hover:bg-surface"
      >
        {mode === "dark" ? <Sun /> : <Moon />}
      </IconButton>
    </StoreContextProvider>
  );
}

export default App;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/App.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/App.test.jsx
git commit -m "Migrate App theme toggle to data-theme (drop MUI theme)"
```

---

### Task 9: Migrate HomePage + MainDrawer shell

**Files:**
- Modify: `src/common/HomePage.jsx`
- Modify: `src/common/MainDrawer.jsx`

**Interfaces:**
- Consumes: `Drawer` (Task 6), `DrawerLists`, `ResetButtonGroup`, `useIsMobile`.
- Produces: the shell with a docked drawer on desktop and an overlay drawer on mobile. The drawer `<aside>` carries `data-testid="controls-drawer"` and `data-variant="docked"|"overlay"` for the e2e specs.

- [ ] **Step 1: Rewrite `src/common/HomePage.jsx`**

```jsx
import * as React from "react";
import MainTab from "./MainTabPanel";
import MainDrawer from "./MainDrawer";
import Loader from "./Loader";
import StoreContext from "./Store";

export default function HomePage() {
  const { loading } = React.useContext(StoreContext);
  return (
    <div className="absolute h-full w-full bg-bg">
      <div className="relative mt-16 h-full">
        {loading ? <Loader /> : null}
        <MainTab />
      </div>
      <MainDrawer />
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `src/common/MainDrawer.jsx`**

Keep the `.navbar` + `.logo` markup and the mobile logo-tap toggle. Replace MUI `Box`/`Drawer`/`Toolbar`/`Divider` with the `ui/Drawer` and Tailwind. The `64px` navbar height is preserved by the `mt-16` in HomePage and the fixed navbar height.

```jsx
import * as React from "react";
import Drawer from "../ui/Drawer";
import DrawerLists from "./DrawerLists";
import ResetButtonGroup from "../TabPanels/mapPanel/ResetButtonGroup";
import useIsMobile from "../hooks/use-is-mobile.hook";

const drawerWidth = 200;

export default function ResponsiveDrawer() {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(!isMobile);

  const handleDrawerToggle = () => setOpen((o) => !o);

  return (
    <nav aria-label="controls">
      <div
        className="navbar fixed left-0 top-0 z-[10000] flex h-16 w-screen items-center bg-surface border-b border-border"
      >
        <div
          className="logo h-16"
          style={{
            width: `${drawerWidth - 1}px`,
            backgroundImage: `url(${process.env.PUBLIC_URL + "/Huskies3.png"})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "left",
          }}
          onClick={handleDrawerToggle}
        />
      </div>

      <Drawer
        variant={isMobile ? "overlay" : "docked"}
        open={isMobile ? open : true}
        onClose={handleDrawerToggle}
        width={drawerWidth}
        className="pt-16"
        data-testid="controls-drawer"
      >
        <DrawerLists />
        <div className="my-2 border-t border-border" />
        <ResetButtonGroup />
      </Drawer>
    </nav>
  );
}
```

Note: on desktop the docked drawer is always visible (`open={true}`); the logo tap still toggles the mobile overlay. This preserves the current behavior where desktop controls are always shown.

- [ ] **Step 3: Verify shell renders and drawer variant is correct**

Run: `pnpm test` (the App test mounts HomePage → MainDrawer; matchMedia stub defaults to desktop, so the docked variant renders). Expected: PASS, no MUI resolution errors.

- [ ] **Step 4: Manual check**

Run `pnpm dev`. Desktop: drawer docked under the navbar, controls visible. Narrow the window below the mobile breakpoint / use devtools device mode: drawer hidden, tapping the logo opens the overlay with a scrim. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/common/HomePage.jsx src/common/MainDrawer.jsx
git commit -m "Migrate app shell (HomePage + MainDrawer) to ui/Drawer"
```

---

### Task 10: Migrate the four nav lists onto NavSection

**Files:**
- Modify: `src/common/StateList.jsx`
- Modify: `src/common/PlanList.jsx`
- Modify: `src/common/MultiPlanList.jsx`
- Modify: `src/common/MapFilterList.jsx`

**Interfaces:**
- Consumes: `NavSection` + `NavItem` (Task 5), `Toggle` (Task 4). No MUI imports remain in these files.
- Produces: same store interactions as before (state select/unselect, plan select, plan-filter add/remove, map-filter mutual exclusivity, reset-callback registration).

- [ ] **Step 1: Rewrite `src/common/StateList.jsx`**

Preserve `onStateClick`, the `open` state, and `isStateMatch`. Replace MUI list/collapse/icons with `NavSection`/`NavItem`.

```jsx
import * as React from "react";
import { useContext } from "react";
import NavSection, { NavItem } from "../ui/NavSection";
import StoreContext from "./Store";
import { StateType } from "./GlobalVariables";

export default function StateList() {
  const { mapStore } = useContext(StoreContext);
  const [open, setOpen] = React.useState(true);

  function onStateClick(stateType) {
    mapStore.isStateMatch(stateType) ? mapStore.unselectState() : mapStore.selectState(stateType);
  }

  const states = [
    [StateType.NEWYORK, "New York"],
    [StateType.GEORGIA, "Georgia"],
    [StateType.ILLINOIS, "Illinois"],
  ];

  return (
    <NavSection title="States" open={open} onToggle={() => setOpen(!open)}>
      {states.map(([type, label]) => (
        <NavItem key={type} selected={mapStore.isStateMatch(type)} onClick={() => onStateClick(type)}>
          {label}
        </NavItem>
      ))}
    </NavSection>
  );
}
```

- [ ] **Step 2: Rewrite `src/common/PlanList.jsx`**

Preserve the `useEffect` default plan selection and the collapsed-title behavior (title becomes the current plan when collapsed).

```jsx
import * as React from "react";
import { useContext, useEffect } from "react";
import NavSection, { NavItem } from "../ui/NavSection";
import StoreContext from "./Store";
import { PlanTitleType, PlanType } from "./GlobalVariables";

export default function PlanList() {
  const { mapStore } = useContext(StoreContext);
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    mapStore.selectPlan(PlanType.Y2022);
  }, []);

  const title = open ? "Plan" : mapStore.getMapPlan();

  return (
    <NavSection title={title} open={open} onToggle={() => setOpen(!open)}>
      {Object.keys(PlanType).map((key) => {
        const planType = PlanType[key];
        return (
          <NavItem
            key={planType}
            selected={mapStore.getMapPlan() === planType}
            onClick={() => mapStore.selectPlan(planType)}
          >
            {PlanTitleType[planType]}
          </NavItem>
        );
      })}
    </NavSection>
  );
}
```

- [ ] **Step 3: Rewrite `src/common/MultiPlanList.jsx`**

Preserve reset-callback registration and per-plan filter add/remove; skip `Y2022`.

```jsx
import * as React from "react";
import { useState, useContext, useEffect, useCallback } from "react";
import NavSection, { NavItem } from "../ui/NavSection";
import StoreContext from "./Store";
import { PlanTitleType, PlanType } from "./GlobalVariables";

const emptyFilters = {
  [PlanType.S0001]: false,
  [PlanType.S0002]: false,
  [PlanType.S0003]: false,
  [PlanType.S0004]: false,
  [PlanType.S0005]: false,
};

export default function MultiPlanList() {
  const { mapStore, callbacks } = useContext(StoreContext);
  const [open, setOpen] = useState(true);
  const [filters, setFilters] = useState(emptyFilters);

  const resetStateFilter = useCallback(() => setFilters(emptyFilters), []);

  useEffect(() => {
    callbacks.addOnResetState(resetStateFilter);
  }, []);

  function onPlanButtonClick(planType) {
    if (!filters[planType]) {
      mapStore.addPlanFilter(planType);
      setFilters((prev) => ({ ...prev, [planType]: true }));
    } else {
      mapStore.removePlanFilter(planType);
      setFilters((prev) => ({ ...prev, [planType]: false }));
    }
  }

  return (
    <NavSection title="Plan Filter" open={open} onToggle={() => setOpen(!open)}>
      {Object.keys(PlanType)
        .map((key) => PlanType[key])
        .filter((planType) => planType !== PlanType.Y2022)
        .map((planType) => (
          <NavItem key={planType} selected={filters[planType]} onClick={() => onPlanButtonClick(planType)}>
            {PlanTitleType[planType]}
          </NavItem>
        ))}
    </NavSection>
  );
}
```

- [ ] **Step 4: Rewrite `src/common/MapFilterList.jsx`**

Preserve the mutual-exclusivity logic in `onToggle` exactly. Each row is a label + `Toggle`. `onToggle` reads `e.target.checked` (the `Toggle` provides this event shape).

```jsx
import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import NavSection from "../ui/NavSection";
import Toggle from "../ui/Toggle";
import StoreContext from "./Store";
import { MapFilterType } from "./GlobalVariables";

const allOff = {
  [MapFilterType.INCUMBENT]: false,
  [MapFilterType.VICTORYMARGIN]: false,
  [MapFilterType.WHITE]: false,
  [MapFilterType.BLACK]: false,
  [MapFilterType.HISPANIC]: false,
};

export default function MapFilterList() {
  const { mapStore, callbacks } = useContext(StoreContext);
  const [open, setOpen] = useState(true);
  const [switches, setSwitches] = useState({ ...allOff, [MapFilterType.VICTORYMARGIN]: true });

  const resetStateFilter = useCallback(() => setSwitches({ ...allOff }), []);

  useEffect(() => {
    callbacks.addOnResetState(resetStateFilter);
  }, []);

  useEffect(() => {
    mapStore.setColorFilter(MapFilterType.VICTORYMARGIN);
  }, []);

  const onToggle = (e, filterType) => {
    let state;
    if (filterType === MapFilterType.INCUMBENT) {
      state = { ...switches, [MapFilterType.INCUMBENT]: e.target.checked };
      mapStore.setIncumbentFilter(e.target.checked);
    } else {
      const activeFilter = e.target.checked
        ? filterType
        : filterType === MapFilterType.VICTORYMARGIN
        ? MapFilterType.NONE
        : MapFilterType.VICTORYMARGIN;
      state = {
        [MapFilterType.INCUMBENT]: switches[MapFilterType.INCUMBENT],
        [MapFilterType.VICTORYMARGIN]: activeFilter === MapFilterType.VICTORYMARGIN,
        [MapFilterType.WHITE]: activeFilter === MapFilterType.WHITE,
        [MapFilterType.BLACK]: activeFilter === MapFilterType.BLACK,
        [MapFilterType.HISPANIC]: activeFilter === MapFilterType.HISPANIC,
      };
      mapStore.setColorFilter(activeFilter);
    }
    setSwitches(state);
  };

  const rows = [
    [MapFilterType.INCUMBENT, "Incumbent"],
    [MapFilterType.VICTORYMARGIN, "Victory Margin"],
    [MapFilterType.WHITE, "White Pop"],
    [MapFilterType.BLACK, "Black Pop"],
    [MapFilterType.HISPANIC, "Hispanic Pop"],
  ];

  return (
    <NavSection title="Map Filter" open={open} onToggle={() => setOpen(!open)}>
      {rows.map(([type, label]) => (
        <div key={type} className="flex items-center justify-between px-6 py-1.5 text-xs text-fg">
          <span>{label}</span>
          <Toggle
            size="sm"
            aria-label={label}
            checked={switches[type]}
            onChange={(e) => onToggle(e, type)}
          />
        </div>
      ))}
    </NavSection>
  );
}
```

- [ ] **Step 5: Verify no MUI remains in these files and tests pass**

Run: `grep -rn "@mui" src/common/StateList.jsx src/common/PlanList.jsx src/common/MultiPlanList.jsx src/common/MapFilterList.jsx`
Expected: no output.
Run: `pnpm test`
Expected: PASS (existing unit tests unaffected).

- [ ] **Step 6: Commit**

```bash
git add src/common/StateList.jsx src/common/PlanList.jsx src/common/MultiPlanList.jsx src/common/MapFilterList.jsx
git commit -m "Migrate nav lists to NavSection primitives (drop MUI lists)"
```

---

### Task 11: Migrate MapPanel + ResetButtonGroup

**Files:**
- Modify: `src/TabPanels/mapPanel/MapPanel.jsx`
- Modify: `src/TabPanels/mapPanel/ResetButtonGroup.jsx`

**Interfaces:**
- Consumes: `Panel` (Task 3), `IconButton` (Task 3), `BottomSheet` (Task 6), `BarChart` icon (Task 2), `Button` (Task 3).
- Produces: same desktop/mobile branches and `#map-container` preservation; mobile FAB opens the bottom sheet.

- [ ] **Step 1: Rewrite `src/TabPanels/mapPanel/ResetButtonGroup.jsx`**

```jsx
import { useContext } from "react";
import Button from "../../ui/Button";
import { StoreContext } from "../../common/Store";

export default function ResetButtonGroup() {
  const { mapStore } = useContext(StoreContext);

  return (
    <div className="flex flex-col items-start px-3 py-2">
      {!mapStore.isStateNone() && (
        <Button size="sm" onClick={() => mapStore.resetState()}>
          Reset State
        </Button>
      )}
      <Button size="sm" onClick={() => mapStore.resetPage()}>
        Reset Page
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `src/TabPanels/mapPanel/MapPanel.jsx`**

Replace `Paper`→`Panel`, `Fab`+`BarChartIcon`→`IconButton variant="elevated"`+`BarChart`, bottom `Drawer`→`BottomSheet`. Keep both layout branches and `DataTables`.

```jsx
import { useContext, useState } from "react";
import "leaflet/dist/leaflet.css";
import Panel from "../../ui/Panel";
import IconButton from "../../ui/IconButton";
import BottomSheet from "../../ui/BottomSheet";
import { BarChart } from "../../ui/icons";
import MainMap from "./MainMap";
import DistrictSummaryTable from "./DistrictSummaryTable";
import StateInfoTable from "./StateInfoTable";
import StoreReducer from "../../common/Store";
import HeatMap from "./HeatMap";
import SummaryEnsembleTable from "../analyzePanel/SummaryEnsembleTable";
import useIsMobile from "../../hooks/use-is-mobile.hook";

function DataTables({ mapStore }) {
  return (
    <>
      <div className="mb-2.5 w-full flex-none">
        {!mapStore.isStateNone() && <StateInfoTable />}
      </div>
      <div className="mb-2.5 w-full flex-none">
        {!mapStore.isStateNone() && mapStore.getMapPlan() === "enacted" && <SummaryEnsembleTable />}
      </div>
      <Panel className="flex w-full flex-1" style={{ minHeight: 240 }}>
        {!mapStore.isStateNone() && <DistrictSummaryTable />}
      </Panel>
    </>
  );
}

export default function MapPanel() {
  const { mapStore } = useContext(StoreReducer);
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="absolute h-full w-full">
        <Panel className="map absolute inset-0">
          <MainMap />
          <HeatMap />
        </Panel>
        {!mapStore.isStateNone() && (
          <IconButton
            variant="elevated"
            aria-label="Show district data"
            onClick={() => setSheetOpen(true)}
            className="absolute bottom-4 right-4 z-[1100]"
          >
            <BarChart />
          </IconButton>
        )}
        <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
          <DataTables mapStore={mapStore} />
        </BottomSheet>
      </div>
    );
  }

  return (
    <div className="absolute flex h-full p-2.5" style={{ width: "calc(100% - 20px)" }}>
      <div className="mr-2.5 flex flex-[3.5] flex-col justify-center">
        <Panel className="map mb-2.5 flex-1">
          <MainMap />
          <HeatMap />
        </Panel>
      </div>
      <div className="flex flex-[2.5] flex-col">
        <div className="mb-2.5 h-full flex-none">
          {!mapStore.isStateNone() && <StateInfoTable />}
        </div>
        <div className="mb-2.5 h-full flex-none">
          {!mapStore.isStateNone() && mapStore.getMapPlan() === "enacted" && <SummaryEnsembleTable />}
        </div>
        <Panel className="flex flex-1" style={{ height: "70%" }}>
          {!mapStore.isStateNone() && <DistrictSummaryTable />}
        </Panel>
      </div>
    </div>
  );
}
```

Note: `#map-container` is emitted by `MainMap`/Leaflet, not by MapPanel; leaving `MainMap` untouched preserves it.

- [ ] **Step 3: Verify no MUI remains and build passes**

Run: `grep -rn "@mui" src/TabPanels/mapPanel/MapPanel.jsx src/TabPanels/mapPanel/ResetButtonGroup.jsx`
Expected: no output.
Run: `pnpm build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/TabPanels/mapPanel/MapPanel.jsx src/TabPanels/mapPanel/ResetButtonGroup.jsx
git commit -m "Migrate MapPanel and ResetButtonGroup off MUI"
```

---

### Task 12: Migrate the tables (StateInfo, SummaryEnsemble, DistrictSummary)

**Files:**
- Modify: `src/TabPanels/mapPanel/StateInfoTable.jsx`
- Modify: `src/TabPanels/analyzePanel/SummaryEnsembleTable.jsx`
- Modify: `src/TabPanels/mapPanel/DistrictSummaryTable.jsx`
- Modify: `src/TabPanels/mapPanel/DistrictSummaryItem.jsx`

**Interfaces:**
- Consumes: `Table`/`Thead`/`Tbody`/`Tr`/`Th`/`Td` (Task 7), `Panel` (Task 3), `Toggle` (Task 4), `Checkbox` (Task 4).
- Produces: identical data rendered; `DistrictSummaryTable` keeps the highlight-scroll `useEffect` and the incumbent filter; `DistrictSummaryItem` keeps its inline flex layout, party-color bars, and the expandable comparison table.

- [ ] **Step 1: Rewrite `src/TabPanels/mapPanel/StateInfoTable.jsx`**

```jsx
import * as React from "react";
import { useContext } from "react";
import StoreContext from "../../common/Store";
import Panel from "../../ui/Panel";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../ui/Table";

export default function StateInfoTable() {
  const { mapStore, dataStore } = useContext(StoreContext);
  if (!dataStore.isReadyToDisplayCurrentMap()) return null;
  const modelData = dataStore.getStateModelData(mapStore.plan, mapStore.state);
  const summaryData = modelData.summaryData;

  return (
    <Panel className="p-2">
      <Table>
        <Thead>
          <Tr>
            <Th>Total Districts</Th>
            <Th>Incumbents</Th>
            <Th>Dem winners</Th>
            <Th>Rep winners</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{summaryData.numOfDistrics}</Td>
            <Td>{summaryData.numOfIncumbents}</Td>
            <Td>{summaryData.numOfDemocratWinners}</Td>
            <Td>{summaryData.numOfRepublicanWinners}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Panel>
  );
}
```

- [ ] **Step 2: Rewrite `src/TabPanels/analyzePanel/SummaryEnsembleTable.jsx`**

```jsx
import * as React from "react";
import { useContext } from "react";
import StoreContext from "../../common/Store";
import Panel from "../../ui/Panel";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../ui/Table";

export default function SummaryEnsembleTable() {
  const { dataStore } = useContext(StoreContext);
  if (!dataStore.isEnsemblejsonReady()) return null;

  const data = dataStore.getEnsembleData().ensemble_summary;
  if (!data) return null;

  return (
    <Panel className="p-2">
      <Table>
        <Thead>
          <Tr>
            <Th>Plans</Th>
            <Th>Incumbents</Th>
            <Th>Predicted Winners</Th>
            <Th>Avg Geo Var</Th>
            <Th>Avg Pop Var</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{data.num_plans}</Td>
            <Td>{data.num_incumbents}</Td>
            <Td>{Math.round(data.avg_incumbent_winners)}</Td>
            <Td>{data.avg_geo_var.toLocaleString("en", { style: "percent" })}</Td>
            <Td>{data.avg_pop_var.toLocaleString("en", { style: "percent" })}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Panel>
  );
}
```

- [ ] **Step 3: Edit `src/TabPanels/mapPanel/DistrictSummaryTable.jsx`**

Change only the MUI `Switch`. Replace the import line:

```jsx
import { Switch } from "@mui/material";
```

with:

```jsx
import Toggle from "../../ui/Toggle";
```

Then replace the switch in the JSX:

```jsx
<Switch aria-label='Switch demo' size="small" sx={{margin: 1}} checked={state.incumbentFilter} onClick={onIncumbentFilterClick} />
```

with:

```jsx
<Toggle size="sm" aria-label="Only Incumbents" checked={state.incumbentFilter} onChange={onIncumbentFilterClick} />
```

`onIncumbentFilterClick(event)` already reads `event.target.checked`, which the `Toggle` provides. All other markup in this file stays.

- [ ] **Step 4: Edit `src/TabPanels/mapPanel/DistrictSummaryItem.jsx`**

Replace the MUI import line:

```jsx
import {Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
```

with:

```jsx
import Panel from "../../ui/Panel";
import Checkbox from "../../ui/Checkbox";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../ui/Table";
```

Replace the two winner/loser incumbent checkboxes:

```jsx
{(data.winnerCandidate === data.incumbent) &&<Checkbox defaultChecked disabled={true} color="default" size="small" sx={{position: 'relative', margin:'-10px'}}/>}
```
```jsx
{(data.loserCandidate === data.incumbent) && <Checkbox defaultChecked color="default" size="small" sx={{margin:'-10px'}}/>}
```

with (respectively):

```jsx
{(data.winnerCandidate === data.incumbent) && <Checkbox checked />}
```
```jsx
{(data.loserCandidate === data.incumbent) && <Checkbox checked />}
```

Replace the expandable comparison table block (the `<TableContainer component={Paper} ...>` through its closing `</TableContainer>`) with the `ui` equivalents, preserving the `rows.map` and the `IncumbentVariation` chart row:

```jsx
<Panel className="mb-2.5">
  <Table>
    <Thead>
      <Tr>
        <Th className="text-left font-extrabold">Compare to 2020 plan</Th>
        <Th className="text-right font-extrabold">Percentage&nbsp;(%)</Th>
      </Tr>
    </Thead>
    <Tbody>
      {rows.map((row) => (
        <Tr key={row.name}>
          <Td className="text-left text-fg">{row.name}</Td>
          <Td className="text-right font-bold text-fg">{row.percentage}</Td>
        </Tr>
      ))}
      <Tr key="chart">
        {canShowIncumbentVariation && (
          <IncumbentVariation incumbent={data.incumbent} enactedData={enactedData.incumbent_data} incumbentData={incumbentData} type={"area_variations"} />
        )}
        {canShowIncumbentVariation && (
          <IncumbentVariation incumbent={data.incumbent} enactedData={enactedData.incumbent_data} incumbentData={incumbentData} type={"vap_variations"} />
        )}
      </Tr>
    </Tbody>
  </Table>
</Panel>
```

Leave the rest of the component (the inline flex district row, party-color bars, vote counts) unchanged.

- [ ] **Step 5: Verify no MUI remains in the table files and tests pass**

Run: `grep -rn "@mui" src/TabPanels`
Expected: no output.
Run: `pnpm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/TabPanels/mapPanel/StateInfoTable.jsx src/TabPanels/analyzePanel/SummaryEnsembleTable.jsx src/TabPanels/mapPanel/DistrictSummaryTable.jsx src/TabPanels/mapPanel/DistrictSummaryItem.jsx
git commit -m "Migrate tables and district summary off MUI"
```

---

### Task 13: Remove MUI/Emotion deps, clean CSS, update e2e, final gates

**Files:**
- Modify: `package.json`
- Modify: `src/App.css`
- Modify: `e2e/responsive.spec.js`

**Interfaces:**
- Consumes: everything migrated above.
- Produces: an MUI-free client with green units, updated e2e, and a clean build.

- [ ] **Step 1: Confirm no MUI/Emotion imports remain anywhere**

Run: `grep -rn "@mui\|@emotion" src`
Expected: no output. If anything prints, fix that file before continuing.

- [ ] **Step 2: Remove the dependencies**

```bash
pnpm remove @mui/material @mui/icons-material @emotion/react @emotion/styled
```

- [ ] **Step 3: Clean dead CRA CSS in `src/App.css`**

Remove the unused `.App`, `.App-logo`, `.App-header`, `.App-link`, and `@keyframes App-logo-spin` rules and their `@media` block. Keep `.map-side-item` and `div.logo:hover`:

```css
.map-side-item {
  cursor: pointer;
}

div.logo:hover {
  box-shadow: inset 0 0 0 2000px rgba(94, 72, 215, 0.3);
  cursor: pointer;
}
```

- [ ] **Step 4: Update `e2e/responsive.spec.js` selectors**

Replace the two `.MuiDrawer-docked` assertions. Desktop expects the docked drawer present; mobile expects it absent.

Desktop assertion — replace:

```js
    await expect(page.locator(".MuiDrawer-docked")).toHaveCount(1);
```

with:

```js
    await expect(page.locator('[data-testid="controls-drawer"][data-variant="docked"]')).toHaveCount(1);
```

Mobile assertion — replace:

```js
    await expect(page.locator(".MuiDrawer-docked")).toHaveCount(0);
```

with:

```js
    await expect(page.locator('[data-testid="controls-drawer"][data-variant="docked"]')).toHaveCount(0);
```

(The mobile drawer renders with `data-variant="overlay"`, so the docked selector correctly yields 0.)

- [ ] **Step 5: Run the unit suite**

Run: `pnpm test`
Expected: PASS (all existing + new primitive/App tests).

- [ ] **Step 6: Run the build gate**

Run: `pnpm build`
Expected: succeeds with no MUI resolution errors.

- [ ] **Step 7: Run the e2e suite**

Run: `pnpm test:e2e`
Expected: PASS on both desktop and mobile projects (smoke + responsive).

- [ ] **Step 8: Manual verification pass**

Run `pnpm dev` and confirm:
- Light/dark toggle flips theme, persists across reload, no flash on load.
- Desktop: drawer docked, controls visible, map shares the row.
- Mobile (devtools device mode): drawer hidden, map fills viewport, logo tap opens overlay drawer with scrim.
- All four nav sections expand/collapse.
- Map filter toggles drive the map; mutual exclusivity preserved (enabling one population filter disables the others; disabling falls back to Victory Margin).
- Selecting a district scrolls its summary item into view; the comparison table and charts render.
- Mobile FAB opens the bottom sheet and it scrolls.

- [ ] **Step 9: Commit**

```bash
git add package.json pnpm-lock.yaml src/App.css e2e/responsive.spec.js
git commit -m "Remove MUI/Emotion deps, clean CSS, update e2e selectors"
```

---

## Self-Review Notes

- **Spec coverage:** Theme tokens + toggle (Tasks 1, 8); UI primitives replacing every MUI component in use — Button/Fab/IconButton, Paper, Switch, Checkbox, Collapse, List family, Drawer, bottom Drawer, Table family (Tasks 2-7); all 13 feature-file migrations (Tasks 9-12); dependency removal + CSS cleanup + e2e update + gates (Task 13). Every spec section maps to at least one task.
- **Icons:** Star, ChevronDown, ChevronUp, Sun, Moon, BarChart, Check cover every `@mui/icons-material` import found (Star, ExpandLess, ExpandMore, Brightness4/7, BarChart) plus the Checkbox glyph.
- **Type/name consistency:** `Toggle` uses `onChange(e)` with `e.target.checked` = new value; all callers (`MapFilterList`, `DistrictSummaryTable`) updated to `onChange` and already read `e.target.checked`. `Drawer` forwards `data-testid`/`data-variant`; e2e asserts on exactly those attributes. `Table` exports (`Table/Thead/Tbody/Tr/Th/Td`) match every table consumer.
- **Untouched by design:** `Store.jsx`, reducers, `StateModel`, `api.js`, `MapController`, `GlobalVariables`, `MainMap` (`#map-container`), `IncumbentVariation` (ApexCharts), Leaflet CSS.
