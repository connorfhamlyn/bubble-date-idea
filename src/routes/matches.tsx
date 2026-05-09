import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { getPerson, store, useStore, CURRENT_USER_ID } from "@/lib/mock";
import type { MatchRequest } from "@/lib/mock";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/matches")({ component: Matches });

function Matches() {
  const matches = useStore((s) => s.matches);
  const dates = useStore((s) => s.dates);
  const limit = useStore((s) => s.pendingLimit);

  const sent = matches.filter((m) => m.fromUserId === CURRENT_USER_ID);
  const received = matches.filter((m) => m.toUserId === CURRENT_USER_ID);
  const sentPending = sent.filter((m) => m.status === "pending" || m.status === "suggested").length;

  function update(m: MatchRequest, status: MatchRequest["status"]) {
    const next = matches.map((x) => (x.id === m.id ? { ...x, status } : x));
    store.set({ matches: next });
  }
  function withdraw(m: MatchRequest) {
    store.set({ matches: matches.filter((x) => x.id !== m.id) });
  }

  return (
    <div className="min-h-dvh pb-28">
      <TopBar title="Matches" />
      <div className="px-5 pt-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold">Sent</h2>
          <span className="text-xs text-muted-foreground">{sentPending}/{limit} pending</span>
        </div>
        <div className="mt-3 space-y-2">
          {sent.length === 0 && <Empty text="No requests yet. Tap a bubble on the map." />}
          {sent.map((m) => {
            const d = dates.find((x) => x.id === m.dateId);
            const p = d ? getPerson(d.authorId) : null;
            if (!d || !p) return null;
            return (
              <div key={m.id} className="bg-card rounded-2xl p-4 shadow-card border border-border">
                <Row avatar={p.avatar} name={p.name} title={d.title} status={m.status} />
                {m.status === "accepted" ? (
                  <Link to="/chat/$id" params={{ id: m.id }}
                    className="mt-3 block text-center h-10 leading-10 rounded-xl bg-primary text-primary-foreground font-semibold">
                    Open chat
                  </Link>
                ) : (
                  <button onClick={() => withdraw(m)} className="mt-3 w-full h-10 rounded-xl border border-border text-sm font-semibold">
                    Withdraw
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <h2 className="font-display text-xl font-semibold mt-8">Received</h2>
        <div className="mt-3 space-y-2">
          {received.length === 0 && <Empty text="When someone wants your date idea, you'll see it here." />}
          {received.map((m) => {
            const d = dates.find((x) => x.id === m.dateId);
            const p = getPerson(m.fromUserId);
            if (!d) return null;
            return (
              <div key={m.id} className="bg-card rounded-2xl p-4 shadow-card border border-border">
                <Row avatar={p.avatar} name={p.name} title={d.title} status={m.status} />
                {m.note && <p className="text-sm text-foreground/80 mt-2">"{m.note}"</p>}
                {m.suggestion && <p className="text-sm text-foreground/80 mt-2">Suggests: "{m.suggestion}"</p>}
                {m.status === "pending" || m.status === "suggested" ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => update(m, "declined")}
                      className="h-10 rounded-xl border border-border font-semibold text-sm flex items-center justify-center gap-1">
                      <X className="w-4 h-4" /> Decline
                    </button>
                    <button onClick={() => update(m, "accepted")}
                      className="h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-1 shadow-bubble">
                      <Check className="w-4 h-4" /> Accept
                    </button>
                  </div>
                ) : m.status === "accepted" ? (
                  <Link to="/chat/$id" params={{ id: m.id }}
                    className="mt-3 block text-center h-10 leading-10 rounded-xl bg-primary text-primary-foreground font-semibold">
                    Open chat
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8">
          Want to test received requests? Open Profile → "Simulate incoming."
        </p>
      </div>
      <BottomNav />
    </div>
  );
}

function Row({ avatar, name, title, status }: { avatar: string; name: string; title: string; status: string }) {
  const tone =
    status === "accepted" ? "bg-sage/30 text-foreground" :
    status === "declined" ? "bg-muted text-muted-foreground" :
    status === "suggested" ? "bg-sun/40 text-foreground" :
    "bg-coral-soft text-foreground";
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl bg-coral-soft">{avatar}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{title}</p>
      </div>
      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${tone}`}>{status}</span>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-sm text-muted-foreground bg-card border border-dashed border-border rounded-2xl p-5 text-center">{text}</div>;
}
