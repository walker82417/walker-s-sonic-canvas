/**
 * Content loader for music and videos.
 * Music files dropped under src/content/music/<category>/ are auto-loaded.
 * External links and video entries live in their manifest files.
 */
import {
  tracks as sampleTracks,
  videos as sampleVideos,
  type Track,
  type Video,
  type MusicCategory,
  type VideoCategory,
} from "./data";
import { parseLyrics, type LyricLine } from "./lrc";
import {
  musicManifest,
  githubSongs,
  GITHUB_BASE,
  type MusicManifestEntry,
} from "@/content/music/manifest";
import { videoManifest, type VideoManifestEntry } from "@/content/videos/manifest";

export type { MusicCategory, VideoCategory };

const audioFiles = import.meta.glob("/src/content/music/**/*.{mp3,m4a,wav,ogg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const lrcFiles = import.meta.glob("/src/content/music/**/*.lrc", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;
const artFiles = import.meta.glob("/src/content/music/**/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function basename(p: string) {
  const f = p.split("/").pop() ?? p;
  return f.replace(/\.[^.]+$/, "");
}
function categoryOf(p: string): MusicCategory | null {
  const m = p.match(/\/content\/music\/([^/]+)\//);
  const c = m?.[1];
  if (c === "official" || c === "remix" || c === "cover") return c;
  return null;
}
function siblingArt(audioPath: string, name: string): string | undefined {
  const dir = audioPath.replace(/[^/]+$/, "");
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const k = `${dir}${name}.${ext}`;
    if (artFiles[k]) return artFiles[k];
  }
  return undefined;
}
function siblingLyrics(audioPath: string, name: string): LyricLine[] {
  const dir = audioPath.replace(/[^/]+$/, "");
  const k = `${dir}${name}.lrc`;
  return lrcFiles[k] ? parseLyrics(lrcFiles[k]) : [];
}

const FALLBACK_ART = "https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg";

function parseNameAndArtist(raw: string): { title: string; artist: string } {
  // Filenames may end with " - Artist Name" to credit the original owner.
  // e.g. "Faded - Alan Walker" -> title "Faded", artist "Alan Walker"
  const cleaned = raw.replace(/[_]+/g, " ").trim();
  const m = cleaned.match(/^(.*?)[\s]+[-–—][\s]+(.+)$/);
  if (m) return { title: m[1].trim(), artist: m[2].trim() };
  return { title: cleaned, artist: "Walker's Music World" };
}

function fileTracks(): Track[] {
  const out: Track[] = [];
  for (const [path, url] of Object.entries(audioFiles)) {
    const cat = categoryOf(path);
    if (!cat) continue;
    const name = basename(path);
    const { title, artist } = parseNameAndArtist(name);
    out.push({
      id: `${cat}-${name}`.toLowerCase().replace(/\s+/g, "-"),
      title,
      artist,
      artwork: siblingArt(path, name) ?? FALLBACK_ART,
      audioUrl: url,
      duration: 0,
      quality: "Studio quality",
      format: "Studio",
      lyrics: siblingLyrics(path, name),
      category: cat,
    });
  }
  return out;
}

function manifestTracks(): Track[] {
  return musicManifest.map((m: MusicManifestEntry) => ({
    id: m.id,
    title: m.title,
    artist: "Walker's Music World",
    artwork: m.artwork ?? FALLBACK_ART,
    audioUrl: m.audioUrl,
    duration: m.duration ?? 0,
    quality: "Studio quality",
    format: "Studio" as const,
    lyrics: m.lyrics ?? [],
    category: m.category,
  }));
}

function manifestVideos(): Video[] {
  return videoManifest.map((v: VideoManifestEntry) => ({
    id: v.id,
    title: v.title,
    youtubeId: v.youtubeId,
    thumbnail: v.thumbnail ?? `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
    category: v.category,
    description: v.description,
    credits: v.credits,
  }));
}

function githubTracks(): Track[] {
  if (!GITHUB_BASE || !githubSongs.length) return [];
  const base = (GITHUB_BASE as string).replace(/\/$/, "");
  return githubSongs.map((s) => {
    const enc = encodeURIComponent(s.name);
    const audioExt = s.audioExt ?? "mp3";
    const artExt = s.artExt ?? "jpg";
    const { title, artist } = parseNameAndArtist(s.name);
    return {
      id: `gh-${s.name}`.toLowerCase().replace(/\s+/g, "-"),
      title,
      artist,
      artwork: `${base}/${enc}.${artExt}`,
      audioUrl: `${base}/${enc}.${audioExt}`,
      duration: 0,
      quality: "Studio quality",
      format: "Studio" as const,
      lyrics: [],
      category: s.category ?? "official",
      lyricsUrl: s.hasLyrics ? `${base}/${enc}.lrc` : undefined,
    } as Track & { lyricsUrl?: string };
  });
}

export function loadAllTracks(): Track[] {
  const merged = [...fileTracks(), ...githubTracks(), ...manifestTracks()];
  return merged.length ? merged : sampleTracks;
}

export function loadAllVideos(): Video[] {
  const merged = manifestVideos();
  return merged.length ? merged : sampleVideos;
}
