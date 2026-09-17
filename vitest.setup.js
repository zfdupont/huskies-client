import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom does not implement matchMedia; components that use it (e.g. the
// useIsMobile hook, MUI) need a stub. Defaults to "desktop" (no match); tests
// that care about mobile can override window.matchMedia per-case.
if (!window.matchMedia) {
    window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
    });
}

afterEach(() => {
    cleanup();
});
