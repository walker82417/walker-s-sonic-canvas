import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { LyricsSync } from "@/components/player/LyricsSync";
import { usePlayer } from "@/components/player/PlayerContext";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
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
    queue,
    upNext,
    isPlaying,
    shuffle,
    repeatMode,
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
    toggleShuffle,
    toggleRepeat,
    setVolume,
    toggleMute,
  } = usePlayer();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<MusicCategory | "all">("all");
  const [tab, setTab] = useState<"queue" | "lyrics">("queue");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return tracks.filter((t) => {
      if (t.vaultType) return false;
      if (cat !== "all" && t.category !== cat) return false;
      if (!needle) return true;
      return t.title.toLowerCase().includes(needle) || t.artist.toLowerCase().includes(needle);
    });
  }, [tracks, q, cat]);

  const totalDuration = duration || current.duration || 0;
  const effVolume = muted ? 0 : volume;
  const repeatLabel =
    repeatMode === "one" ? "Repeat one" : repeatMode === "all" ? "Repeat all" : "Repeat off";
  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;

  return (
    <div className="mx-auto w-full max-w-[100svw] overflow-hidden px-3 py-5 sm:px-4 md:px-6 lg:px-8 2xl:max-w-screen-2xl 2xl:px-10 2xl:py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Walker Player</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Library</h1>
      </header>

      <div className="grid w-full max-w-full gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] 2xl:gap-6">
        {/* Library column */}
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="glass relative flex min-w-0 flex-1 basis-full items-center gap-2 rounded-full px-4 py-2 sm:basis-[220px]">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search songs"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex max-w-full gap-1.5 overflow-x-auto pb-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
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

          <div className="player-surface ring-soft w-full max-w-full overflow-hidden rounded-2xl">
            <ul className="divide-y divide-border">
              {filtered.length === 0 && (
                <li className="px-4 py-10 text-center text-sm text-muted-foreground">No songs found.</li>
              )}
              {filtered.map((t, i) => {
                const active = t.id === current.id;
                return (
                  <li key={t.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => selectTrack(t.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          selectTrack(t.id);
                        }
                      }}
                      className={cn(
                        "group flex w-full max-w-full cursor-pointer items-center gap-2 px-2 py-3 text-left transition hover:bg-foreground/5 sm:gap-3 sm:px-3",
                        active && "bg-foreground/5",
                      )}
                    >
                      <div className="grid w-6 shrink-0 place-items-center text-xs tabular-nums text-muted-foreground sm:w-7">
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
                      <img src={t.artwork} alt="" loading="lazy" className="size-10 shrink-0 rounded-md bg-black/40 object-contain sm:size-11" />
                      <div className="min-w-0 flex-1">
                        <div className={cn("line-clamp-2 text-sm font-semibold leading-snug sm:truncate", active && "text-primary")}>
                          {t.title}
                        </div>
                        <div className="line-clamp-1 text-xs text-muted-foreground">
                          {t.artist} {t.category ? `· ${t.category}` : ""}
                        </div>
                      </div>
                      <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">
                        {t.duration ? formatTime(t.duration) : "—"}
                      </span>
                      <div className="ml-2 hidden sm:block">
                        <CreditsButton
                          title={t.title}
                          artist={t.artist}
                          credits={t.credits}
                          compact
                        />
                      </div>
                      <Heart className="ml-2 hidden size-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100 sm:block" />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Now playing column */}
        <aside className="player-surface ring-soft flex min-h-0 w-full max-w-full flex-col gap-4 self-start rounded-3xl p-4 sm:p-5 xl:sticky xl:top-4 xl:max-h-[calc(100dvh-2rem)]">
          <div className="mx-auto w-full max-w-[min(78svw,360px)] overflow-hidden rounded-2xl shadow-elevated xl:max-w-none">
            <img src={current.artwork} alt={current.title} className="aspect-square w-full bg-black/40 object-contain" />
          </div>
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-xl font-bold leading-tight tracking-tight">{current.title}</h2>
            <p className="truncate text-sm text-muted-foreground">{current.artist}</p>
            <div className="mt-2">
              <CreditsButton
                title={current.title}
                artist={current.artist}
                credits={current.credits}
              />
            </div>
          </div>

          {/* Seek */}
          <div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-foreground/10">
                <div className="h-full bg-foreground/15" style={{ width: `${buffered * 100}%` }} />
              </div>
              <SeekSlider
                value={[currentTime]}
                max={Math.max(totalDuration, 0.001)}
                step={0.1}
                onValueCommit={([v]) => seek(v)}
                className="relative z-10"
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] tabular-nums text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Transport */}
          <div className="flex items-center justify-center gap-3 min-[360px]:gap-4 min-[420px]:gap-5">
            <button
              onClick={toggleShuffle}
              className={cn("text-muted-foreground hover:text-foreground", shuffle && "text-primary hover:text-primary")}
              aria-label="Shuffle"
              aria-pressed={shuffle}
            >
              <Shuffle className="size-4 min-[380px]:size-5" />
            </button>
            <button onClick={prev} className="text-muted-foreground hover:text-foreground" aria-label="Previous">
              <SkipBack className="size-4 min-[380px]:size-5" />
            </button>
            <button
              onClick={toggle}
              className="grid size-12 place-items-center rounded-full bg-foreground text-background shadow-glow transition hover:scale-105 min-[380px]:size-14"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current pl-0.5" />}
            </button>
            <button onClick={next} className="text-muted-foreground hover:text-foreground" aria-label="Next">
              <SkipForward className="size-4 min-[380px]:size-5" />
            </button>
            <button
              onClick={toggleRepeat}
              className={cn("text-muted-foreground hover:text-foreground", repeatMode !== "off" && "text-primary hover:text-primary")}
              aria-label={repeatLabel}
              aria-pressed={repeatMode !== "off"}
            >
              <RepeatIcon className="size-4 min-[380px]:size-5" />
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
          <div className="flex gap-4 overflow-x-auto border-t border-border pt-3">
            <TabBtn icon={Music2} active={tab === "lyrics"} onClick={() => setTab("lyrics")}>
              Lyrics
            </TabBtn>
            <TabBtn icon={ListMusic} active={tab === "queue"} onClick={() => setTab("queue")}>
              Up next
            </TabBtn>
          </div>
          <div className="min-h-[320px] flex-1 overflow-hidden rounded-xl xl:min-h-0">
            {tab === "lyrics" ? (
              <LyricsSync lyrics={current.lyrics} currentTime={currentTime} onSeek={seek} />
            ) : (
              <div className="flex h-full min-h-0 flex-col">
                <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <span>{repeatMode === "one" ? "Repeating this track" : `${upNext.length} up next`}</span>
                  <span>{repeatMode === "all" ? "Loop on" : repeatMode === "one" ? "Repeat one" : "Loop off"}</span>
                </div>
                <ul className="min-h-0 flex-1 space-y-1 overflow-auto pr-1 text-sm">
                  {(repeatMode === "one" ? [current] : queue).map((t, i) => {
                    const active = t.id === current.id && i === 0;
                    return (
                      <li key={`${t.id}-${i}`}>
                      <button
                        onClick={() => !active && selectTrack(t.id)}
                        className={cn(
                          "flex w-full max-w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition",
                          active ? "bg-primary/12 text-foreground" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                        )}
                      >
                        <span className="w-7 shrink-0 text-center text-[10px] font-semibold uppercase tracking-wider sm:w-8">
                          {active ? "Now" : i}
                        </span>
                        <img src={t.artwork} alt="" className="size-8 shrink-0 rounded bg-black/40 object-contain" />
                        <span className="min-w-0 flex-1 overflow-hidden">
                          <span className="block line-clamp-2 leading-snug">{t.title}</span>
                          <span className="block line-clamp-1 text-[11px] text-muted-foreground">{t.artist}</span>
                        </span>
                      </button>
                    </li>
                    );
                  })}
                </ul>
                {queue.length <= 1 && repeatMode === "off" && (
                  <p className="mt-2 rounded-lg bg-foreground/5 px-3 py-2 text-xs text-muted-foreground">
                    No more tracks after this one. Turn on repeat to loop the queue.
                  </p>
                )}
              </div>
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

function SeekSlider({ value, onValueChange, onValueCommit, ...props }: React.ComponentProps<typeof Slider>) {
  const externalValue = Array.isArray(value) ? value[0] ?? 0 : 0;
  const { displayValue, preview, commit } = useScrubValue(externalValue);

  return (
    <Slider
      {...props}
      value={[displayValue]}
      onValueChange={(next) => {
        preview(next[0] ?? 0);
        onValueChange?.(next);
      }}
      onValueCommit={(next) => {
        commit(next[0] ?? 0);
        onValueCommit?.(next);
      }}
    />
  );
}

function useScrubValue(value: number) {
  const [draft, setDraft] = useState(value);
  const [scrubbing, setScrubbing] = useState(false);

  useEffect(() => {
    if (!scrubbing) setDraft(value);
  }, [scrubbing, value]);

  return {
    displayValue: scrubbing ? draft : value,
    preview(nextValue: number) {
      setScrubbing(true);
      setDraft(nextValue);
    },
    commit(nextValue: number) {
      setDraft(nextValue);
      setScrubbing(false);
    },
  };
}
