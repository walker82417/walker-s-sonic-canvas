// External / linked audio. Two ways to add songs:
//
// 1) `githubSongs` — easiest. Set GITHUB_BASE once, then list each track by
//    name. The loader builds the audio + thumbnail URLs for you. The audio
//    file extension is auto-detected (mp3/m4a/wav/flac/ogg) and the
//    thumbnail extension is auto-detected (jpg/jpeg/png/webp).
//
// 2) `musicManifest` — full control. Provide explicit URLs.
//
// Either way, drop a `<name>.lrc` lyrics file in your repo and reference its
// URL via `lyricsUrl` in githubSongs to get synced lyrics.

import type { MusicCategory } from "@/lib/content";

export interface MusicManifestEntry {
  id: string;
  title: string;
  category: MusicCategory;
  audioUrl: string;
  artwork?: string;
  duration?: number;
  lyrics?: { time: number; text: string }[];
}

export const musicManifest: MusicManifestEntry[] = [];

// ---- Simple GitHub-hosted songs ---------------------------------------------
//
// Set this to your raw GitHub base, e.g.
//   "https://raw.githubusercontent.com/<user>/<repo>/main/songs"
// Folder layout in your repo (recommended):
//   songs/
//     <Song Name>.mp3
//     <Song Name>.jpg     (thumbnail, same name as the song)
//     <Song Name>.lrc     (optional lyrics)
export const GITHUB_BASE = "";

export interface GithubSong {
  name: string;                  // file basename without extension, also the display title
  category?: MusicCategory;      // defaults to "official"
  audioExt?: string;             // override extension if not mp3
  artExt?: string;               // override thumbnail extension if not jpg
  hasLyrics?: boolean;           // looks for <name>.lrc in the same folder
}

export const githubSongs: GithubSong[] = [
  // Example after you set GITHUB_BASE above:
  // { name: "Faded Walker Cover", hasLyrics: true },
  // { name: "Alone Acoustic", category: "cover", audioExt: "m4a" },
];
