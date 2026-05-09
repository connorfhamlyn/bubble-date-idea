import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { store, CURRENT_USER_ID } from "@/lib/mock";
import type { DatePost } from "@/lib/mock";

export const Route = createFileRoute("/create")({ component: Create });

const CATEGORIES: DatePost["category"][] = ["Coffee", "Drinks", "Food", "Outdoors", "Culture", "Active"];
const BUDGETS: DatePost["budget"][] = ["$", "$$", "$$$"];

function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [venueName, setVenueName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [category, setCategory] = useState<DatePost["category"]>("Coffee");
  const [vibe, setVibe] = useState("");
  const [when, setWhen] = useState("");
  const [budget, setBudget] = useState<DatePost["budget"]>("$$");
  const [description, setDescription] = useState("");

  function publish(e: React.FormEvent) {
    e.preventDefault();
    const post: DatePost = {
      id: crypto.randomUUID(),
      authorId: CURRENT_USER_ID,
      title, venueName, neighborhood, category, vibe, when, budget, description,
      x: 30 + Math.random() * 50,
      y: 25 + Math.random() * 55,
    };
    store.set({ dates: [...store.get().dates, post] });
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-dvh pb-28">
      <TopBar back title="New date idea" />
      <form onSubmit={publish} className="px-5 pt-4 space-y-4">
        <div className="rounded-2xl bg-coral-soft p-4 text-sm">
          <p className="font-semibold">A few rules.</p>
          <ul className="mt-1 list-disc list-inside text-foreground/80 text-xs space-y-0.5">
            <li>Public venues only — no homes, no addresses.</li>
            <li>Be specific: a real plan beats "let's hang."</li>
          </ul>
        </div>

        <Field label="The idea">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} maxLength={70}
            placeholder="e.g. Slow pour-over + people watching" className={input} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Venue name">
            <input required value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="Sey Coffee" className={input} />
          </Field>
          <Field label="Neighborhood">
            <input required value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Bushwick" className={input} />
          </Field>
        </div>

        <Field label="Category">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" onClick={() => setCategory(c)}
                className={`px-3 h-9 rounded-full text-sm border ${category === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
                {c}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="When">
            <input required value={when} onChange={(e) => setWhen(e.target.value)} placeholder="Sat afternoon" className={input} />
          </Field>
          <Field label="Budget">
            <div className="flex gap-2">
              {BUDGETS.map((b) => (
                <button key={b} type="button" onClick={() => setBudget(b)}
                  className={`flex-1 h-11 rounded-xl border text-sm font-semibold ${budget === b ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
                  {b}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <Field label="Vibe">
          <input value={vibe} onChange={(e) => setVibe(e.target.value)} placeholder="Quiet, unhurried" className={input} />
        </Field>

        <Field label="Tell people more">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
            placeholder="What does this date look like? What would make it great?"
            className={`${input} h-auto py-3 resize-none`} />
        </Field>

        <button type="submit" className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-bubble">
          Drop the bubble
        </button>
      </form>
      <BottomNav />
    </div>
  );
}

const input = "w-full bg-card border border-input rounded-xl px-4 h-11 text-sm outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
