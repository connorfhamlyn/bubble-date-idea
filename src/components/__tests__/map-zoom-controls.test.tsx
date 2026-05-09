import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { DatePost } from "@/lib/mock";
import { MapView } from "@/components/MapView";

const zoomIn = vi.fn();
const zoomOut = vi.fn();
const flyTo = vi.fn();
const getZoom = vi.fn(() => 14);

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  useMap: () => ({ zoomIn, zoomOut, flyTo, getZoom }),
  useMapEvents: () => null,
}));

const date: DatePost = {
  id: "date-1",
  authorId: "p1",
  title: "Coffee walk",
  category: "Coffee",
  venueName: "Demo Cafe",
  neighborhood: "Downtown",
  when: "Sat 2pm",
  budget: "$$",
  description: "Walk and chat.",
  lat: 44.2312,
  lng: -76.486,
};

describe("map zoom controls", () => {
  it("triggers leaflet zoom actions", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: query.includes("coarse"),
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    );

    render(<MapView dates={[date]} selectedId={null} onSelect={() => {}} />);

    await user.click(await screen.findByRole("button", { name: "Zoom in" }));
    await user.click(screen.getByRole("button", { name: "Zoom out" }));

    expect(zoomIn).toHaveBeenCalledTimes(1);
    expect(zoomOut).toHaveBeenCalledTimes(1);
  });
});
