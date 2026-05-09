import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { store } from "@/lib/mock";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    store.set({ signedIn: true });
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-warm">
      <div className="flex-1 flex flex-col justify-center px-6 py-10">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Motif</p>
          <h1 className="font-display text-5xl font-semibold leading-[0.95] mt-2">
            Date ideas,<br/>on the map.
          </h1>
          <p className="mt-3 text-foreground/70 max-w-xs">
            Skip the small talk. Connect on a real plan, at a real place.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3 bg-card rounded-3xl p-5 shadow-card">
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">Email</span>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-background border border-input rounded-xl px-4 h-12 outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@domain.com"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">Password</span>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-background border border-input rounded-xl px-4 h-12 outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className="pressable w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-bubble">
            Log in
          </button>
          <p className="text-center text-sm text-muted-foreground pt-1">
            New here? <Link to="/signup" className="text-primary font-semibold">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
