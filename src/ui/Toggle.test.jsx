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
