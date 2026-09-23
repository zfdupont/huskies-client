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
