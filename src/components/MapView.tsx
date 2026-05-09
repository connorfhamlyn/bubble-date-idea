import { memo, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
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

function bubbleIcon(emoji: string, avatarUrl: string | undefined, color: string, active: boolean) {
  const size = active ? 60 : 46;
  const inner = avatarUrl
    ? `<img src="${avatarUrl}" alt="" loading="lazy" style="
        width:100%;height:100%;border-radius:9999px;object-fit:cover;display:block;
      " />`
    : `<span aria-hidden="true">${emoji}</span>`;
  return L.divIcon({
    className: "plotted-bubble",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      display:grid;place-items:center;font-size:${active ? 26 : 22}px;overflow:hidden;
      background:${color};border:3px solid white;
      box-shadow:0 8px 24px -8px oklch(0.22 0.04 280 / 0.45);
      transform: translateY(0); transition: transform .15s ease;
    ">${inner}</div>`,
  });
}

function selectedPinIcon() {
  return L.divIcon({
    className: "plotted-selected-pin",
    iconSize: [36, 48],
    iconAnchor: [18, 46],
    popupAnchor: [0, -42],
    html: `<div style="
      width:36px;height:36px;background:#ea4335;border-radius:50% 50% 50% 0;
      transform: rotate(-45deg); position: relative;
      box-shadow:0 8px 24px -8px oklch(0.22 0.04 280 / 0.45);
      border:2px solid white;
    ">
      <div style="
        position:absolute;left:50%;top:50%;
        width:12px;height:12px;border-radius:9999px;background:white;
        transform:translate(-50%,-50%) rotate(45deg);
      "></div>
    </div>`,
  });
}
const SELECTED_PIN_ICON = selectedPinIcon();

const iconCache = new Map<string, L.DivIcon>();
function getCachedBubbleIcon(emoji: string, avatarUrl: string | undefined, color: string, active: boolean) {
  const key = `${emoji}|${avatarUrl ?? "none"}|${color}|${active ? 1 : 0}`;
  const cached = iconCache.get(key);
  if (cached) return cached;

  const created = bubbleIcon(emoji, avatarUrl, color, active);
  iconCache.set(key, created);
  return created;
}

function FlyTo({ to }: { to: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!to) return;
    const zoom = Math.max(map.getZoom(), 16);
    const markerPoint = map.project(L.latLng(to[0], to[1]), zoom);
    // Place pin slightly below center so the centered card can sit above it.
    const adaptiveShift = Math.round(Math.min(180, Math.max(120, map.getSize().y * 0.18)));
    const shiftedCenter = map.unproject(markerPoint.subtract([0, adaptiveShift]), zoom);
    map.flyTo(shiftedCenter, zoom, { duration: 0.6 });
  }, [to, map]);
  return null;
}

function MapClickClear({ onClear }: { onClear: () => void }) {
  useMapEvents({
    click: () => onClear(),
  });
  return null;
}

function MapZoomButtons() {
  const map = useMap();
  return (
    <div className="plotted-map-zoom" role="group" aria-label="Map zoom controls">
      <button
        type="button"
        className="plotted-map-zoom-btn"
        aria-label="Zoom in"
        onClick={() => map.zoomIn()}
      >
        +
      </button>
      <button
        type="button"
        className="plotted-map-zoom-btn"
        aria-label="Zoom out"
        onClick={() => map.zoomOut()}
      >
        -
      </button>
    </div>
  );
}

const DateMarker = memo(function DateMarker({
  date,
  active,
  onToggle,
}: {
  date: DatePost;
  active: boolean;
  onToggle: (id: string, active: boolean) => void;
}) {
  const person = useMemo(() => getPerson(date.authorId), [date.authorId]);
  const icon = useMemo(
    () => (active ? SELECTED_PIN_ICON : getCachedBubbleIcon(person.avatar, person.avatarUrl, CATEGORY_COLOR[date.category], false)),
    [active, person.avatar, person.avatarUrl, date.category],
  );

  return (
    <Marker
      position={[date.lat, date.lng]}
      icon={icon}
      zIndexOffset={active ? 1000 : 0}
      eventHandlers={{
        click: (event) => {
          if (event.originalEvent) L.DomEvent.stopPropagation(event.originalEvent);
          onToggle(date.id, active);
        },
      }}
    />
  );
});

export function MapView({
  dates,
  selectedId,
  onSelect,
}: {
  dates: DatePost[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const sync = () => setIsTouchDevice(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  if (!mounted) {
    return (
      <div
        className="absolute inset-0 bg-map grid place-items-center"
        role="status"
        aria-label="Loading map"
      >
        <div className="flex items-center gap-1.5 rounded-full bg-card/80 backdrop-blur px-3 py-2 shadow-card">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.2s]" />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.1s]" />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
          <span className="text-xs text-muted-foreground ml-1">Loading map…</span>
        </div>
      </div>
    );
  }

  const selected = dates.find((d) => d.id === selectedId) ?? null;

  return (
    <div className="absolute inset-0">
      <MapContainer
        className="plotted-map"
        center={KINGSTON_CENTER}
        zoom={14}
        scrollWheelZoom={!isTouchDevice}
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: "var(--muted)" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapZoomButtons />
        {dates.map((d) => {
          const active = d.id === selectedId;
          return (
            <DateMarker
              key={d.id}
              date={d}
              active={active}
              onToggle={(id, isActive) => onSelect(isActive ? null : id)}
            />
          );
        })}
        <MapClickClear onClear={() => onSelect(null)} />
        <FlyTo to={selected ? [selected.lat, selected.lng] : null} />
      </MapContainer>
    </div>
  );
}
