import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { VIDEO_CATEGORIES, type Video, type VideoCategory } from "@/lib/data";
import { loadAllVideos } from "@/lib/content";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/components/player/PlayerContext";
import { SmartVideoThumbnail } from "@/components/SmartVideoThumbnail";
import { isTrustedYoutubeOrigin, youtubeEmbedUrl, youtubeWatchUrl } from "@/lib/video";

export const Route = createFileRoute("/videos")({
  component: VideosPage,
  head: () => ({
    meta: [
      { title: "Videos | Walker's Music World" },
      { name: "description", content: "Watch curated videos from Walker's Music World, sorted by category." },
    ],
  }),
});

function VideosPage() {
  const allVideos = loadAllVideos();
  const [filter, setFilter] = useState<VideoCategory | "all">("all");
  const [active, setActive] = useState<Video | null>(null);
  const { pauseForExternalVideo, resumeAfterExternalVideo } = usePlayer();
  const activeEmbedUrl = active?.embedUrl ?? youtubeEmbedUrl(active?.youtubeId);
  const activeWatchUrl = youtubeWatchUrl(active?.youtubeId);

  const filtered = useMemo(
    () => (filter === "all" ? allVideos : allVideos.filter((v) => v.category === filter)),
    [filter, allVideos],
  );

  useVideoAudioHandoff(Boolean(active), () => setActive(null), pauseForExternalVideo, resumeAfterExternalVideo);

  return (
    <AppLayout>
      <div className="px-4 py-6 md:px-6">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Videos</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Watch the World</h1>
          <p className="mt-2 text-muted-foreground">Sessions, covers, remixes and visuals from the Walker community.</p>
        </header>

        <div className="mb-8 flex flex-wrap gap-2">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>All</Chip>
          {VIDEO_CATEGORIES.map((c) => (
            <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          {active && (
            <motion.section
              key={active.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="glass mb-8 overflow-hidden rounded-3xl"
            >
              <div className="flex items-center justify-between gap-3 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Now showing</p>
                <button
                  onClick={() => setActive(null)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  aria-label="Close player"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  key={active.youtubeId ?? active.embedUrl}
                  src={activeEmbedUrl}
                  title={active.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="size-full"
                />
              </div>
              <div className="px-6 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  {active.category && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
                      {active.category}
                    </span>
                  )}
                  <h2 className="text-xl font-bold tracking-tight md:text-2xl">{active.title}</h2>
                </div>
                {active.description && (
                  <p className="mt-3 text-sm text-muted-foreground md:text-base">{active.description}</p>
                )}
                {active.credits && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Credits:</span> {active.credits}
                  </p>
                )}
                {activeWatchUrl && (
                  <a
                    href={activeWatchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex rounded-full border border-border bg-foreground/5 px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-foreground/10"
                  >
                    Watch on YouTube
                  </a>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <motion.button
              layout
              key={v.id}
              onClick={() => setActive(v)}
              className={cn(
                "group overflow-hidden rounded-xl glass text-left shadow-elevated transition hover:-translate-y-1 hover:shadow-glow",
                active?.id === v.id && "ring-2 ring-primary",
              )}
            >
              <div className="relative aspect-video bg-black">
                <SmartVideoThumbnail
                  src={v.thumbnail}
                  youtubeId={v.youtubeId}
                  alt={v.title}
                  loading="lazy"
                  className="transition group-hover:scale-105"
                />
                <span className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                  <span className="grid size-14 place-items-center rounded-full bg-foreground/90 text-background shadow-glow">
                    <Play className="size-6 fill-current pl-0.5" />
                  </span>
                </span>
                {v.category && (
                  <span className="absolute left-3 top-3 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-foreground backdrop-blur">
                    {v.category}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="truncate font-semibold">{v.title}</h3>
                <p className="text-xs text-muted-foreground">Walker's Music World</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="glass mt-6 rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Nothing in this category yet. Check back soon.
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function useVideoAudioHandoff(
  active: boolean,
  onVideoStop: () => void,
  pauseForExternalVideo: () => void,
  resumeAfterExternalVideo: () => void,
) {
  useEffect(() => {
    if (!active) return;
    pauseForExternalVideo();
    return () => resumeAfterExternalVideo();
  }, [active, pauseForExternalVideo, resumeAfterExternalVideo]);

  useEffect(() => {
    if (!active) return;
    const onMessage = (event: MessageEvent) => {
      if (!isTrustedYoutubeOrigin(event.origin)) return;
      const data = typeof event.data === "string" ? safeJson(event.data) : event.data;
      const state = data?.info?.playerState;
      if (state === 0 || state === 2) onVideoStop();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [active, onVideoStop]);
}

function safeJson(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition",
        active
          ? "border-transparent bg-foreground text-background shadow-glow"
          : "border-border bg-foreground/5 text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
