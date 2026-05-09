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
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-2 px-4 h-14">
        {back ? (
          <Link to="/" className="-ml-2 p-2 rounded-full hover:bg-accent" aria-label="Back">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        ) : (
          <span className="font-display text-xl font-semibold tracking-tight">
            <span className="text-primary">●</span> Plotted
          </span>
        )}
        {title && <h1 className="font-display text-lg font-semibold">{title}</h1>}
        <div className="ml-auto">{right}</div>
      </div>
    </header>
  );
}
