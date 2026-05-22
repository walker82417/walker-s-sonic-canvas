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
import fallbackArt from "@/assets/album-fade-beyond.jpg";

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
const musicDetailsFiles = import.meta.glob("/src/content/music/details.{text,txt}", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;
const videoDetailsFiles = import.meta.glob("/src/content/videos/*details*.txt", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;
const artFiles = import.meta.glob("/src/content/music/**/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const musicDetailsRaw = Object.values(musicDetailsFiles).join("\n");
const videoDetailsRaw = Object.values(videoDetailsFiles).join("\n");

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

const FALLBACK_ART = fallbackArt;

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
    const credited = artist !== "Walker's Music World";
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
      credits: credited
        ? `Original by ${artist}. All rights reserved to the respective owners.`
        : undefined,
    });
  }
  return out;
}

function findArtworkByName(name: string): string | undefined {
  const exts = ["jpg", "jpeg", "png", "webp"];
  const target = normalizeLookup(name.replace(/\.(?:jpe?g|png|webp)$/i, ""));
  for (const k of Object.keys(artFiles)) {
    const file = basename(k.split("/").pop() ?? "");
    for (const ext of exts) {
      if (normalizeLookup(file) === target || normalizeLookup(`${file}.${ext}`) === normalizeLookup(`${target}.${ext}`)) {
        return artFiles[k];
      }
    }
  }
  return undefined;
}

function findArtworkByPath(path: string): string | undefined {
  const normalized = normalizePathLookup(path);
  const key = Object.keys(artFiles).find((k) => normalizePathLookup(k) === normalized);
  return key ? artFiles[key] : undefined;
}

function normalizeLookup(raw: string) {
  return repairMojibake(raw)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePathLookup(raw: string) {
  return normalizeLookup(raw)
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/");
}

function repairMojibake(raw: string) {
  if (!/[ÃÂ]/.test(raw)) return raw;
  try {
    const bytes = Uint8Array.from(Array.from(raw, (char) => char.charCodeAt(0)));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return raw;
  }
}

function slug(raw: string) {
  return raw
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanField(raw: string) {
  return repairDisplayText(raw)
    .replace(/\s+/g, " ")
    .replace(/^song\s*name\s*:/i, "")
    .replace(/^song\s*:/i, "")
    .replace(/^credit\s*:/i, "")
    .trim();
}

function repairDisplayText(raw: string) {
  if (!/[\u00c3\u00c2\u00e2]/.test(raw)) return raw;
  try {
    const bytes = Uint8Array.from(Array.from(raw, byteFromMojibakeChar));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return repairMojibake(raw);
  }
}

function byteFromMojibakeChar(char: string) {
  const code = char.charCodeAt(0);
  if (code <= 0xff) return code;
  const windows1252 = new Map<string, number>([
    ["\u20ac", 0x80],
    ["\u201a", 0x82],
    ["\u0192", 0x83],
    ["\u201e", 0x84],
    ["\u2026", 0x85],
    ["\u2020", 0x86],
    ["\u2021", 0x87],
    ["\u02c6", 0x88],
    ["\u2030", 0x89],
    ["\u0160", 0x8a],
    ["\u2039", 0x8b],
    ["\u0152", 0x8c],
    ["\u017d", 0x8e],
    ["\u2018", 0x91],
    ["\u2019", 0x92],
    ["\u201c", 0x93],
    ["\u201d", 0x94],
    ["\u2022", 0x95],
    ["\u2013", 0x96],
    ["\u2014", 0x97],
    ["\u02dc", 0x98],
    ["\u2122", 0x99],
    ["\u0161", 0x9a],
    ["\u203a", 0x9b],
    ["\u0153", 0x9c],
    ["\u017e", 0x9e],
    ["\u0178", 0x9f],
  ]);
  return windows1252.get(char) ?? code;
}

function parseDetailTitle(segment: string) {
  const match = segment.match(/(?:song\s*name|song)\s*:\s*(.*?)(?:,\s*(?:credit|crdit)\s*:|$)/i);
  return cleanField(match?.[1] ?? segment);
}

function parseDetailArtist(segment: string) {
  const match = segment.match(/(?:credit|crdit)\s*:\s*(.*)$/i);
  return cleanField(match?.[1] ?? "Walker's Music World").replace(/[)]$/, "").trim();
}

function parseDetailCategory(parts: string[]): MusicCategory {
  const type = parts.map((p) => p.trim().toLowerCase()).find((p) => p === "official" || p === "cover" || p === "remix");
  return (type as MusicCategory | undefined) ?? "remix";
}

function sanitizeAudioUrl(raw: string) {
  const nested = raw.lastIndexOf("https://");
  const clean = nested > 0 ? raw.slice(nested) : raw;
  return clean.replace(/\s+/g, "");
}

function imagePathFromDetail(afterUrl: string) {
  const pathMatch = afterUrl.match(/path\s*[:;]\s*([^\r\n]+?\.(?:jpe?g|png|webp))/i);
  return pathMatch?.[1]?.trim();
}

function imageNameFromDetail(afterUrl: string) {
  const imageNameMatch = afterUrl.match(/\/\s*([^/\r\n]+?\.(?:jpe?g|png|webp))/i);
  return imageNameMatch?.[1]?.trim();
}

function detailsTracks(): Track[] {
  const lines = musicDetailsRaw.split(/\r?\n/);
  const out: Track[] = [];

  for (const line of lines) {
    if (!/^\s*\d+\./.test(line)) continue;
    if (isVaultDetailLine(line)) continue;
    const audioMatch = line.match(/https?:\/\/\S+?\.mp3/i);
    if (!audioMatch) continue;

    const beforeUrl = line.slice(line.indexOf(".") + 1, audioMatch.index).trim();
    const afterUrl = line.slice((audioMatch.index ?? 0) + audioMatch[0].length);
    const parts = beforeUrl.split("/").map((p) => p.trim()).filter(Boolean);
    const titleArtistPart = parts.at(-1) ?? "";
    const title = parseDetailTitle(titleArtistPart);
    const artist = parseDetailArtist(titleArtistPart);

    if (!title) continue;

    const imagePath = imagePathFromDetail(afterUrl);
    const imageName = imageNameFromDetail(afterUrl);
    const artwork =
      (imagePath ? findArtworkByPath(imagePath) : undefined) ??
      (imageName ? findArtworkByName(imageName) : undefined) ??
      FALLBACK_ART;

    out.push({
      id: `details-${slug(`${title}-${artist}`)}`,
      title,
      artist,
      artwork,
      audioUrl: sanitizeAudioUrl(audioMatch[0]),
      duration: 0,
      quality: "Studio quality",
      format: "Studio",
      lyrics: [],
      category: parseDetailCategory(parts),
      credits: `${title}. Credit: ${artist}. All rights reserved to the respective owners.`,
    });
  }

  return out;
}

function manifestTracks(): Track[] {
  return musicManifest.map((m: MusicManifestEntry) => ({
    id: m.id,
    title: m.title,
    artist: m.artist ?? "Walker's Music World",
    artwork:
      m.artwork ??
      (m.artworkName ? findArtworkByName(m.artworkName) : undefined) ??
      FALLBACK_ART,
    audioUrl: m.audioUrl,
    duration: m.duration ?? 0,
    quality: "Studio quality",
    format: "Studio" as const,
    lyrics: m.lyrics ?? [],
    category: m.category,
    credits: m.credits,
  }));
}

function manifestVideos(): Video[] {
  return videoManifest.map((v: VideoManifestEntry) => ({
    id: v.id,
    title: v.title,
    youtubeId: v.youtubeId,
    thumbnail: v.thumbnail ?? youtubeThumbnail(v.youtubeId),
    category: v.category,
    description: v.description,
    credits: v.credits,
  }));
}

function parseVideoCategory(parts: string[]): VideoCategory {
  const allowed: VideoCategory[] = ["official", "remix", "cover", "live", "lyrics", "blog", "instrumental"];
  const type = parts.map((p) => p.trim().toLowerCase()).find((p): p is VideoCategory => allowed.includes(p as VideoCategory));
  return type ?? "official";
}

function youtubeIdFromUrl(url: string) {
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (short) return short[1];
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watch) return watch[1];
  return url.match(/\/embed\/([a-zA-Z0-9_-]{6,})/)?.[1];
}

