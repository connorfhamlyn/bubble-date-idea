import type { DatePost } from "@/lib/mock";
import { CURRENT_USER_ID, getPerson, store, useStore } from "@/lib/mock";
import { useEffect, useMemo, useState } from "react";

export function DatePreviewCard({
  date,
  onDismiss,
  onOpenProfile,
}: {
  date: DatePost;
  onDismiss?: () => void;
  onOpenProfile?: (personId: string) => void;
}) {
  const person = getPerson(date.authorId);
  const matches = useStore((s) => s.matches);
  const [sentPulse, setSentPulse] = useState(false);

  const existing = useMemo(
    () =>
      matches.find(
        (m) =>
          m.dateId === date.id &&
          ((m.fromUserId === CURRENT_USER_ID && m.toUserId === date.authorId) ||
            (m.fromUserId === date.authorId && m.toUserId === CURRENT_USER_ID)),
      ),
    [matches, date.id, date.authorId],
  );

  const isOwnPost = date.authorId === CURRENT_USER_ID;
  const requestSent = !!existing && existing.status !== "closed";
  const mutualInterest = existing?.status === "chat_opened";

  useEffect(() => {
    if (!sentPulse) return;
    const timer = window.setTimeout(() => setSentPulse(false), 650);
    return () => window.clearTimeout(timer);
  }, [sentPulse]);

  function sendInterest() {
    if (isOwnPost || requestSent) return;
    const next = [
      ...store.get().matches,
      {
        id: crypto.randomUUID(),
        dateId: date.id,
        fromUserId: CURRENT_USER_ID,
        toUserId: date.authorId,
        status: "pending" as const,
        createdAt: Date.now(),
      },
    ];
    store.set({ matches: next });
    setSentPulse(true);
  }

  return (
    <div className="bg-card text-card-foreground rounded-3xl shadow-card overflow-hidden">
      <div className="px-4 pt-4 pb-3 max-h-[40vh] overflow-y-auto space-y-3">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onOpenProfile?.(person.id)}
            className="w-14 h-14 rounded-2xl grid place-items-center text-3xl shrink-0"
            style={{ background: "var(--coral-soft)" }}
            aria-label={`Open ${person.name}'s profile`}
          >
            {person.avatarUrl ? (
              <img src={person.avatarUrl} alt="" loading="lazy" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              person.avatar
            )}
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <button
                type="button"
                onClick={() => onOpenProfile?.(person.id)}
                className="font-semibold hover:underline text-left"
              >
                {person.name}, {person.age}
              </button>
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
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{date.when} · {date.vibe}</span>
          <span className="font-semibold text-primary">{date.budget}</span>
        </div>

        {mutualInterest && (
          <div className="rounded-2xl bg-accent/65 px-3 py-2 text-sm">
            <p className="font-semibold">You're both into this plan</p>
            <p className="text-xs text-muted-foreground">{person.name} is interested too.</p>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 pt-3 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 flex items-center gap-2">
        <button
          type="button"
          onClick={sendInterest}
          disabled={isOwnPost || requestSent}
          className={[
            "pressable h-12 flex-1 rounded-2xl font-semibold transition-all",
            requestSent
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-primary text-primary-foreground shadow-bubble",
            sentPulse ? "scale-[1.02] ring-2 ring-primary/25" : "",
            isOwnPost ? "opacity-60 cursor-not-allowed" : "",
          ].join(" ")}
        >
          {isOwnPost ? "Your plan" : requestSent ? "Request sent" : "I'd do this"}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="pressable h-12 px-4 rounded-2xl border border-border text-sm text-muted-foreground hover:text-foreground"
        >
          Not for me
        </button>
      </div>
    </div>
  );
}
