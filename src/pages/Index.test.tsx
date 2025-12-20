import { describe, it, expect } from "bun:test";
import { render, screen } from "@/__tests__/utils/test-utils";
import Index from "./Index";

describe("Index Page", () => {
  it("renders the main heading", () => {
    render(<Index />);
    const heading = screen.getByRole("heading", { name: /React Frontend Template/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<Index />);
    expect(
      screen.getByText(/A modern, production-ready React template/i)
    ).toBeInTheDocument();
  });

  it("has the correct layout structure", () => {
    const { container } = render(<Index />);
    const mainContainer = container.querySelector(".min-h-screen");
    expect(mainContainer).toBeInTheDocument();
  });
});
