import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  ChevronUp,
  ChevronDown,
  Loader2,
  AlertCircle,
  Mic2,
  X,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "./PlayerContext";
import { LyricsSync } from "./LyricsSync";
import { formatTime } from "@/lib/lrc";
import { cn } from "@/lib/utils";
import { CreditsButton } from "@/components/CreditsButton";

export function MusicPlayer() {
  const {
    current,
    isPlaying,
    isBuffering,
    loadError,
    buffered,
    currentTime,
    duration,
    volume,
    muted,
    hasStarted,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
  } = usePlayer();

  const [expanded, setExpanded] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const totalDuration = duration || current.duration;
  const effVolume = muted ? 0 : volume;
  const visible = hasStarted;
  const progress = totalDuration ? (currentTime / totalDuration) * 100 : 0;

  return (
    <>
      {/* Backdrop for expanded view */}
      <AnimatePresence>
        {expanded && visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(false)}
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      {/* Desktop: floating Now Playing right sidebar with lyrics toggle */}
      <AnimatePresence>
        {visible && showLyrics && (
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="player-surface ring-soft fixed right-4 top-4 bottom-28 z-40 hidden w-[360px] flex-col rounded-3xl p-5 lg:flex"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Now Playing
              </p>
              <button
                onClick={() => setShowLyrics(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                aria-label="Hide lyrics"
              >
                <X className="size-4" />
              </button>
            </div>
            <img
              src={current.artwork}
              alt={current.title}
              className="mt-4 aspect-square w-full rounded-2xl object-cover shadow-elevated"
            />
            <div className="mt-4">
              <h3 className="truncate text-lg font-bold tracking-tight">{current.title}</h3>
              <p className="truncate text-xs text-muted-foreground">{current.artist}</p>
            </div>
            <div className="mt-4 flex-1 overflow-hidden rounded-xl">
              <LyricsSync lyrics={current.lyrics} currentTime={currentTime} onSeek={seek} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            {/* Mobile lyrics drawer (full-screen sheet) */}
            <AnimatePresence>
              {showLyrics && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  className="player-surface fixed inset-x-3 bottom-[88px] top-20 z-40 rounded-3xl p-5 lg:hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={current.artwork} alt="" className="size-10 rounded-md object-cover" />
                      <div>
                        <div className="truncate text-sm font-semibold">{current.title}</div>
                        <div className="truncate text-[11px] text-muted-foreground">{current.artist}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLyrics(false)}
                      className="rounded-md p-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                      aria-label="Close lyrics"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="mt-4 h-[calc(100%-3.5rem)] overflow-hidden rounded-xl">
                    <LyricsSync lyrics={current.lyrics} currentTime={currentTime} onSeek={seek} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="player-surface ring-soft mx-2 mb-2 rounded-2xl md:mx-4 md:mb-4">
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mx-auto grid max-w-5xl gap-8 px-6 pb-8 pt-10 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
                      <div className="flex flex-col items-center md:items-start">
                        <img
                          src={current.artwork}
                          alt={current.title}
                          className="aspect-square w-full max-w-[280px] rounded-2xl object-cover shadow-elevated"
                        />
                        <h2 className="mt-5 text-2xl font-bold tracking-tight">{current.title}</h2>
                        <p className="text-sm text-muted-foreground">{current.artist}</p>
                      </div>
                      <div className="h-[280px] md:h-[360px]">
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Lyrics
                        </h3>
                        <div className="h-[calc(100%-2rem)] overflow-hidden rounded-xl">
                          <LyricsSync lyrics={current.lyrics} currentTime={currentTime} onSeek={seek} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {loadError && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-destructive/15 text-destructive"
                  >
                    <div className="mx-auto flex items-center gap-2 px-4 py-2 text-xs md:px-6">
                      <AlertCircle className="size-3.5" />
                      <span>{loadError}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hairline progress at the very top of the bar */}
              <div className="relative h-0.5 w-full overflow-hidden rounded-t-2xl bg-foreground/8">
                <div className="h-full bg-foreground/15" style={{ width: `${buffered * 100}%` }} />
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Mobile compact bar */}
              <div className="md:hidden">
                <MobileSeek currentTime={currentTime} duration={totalDuration} buffered={buffered} onSeek={seek} />
                <div className="flex items-center gap-3 px-3 py-3">
                  <button onClick={() => setExpanded((e) => !e)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <img src={current.artwork} alt="" className="size-12 shrink-0 rounded-lg object-cover shadow-elevated" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{current.title}</div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {formatTime(currentTime)} · {current.artist}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setShowLyrics((s) => !s)}
                    className={cn("rounded-md p-2", showLyrics ? "text-primary" : "text-muted-foreground")}
                    aria-label="Lyrics"
                  >
                    <Mic2 className="size-5" />
                  </button>
                  <button
                    onClick={toggle}
                    className="grid size-11 place-items-center rounded-full bg-foreground text-background shadow-glow"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isBuffering ? <Loader2 className="size-4 animate-spin" /> : isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current pl-0.5" />}
                  </button>
                  <button onClick={() => setExpanded((e) => !e)} className="text-muted-foreground" aria-label={expanded ? "Collapse" : "Expand"}>
                    {expanded ? <ChevronDown className="size-5" /> : <ChevronUp className="size-5" />}
                  </button>
                </div>
              </div>

              {/* Desktop bar */}
              <div className="mx-auto hidden max-w-[1800px] items-center gap-6 px-6 py-3 md:flex">
                <div className="flex w-[300px] min-w-0 items-center gap-3">
                  <img src={current.artwork} alt={current.title} className="size-14 shrink-0 rounded-lg object-cover shadow-elevated" width={56} height={56} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{current.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{current.artist}</div>
                  </div>
                  <button className="ml-auto text-muted-foreground hover:text-primary" aria-label="Like">
                    <Heart className="size-4" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex items-center gap-5">
                    <button className="text-muted-foreground hover:text-foreground" aria-label="Shuffle"><Shuffle className="size-4" /></button>
                    <button onClick={prev} className="text-muted-foreground hover:text-foreground" aria-label="Previous"><SkipBack className="size-5" /></button>
                    <button
                      onClick={toggle}
                      className="grid size-12 place-items-center rounded-full bg-foreground text-background shadow-glow transition hover:scale-105"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isBuffering ? <Loader2 className="size-4 animate-spin" /> : isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current pl-0.5" />}
                    </button>
                    <button onClick={next} className="text-muted-foreground hover:text-foreground" aria-label="Next"><SkipForward className="size-5" /></button>
                    <button className="text-muted-foreground hover:text-foreground" aria-label="Repeat"><Repeat className="size-4" /></button>
                  </div>
                  <div className="flex w-full items-center gap-3 text-[11px] tabular-nums text-muted-foreground">
                    <span className="w-10 text-right">{formatTime(currentTime)}</span>
                    <BufferedSlider value={currentTime} max={totalDuration} buffered={buffered} onValueChange={seek} />
                    <span className="w-10">{formatTime(totalDuration)}</span>
                  </div>
                </div>

                <div className="flex w-[300px] items-center justify-end gap-3">
                  <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">HQ</span>
                  <button
                    onClick={() => setShowLyrics((s) => !s)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                      showLyrics
                        ? "border-transparent bg-primary/15 text-primary"
                        : "border-border bg-foreground/5 text-muted-foreground hover:text-foreground",
                    )}
                    aria-pressed={showLyrics}
                  >
                    <Mic2 className="size-3.5" /> Lyrics
                  </button>
                  <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground" aria-label={muted ? "Unmute" : "Mute"}>
                    {muted || effVolume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                  </button>
                  <Slider value={[effVolume * 100]} max={100} step={1} onValueChange={([v]) => setVolume(v / 100)} className="w-24" />
                  <button onClick={() => setExpanded((e) => !e)} className="text-muted-foreground hover:text-foreground" aria-label={expanded ? "Collapse" : "Expand"}>
                    {expanded ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function BufferedSlider({ value, max, buffered, onValueChange }: { value: number; max: number; buffered: number; onValueChange: (v: number) => void }) {
  const safeMax = Math.max(max, 0.001);
  return (
    <div className="relative flex-1">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-foreground/10">
        <div className="h-full bg-foreground/15" style={{ width: `${buffered * 100}%` }} />
      </div>
      <Slider value={[value]} max={safeMax} step={0.1} onValueChange={([v]) => onValueChange(v)} className="relative z-10" />
    </div>
  );
}

function MobileSeek({ currentTime, duration, buffered, onSeek }: { currentTime: number; duration: number; buffered: number; onSeek: (t: number) => void }) {
  const safeMax = Math.max(duration, 0.001);
  return (
    <div className="px-2 pt-1">
      <div className="relative h-5 touch-none">
        <div className="pointer-events-none absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-foreground/10">
          <div className="h-full bg-foreground/15" style={{ width: `${buffered * 100}%` }} />
          <div className="-mt-1 h-full bg-foreground/80" style={{ width: `${(currentTime / safeMax) * 100}%` }} />
        </div>
        <Slider value={[currentTime]} max={safeMax} step={0.1} onValueChange={([v]) => onSeek(v)} className="absolute inset-0" />
      </div>
    </div>
  );
}
