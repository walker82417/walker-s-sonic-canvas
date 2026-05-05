// External / linked audio. Use this when the audio is hosted elsewhere
// (GitHub raw, a CDN, etc). For files dropped directly into the
// official/remix/cover folders, you do NOT need to edit this file.
//
// Each entry MUST set its category. The same-named .lrc lyrics file under
// the same folder is auto loaded if present.

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

export const musicManifest: MusicManifestEntry[] = [
  // Example:
  // {
  //   id: "faded-cover",
  //   title: "Faded — Walker Cover",
  //   category: "cover",
  //   audioUrl: "https://raw.githubusercontent.com/<user>/<repo>/main/audio/faded.mp3",
  //   artwork: "https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg",
  // },
];
