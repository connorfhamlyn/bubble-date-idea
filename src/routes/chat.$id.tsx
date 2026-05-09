import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { store, useStore, CURRENT_USER_ID, getPerson } from "@/lib/mock";
import { Send, Flag, MapPin } from "lucide-react";

export const Route = createFileRoute("/chat/$id")({ component: Chat });

function Chat() {
  const { id } = Route.useParams();
  const match = useStore((s) => s.matches.find((m) => m.id === id));
  const date = useStore((s) => (match ? s.dates.find((d) => d.id === match.dateId) : undefined));
  const messages = useStore((s) => s.messages.filter((m) => m.matchId === id));
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  if (!match || !date) {
    return <div className="p-6 text-center text-muted-foreground">Chat not found. <Link to="/matches" className="text-primary">Back</Link></div>;
  }

  if (match.status !== "chat_opened") {
    return (
      <div className="min-h-dvh flex flex-col">
        <TopBar back title="Chat locked" />
        <div className="flex-1 grid place-items-center p-6 text-center">
          <div>
            <div className="text-5xl">🔒</div>
            <p className="font-semibold mt-3">Chat opens once someone starts planning.</p>
            <p className="text-sm text-muted-foreground mt-1">Keep it on Motif until then.</p>
          </div>
        </div>
      </div>
    );
  }

  const otherId = match.fromUserId === CURRENT_USER_ID ? match.toUserId : match.fromUserId;
  const other = getPerson(otherId);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    store.set({
      messages: [
        ...store.get().messages,
        { id: crypto.randomUUID(), matchId: id, fromUserId: CURRENT_USER_ID, text: text.trim(), at: Date.now() },
      ],
    });
    setText("");
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 px-3 h-14">
          <Link to="/inbox" className="p-2 -ml-2">←</Link>
          <div className="w-9 h-9 rounded-xl grid place-items-center text-xl bg-coral-soft">{other.avatar}</div>
          <div className="min-w-0">
            <p className="font-semibold leading-tight">{other.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{date.venueName} · {date.when}</p>
          </div>
          <Link to="/safety" className="ml-auto p-2 rounded-full hover:bg-accent" aria-label="Safety">
            <Flag className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        <div className="mx-auto max-w-xs bg-coral-soft rounded-2xl p-3 text-center text-xs">
          <MapPin className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
          You matched on <span className="font-semibold">{date.title}</span> at {date.venueName}.
        </div>
        {messages.map((m) => {
          const mine = m.fromUserId === CURRENT_USER_ID;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm ${mine ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border rounded-bl-md"}`}>
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="border-t border-border bg-background px-3 py-2 safe-bottom flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Message"
          enterKeyHint="send"
          className="flex-1 bg-card border border-input rounded-full px-4 h-11 text-sm outline-none focus:ring-2 focus:ring-ring" />
        <button
          className="pressable w-11 h-11 grid place-items-center rounded-full bg-primary text-primary-foreground shadow-bubble disabled:opacity-50"
          aria-label="Send"
          disabled={!text.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
