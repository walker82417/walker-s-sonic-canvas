/**
 * GitHub data loader.
 *
 * Set VITE_GITHUB_DATA_URL to a raw GitHub URL pointing at a data.json with shape:
 * {
 *   "tracks": [{
 *     "id": "fade-beyond",
 *     "title": "Fade Beyond",
 *     "artist": "Walker's Music World",
 *     "artwork": "https://raw.githubusercontent.com/.../images/fade.jpg",
 *     "audioUrl": "https://raw.githubusercontent.com/.../audio/fade.flac",
 *     "lyricsUrl": "https://raw.githubusercontent.com/.../lyrics/fade.lrc",
 *     "duration": 222,
 *     "quality": "24-bit / 96 KHz",
 *     "format": "FLAC"
 *   }],
 *   "videos": [...]
 * }
 *
 * Falls back to bundled sample data on failure.
 */
import {
  tracks as sampleTracks,
  videos as sampleVideos,
  type Track,
  type Video,
} from "./data";
import { parseLyrics, type LyricLine } from "./lrc";

const GITHUB_DATA_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_GITHUB_DATA_URL) || "";

interface RemoteTrack extends Omit<Track, "lyrics"> {
  lyrics?: LyricLine[];
  lyricsUrl?: string;
}

interface RemoteData {
  tracks?: RemoteTrack[];
  videos?: Video[];
}

export interface LoadedData {
  tracks: Track[];
  videos: Video[];
  source: "github" | "sample";
}

async function fetchWithTimeout(url: string, ms = 8000): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { cache: "no-store", signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function resolveLyrics(track: RemoteTrack): Promise<LyricLine[]> {
  if (track.lyrics?.length) return track.lyrics;
  if (!track.lyricsUrl) return [];
  try {
    const res = await fetchWithTimeout(track.lyricsUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parseLyrics(await res.text());
  } catch (e) {
    console.warn(`Lyrics fetch failed for ${track.id}:`, e);
    return [];
  }
}

export async function fetchGithubData(): Promise<LoadedData> {
  if (!GITHUB_DATA_URL) {
    return { tracks: sampleTracks, videos: sampleVideos, source: "sample" };
  }
  try {
    const res = await fetchWithTimeout(GITHUB_DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: RemoteData = await res.json();

    const tracks: Track[] = data.tracks?.length
      ? await Promise.all(
          data.tracks.map(async (t) => ({
            ...t,
            lyrics: await resolveLyrics(t),
          })),
        )
      : sampleTracks;

    return {
      tracks,
      videos: data.videos?.length ? data.videos : sampleVideos,
      source: "github",
    };
  } catch (err) {
    console.warn("GitHub fetch failed, using sample data:", err);
    return { tracks: sampleTracks, videos: sampleVideos, source: "sample" };
  }
}

export async function fetchLRC(url: string): Promise<LyricLine[]> {
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Failed to load lyrics: ${res.status}`);
  return parseLyrics(await res.text());
}
