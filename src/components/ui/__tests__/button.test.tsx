import { describe, it, expect, mock } from "bun:test";
import { render, screen } from "@/__tests__/utils/test-utils.tsx";
import userEvent from "@testing-library/user-event";
import { Button } from "../button.tsx";

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /Click me/i })).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", async () => {
    const handleClick = mock(() => {});
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /Click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant classes correctly", () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("applies size classes correctly", () => {
    const { container } = render(<Button size="lg">Large Button</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("h-11");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button", { name: /Disabled Button/i });
    expect(button).toBeDisabled();
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = mock(() => {});
    const user = userEvent.setup();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole("button", { name: /Disabled Button/i });
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders as child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: /Link Button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });
});
