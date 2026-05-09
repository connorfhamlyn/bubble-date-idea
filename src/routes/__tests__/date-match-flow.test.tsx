import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CURRENT_USER_ID, store } from "@/lib/mock";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: Record<string, unknown>) => ({
    ...options,
    useParams: () => ({ id: "d1" }),
  }),
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

describe("date details route", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    store.reset();
  });

  it("sends an interest and navigates to matches", async () => {
    const user = userEvent.setup();
    const { Route } = await import("../date.$id");

    render(<Route.component />);
    await user.click(screen.getByRole("button", { name: /I'd do this/i }));

    const sent = store
      .get()
      .matches.find((m) => m.dateId === "d1" && m.fromUserId === CURRENT_USER_ID);

    expect(sent).toBeTruthy();
    expect(sent?.status).toBe("interested");
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/matches" });
  });
});
