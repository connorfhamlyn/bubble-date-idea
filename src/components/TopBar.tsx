import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function TopBar({
  title,
  back = false,
  right,
}: {
  title?: string;
  back?: boolean;
  right?: React.ReactNode;
}) {
  const showBrand = !back && !title;

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-border pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-2 px-3 h-14">
        {back && (
          <Link
            to="/"
            className="-ml-1 h-10 w-10 grid place-items-center rounded-full hover:bg-accent active:bg-accent/80 active:scale-95 transition-transform"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
        )}

        {showBrand && (
          <span className="font-display text-xl font-semibold tracking-tight pl-1">
            <span className="text-primary">●</span> Motif
          </span>
        )}

        {title && (
          <h1 className="font-display text-lg font-semibold truncate">{title}</h1>
        )}

        {right && <div className="ml-auto flex items-center">{right}</div>}
      </div>
    </header>
  );
}
