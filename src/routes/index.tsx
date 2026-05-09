import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapView, DatePreviewCard } from "@/components/MapView";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { store, useStore } from "@/lib/mock";
import { Search, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const signedIn = useStore((s) => s.signedIn);
  const dates = useStore((s) => s.dates);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedDate = dates.find((d) => d.id === selected) ?? null;

  return (
    <div className="min-h-dvh flex flex-col">
      <TopBar
        right={
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-full hover:bg-accent" aria-label="Search"><Search className="w-5 h-5" /></button>
            <button className="p-2 rounded-full hover:bg-accent" aria-label="Filters"><SlidersHorizontal className="w-5 h-5" /></button>
          </div>
        }
      />
      <main className="relative flex-1">
        <MapView dates={dates} selectedId={selected} onSelect={setSelected} />

        {/* Floating helper */}
        {!selectedDate && (
          <div className="absolute top-4 inset-x-4 bg-card/95 backdrop-blur rounded-2xl shadow-card px-4 py-3 text-sm">
            <p className="font-semibold">Tap a bubble to preview a date idea.</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Bubbles show public venues — never anyone's home.
            </p>
          </div>
        )}

        {/* Preview drawer */}
        {selectedDate && (
          <div className="absolute inset-x-3 bottom-24 animate-in slide-in-from-bottom-4 fade-in">
            <DatePreviewCard date={selectedDate} />
          </div>
        )}

        {!signedIn && (
          <div className="absolute inset-0 z-20">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
            <div className="absolute inset-0 grid place-items-center px-5">
              <div className="w-full max-w-sm rounded-3xl bg-card/95 backdrop-blur border border-border shadow-card p-6 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Plotted</p>
                <h2 className="font-display text-3xl font-semibold leading-tight mt-2">
                  Date ideas, on the map.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Log in to post, match, and chat.
                </p>

                <div className="mt-5 grid gap-2">
                  <Link
                    to="/login"
                    className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold grid place-items-center shadow-bubble"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="h-12 rounded-xl border border-border font-semibold grid place-items-center"
                  >
                    Sign up
                  </Link>
                  <button
                    type="button"
                    onClick={() => store.set({ signedIn: true })}
                    className="h-12 rounded-xl bg-accent font-semibold"
                  >
                    Continue in Demo Mode
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
