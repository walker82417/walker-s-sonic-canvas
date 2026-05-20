import { useEffect, useMemo, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SmartVideoThumbnailProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  youtubeId?: string;
}

export function SmartVideoThumbnail({
  src,
  youtubeId,
  className,
  onError,
  onLoad,
  ...props
}: SmartVideoThumbnailProps) {
  const candidates = useMemo(() => thumbnailCandidates(src, youtubeId), [src, youtubeId]);
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [candidates]);

  const activeSrc = candidates[candidateIndex] ?? src;
  const tryNext = () => {
    if (candidateIndex >= candidates.length - 1) return false;
    setCandidateIndex((index) => Math.min(index + 1, candidates.length - 1));
    return true;
  };

  return (
    <img
      {...props}
      src={activeSrc}
      className={cn("size-full object-cover", className)}
      onError={(event) => {
        if (!tryNext()) onError?.(event);
      }}
      onLoad={(event) => {
        const image = event.currentTarget;
        if (isTinyYoutubeFallback(image) && tryNext()) return;
        onLoad?.(event);
      }}
    />
  );
}

function thumbnailCandidates(src: string, youtubeId?: string) {
  if (!youtubeId) return [src];

  const base = `https://i.ytimg.com/vi/${youtubeId}`;
  return unique([
    src,
    `${base}/maxresdefault.jpg`,
    `${base}/mqdefault.jpg`,
    `${base}/sddefault.jpg`,
    `${base}/hqdefault.jpg`,
    `${base}/0.jpg`,
  ]);
}

function isTinyYoutubeFallback(image: HTMLImageElement) {
  const src = image.currentSrc || image.src;
  if (!src.includes("ytimg.com")) return false;
  return image.naturalWidth <= 160 || image.naturalHeight <= 120;
}

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}
