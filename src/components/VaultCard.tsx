import { Play, Pause } from "lucide-react";
import type { Track } from "@/lib/data";
import { usePlayer } from "@/components/player/PlayerContext";
import { formatTime } from "@/lib/lrc";
import { cn } from "@/lib/utils";

export function VaultCard({ track }: { track: Track }) {
  const { current, isPlaying, selectTrack, toggle } = usePlayer();
  const isCurrent = current.id === track.id;

  return (
    <button
      onClick={() => (isCurrent ? toggle() : selectTrack(track.id))}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl glass p-4 text-left transition shadow-elevated hover:-translate-y-1 hover:shadow-glow",
        isCurrent && "ring-1 ring-primary/40",
      )}
    >
      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
        <img
          src={track.artwork}
          alt={track.title}
          loading="lazy"
          className="size-full bg-black/40 object-contain transition group-hover:scale-105"
        />
        <span className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-full bg-foreground text-background opacity-0 shadow-glow transition group-hover:opacity-100">
          {isCurrent && isPlaying ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="size-5 fill-current pl-0.5" />
          )}
        </span>
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{track.title}</h3>
          <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
        </div>
        <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
          {track.format}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{track.quality}</span>
        <span>{formatTime(track.duration)}</span>
      </div>
    </button>
  );
}
