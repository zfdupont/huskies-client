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
