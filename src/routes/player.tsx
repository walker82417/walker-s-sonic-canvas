import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { LyricsSync } from "@/components/player/LyricsSync";
import { usePlayer } from "@/components/player/PlayerContext";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Search,
  Music2,
  ListMusic,
  Heart,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/lrc";
import { CreditsButton } from "@/components/CreditsButton";
import type { MusicCategory } from "@/lib/data";

export const Route = createFileRoute("/player")({
  component: PlayerPage,
  head: () => ({
    meta: [
      { title: "Walker Player | Walker's Music World" },
      { name: "description", content: "Browse the full library, play songs and follow along with the lyrics." },
    ],
  }),
});

function PlayerPage() {
  return (
    <AppLayout>
      <Inner />
    </AppLayout>
  );
}

const CATEGORIES: { id: MusicCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "official", label: "Official" },
  { id: "remix", label: "Remix" },
  { id: "cover", label: "Covers" },
];

function Inner() {
  const {
    tracks,
    current,
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    muted,
    seek,
    selectTrack,
    toggle,
    next,
    prev,
    setVolume,
    toggleMute,
  } = usePlayer();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<MusicCategory | "all">("all");
  const [tab, setTab] = useState<"queue" | "lyrics">("queue");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return tracks.filter((t) => {
      if (cat !== "all" && t.category !== cat) return false;
      if (!needle) return true;
      return t.title.toLowerCase().includes(needle) || t.artist.toLowerCase().includes(needle);
    });
  }, [tracks, q, cat]);

  const totalDuration = duration || current.duration || 0;
  const effVolume = muted ? 0 : volume;

  return (
    <div className="px-4 py-6 md:px-10 md:py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Walker Player</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Library</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        {/* Library column */}
        <section>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="glass relative flex min-w-[220px] flex-1 items-center gap-2 rounded-full px-4 py-2">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search songs"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                    cat === c.id
                      ? "bg-foreground text-background"
                      : "bg-foreground/5 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="player-surface ring-soft overflow-hidden rounded-2xl">
            <ul className="divide-y divide-border">
              {filtered.length === 0 && (
                <li className="px-4 py-10 text-center text-sm text-muted-foreground">No songs found.</li>
              )}
              {filtered.map((t, i) => {
                const active = t.id === current.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => selectTrack(t.id)}
                      className={cn(
                        "group flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-foreground/5",
                        active && "bg-foreground/5",
                      )}
                    >
                      <div className="grid w-7 place-items-center text-xs tabular-nums text-muted-foreground">
                        {active && isPlaying ? (
                          <span className="flex h-3 items-end gap-0.5">
                            <span className="h-2 w-0.5 animate-pulse bg-primary" />
                            <span className="h-3 w-0.5 animate-pulse bg-primary [animation-delay:120ms]" />
                            <span className="h-1.5 w-0.5 animate-pulse bg-primary [animation-delay:240ms]" />
                          </span>
                        ) : (
                          i + 1
                        )}
                      </div>
                      <img src={t.artwork} alt="" loading="lazy" className="size-11 shrink-0 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className={cn("truncate text-sm font-semibold", active && "text-primary")}>
                          {t.title}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {t.artist} {t.category ? `· ${t.category}` : ""}
                        </div>
                      </div>
                      <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">
                        {t.duration ? formatTime(t.duration) : "—"}
                      </span>
                      <Heart className="ml-2 size-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Now playing column */}
        <aside className="player-surface ring-soft sticky top-4 flex max-h-[calc(100dvh-2rem)] flex-col gap-4 self-start rounded-3xl p-5">
          <div className="overflow-hidden rounded-2xl shadow-elevated">
            <img src={current.artwork} alt={current.title} className="aspect-square w-full object-cover" />
          </div>
          <div>
            <h2 className="truncate text-xl font-bold tracking-tight">{current.title}</h2>
            <p className="truncate text-sm text-muted-foreground">{current.artist}</p>
          </div>

          {/* Seek */}
          <div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-foreground/10">
                <div className="h-full bg-foreground/15" style={{ width: `${buffered * 100}%` }} />
              </div>
              <Slider
                value={[currentTime]}
                max={Math.max(totalDuration, 0.001)}
                step={0.1}
                onValueChange={([v]) => seek(v)}
                className="relative z-10"
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] tabular-nums text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Transport */}
          <div className="flex items-center justify-center gap-5">
            <button onClick={prev} className="text-muted-foreground hover:text-foreground" aria-label="Previous">
              <SkipBack className="size-5" />
            </button>
            <button
              onClick={toggle}
              className="grid size-14 place-items-center rounded-full bg-foreground text-background shadow-glow transition hover:scale-105"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current pl-0.5" />}
            </button>
            <button onClick={next} className="text-muted-foreground hover:text-foreground" aria-label="Next">
              <SkipForward className="size-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground" aria-label={muted ? "Unmute" : "Mute"}>
              {muted || effVolume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <Slider
              value={[effVolume * 100]}
              max={100}
              step={1}
              onValueChange={([v]) => setVolume(v / 100)}
              className="flex-1"
            />
          </div>

          {/* Tabs (lyrics / queue brief) */}
          <div className="flex gap-4 border-t border-border pt-3">
            <TabBtn icon={Music2} active={tab === "lyrics"} onClick={() => setTab("lyrics")}>
              Lyrics
            </TabBtn>
            <TabBtn icon={ListMusic} active={tab === "queue"} onClick={() => setTab("queue")}>
              Up next
            </TabBtn>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden rounded-xl">
            {tab === "lyrics" ? (
              <LyricsSync lyrics={current.lyrics} currentTime={currentTime} onSeek={seek} />
            ) : (
              <ul className="space-y-1 overflow-auto pr-1 text-sm">
                {tracks
                  .filter((t) => t.id !== current.id)
                  .slice(0, 8)
                  .map((t) => (
                    <li key={t.id}>
                      <button
                        onClick={() => selectTrack(t.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
                      >
                        <img src={t.artwork} alt="" className="size-8 rounded object-cover" />
                        <span className="truncate">{t.title}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
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
        "relative inline-flex items-center gap-2 pb-2 text-xs font-semibold uppercase tracking-widest transition",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
      )}
    >
      <Icon className="size-3.5" />
      {children}
      {active && <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-primary" />}
    </button>
  );
}
