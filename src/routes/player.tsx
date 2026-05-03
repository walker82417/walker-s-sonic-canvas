import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { LyricsSync } from "@/components/player/LyricsSync";
import { usePlayer } from "@/components/player/PlayerContext";
import { tracks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Play, Pause, Heart } from "lucide-react";
import { formatTime } from "@/lib/lrc";

export const Route = createFileRoute("/player")({
  component: PlayerPage,
  head: () => ({
    meta: [
      { title: "Walker Player — Cinematic Listening | Walker's Music World" },
      { name: "description", content: "Immersive full-screen music player with synced lyrics." },
    ],
  }),
});

function PlayerPage() {
  return (
    <AppLayout tracks={tracks}>
      <Inner />
    </AppLayout>
  );
}

function Inner() {
  const { tracks, current, isPlaying, currentTime, seek, selectTrack, toggle } = usePlayer();
  const [tab, setTab] = useState<"lyrics" | "queue">("lyrics");

  return (
    <div className="px-4 py-6 md:px-10 md:py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Walker Player</p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight md:text-5xl">Cinematic Listening</h1>
      </header>

      <div className="glass grid gap-8 rounded-3xl p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:p-10">
        <div>
          <div className="overflow-hidden rounded-3xl shadow-elevated">
            <img src={current.artwork} alt={current.title} className="aspect-square w-full object-cover" />
          </div>
          <div className="mt-6 flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
                {current.title}
                <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">HQ</span>
              </h2>
              <p className="mt-1 text-muted-foreground">{current.artist} · {current.format} · {current.quality}</p>
            </div>
            <button
              onClick={toggle}
              className="grid size-14 place-items-center rounded-full bg-foreground text-background shadow-glow transition hover:scale-105"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current pl-0.5" />}
            </button>
          </div>
        </div>

        <div className="flex min-h-[480px] flex-col">
          <div className="flex items-center gap-6 border-b border-border">
            {(["lyrics", "queue"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative pb-3 text-sm font-semibold uppercase tracking-widest transition",
                  tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
                )}
              >
                {t}
                {tab === t && <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden">
            {tab === "lyrics" ? (
              <LyricsSync lyrics={current.lyrics} currentTime={currentTime} onSeek={seek} />
            ) : (
              <ul className="divide-y divide-border py-2">
                {tracks.map((t) => {
                  const active = t.id === current.id;
                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => selectTrack(t.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-foreground/5",
                          active && "bg-foreground/5",
                        )}
                      >
                        <img src={t.artwork} alt="" className="size-10 rounded-md object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className={cn("truncate text-sm font-semibold", active && "text-primary")}>{t.title}</div>
                          <div className="truncate text-xs text-muted-foreground">{t.artist}</div>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatTime(t.duration)}</span>
                        <Heart className="size-4 text-muted-foreground" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
