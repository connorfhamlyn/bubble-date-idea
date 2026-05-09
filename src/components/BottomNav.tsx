import { Link, useLocation } from "@tanstack/react-router";
import { Map, Plus, Heart, MessageCircle, User } from "lucide-react";

const items: { to: string; label: string; icon: typeof Map; accent?: boolean }[] = [
  { to: "/", label: "Map", icon: Map },
  { to: "/matches", label: "Matches", icon: Heart },
  { to: "/create", label: "Post", icon: Plus, accent: true },
  { to: "/inbox", label: "Chats", icon: MessageCircle },
  { to: "/profile", label: "You", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-[1000] border-t border-border bg-background/85 backdrop-blur-xl">
      <ul className="grid grid-cols-5 max-w-md mx-auto px-2 pt-2 safe-bottom">
        {items.map(({ to, label, icon: Icon, accent }) => {
          const active = pathname === to || (to !== "/" && pathname.startsWith(to));
          return (
            <li key={to} className="flex">
              <Link
                to={to as "/"}
                className="relative flex flex-1 flex-col items-center justify-center gap-1 py-1.5 active:scale-95 transition-transform"
                aria-label={label}
                aria-current={active ? "page" : undefined}
              >
                {!accent && (
                  <span
                    aria-hidden
                    className={[
                      "absolute -top-2 h-1 w-8 rounded-full bg-primary transition-opacity",
                      active ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  />
                )}

                <span
                  className={[
                    "grid place-items-center rounded-full transition-all",
                    accent
                      ? "w-12 h-12 -mt-5 bg-primary text-primary-foreground shadow-bubble ring-4 ring-background"
                      : "w-9 h-9",
                    !accent && active ? "bg-accent text-foreground" : "",
                    !accent && !active ? "text-muted-foreground" : "",
                  ].join(" ")}
                >
                  <Icon
                    className={accent ? "w-5 h-5" : "w-[18px] h-[18px]"}
                    strokeWidth={2.2}
                  />
                </span>
                <span
                  className={[
                    "text-[10px] tracking-wide",
                    active ? "text-foreground font-semibold" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
