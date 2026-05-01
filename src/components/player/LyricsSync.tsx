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

  const activeIndex = useMemo(() => {
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) idx = i;
      else break;
    }
    return idx;
  }, [lyrics, currentTime]);

  useEffect(() => {
    if (!activeRef.current || !containerRef.current) return;
    const el = activeRef.current;
    const container = containerRef.current;
    const offset = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
    container.scrollTo({ top: offset, behavior: "smooth" });
  }, [activeIndex]);

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
