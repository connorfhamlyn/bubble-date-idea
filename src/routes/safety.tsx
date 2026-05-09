import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Shield, Flag, UserX, Phone, MapPinOff, Eye } from "lucide-react";

export const Route = createFileRoute("/safety")({ component: Safety });

function Safety() {
  const [done, setDone] = useState<"" | "report" | "block">("");

  return (
    <div className="min-h-dvh pb-16">
      <TopBar back title="Safety" />
      <div className="px-5 pt-4 space-y-4">
        <div className="rounded-3xl bg-gradient-warm p-5 shadow-card">
          <Shield className="w-6 h-6" />
          <h2 className="font-display text-2xl font-semibold mt-2">You're in control.</h2>
          <p className="text-sm text-foreground/80 mt-1">Plotted only ever shows public venues — never anyone's home address.</p>
        </div>

        <Section title="Our ground rules">
          <Rule icon={<MapPinOff className="w-4 h-4" />} text="Bubbles are public venues, not live locations." />
          <Rule icon={<Eye className="w-4 h-4" />} text="Photos and chat unlock only after a mutual match." />
          <Rule icon={<Phone className="w-4 h-4" />} text="Tell a friend where you're going. Meet in busy hours." />
        </Section>

        <Section title="Report or block">
          {done === "report" && <Banner text="Report sent. Our team will review within 24h." />}
          {done === "block" && <Banner text="User blocked. They can no longer see you." />}
          <button onClick={() => setDone("report")}
            className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 text-left">
            <span className="w-10 h-10 rounded-xl bg-coral-soft grid place-items-center"><Flag className="w-5 h-5" /></span>
            <span>
              <p className="font-semibold">Report a profile or chat</p>
              <p className="text-xs text-muted-foreground">For harassment, fakes, off-platform asks.</p>
            </span>
          </button>
          <button onClick={() => setDone("block")}
            className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 text-left">
            <span className="w-10 h-10 rounded-xl bg-coral-soft grid place-items-center"><UserX className="w-5 h-5" /></span>
            <span>
              <p className="font-semibold">Block this user</p>
              <p className="text-xs text-muted-foreground">Instant. They won't know.</p>
            </span>
          </button>
        </Section>

        <p className="text-xs text-center text-muted-foreground pt-4">
          In an emergency, call your local emergency number first.
        </p>
        <Link to="/" className="block text-center text-primary font-semibold pt-2">Back to map</Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function Rule({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 flex items-start gap-2 text-sm">
      <span className="w-7 h-7 rounded-lg bg-accent grid place-items-center shrink-0">{icon}</span>
      <span className="pt-1">{text}</span>
    </div>
  );
}
function Banner({ text }: { text: string }) {
  return <div className="bg-sage/30 border border-sage/40 text-foreground rounded-2xl p-3 text-sm">{text}</div>;
}
