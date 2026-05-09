import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapView, DatePreviewCard } from "@/components/MapView";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { store, useStore } from "@/lib/mock";
import { Search, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const navigate = useNavigate();
  const signedIn = useStore((s) => s.signedIn);
  const dates = useStore((s) => s.dates);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !store.get().signedIn) {
      navigate({ to: "/login" });
    }
  }, [navigate, signedIn]);

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
      </main>
      <BottomNav />
    </div>
  );
}
