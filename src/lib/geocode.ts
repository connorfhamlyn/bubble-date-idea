// Public-venue search using OpenStreetMap Nominatim.
// Restricted to Kingston, Ontario bounding box.
// Filters out residential / house results so no home addresses can be posted.

export type Venue = {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
};

// Rough Kingston bbox: lon_min, lat_min, lon_max, lat_max
const BBOX = "-76.62,44.18,-76.40,44.30";

// OSM "class" values that represent public venues. Anything else is rejected.
const PUBLIC_CLASSES = new Set([
  "amenity", "shop", "tourism", "leisure", "historic", "office", "craft",
]);

// Specific amenity/shop types we always reject even if class passes.
const REJECTED_TYPES = new Set([
  "house", "residential", "apartments", "detached", "dormitory",
  "hostel", "static_caravan", "bungalow", "terrace", "semidetached_house",
]);

type NominatimItem = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  class: string;
  type: string;
  address?: Record<string, string>;
};

function neighborhoodOf(addr?: Record<string, string>): string {
  if (!addr) return "Kingston";
  return (
    addr.neighbourhood ||
    addr.suburb ||
    addr.quarter ||
    addr.city_district ||
    addr.town ||
    addr.village ||
    addr.city ||
    "Kingston"
  );
}

function shortAddress(addr?: Record<string, string>): string {
  if (!addr) return "Kingston, ON";
  const street = [addr.house_number, addr.road].filter(Boolean).join(" ");
  return [street, addr.city || addr.town || "Kingston"].filter(Boolean).join(", ");
}

export async function searchVenues(query: string, signal?: AbortSignal): Promise<Venue[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "10");
  url.searchParams.set("viewbox", BBOX);
  url.searchParams.set("bounded", "1");
  url.searchParams.set("countrycodes", "ca");

  const res = await fetch(url.toString(), {
    signal,
    headers: { "Accept-Language": "en" },
  });
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const items = (await res.json()) as NominatimItem[];

  return items
    .filter((it) => PUBLIC_CLASSES.has(it.class) && !REJECTED_TYPES.has(it.type))
    .filter((it) => Boolean(it.name)) // require a named venue, never raw addresses
    .map((it) => ({
      id: String(it.place_id),
      name: it.name!,
      category: it.type.replace(/_/g, " "),
      neighborhood: neighborhoodOf(it.address),
      address: shortAddress(it.address),
      lat: Number(it.lat),
      lng: Number(it.lon),
    }));
}
