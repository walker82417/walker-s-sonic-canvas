import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { tracks as sampleTracks, type Track } from "@/lib/data";

interface PlayerState {
  tracks: Track[];
  currentIndex: number;
  current: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
  setVolume: (v: number) => void;
  selectTrack: (id: string) => void;
}

const Ctx = createContext<PlayerState | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [tracks] = useState<Track[]>(sampleTracks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = tracks[currentIndex];

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => setIsPlaying(false));
  }, []);
  const pause = useCallback(() => audioRef.current?.pause(), []);
  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.paused ? play() : pause();
  }, [play, pause]);

  const next = useCallback(
    () => setCurrentIndex((i) => (i + 1) % tracks.length),
    [tracks.length],
  );
  const prev = useCallback(
    () => setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length),
    [tracks.length],
  );
  const seek = useCallback((t: number) => {
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  }, []);
  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);
  const selectTrack = useCallback(
    (id: string) => {
      const idx = tracks.findIndex((t) => t.id === id);
      if (idx >= 0) {
        setCurrentIndex(idx);
        setIsPlaying(true);
      }
    },
    [tracks],
  );

  // auto-play on track change after first interaction
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const value = useMemo<PlayerState>(
    () => ({
      tracks,
      currentIndex,
      current,
      isPlaying,
      currentTime,
      duration,
      volume,
      audioRef,
      play,
      pause,
      toggle,
      next,
      prev,
      seek,
      setVolume,
      selectTrack,
    }),
    [tracks, currentIndex, current, isPlaying, currentTime, duration, volume, play, pause, toggle, next, prev, seek, setVolume, selectTrack],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={current.audioUrl}
        preload="metadata"
        crossOrigin="anonymous"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
      />
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}
