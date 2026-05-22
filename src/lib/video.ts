const TRUSTED_YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

export function isTrustedYoutubeOrigin(origin: string) {
  try {
    const host = new URL(origin).hostname.toLowerCase();
    return TRUSTED_YOUTUBE_HOSTS.has(host);
  } catch {
    return false;
  }
}

export function youtubeEmbedUrl(youtubeId?: string) {
  if (!youtubeId) return "";
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
    origin: typeof window === "undefined" ? "https://walkersmusicworld.vercel.app" : window.location.origin,
  });
  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
}

export function youtubeWatchUrl(youtubeId?: string) {
  return youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : undefined;
}
