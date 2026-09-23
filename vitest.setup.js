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

// jsdom does not implement ResizeObserver; apexcharts (box-and-whisker chart in
// the Analyze tab) reaches for it on mount. Provide a no-op stub.
if (!global.ResizeObserver) {
    global.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}

afterEach(() => {
    cleanup();
});
