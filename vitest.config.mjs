import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.mjs";

// Reuse the app's Vite config (React, svgr, ~ alias, env handling) so tests
// transform modules exactly like the app does, then layer the test options on
// top. Playwright specs live in e2e/ and are intentionally excluded here.
export default mergeConfig(
    viteConfig({ command: "serve", mode: "test" }),
    defineConfig({
        test: {
            environment: "jsdom",
            globals: true,
            setupFiles: "./vitest.setup.js",
            include: ["src/**/*.test.{js,jsx}"],
            css: false,
        },
    })
);
