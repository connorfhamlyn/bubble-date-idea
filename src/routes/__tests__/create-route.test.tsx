import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { store } from "@/lib/mock";

const mockNavigate = vi.fn();
const mockSearchVenues = vi.fn();

vi.mock("@/lib/geocode", () => ({
  searchVenues: (...args: unknown[]) => mockSearchVenues(...args),
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => options,
  useNavigate: () => mockNavigate,
}));

describe("create route", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockReset();
    mockSearchVenues.mockReset();
    store.reset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("searches venues, allows selecting one, and publishes a date", async () => {
    mockSearchVenues.mockResolvedValue([
      {
        id: "v1",
        name: "Demo Cafe",
        category: "cafe",
        address: "1 Princess St",
        neighborhood: "Downtown",
        lat: 44.23,
        lng: -76.48,
      },
    ]);

    const { Route } = await import("../create");
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Route.component />);

    await user.type(screen.getByPlaceholderText("e.g. Slow pour-over + people watching"), "Test date");
    await user.type(screen.getByPlaceholderText("Search a café, bar, park…"), "Demo");

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    await waitFor(() => expect(mockSearchVenues).toHaveBeenCalled());
    await user.click(screen.getByText("Demo Cafe"));
    await user.type(screen.getByPlaceholderText("Sat afternoon"), "Sat noon");
    await user.click(screen.getByRole("button", { name: "Drop the bubble" }));

    const latest = store.get().dates.at(-1);
    expect(latest?.title).toBe("Test date");
    expect(latest?.venueName).toBe("Demo Cafe");
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
  });
});
