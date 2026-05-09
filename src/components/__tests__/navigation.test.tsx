import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

let pathname = "/";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname }),
}));

describe("navigation components", () => {
  it("shows brand on top bar when not in back mode", async () => {
    const { TopBar } = await import("../TopBar");
    render(<TopBar />);
    expect(screen.getByText(/Motif/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Back")).not.toBeInTheDocument();
  });

  it("shows back control when top bar back is enabled", async () => {
    const { TopBar } = await import("../TopBar");
    render(<TopBar back title="Details" />);
    expect(screen.getByLabelText("Back")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("marks current bottom nav item as active", async () => {
    pathname = "/matches";
    const { BottomNav } = await import("../BottomNav");
    render(<BottomNav />);

    expect(screen.getByLabelText("Matches")).toHaveAttribute("aria-current", "page");
    expect(screen.getByLabelText("Map")).not.toHaveAttribute("aria-current");
  });
});
