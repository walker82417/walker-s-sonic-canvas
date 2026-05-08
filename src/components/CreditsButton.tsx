import { useState } from "react";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditsButtonProps {
  title: string;
  artist?: string;
  credits?: string;
  className?: string;
  label?: string;
  compact?: boolean;
}

/**
 * Small button that opens a modal with the original-owner credits text for a
 * track or video. Use it on the player and on each track card.
 */
export function CreditsButton({
  title,
  artist,
  credits,
  className,
  label = "Credits",
  compact = false,
}: CreditsButtonProps) {
  const [open, setOpen] = useState(false);
  const text =
    credits ??
    (artist
      ? `Original by ${artist}. All rights reserved to the respective owners.`
      : "All rights reserved to the respective owners.");

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={`${label} for ${title}`}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-border bg-foreground/5 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground",
          compact ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs font-semibold",
          className,
        )}
      >
        <Info className={compact ? "size-3" : "size-3.5"} />
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-background/70 p-4 backdrop-blur"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="player-surface ring-soft w-full max-w-md rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Credits
                </p>
                <h3 className="mt-1 text-base font-bold tracking-tight">{title}</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close credits"
                className="rounded-md p-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">{text}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              All music and video copyright belongs to the respective owners. This
              channel is a fan space built out of love for the community.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
