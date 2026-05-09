import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/onboarding" });
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-warm">
      <div className="flex-1 flex flex-col justify-center px-6 py-10">
        <h1 className="font-display text-4xl font-semibold leading-tight">Make an account</h1>
        <p className="text-foreground/70 mt-2 mb-8">Two steps. Then you're plotting.</p>

        <form onSubmit={submit} className="space-y-3 bg-card rounded-3xl p-5 shadow-card">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background border border-input rounded-xl px-4 h-12 outline-none focus:ring-2 focus:ring-ring"
            placeholder="Email"
          />
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-input rounded-xl px-4 h-12 outline-none focus:ring-2 focus:ring-ring"
            placeholder="Password"
          />
          <p className="text-[11px] text-muted-foreground px-1">
            By continuing, you agree to be kind, honest, and to never share home addresses.
          </p>
          <button type="submit" className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-bubble">
            Continue
          </button>
          <p className="text-center text-sm text-muted-foreground pt-1">
            Already have one? <Link to="/login" className="text-primary font-semibold">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