function driveIdFromUrl(url: string) {
  return url.match(/drive\.google\.com\/file\/d\/([^/]+)/)?.[1];
}

function youtubeThumbnail(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
}

function videoDetails(): Video[] {
  const out: Video[] = [];
  for (const line of videoDetailsRaw.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("*")) continue;
    if (isVaultDetailLine(line)) continue;
    const urlMatch = line.match(/https?:\/\/\S+/i);
    if (!urlMatch) continue;
    const youtubeId = youtubeIdFromUrl(urlMatch[0]);
    const driveId = driveIdFromUrl(urlMatch[0]);
    if (!youtubeId && !driveId) continue;

    const beforeUrl = line.slice(0, urlMatch.index).trim();
    const parts = beforeUrl.split("/").map((p) => p.trim()).filter(Boolean);
    const titleArtistPart = parts.at(-1) ?? "";
    const title = parseDetailTitle(titleArtistPart);
    const artist = parseDetailArtist(titleArtistPart);
    if (!title) continue;

    out.push({
      id: `video-${slug(`${title}-${youtubeId ?? driveId}`)}`,
      title,
      youtubeId,
      embedUrl: driveId ? `https://drive.google.com/file/d/${driveId}/preview` : undefined,
      thumbnail: youtubeId
        ? youtubeThumbnail(youtubeId)
        : `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`,
      category: parseVideoCategory(parts),
      description: `${title} from Walker's Music World.`,
      credits: artist,
    });
  }
  return out;
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
  const merged = [...detailsTracks(), ...fileTracks(), ...githubTracks(), ...manifestTracks()];
  const seen = new Set<string>();
  const unique = merged.filter((track) => {
    const key = track.audioUrl || track.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const publicTracks = unique.filter((track) => !track.vaultType);
  return publicTracks.length ? publicTracks : unique.length ? unique : sampleTracks;
}

export function loadAllVideos(): Video[] {
  const details = videoDetails();
  const merged = details.length ? details : manifestVideos();
  const seen = new Set<string>();
  const unique = merged.filter((video) => {
    const key = video.youtubeId ?? video.embedUrl ?? video.id;
    if (video.vaultType || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique.length ? unique : sampleVideos;
}

export function loadVaultTracks(): Track[] {
  return [];
}

export function loadVaultVideos(): Video[] {
  return [];
}

export function loadPlayableTracks(): Track[] {
  return loadAllTracks();
}

function isVaultDetailLine(line: string) {
  const urlIndex = line.search(/https?:\/\//i);
  return line
    .slice(0, urlIndex >= 0 ? urlIndex : line.length)
    .split("/")
    .some((part) => part.trim().toLowerCase() === "vault");
}
