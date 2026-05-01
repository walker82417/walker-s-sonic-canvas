import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { LyricLine } from "@/lib/lrc";
import { formatTime } from "@/lib/lrc";
import { cn } from "@/lib/utils";

interface Props {
  lyrics: LyricLine[];
  currentTime: number;
  onSeek: (t: number) => void;
}

export function LyricsSync({ lyrics, currentTime, onSeek }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const lastIndexRef = useRef(-1);

  // Binary search active line for performance with long LRCs
  const activeIndex = useMemo(() => {
    if (!lyrics.length) return -1;
    let lo = 0;
    let hi = lyrics.length - 1;
    let result = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (lyrics[mid].time <= currentTime) {
        result = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return result;
  }, [lyrics, currentTime]);

  // Auto-scroll only when the active line actually changes
  useEffect(() => {
    if (activeIndex === lastIndexRef.current) return;
    lastIndexRef.current = activeIndex;
    if (!activeRef.current || !containerRef.current) return;
    const el = activeRef.current;
    const container = containerRef.current;
    const offset = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
    container.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
  }, [activeIndex]);

  if (!lyrics.length) {
    return (
      <div className="grid h-full place-items-center text-sm text-muted-foreground">
        No lyrics available for this track.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto pr-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border"
    >
      <div className="space-y-1 py-4">
        {lyrics.map((line, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={i}
              ref={active ? activeRef : null}
              onClick={() => onSeek(line.time)}
              className={cn(
                "group flex w-full items-center gap-5 rounded-lg px-3 py-2 text-left transition-all",
                active
                  ? "bg-foreground/5 text-foreground"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground/80",
              )}
            >
              <span className={cn("flex w-12 items-center gap-1 text-xs tabular-nums", active && "text-primary")}>
                {active && <Play className="size-2.5 fill-current" />}
                {formatTime(line.time)}
              </span>
              <motion.span
                animate={{ scale: active ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
                className={cn("flex-1 text-base leading-relaxed", active && "font-semibold")}
              >
                {line.text}
              </motion.span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
