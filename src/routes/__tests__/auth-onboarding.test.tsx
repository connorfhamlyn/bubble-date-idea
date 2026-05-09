import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { store } from "@/lib/mock";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => options,
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

describe("auth and onboarding routes", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    store.reset();
  });

  it("logs user in and redirects home", async () => {
    const { Route } = await import("../login");
    const user = userEvent.setup();

    render(<Route.component />);
    await user.type(screen.getByPlaceholderText("you@domain.com"), "test@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "secret");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(store.get().signedIn).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
  });

  it("routes signup submit to onboarding", async () => {
    const { Route } = await import("../signup");
    const user = userEvent.setup();

    render(<Route.component />);
    await user.type(screen.getByPlaceholderText("Email"), "new@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "secret");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/onboarding" });
  });

  it("completes onboarding and writes profile defaults", async () => {
    const { Route } = await import("../onboarding");
    const user = userEvent.setup();

    render(<Route.component />);
    await user.type(screen.getByPlaceholderText("First name"), "Casey");
    await user.type(screen.getByPlaceholderText("Age"), "30");
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Open the map" }));

    expect(store.get().signedIn).toBe(true);
    expect(store.get().profile.name).toBe("Casey");
    expect(store.get().profile.age).toBe(30);
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
  });
});
