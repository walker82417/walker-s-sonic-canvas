import { useState } from "react";
import { Play } from "lucide-react";
import type { Video } from "@/lib/data";

export function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="group overflow-hidden rounded-xl glass shadow-elevated transition hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group/btn absolute inset-0"
            aria-label={`Play ${video.title}`}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              loading="lazy"
              className="size-full object-cover transition group-hover:scale-105"
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
