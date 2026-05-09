import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { DatePreviewCard } from "@/components/DatePreviewCard";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { getPerson, store, useStore } from "@/lib/mock";
import { Search, SlidersHorizontal, X, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });
const LazyMapView = lazy(() => import("@/components/MapView").then((module) => ({ default: module.MapView })));

function Index() {
  const signedIn = useStore((s) => s.signedIn);
  const dates = useStore((s) => s.dates);
  const [selected, setSelected] = useState<string | null>(null);
  const [openedProfileId, setOpenedProfileId] = useState<string | null>(null);
  const showAuthGate = !signedIn && !import.meta.env.DEV;
  const [tipDismissed, setTipDismissed] = useState(false);

  const selectedDate = dates.find((d) => d.id === selected) ?? null;

  return (
    <div className="min-h-dvh flex flex-col">
      <TopBar
        right={
          <div className="flex items-center gap-1">
            <button
              className="h-10 w-10 grid place-items-center rounded-full hover:bg-accent active:bg-accent/80 active:scale-95 transition-transform"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="h-10 w-10 grid place-items-center rounded-full hover:bg-accent active:bg-accent/80 active:scale-95 transition-transform"
              aria-label="Filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        }
      />
      <main className="relative flex-1">
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-map grid place-items-center" role="status" aria-label="Loading map">
              <div className="flex items-center gap-1.5 rounded-full bg-card/80 backdrop-blur px-3 py-2 shadow-card">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.2s]" />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.1s]" />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <span className="text-xs text-muted-foreground ml-1">Loading map…</span>
              </div>
            </div>
          }
        >
          <LazyMapView dates={dates} selectedId={selected} onSelect={setSelected} />
        </Suspense>

        {!selectedDate && !tipDismissed && (
          <div className="absolute top-3 inset-x-3 bg-card/95 backdrop-blur rounded-2xl shadow-card pl-4 pr-2 py-3 text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold">Tap a bubble to preview a date idea.</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Bubbles show public venues — never anyone's home.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTipDismissed(true)}
              className="pressable shrink-0 h-8 w-8 grid place-items-center rounded-full text-muted-foreground hover:bg-accent active:bg-accent/80"
              aria-label="Dismiss tip"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {selectedDate && (
          <div className="absolute inset-x-3 top-[calc(4.75rem+env(safe-area-inset-top))] bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-[1200] grid place-items-center pointer-events-none">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 pointer-events-auto">
              <DatePreviewCard
                date={selectedDate}
                onDismiss={() => setSelected(null)}
                onOpenProfile={(personId) => setOpenedProfileId(personId)}
              />
            </div>
          </div>
        )}

        {openedProfileId && (
          <ProfileOverlay personId={openedProfileId} onClose={() => setOpenedProfileId(null)} />
        )}

        {showAuthGate && (
          <div className="absolute inset-0 z-20">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
            <div className="absolute inset-0 grid place-items-center px-5">
              <div className="w-full max-w-sm rounded-3xl bg-card/95 backdrop-blur border border-border shadow-card p-6 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Motif</p>
                <h2 className="font-display text-3xl font-semibold leading-tight mt-2">
                  Date ideas, on the map.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Log in to post, match, and chat.
                </p>

                <div className="mt-5 grid gap-2">
                  <Link
                    to="/login"
                    className="pressable h-12 rounded-xl bg-primary text-primary-foreground font-semibold grid place-items-center shadow-bubble"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="pressable h-12 rounded-xl border border-border font-semibold grid place-items-center"
                  >
                    Sign up
                  </Link>
                  <button
                    type="button"
                    onClick={() => store.set({ signedIn: true })}
                    className="pressable h-12 rounded-xl bg-accent font-semibold"
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

function ProfileOverlay({ personId, onClose }: { personId: string; onClose: () => void }) {
  const person = getPerson(personId);
  const clearFace = person.photos.find((p) => p.id === person.clearFacePhotoId) ?? person.photos[0];
  const slides = [clearFace, ...person.photos.filter((p) => p.id !== clearFace?.id)].slice(0, 10);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const sliverSizeRem = 2.25;
  const touchStartXRef = useRef<number | null>(null);
  const wheelGestureActiveRef = useRef(false);
  const wheelGestureTimerRef = useRef<number | null>(null);
  useEffect(() => {
    setActivePhotoIndex(0);
  }, [personId]);
  const activeSlide = slides[activePhotoIndex];
  const prevSlide = slides[activePhotoIndex - 1] ?? null;
  const nextSlide = slides[activePhotoIndex + 1] ?? null;

  function moveBy(delta: number) {
    setActivePhotoIndex((current) => Math.max(0, Math.min(slides.length - 1, current + delta)));
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartXRef.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = touchStartXRef.current - endX;
    const threshold = 24;
    if (Math.abs(deltaX) > threshold) {
      moveBy(deltaX > 0 ? 1 : -1);
    }
    touchStartXRef.current = null;
  }

  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 8) return;
    e.preventDefault();

    if (!wheelGestureActiveRef.current) {
      wheelGestureActiveRef.current = true;
      moveBy(delta > 0 ? 1 : -1);
    }

    if (wheelGestureTimerRef.current) window.clearTimeout(wheelGestureTimerRef.current);
    wheelGestureTimerRef.current = window.setTimeout(() => {
      wheelGestureActiveRef.current = false;
    }, 140);
  }

  return (
    <div className="absolute inset-x-0 top-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-[1400] bg-background/75 backdrop-blur-sm">
      <div className="absolute inset-0">
        <div className="h-full bg-background rounded-t-3xl border-t border-border overflow-y-auto no-scrollbar">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 h-14 flex items-center gap-2">
            <button type="button" onClick={onClose} className="w-10 h-10 rounded-full grid place-items-center hover:bg-accent" aria-label="Back to map">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <p className="font-semibold">{person.name}'s profile</p>
          </div>
          <div className="px-4 py-3 space-y-3 pb-6">
            {slides.length > 0 && (
              <section className="relative">
                <div className="w-full overflow-hidden">
                  <div
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onWheel={handleWheel}
                    className="relative h-[16.25rem] pb-3 overflow-hidden"
                  >
                    {activeSlide && (
                      <img
                        key={activeSlide.id}
                        src={activeSlide.url}
                        alt={`${person.name} photo ${activePhotoIndex + 1}`}
                        className="absolute left-1/2 -translate-x-1/2 w-52 aspect-[4/5] object-cover rounded-3xl shadow-card transition-all duration-300 ease-out"
                      />
                    )}
                    {prevSlide && (
                      <img
                        key={prevSlide.id}
                        src={prevSlide.url}
                        alt={`${person.name} photo ${activePhotoIndex}`}
                        className="absolute w-52 aspect-[4/5] object-cover rounded-3xl shadow-card opacity-95 transition-all duration-300 ease-out"
                        style={{ right: `calc(100% - ${sliverSizeRem}rem)` }}
                      />
                    )}
                    {nextSlide && (
                      <img
                        key={nextSlide.id}
                        src={nextSlide.url}
                        alt={`${person.name} photo ${activePhotoIndex + 2}`}
                        className="absolute w-52 aspect-[4/5] object-cover rounded-3xl shadow-card opacity-95 transition-all duration-300 ease-out"
                        style={{ left: `calc(100% - ${sliverSizeRem}rem)` }}
                      />
                    )}
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5 pointer-events-none" aria-hidden="true">
                  {Array.from({ length: slides.length }, (_, idx) => (
                    <span
                      key={`dot-${idx + 1}`}
                      className={[
                        "h-1.5 rounded-full transition-all duration-250 ease-out backdrop-blur-sm",
                        idx === activePhotoIndex
                          ? "w-4 bg-background/95 scale-100"
                          : "w-1.5 bg-background/60 scale-90",
                      ].join(" ")}
                    />
                  ))}
                </div>
              </section>
            )}
            <section className="bg-card rounded-3xl border border-border p-4">
              <h2 className="font-display text-3xl font-semibold leading-tight">{person.name}, {person.age}</h2>
              <p className="text-sm text-muted-foreground mt-1">{[person.gender, person.hometown].filter(Boolean).join(" · ")}</p>
              <p className="mt-3 text-[15px] leading-relaxed">{person.bio}</p>
            </section>
            <section className="bg-card rounded-3xl border border-border p-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Interests</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {person.interests.map((interest) => (
                  <span key={interest} className="px-3 py-1.5 rounded-full bg-accent text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </section>
            <section className="bg-card rounded-3xl border border-border p-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Open to</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {person.openTo.map((intent) => (
                  <span key={intent} className="px-3 py-1.5 rounded-full bg-coral-soft text-sm">
                    {intent}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
