import { Link, useLocation } from "@tanstack/react-router";
import { Map, Plus, Heart, MessageCircle, User } from "lucide-react";

const items = [
  { to: "/", label: "Map", icon: Map },
  { to: "/matches", label: "Matches", icon: Heart },
  { to: "/create", label: "Post", icon: Plus, accent: true },
  { to: "/inbox", label: "Chats", icon: MessageCircle },
  { to: "/profile", label: "You", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl">
      <ul className="grid grid-cols-5 max-w-md mx-auto px-2 pt-2 safe-bottom">
        {items.map(({ to, label, icon: Icon, accent }) => {
          const active = pathname === to || (to !== "/" && pathname.startsWith(to));
          return (
            <li key={to} className="flex">
              <Link
                to={to}
                className="flex flex-1 flex-col items-center justify-center gap-1 py-1.5"
                aria-label={label}
              >
                <span
                  className={[
                    "grid place-items-center rounded-full transition-all",
                    accent
                      ? "w-11 h-11 -mt-4 bg-primary text-primary-foreground shadow-bubble"
                      : "w-9 h-9",
                    !accent && active ? "bg-accent text-foreground" : "",
                    !accent && !active ? "text-muted-foreground" : "",
                  ].join(" ")}
                >
                  <Icon className={accent ? "w-5 h-5" : "w-[18px] h-[18px]"} strokeWidth={2.2} />
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
