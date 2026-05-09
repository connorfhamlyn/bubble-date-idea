import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { store, CURRENT_USER_ID } from "@/lib/mock";
import type { DatePost } from "@/lib/mock";
import { searchVenues, type Venue } from "@/lib/geocode";
import { MapPin, Loader2, Check } from "lucide-react";

export const Route = createFileRoute("/create")({ component: Create });

const CATEGORIES: DatePost["category"][] = ["Coffee", "Drinks", "Food", "Outdoors", "Culture", "Active"];
const BUDGETS: DatePost["budget"][] = ["$", "$$", "$$$"];

function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [venueQuery, setVenueQuery] = useState("");
  const [venue, setVenue] = useState<Venue | null>(null);
  const [results, setResults] = useState<Venue[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [category, setCategory] = useState<DatePost["category"]>("Coffee");
  const [vibe, setVibe] = useState("");
  const [when, setWhen] = useState("");
  const [budget, setBudget] = useState<DatePost["budget"]>("$$");
  const [description, setDescription] = useState("");

  // Debounced venue search (Nominatim asks for max 1 req/sec)
  useEffect(() => {
    if (venue && venueQuery === venue.name) return;
    if (venueQuery.trim().length < 2) {
      setResults([]);
      setSearchError(null);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      try {
        const r = await searchVenues(venueQuery, ctrl.signal);
        setResults(r);
        if (r.length === 0) setSearchError("No public venues match in Kingston. Try a venue name.");
      } catch (e) {
        if ((e as Error).name !== "AbortError") setSearchError("Couldn't reach venue search. Try again.");
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [venueQuery, venue]);

  function pick(v: Venue) {
    setVenue(v);
    setVenueQuery(v.name);
    setResults([]);
  }

  function publish(e: React.FormEvent) {
    e.preventDefault();
    if (!venue) return;
    const post: DatePost = {
      id: crypto.randomUUID(),
      authorId: CURRENT_USER_ID,
      title,
      venueName: venue.name,
      neighborhood: venue.neighborhood,
      address: venue.address,
      category, vibe, when, budget, description,
      lat: venue.lat,
      lng: venue.lng,
    };
    store.set({ dates: [...store.get().dates, post] });
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-dvh pb-28">
      <TopBar back title="New date idea" />
      <form onSubmit={publish} className="px-5 pt-4 space-y-4">
        <div className="rounded-2xl bg-coral-soft p-4 text-sm">
          <p className="font-semibold">A few rules.</p>
          <ul className="mt-1 list-disc list-inside text-foreground/80 text-xs space-y-0.5">
            <li>Public venues only — homes and addresses are blocked at search.</li>
            <li>Be specific: a real plan beats "let's hang."</li>
          </ul>
        </div>

        <Field label="The idea">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} maxLength={70}
            placeholder="e.g. Slow pour-over + people watching" className={input} />
        </Field>

        <Field label="Venue (Kingston, ON)">
          <div className="relative">
            <input
              required
              value={venueQuery}
              onChange={(e) => { setVenueQuery(e.target.value); setVenue(null); }}
              placeholder="Search a café, bar, park…"
              className={input}
              autoComplete="off"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {searching ? <Loader2 className="w-4 h-4 animate-spin" />
                : venue ? <Check className="w-4 h-4 text-primary" />
                : <MapPin className="w-4 h-4" />}
            </span>
          </div>

          {!venue && results.length > 0 && (
            <ul className="mt-2 bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border max-h-72 overflow-y-auto">
              {results.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => pick(r)}
                    className="w-full text-left px-4 py-3 hover:bg-accent">
                    <p className="font-semibold text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.category} · {r.address}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!venue && searchError && (
            <p className="text-xs text-muted-foreground mt-2">{searchError}</p>
          )}
          {venue && (
            <p className="text-xs text-muted-foreground mt-2">
              📍 {venue.address} · {venue.neighborhood}
            </p>
          )}
          <p className="text-[11px] text-muted-foreground mt-2">
            Powered by OpenStreetMap. Residential addresses are filtered out.
          </p>
        </Field>

        <Field label="Category">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" onClick={() => setCategory(c)}
                className={`px-3 h-9 rounded-full text-sm border ${category === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
                {c}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="When">
            <input required value={when} onChange={(e) => setWhen(e.target.value)} placeholder="Sat afternoon" className={input} />
          </Field>
          <Field label="Budget">
            <div className="flex gap-2">
              {BUDGETS.map((b) => (
                <button key={b} type="button" onClick={() => setBudget(b)}
                  className={`flex-1 h-11 rounded-xl border text-sm font-semibold ${budget === b ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
                  {b}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <Field label="Vibe">
          <input value={vibe} onChange={(e) => setVibe(e.target.value)} placeholder="Quiet, unhurried" className={input} />
        </Field>

        <Field label="Tell people more">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
            placeholder="What does this date look like? What would make it great?"
            className={`${input} h-auto py-3 resize-none`} />
        </Field>

        <button type="submit" disabled={!venue}
          className="pressable w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-bubble disabled:opacity-50">
          {venue ? "Drop the bubble" : "Pick a venue first"}
        </button>
      </form>
      <BottomNav />
    </div>
  );
}

const input = "w-full bg-card border border-input rounded-xl px-4 h-11 text-sm outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
