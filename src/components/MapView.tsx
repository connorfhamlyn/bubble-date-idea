import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import type { DatePost } from "@/lib/mock";
import { getPerson, KINGSTON_CENTER } from "@/lib/mock";

const CATEGORY_COLOR: Record<DatePost["category"], string> = {
  Coffee: "oklch(0.78 0.12 60)",
  Drinks: "oklch(0.68 0.19 25)",
  Food: "oklch(0.78 0.16 40)",
  Outdoors: "oklch(0.72 0.12 160)",
  Culture: "oklch(0.65 0.15 290)",
  Active: "oklch(0.7 0.14 200)",
};

function bubbleIcon(emoji: string, color: string, active: boolean) {
  const size = active ? 60 : 46;
  return L.divIcon({
    className: "plotted-bubble",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      display:grid;place-items:center;font-size:${active ? 26 : 22}px;
      background:${color};border:3px solid white;
      box-shadow:0 8px 24px -8px oklch(0.22 0.04 280 / 0.45);
      transform: translateY(0); transition: transform .15s ease;
    ">${emoji}</div>`,
  });
}

function FlyTo({ to }: { to: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (to) map.flyTo(to, Math.max(map.getZoom(), 16), { duration: 0.6 });
  }, [to, map]);
  return null;
}

export function MapView({
  dates,
  selectedId,
  onSelect,
}: {
  dates: DatePost[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-muted animate-pulse" aria-hidden />;
  }

  const selected = dates.find((d) => d.id === selectedId) ?? null;

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={KINGSTON_CENTER}
        zoom={14}
        scrollWheelZoom
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: "var(--muted)" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {dates.map((d) => {
          const p = getPerson(d.authorId);
          const active = d.id === selectedId;
          return (
            <Marker
              key={d.id}
              position={[d.lat, d.lng]}
              icon={bubbleIcon(p.avatar, CATEGORY_COLOR[d.category], active)}
              zIndexOffset={active ? 1000 : 0}
              eventHandlers={{ click: () => onSelect(d.id) }}
            />
          );
        })}
        <FlyTo to={selected ? [selected.lat, selected.lng] : null} />
      </MapContainer>
    </div>
  );
}

export function DatePreviewCard({ date }: { date: DatePost }) {
  const person = getPerson(date.authorId);
  return (
    <Link
      to="/date/$id"
      params={{ id: date.id }}
      className="block bg-card text-card-foreground rounded-3xl shadow-card p-4 active:scale-[0.99] transition"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-14 h-14 rounded-2xl grid place-items-center text-3xl shrink-0"
          style={{ background: "var(--coral-soft)" }}
        >
          {person.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold">{person.name}</span>
            <span className="text-xs text-muted-foreground">{person.age}</span>
            <span className="ml-auto text-[11px] uppercase tracking-wider text-muted-foreground">
              {date.category}
            </span>
          </div>
          <h3 className="font-display text-lg leading-tight mt-1">{date.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            📍 {date.venueName} · {date.neighborhood} · {date.budget}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{date.when} · {date.vibe}</span>
        <span className="font-semibold text-primary">View →</span>
      </div>
    </Link>
  );
}
