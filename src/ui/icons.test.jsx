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
