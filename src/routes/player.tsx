import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/AppLayout";
import { LyricsSync } from "@/components/player/LyricsSync";
import { usePlayer } from "@/components/player/PlayerContext";
import { tracks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Play, Pause, Heart, Music2, ListMusic, PictureInPicture2, X, SkipBack, SkipForward } from "lucide-react";
import { formatTime } from "@/lib/lrc";

export const Route = createFileRoute("/player")({
  component: PlayerPage,
  head: () => ({
    meta: [
      { title: "Walker Player | Walker's Music World" },
      { name: "description", content: "Now Playing view with lyrics, queue and an optional mini player." },
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
  const { tracks, current, isPlaying, currentTime, seek, selectTrack, toggle, next, prev } = usePlayer();
  const [tab, setTab] = useState<"lyrics" | "queue">("lyrics");
  const [miniOpen, setMiniOpen] = useState(false);

  return (
    <div className="px-4 py-6 md:px-10 md:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Walker Player</p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight md:text-5xl">Now Playing</h1>
        </div>
        <button
          onClick={() => setMiniOpen((m) => !m)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold transition",
            miniOpen ? "bg-primary/15 text-primary" : "bg-foreground/5 text-muted-foreground hover:text-foreground",
          )}
          aria-label="Toggle mini player"
        >
          <PictureInPicture2 className="size-4" />
          {miniOpen ? "Mini player on" : "Open mini player"}
        </button>
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
              <p className="mt-1 text-muted-foreground">{current.artist} · {current.quality}</p>
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
          <div className="flex items-center gap-4 border-b border-border">
            <TabBtn icon={Music2} active={tab === "lyrics"} onClick={() => setTab("lyrics")}>Lyrics</TabBtn>
            <TabBtn icon={ListMusic} active={tab === "queue"} onClick={() => setTab("queue")}>Queue</TabBtn>
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

      {/* Floating mini player */}
      <AnimatePresence>
        {miniOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            className="glass-strong fixed bottom-28 right-4 z-40 flex w-[min(92vw,340px)] items-center gap-3 rounded-2xl p-3 shadow-elevated"
            role="dialog"
            aria-label="Mini player"
          >
            <img src={current.artwork} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{current.title}</div>
              <div className="truncate text-xs text-muted-foreground">{current.artist}</div>
            </div>
            <button onClick={prev} className="text-muted-foreground hover:text-foreground" aria-label="Previous">
              <SkipBack className="size-4" />
            </button>
            <button
              onClick={toggle}
              className="grid size-9 place-items-center rounded-full bg-foreground text-background shadow-glow"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current pl-0.5" />}
            </button>
            <button onClick={next} className="text-muted-foreground hover:text-foreground" aria-label="Next">
              <SkipForward className="size-4" />
            </button>
            <button
              onClick={() => setMiniOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close mini player"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabBtn({
  icon: Icon,
  active,
  onClick,
  children,
}: {
  icon: typeof Music2;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-2 pb-3 text-sm font-semibold uppercase tracking-widest transition",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
      )}
    >
      <Icon className="size-4" />
      {children}
      {active && <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-primary" />}
    </button>
  );
}
