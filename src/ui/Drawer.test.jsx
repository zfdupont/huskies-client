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
