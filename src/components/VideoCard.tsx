import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import type { Video } from "@/lib/data";
import { usePlayer } from "@/components/player/PlayerContext";
import { SmartVideoThumbnail } from "@/components/SmartVideoThumbnail";

export function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  const { pauseForExternalVideo, resumeAfterExternalVideo } = usePlayer();
  const embedUrl = video.embedUrl ?? `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&enablejsapi=1`;

  useEffect(() => {
    if (!playing) return;
    pauseForExternalVideo();
    return () => resumeAfterExternalVideo();
  }, [playing, pauseForExternalVideo, resumeAfterExternalVideo]);

  useEffect(() => {
    if (!playing) return;
    const onMessage = (event: MessageEvent) => {
      if (!String(event.origin).includes("youtube")) return;
      const data = typeof event.data === "string" ? safeJson(event.data) : event.data;
      const state = data?.info?.playerState;
      if (state === 0 || state === 2) setPlaying(false);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [playing]);

  return (
    <div className="group overflow-hidden rounded-xl glass shadow-elevated transition hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <>
            <iframe
              src={embedUrl}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
            <button
              onClick={() => setPlaying(false)}
              className="absolute right-2 top-2 rounded-md bg-background/80 p-1 text-foreground backdrop-blur transition hover:bg-background"
              aria-label="Close video"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group/btn absolute inset-0"
            aria-label={`Play ${video.title}`}
          >
            <SmartVideoThumbnail
              src={video.thumbnail}
              youtubeId={video.youtubeId}
              alt={video.title}
              loading="lazy"
              className="transition group-hover:scale-105"
            />
            <span className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover:opacity-100">
              <span className="grid size-14 place-items-center rounded-full bg-foreground/90 text-background shadow-glow">
                <Play className="size-6 fill-current pl-0.5" />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate font-semibold">{video.title}</h3>
        <p className="text-xs text-muted-foreground">Walker's Music World</p>
      </div>
    </div>
  );
}

function safeJson(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
