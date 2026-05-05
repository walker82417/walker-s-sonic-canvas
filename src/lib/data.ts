import albumFade from "@/assets/album-fade-beyond.jpg";
import albumNight from "@/assets/album-endless-night.jpg";
import albumLight from "@/assets/album-shining-light.jpg";
import type { LyricLine } from "./lrc";

export type VaultType = "unreleased-music" | "unreleased-video" | "demo" | "bts";
export type VideoCategory = "official" | "remix" | "cover" | "live" | "lyrics" | "blog";
export type MusicCategory = "official" | "remix" | "cover";

export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  audioUrl: string;
  duration: number;
  quality: string;
  format: "HQ" | "Studio" | "Standard";
  lyrics: LyricLine[];
  vaultType?: VaultType;
  year?: number;
  category?: MusicCategory;
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
  vaultType?: VaultType;
  year?: number;
  category?: VideoCategory;
  description?: string;
  credits?: string;
}

export const VAULT_TYPES: { id: VaultType; label: string }[] = [
  { id: "unreleased-music", label: "Unreleased Music" },
  { id: "unreleased-video", label: "Unreleased Videos" },
  { id: "demo", label: "Demos" },
  { id: "bts", label: "Behind the Scenes" },
];

export const VIDEO_CATEGORIES: { id: VideoCategory; label: string }[] = [
  { id: "official", label: "Official" },
  { id: "remix", label: "Remix" },
  { id: "cover", label: "Covers" },
  { id: "live", label: "Live" },
  { id: "lyrics", label: "Lyrics" },
  { id: "blog", label: "Blog" },
];

const fadeBeyondLyrics: LyricLine[] = [
  { time: 0, text: "I was lost in the dark" },
  { time: 7, text: "Searching for a spark" },
  { time: 14, text: "You came and made it clear" },
  { time: 21, text: "You're the hope I hold so near" },
  { time: 28, text: "In this endless night" },
  { time: 35, text: "You're the shining light" },
  { time: 42, text: "Guiding me through the storm" },
  { time: 49, text: "Keeping me safe and warm" },
  { time: 56, text: "I'll rise, I'll stand" },
  { time: 63, text: "With you, I'll make my way" },
  { time: 70, text: "Through the fire and rain" },
  { time: 77, text: "You'll never fade away" },
  { time: 90, text: "Fade beyond the silence" },
  { time: 100, text: "Beyond the calling sky" },
  { time: 110, text: "We carry on together" },
  { time: 120, text: "We will never say goodbye" },
];

export const tracks: Track[] = [
  {
    id: "fade-beyond",
    title: "Fade Beyond",
    artist: "Walker's Music World",
    artwork: albumFade,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    duration: 222,
    quality: "Studio quality",
    format: "Studio",
    lyrics: fadeBeyondLyrics,
    vaultType: "unreleased-music",
    year: 2025,
    category: "official",
  },
  {
    id: "endless-night",
    title: "Endless Night",
    artist: "Walker's Music World",
    artwork: albumNight,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
    duration: 180,
    quality: "Studio quality",
    format: "Studio",
    lyrics: [
      { time: 0, text: "Stars above are calling out my name" },
      { time: 8, text: "Through the silence I can hear them sing" },
      { time: 16, text: "In the endless night I find my way" },
      { time: 24, text: "Every step a quiet offering" },
      { time: 40, text: "Hold the moment in your hand" },
      { time: 48, text: "Let it slip into the dark" },
      { time: 56, text: "Every breath a gentle stand" },
      { time: 64, text: "Every heartbeat leaves a mark" },
    ],
    vaultType: "demo",
    year: 2024,
    category: "remix",
  },
  {
    id: "shining-light",
    title: "Shining Light",
    artist: "Walker's Music World",
    artwork: albumLight,
    audioUrl: "https://cdn.pixabay.com/download/audio/2023/06/28/audio_8eecf3c7f6.mp3",
    duration: 195,
    quality: "High quality",
    format: "HQ",
    lyrics: [
      { time: 0, text: "Walking down a winding road" },
      { time: 8, text: "Carrying the weight alone" },
      { time: 16, text: "Then I saw a shining light" },
      { time: 24, text: "Calling me right back home" },
    ],
    vaultType: "unreleased-music",
    year: 2025,
    category: "cover",
  },
];

export const videos: Video[] = [
  { id: "1", title: "Faded, Walker Cover", youtubeId: "60ItHLz5WEA", thumbnail: "https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg", category: "cover", description: "A heartfelt cover of Faded by Alan Walker.", credits: "Original by Alan Walker. All rights to the original creators." },
  { id: "2", title: "Alone, Acoustic Session", youtubeId: "1-xGerv5FOk", thumbnail: "https://i.ytimg.com/vi/1-xGerv5FOk/hqdefault.jpg", category: "live", description: "An intimate acoustic take recorded live.", credits: "Original by Alan Walker. All rights to the original creators." },
  { id: "3", title: "Sing Me to Sleep", youtubeId: "2i2khp_npdE", thumbnail: "https://i.ytimg.com/vi/2i2khp_npdE/hqdefault.jpg", category: "official", description: "Official Walker's Music World feature.", credits: "All rights to the original creators." },
  { id: "4", title: "All Falls Down, Lyrics", youtubeId: "6RLLOEzdxsM", thumbnail: "https://i.ytimg.com/vi/6RLLOEzdxsM/hqdefault.jpg", category: "lyrics", description: "Lyric visual for All Falls Down.", credits: "All rights to the original creators." },
  { id: "5", title: "Darkside, Live", youtubeId: "M-P4QBt-FWw", thumbnail: "https://i.ytimg.com/vi/M-P4QBt-FWw/hqdefault.jpg", category: "live", description: "A live performance of Darkside.", credits: "All rights to the original creators." },
  { id: "6", title: "Diamond Heart Remix", youtubeId: "Cp5_uo3W9hM", thumbnail: "https://i.ytimg.com/vi/Cp5_uo3W9hM/hqdefault.jpg", category: "remix", description: "A community remix of Diamond Heart.", credits: "All rights to the original creators." },
];

export const vaultVideos: Video[] = [
  { id: "v1", title: "New Single Teaser", youtubeId: "60ItHLz5WEA", thumbnail: "https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg", vaultType: "unreleased-video", year: 2025 },
  { id: "v2", title: "Studio Session, Fade Beyond", youtubeId: "1-xGerv5FOk", thumbnail: "https://i.ytimg.com/vi/1-xGerv5FOk/hqdefault.jpg", vaultType: "bts", year: 2025 },
  { id: "v3", title: "Acoustic Demo Take 1", youtubeId: "2i2khp_npdE", thumbnail: "https://i.ytimg.com/vi/2i2khp_npdE/hqdefault.jpg", vaultType: "demo", year: 2024 },
];

export const SOCIAL = {
  email: "walkersmusicworld@gmail.com",
  instagram: "https://instagram.com/walkersmuciworld",
  instagramHandle: "@walkersmuciworld",
  youtube: "https://youtube.com/@walkersmusicworld",
  youtubeHandle: "Walker's Music World",
};
