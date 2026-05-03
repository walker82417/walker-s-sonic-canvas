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
  ListMusic,
  ChevronUp,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "./PlayerContext";
import { LyricsSync } from "./LyricsSync";
import { formatTime } from "@/lib/lrc";
import { cn } from "@/lib/utils";

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
  const totalDuration = duration || current.duration;
  const effVolume = muted ? 0 : volume;

  // Hide entire player until user has started playback at least once
  const visible = hasStarted;

  return (
    <>
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

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t"
          >
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
                  <div className="mx-auto flex max-w-[1800px] items-center gap-2 px-4 py-2 text-xs md:px-6">
                    <AlertCircle className="size-3.5" />
                    <span>{loadError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile compact bar */}
            <div className="md:hidden">
              <MobileSeek currentTime={currentTime} duration={totalDuration} buffered={buffered} onSeek={seek} />
              <div className="flex items-center gap-3 px-4 py-3">
                <button onClick={() => setExpanded((e) => !e)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <img src={current.artwork} alt="" className="size-11 shrink-0 rounded-md object-cover" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{current.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {formatTime(currentTime)} / {formatTime(totalDuration)}
                    </div>
                  </div>
                </button>
                <button onClick={prev} className="text-muted-foreground" aria-label="Previous">
                  <SkipBack className="size-5" />
                </button>
                <button
                  onClick={toggle}
                  className="grid size-11 place-items-center rounded-full bg-foreground text-background shadow-glow"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isBuffering ? <Loader2 className="size-4 animate-spin" /> : isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current pl-0.5" />}
                </button>
                <button onClick={next} className="text-muted-foreground" aria-label="Next">
                  <SkipForward className="size-5" />
                </button>
                <button onClick={() => setExpanded((e) => !e)} className="text-muted-foreground" aria-label={expanded ? "Collapse" : "Expand"}>
                  {expanded ? <ChevronDown className="size-5" /> : <ChevronUp className="size-5" />}
                </button>
              </div>
            </div>

            {/* Desktop bar */}
            <div className="mx-auto hidden max-w-[1800px] items-center gap-6 px-6 py-3 md:flex">
              <div className="flex w-[280px] min-w-0 items-center gap-3">
                <img src={current.artwork} alt={current.title} className="size-12 shrink-0 rounded-md object-cover shadow-elevated" width={48} height={48} />
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
                    className="grid size-11 place-items-center rounded-full bg-foreground text-background shadow-glow transition hover:scale-105"
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

              <div className="flex w-[280px] items-center justify-end gap-3">
                <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">HQ</span>
                <span className="text-xs text-muted-foreground">{current.quality}</span>
                <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground" aria-label={muted ? "Unmute" : "Mute"}>
                  {muted || effVolume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </button>
                <Slider value={[effVolume * 100]} max={100} step={1} onValueChange={([v]) => setVolume(v / 100)} className="w-24" />
                <button onClick={() => setExpanded((e) => !e)} className="text-muted-foreground hover:text-foreground" aria-label={expanded ? "Collapse" : "Expand"}>
                  {expanded ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
                </button>
                <button className="text-muted-foreground hover:text-foreground" aria-label="Queue"><ListMusic className="size-4" /></button>
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
