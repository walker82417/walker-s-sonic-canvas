/**
 * GitHub data fetcher.
 * Drop a `data.json` (and lyrics .lrc, audio, images) in your public GitHub
 * repo and point GITHUB_DATA_URL at the raw url. The app will fall back
 * to the bundled sample data if the request fails.
 */
import { tracks as sampleTracks, videos as sampleVideos, type Track, type Video } from "./data";
import { parseLRC } from "./lrc";

const GITHUB_DATA_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_GITHUB_DATA_URL) ||
  "";

interface RemoteData {
  tracks?: Track[];
  videos?: Video[];
}

export async function fetchGithubData(): Promise<{ tracks: Track[]; videos: Video[] }> {
  if (!GITHUB_DATA_URL) return { tracks: sampleTracks, videos: sampleVideos };
  try {
    const res = await fetch(GITHUB_DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: RemoteData = await res.json();
    return {
      tracks: data.tracks?.length ? data.tracks : sampleTracks,
      videos: data.videos?.length ? data.videos : sampleVideos,
    };
  } catch (err) {
    console.warn("GitHub fetch failed, using sample data:", err);
    return { tracks: sampleTracks, videos: sampleVideos };
  }
}

export async function fetchLRC(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load lyrics");
  return parseLRC(await res.text());
}
