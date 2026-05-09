import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { store } from "@/lib/mock";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const AVATARS = ["🌿", "🌸", "☕", "📚", "🧗‍♀️", "🎧", "🌮", "🎨", "🌊", "🍷", "🍜", "🎬"];
const VIBES = ["Slow mornings", "Late nights", "Outdoors", "Bookish", "Foodie", "Music", "Active", "Cozy"];
const STEPS = [0, 1, 2] as const;
const fieldClass = "w-full bg-card border border-input rounded-xl px-4 h-12 outline-none focus:ring-2 focus:ring-ring";

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState("🌿");
  const [bio, setBio] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  function finish() {
    store.set({
      signedIn: true,
      profile: {
        id: "me",
        name: name || "You",
        age: Number(age) || 28,
        bio: bio || picked.join(" · "),
        avatar,
        gender: "",
        hometown: "Kingston, ON",
        interests: ["Coffee", "Brunch"],
        openTo: ["Intentional dating"],
        photos: [{ id: "me-p1", url: "https://i.pravatar.cc/600?img=29", soloFace: true, layout: "portrait" }],
        clearFacePhotoId: "me-p1",
        avatarUrl: "https://i.pravatar.cc/600?img=29",
      },
    });
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8">
      <div className="flex gap-1.5 mb-8">
        {STEPS.map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>

      {step === 0 && (
        <div className="flex-1 flex flex-col">
          <h1 className="font-display text-3xl font-semibold">The basics</h1>
          <p className="text-muted-foreground mt-1">Just enough to get started.</p>
          <div className="mt-6 space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First name"
              className={fieldClass} />
            <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" inputMode="numeric"
              className={fieldClass} />
          </div>
          <div className="mt-auto pt-8">
            <button onClick={() => setStep(1)} disabled={!name || !age}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-bubble disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 flex flex-col">
          <h1 className="font-display text-3xl font-semibold">Pick a vibe avatar</h1>
          <p className="text-muted-foreground mt-1">Motif leans into ideas, not selfies.</p>
          <div className="grid grid-cols-4 gap-3 mt-6">
            {AVATARS.map((a) => (
              <button key={a} onClick={() => setAvatar(a)}
                className={`aspect-square rounded-2xl text-3xl grid place-items-center border-2 transition
                  ${avatar === a ? "border-primary bg-coral-soft scale-105" : "border-border bg-card"}`}>
                {a}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">You can add a real photo later, after a match.</p>
          <div className="mt-auto pt-8 flex gap-2">
            <button onClick={() => setStep(0)} className="h-12 px-5 rounded-xl border border-border font-semibold">Back</button>
            <button onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-bubble">
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col">
          <h1 className="font-display text-3xl font-semibold">What's your scene?</h1>
          <p className="text-muted-foreground mt-1">Pick a few — helps people read you fast.</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {VIBES.map((v) => {
              const on = picked.includes(v);
              return (
                <button key={v}
                  onClick={() => setPicked(on ? picked.filter((x) => x !== v) : [...picked, v])}
                  className={`px-4 h-10 rounded-full border text-sm font-medium transition
                    ${on ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
                  {v}
                </button>
              );
            })}
          </div>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
            placeholder="One sentence about you (optional)"
            className={`mt-5 ${fieldClass} h-auto py-3 resize-none`} />
          <div className="mt-auto pt-8 flex gap-2">
            <button onClick={() => setStep(1)} className="h-12 px-5 rounded-xl border border-border font-semibold">Back</button>
            <button onClick={finish} className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-bubble">
              Open the map
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
