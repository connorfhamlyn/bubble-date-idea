import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { store, useStore, CURRENT_USER_ID, getPerson } from "@/lib/mock";
import { Shield, Settings, LogOut, Sparkles } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const navigate = useNavigate();
  const profile = useStore((s) => s.profile);
  const dates = useStore((s) => s.dates.filter((d) => d.authorId === CURRENT_USER_ID));
  const matches = useStore((s) => s.matches);

  function simulate() {
    const others = dates;
    const target = others[0] ?? store.get().dates[0];
    if (!target) return;
    store.set({
      matches: [
        ...matches,
        {
          id: crypto.randomUUID(),
          dateId: target.id,
          fromUserId: "u4",
          toUserId: CURRENT_USER_ID,
          status: "pending",
          note: "Yes! I've been wanting to try this.",
          createdAt: Date.now(),
        },
      ],
    });
    navigate({ to: "/matches" });
  }

  function logout() {
    store.reset();
    navigate({ to: "/login" });
  }

  return (
    <div className="min-h-dvh pb-28">
      <TopBar title="You" />
      <div className="px-5 pt-4 space-y-5">
        <div className="rounded-3xl bg-gradient-warm p-6 shadow-card flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-card grid place-items-center text-5xl shadow-bubble">
            {profile.avatar}
          </div>
          <div>
            <p className="font-display text-2xl font-semibold leading-tight">{profile.name}, {profile.age}</p>
            <p className="text-sm text-foreground/80 mt-0.5 max-w-[12rem]">{profile.bio}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat n={dates.length} label="Posted" />
          <Stat n={matches.filter((m) => m.fromUserId === CURRENT_USER_ID).length} label="Sent" />
          <Stat n={matches.filter((m) => m.status === "accepted").length} label="Matched" />
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-2">Your date ideas</h3>
          {dates.length === 0 ? (
            <Link to="/create" className="block bg-card border border-dashed border-border rounded-2xl p-5 text-center text-sm">
              <p className="font-semibold">Drop your first bubble</p>
              <p className="text-muted-foreground text-xs mt-1">Pick a venue and a vibe.</p>
            </Link>
          ) : (
            <div className="space-y-2">
              {dates.map((d) => (
                <Link key={d.id} to="/date/$id" params={{ id: d.id }}
                  className="block bg-card border border-border rounded-2xl p-3">
                  <p className="font-semibold">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.venueName} · {d.when}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <button onClick={simulate} className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 text-left">
            <span className="w-10 h-10 rounded-xl bg-sun/40 grid place-items-center"><Sparkles className="w-5 h-5" /></span>
            <span>
              <p className="font-semibold">Simulate incoming request</p>
              <p className="text-xs text-muted-foreground">Demo only — see the receive flow.</p>
            </span>
          </button>
          <Link to="/safety" className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-coral-soft grid place-items-center"><Shield className="w-5 h-5" /></span>
            <span>
              <p className="font-semibold">Safety, report & block</p>
              <p className="text-xs text-muted-foreground">Ground rules and quick actions.</p>
            </span>
          </Link>
          <button className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 text-left">
            <span className="w-10 h-10 rounded-xl bg-accent grid place-items-center"><Settings className="w-5 h-5" /></span>
            <span>
              <p className="font-semibold">Settings</p>
              <p className="text-xs text-muted-foreground">Notifications, distance, age range.</p>
            </span>
          </button>
          <button onClick={logout} className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 text-left">
            <span className="w-10 h-10 rounded-xl bg-muted grid place-items-center"><LogOut className="w-5 h-5" /></span>
            <span className="font-semibold">Log out & reset prototype</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl py-3">
      <p className="font-display text-2xl font-semibold">{n}</p>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
