// External / linked audio. Two ways to add songs:
//
// 1) `githubSongs` — set GITHUB_BASE once, then list each track by name. The
//    loader builds the audio + thumbnail URLs for you.
//
// 2) `musicManifest` — full control. Provide explicit URLs and credits.

import type { MusicCategory } from "@/lib/content";

export interface MusicManifestEntry {
  id: string;
  title: string;
  category: MusicCategory;
  audioUrl: string;
  artwork?: string;
  /** Filename (without extension) of an image inside src/content/music/<category>/ */
  artworkName?: string;
  artist?: string;       // original credit owner
  credits?: string;      // longer credit string
  duration?: number;
  lyrics?: { time: number; text: string }[];
}

export const musicManifest: MusicManifestEntry[] = [
  {
    id: "remix-diamond-heart-syn-cole",
    title: "Diamond Heart (feat. Sophia Somajo)",
    category: "remix",
    audioUrl:
      "https://res.cloudinary.com/dxfyuokaf/video/upload/v1778245886/Alan_Walker_-_Diamond_Heart_feat._Sophia_Somajo_Syn_Cole_Remix_-_Alan_Walker_gedsxj.mp3",
    artworkName: "Diamond Heat Feat. Sophia_Alan walker & syn cole remix",
    artist: "Alan Walker & Syn Cole (Remix)",
    credits:
      "Diamond Heart (feat. Sophia Somajo) — Syn Cole Remix. Original by Alan Walker. All rights reserved to the respective owners.",
  },
  {
    id: "remix-different-world-niviro",
    title: "Different World (NIVIRO Remix)",
    category: "remix",
    audioUrl:
      "https://res.cloudinary.com/dxfyuokaf/video/upload/v1778245904/Alan_Walker_-_Different_World_NIVIRO_Remix_-_NIVIRO_z279ko.mp3",
    artworkName: "Different World NIVIRO remix_Alan Walker& NIVIRO",
    artist: "Alan Walker & NIVIRO",
    credits:
      "Different World (NIVIRO Remix). Original by Alan Walker. All rights reserved to the respective owners.",
  },
  {
    id: "remix-fade-marnik-blazars",
    title: "Fade (Marnik & Blazars Remix)",
    category: "remix",
    audioUrl:
      "https://res.cloudinary.com/dxfyuokaf/video/upload/v1778245911/Alan_Walker_-_Fade_Marnik_Blazars_Remix_Alan_Walker_-_intro_-_E-Sounds_pu4x31.mp3",
    artworkName: "Fade (Marnik & Blazars Remix)",
    artist: "Alan Walker, Marnik, Blazars & E-Sounds",
    credits:
      "Fade (Marnik & Blazars Remix) with Alan Walker intro by E-Sounds. All rights reserved to the respective owners.",
  },
];

// ---- Simple GitHub-hosted songs ---------------------------------------------
export const GITHUB_BASE = "";

export interface GithubSong {
  name: string;
  category?: MusicCategory;
  audioExt?: string;
  artExt?: string;
  hasLyrics?: boolean;
}

export const githubSongs: GithubSong[] = [];
