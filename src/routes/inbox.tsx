import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { useStore, CURRENT_USER_ID, getPerson } from "@/lib/mock";

export const Route = createFileRoute("/inbox")({ component: Inbox });

function Inbox() {
  const matches = useStore((s) => s.matches);
  const dates = useStore((s) => s.dates);
  const messages = useStore((s) => s.messages);
  const openChats = matches.filter((m) => m.status === "chat_opened");

  return (
    <div className="min-h-dvh pb-28">
      <TopBar title="Chats" />
      <div className="px-5 pt-4 space-y-2">
        {openChats.length === 0 && (
          <div className="bg-card border border-dashed border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">No chats yet.</p>
            <p className="mt-1">Chat opens when someone chooses “Start chat” from plan responses.</p>
          </div>
        )}
        {openChats.map((m) => {
          const d = dates.find((x) => x.id === m.dateId);
          const otherId = m.fromUserId === CURRENT_USER_ID ? m.toUserId : m.fromUserId;
          const p = getPerson(otherId);
          const last = [...messages].reverse().find((x) => x.matchId === m.id);
          if (!d) return null;
          return (
            <Link key={m.id} to="/chat/$id" params={{ id: m.id }}
              className="flex items-center gap-3 bg-card rounded-2xl p-3 border border-border">
              <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl bg-coral-soft">{p.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{p.name} · <span className="text-muted-foreground font-normal text-xs">{d.title}</span></p>
                <p className="text-xs text-muted-foreground truncate">{last ? last.text : "Say hi 👋"}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}
