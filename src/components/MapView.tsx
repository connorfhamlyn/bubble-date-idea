import { Link } from "@tanstack/react-router";
import type { DatePost } from "@/lib/mock";
import { getPerson } from "@/lib/mock";

const CATEGORY_COLOR: Record<DatePost["category"], string> = {
  Coffee: "oklch(0.78 0.12 60)",
  Drinks: "oklch(0.68 0.19 25)",
  Food: "oklch(0.78 0.16 40)",
  Outdoors: "oklch(0.72 0.12 160)",
  Culture: "oklch(0.65 0.15 290)",
  Active: "oklch(0.7 0.14 200)",
};

export function MapView({
  dates,
  selectedId,
  onSelect,
}: {
  dates: DatePost[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="absolute inset-0 bg-map overflow-hidden">
      {/* Stylized "streets" */}
      <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <pattern id="grid" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M 14 0 L 0 0 0 14" fill="none" stroke="white" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <path d="M0 30 Q40 25 100 40" stroke="white" strokeWidth="1.4" fill="none" opacity="0.7" />
        <path d="M20 0 Q30 50 18 100" stroke="white" strokeWidth="1.4" fill="none" opacity="0.6" />
        <path d="M0 75 Q50 70 100 80" stroke="white" strokeWidth="1.4" fill="none" opacity="0.5" />
        <ellipse cx="80" cy="15" rx="18" ry="10" fill="oklch(0.85 0.08 160)" opacity="0.5" />
        <ellipse cx="10" cy="90" rx="14" ry="8" fill="oklch(0.85 0.08 200)" opacity="0.5" />
      </svg>

      {dates.map((d) => {
        const person = getPerson(d.authorId);
        const active = d.id === selectedId;
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              zIndex: active ? 30 : 10,
            }}
            aria-label={`${person.name}'s date: ${d.title}`}
          >
            <span
              className="block rounded-full grid place-items-center text-2xl shadow-bubble border-2 border-white transition-all"
              style={{
                backgroundColor: CATEGORY_COLOR[d.category],
                width: active ? 64 : 48,
                height: active ? 64 : 48,
              }}
            >
              {person.avatar}
            </span>
            {active && (
              <span className="absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[11px] font-semibold bg-foreground text-background px-2 py-0.5 rounded-full">
                {d.venueName}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function DatePreviewCard({ date }: { date: DatePost }) {
  const person = getPerson(date.authorId);
  return (
    <Link
      to="/date/$id"
      params={{ id: date.id }}
      className="block bg-card text-card-foreground rounded-3xl shadow-card p-4 active:scale-[0.99] transition"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-14 h-14 rounded-2xl grid place-items-center text-3xl shrink-0"
          style={{ background: "var(--coral-soft)" }}
        >
          {person.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold">{person.name}</span>
            <span className="text-xs text-muted-foreground">{person.age}</span>
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
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{date.when} · {date.vibe}</span>
        <span className="font-semibold text-primary">View →</span>
      </div>
    </Link>
  );
}
