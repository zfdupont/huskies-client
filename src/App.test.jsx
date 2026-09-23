import { vi } from "vitest";
vi.mock("./common/HomePage", () => ({ default: () => <div data-testid="home-stub" /> }));

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
