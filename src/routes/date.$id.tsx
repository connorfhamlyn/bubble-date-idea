import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { getPerson, store, useStore, CURRENT_USER_ID } from "@/lib/mock";
import type { MatchRequest } from "@/lib/mock";
import { Heart, X, Flag, MapPin, Clock, Sparkles, DollarSign } from "lucide-react";

export const Route = createFileRoute("/date/$id")({ component: DateDetails });

function DateDetails() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const date = useStore((s) => s.dates.find((d) => d.id === id));
  const matches = useStore((s) => s.matches);
  const pendingCount = matches.filter((m) => m.fromUserId === CURRENT_USER_ID && m.status === "interested").length;
  const limit = useStore((s) => s.pendingLimit);
  const existing = matches.find((m) => m.dateId === id && m.fromUserId === CURRENT_USER_ID);
  const [note, setNote] = useState("");

  if (!date) {
    return (
      <div className="min-h-dvh grid place-items-center p-6 text-center">
        <div>
          <p className="text-muted-foreground">Date not found.</p>
          <Link to="/" className="text-primary font-semibold mt-2 inline-block">Back to map</Link>
        </div>
      </div>
    );
  }

  const person = getPerson(date.authorId);
  const atLimit = pendingCount >= limit && !existing;

  function send() {
    const req: MatchRequest = {
      id: crypto.randomUUID(),
      dateId: date.id,
      fromUserId: CURRENT_USER_ID,
      toUserId: date.authorId,
      status: "interested",
      note: note.trim() || undefined,
      createdAt: Date.now(),
    };
    const all = store.get().matches.filter((m) => !(m.dateId === date.id && m.fromUserId === CURRENT_USER_ID));
    store.set({ matches: [...all, req] });
    navigate({ to: "/matches" });
  }

  return (
    <div className="min-h-dvh pb-40 bg-background">
      <TopBar
        back
        right={
          <Link
            to="/safety"
            className="h-10 w-10 grid place-items-center rounded-full hover:bg-accent active:bg-accent/80 active:scale-95 transition-transform"
            aria-label="Report"
          >
            <Flag className="w-5 h-5" />
          </Link>
        }
      />

      {/* Hero */}
      <div className="px-5 pt-2">
        <div className="rounded-3xl bg-gradient-warm p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-card grid place-items-center text-4xl shadow-bubble">
              {person.avatar}
            </div>
            <div>
              <p className="font-semibold text-lg">{person.name}, {person.age}</p>
              <p className="text-sm text-foreground/70">{person.pronouns}</p>
            </div>
          </div>
          <h1 className="font-display text-3xl font-semibold leading-tight mt-5">{date.title}</h1>
          <p className="text-foreground/80 mt-2">{date.description}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="px-5 mt-5 grid grid-cols-2 gap-3 text-sm">
        <Meta icon={<MapPin className="w-4 h-4" />} label="Venue" value={`${date.venueName}, ${date.neighborhood}`} />
        <Meta icon={<Clock className="w-4 h-4" />} label="When" value={date.when} />
        <Meta icon={<Sparkles className="w-4 h-4" />} label="Vibe" value={date.vibe} />
        <Meta icon={<DollarSign className="w-4 h-4" />} label="Budget" value={date.budget} />
      </div>

      <div className="px-5 mt-5">
        <p className="text-xs text-muted-foreground">
          About {person.name}: {person.bio}
        </p>
      </div>

      {existing && (
        <div className="mx-5 mt-6 rounded-2xl bg-accent text-accent-foreground p-4 text-sm">
          Interest sent. Track updates in <Link to="/matches" className="font-semibold underline">Matches</Link>.
        </div>
      )}

      {/* Actions */}
      {!existing && (
        <div className="fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur-xl border-t border-border safe-bottom px-4 pt-3">
          <div className="max-w-md mx-auto">
            {atLimit && (
              <p className="text-xs text-center text-destructive mb-2">
                You've hit {limit} active interests. Close one in Matches to send another.
              </p>
            )}
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`Optional note to ${person.name}`}
              className="w-full bg-card border border-input rounded-xl px-4 h-11 text-sm outline-none focus:ring-2 focus:ring-ring mb-2"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate({ to: "/" })}
                className="h-12 rounded-xl border border-border font-semibold flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" /> Not for me
              </button>
              <button
                disabled={atLimit}
                onClick={send}
                className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-bubble disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-current" /> I'd do this
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl p-3 border border-border">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] uppercase tracking-wider">
        {icon} {label}
      </div>
      <p className="font-medium mt-1 text-sm">{value}</p>
    </div>
  );
}
