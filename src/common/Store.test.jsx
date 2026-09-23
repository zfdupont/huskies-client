import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useContext } from "react";
import StoreContext, { StoreContextProvider } from "./Store";
import { PageType } from "./GlobalVariables";

describe("pageStore", () => {
    it("defaults to the MAP page", () => {
        function Probe() {
            const { pageStore } = useContext(StoreContext);
            return <div data-testid="page">{pageStore.getPage()}</div>;
        }

        render(
            <StoreContextProvider>
                <Probe />
            </StoreContextProvider>
        );

        expect(screen.getByTestId("page")).toHaveTextContent(PageType.MAP);
    });

    it("switches the active page via selectPage", () => {
        let pageStore;
        function Probe() {
            pageStore = useContext(StoreContext).pageStore;
            return <div data-testid="page">{pageStore.getPage()}</div>;
        }

        render(
            <StoreContextProvider>
                <Probe />
            </StoreContextProvider>
        );

        act(() => {
            pageStore.selectPage(PageType.ANALYZE);
        });

        expect(screen.getByTestId("page")).toHaveTextContent(PageType.ANALYZE);
        expect(pageStore.isPage(PageType.ANALYZE)).toBe(true);
        expect(pageStore.isPage(PageType.MAP)).toBe(false);
    });
});
