// All videos are listed here. Each entry must set a category.
// Categories: official, remix, cover, live, lyrics, blog.
//
// `youtubeId` is the 11-character ID from a YouTube URL.
// `description` and `credits` show up in the expanded video panel.

import type { VideoCategory } from "@/lib/content";

export interface VideoManifestEntry {
  id: string;
  youtubeId: string;
  title: string;
  category: VideoCategory;
  description?: string;
  credits?: string;
  thumbnail?: string; // optional override; defaults to YouTube hqdefault
}

export const videoManifest: VideoManifestEntry[] = [
  {
    id: "faded-cover",
    youtubeId: "60ItHLz5WEA",
    title: "Faded, Walker Cover",
    category: "cover",
    description: "A heartfelt cover featured on Walker's Music World.",
    credits: "Original by Alan Walker. All rights to the original creators.",
  },
  {
    id: "alone-acoustic",
    youtubeId: "1-xGerv5FOk",
    title: "Alone, Acoustic Session",
    category: "live",
    description: "An intimate acoustic take recorded live.",
    credits: "Original by Alan Walker. All rights to the original creators.",
  },
  {
    id: "sing-me-to-sleep",
    youtubeId: "2i2khp_npdE",
    title: "Sing Me to Sleep",
    category: "official",
    description: "Official Walker's Music World feature.",
    credits: "All rights to the original creators.",
  },
  {
    id: "all-falls-down-lyrics",
    youtubeId: "6RLLOEzdxsM",
    title: "All Falls Down, Lyrics",
    category: "lyrics",
    description: "Lyric visual for All Falls Down.",
    credits: "All rights to the original creators.",
  },
  {
    id: "darkside-live",
    youtubeId: "M-P4QBt-FWw",
    title: "Darkside, Live",
    category: "live",
    description: "A live performance of Darkside.",
    credits: "All rights to the original creators.",
  },
  {
    id: "diamond-heart-remix",
    youtubeId: "Cp5_uo3W9hM",
    title: "Diamond Heart Remix",
    category: "remix",
    description: "A community remix of Diamond Heart.",
    credits: "All rights to the original creators.",
  },
];
