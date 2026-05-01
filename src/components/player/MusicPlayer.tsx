import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart, ListMusic } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "./PlayerContext";
import { formatTime } from "@/lib/lrc";

export function MusicPlayer() {
  const { current, isPlaying, currentTime, duration, volume, toggle, next, prev, seek, setVolume } = usePlayer();

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t"
    >
      <div className="mx-auto flex max-w-[1800px] items-center gap-4 px-4 py-3 md:gap-6 md:px-6">
        {/* Track meta */}
        <div className="flex min-w-0 items-center gap-3 md:w-[280px]">
          <img
            src={current.artwork}
            alt={current.title}
            className="size-12 shrink-0 rounded-md object-cover shadow-elevated"
            width={48}
            height={48}
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{current.title}</div>
            <div className="truncate text-xs text-muted-foreground">{current.artist}</div>
          </div>
          <button className="ml-auto hidden text-muted-foreground hover:text-primary md:block" aria-label="Like">
            <Heart className="size-4" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex items-center gap-3 md:gap-5">
            <button className="hidden text-muted-foreground hover:text-foreground md:block" aria-label="Shuffle">
              <Shuffle className="size-4" />
            </button>
            <button onClick={prev} className="text-muted-foreground hover:text-foreground" aria-label="Previous">
              <SkipBack className="size-5" />
            </button>
            <button
              onClick={toggle}
              className="grid size-11 place-items-center rounded-full bg-foreground text-background shadow-glow transition hover:scale-105"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current pl-0.5" />}
            </button>
            <button onClick={next} className="text-muted-foreground hover:text-foreground" aria-label="Next">
              <SkipForward className="size-5" />
            </button>
            <button className="hidden text-muted-foreground hover:text-foreground md:block" aria-label="Repeat">
              <Repeat className="size-4" />
            </button>
          </div>
          <div className="flex w-full items-center gap-3 text-[11px] tabular-nums text-muted-foreground">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || current.duration}
              step={0.1}
              onValueChange={([v]) => seek(v)}
              className="flex-1"
            />
            <span className="w-10">{formatTime(duration || current.duration)}</span>
          </div>
        </div>

        {/* Right cluster */}
        <div className="hidden items-center gap-3 md:flex md:w-[280px] md:justify-end">
          <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">HQ</span>
          <span className="text-xs text-muted-foreground">{current.quality}</span>
          <Volume2 className="size-4 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([v]) => setVolume(v / 100)}
            className="w-24"
          />
          <button className="text-muted-foreground hover:text-foreground" aria-label="Queue">
            <ListMusic className="size-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
