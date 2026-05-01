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
  isBuffering: boolean;
  loadError: string | null;
  buffered: number;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  selectTrack: (id: string) => void;
}

const Ctx = createContext<PlayerState | null>(null);

export function PlayerProvider({
  children,
  tracks: tracksProp,
}: {
  children: ReactNode;
  tracks?: Track[];
}) {
  const [tracks] = useState<Track[]>(tracksProp?.length ? tracksProp : sampleTracks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [buffered, setBuffered] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = tracks[currentIndex];

  const play = useCallback(() => {
    setLoadError(null);
    audioRef.current?.play().catch((e) => {
      setIsPlaying(false);
      setLoadError(e?.message || "Playback failed");
    });
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
    setMuted(v === 0);
    if (audioRef.current) {
      audioRef.current.volume = v;
      audioRef.current.muted = v === 0;
    }
  }, []);
  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
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

  useEffect(() => {
    if (!audioRef.current) return;
    setBuffered(0);
    setCurrentTime(0);
    setLoadError(null);
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
      isBuffering,
      loadError,
      buffered,
      currentTime,
      duration,
      volume,
      muted,
      audioRef,
      play,
      pause,
      toggle,
      next,
      prev,
      seek,
      setVolume,
      toggleMute,
      selectTrack,
    }),
    [tracks, currentIndex, current, isPlaying, isBuffering, loadError, buffered, currentTime, duration, volume, muted, play, pause, toggle, next, prev, seek, setVolume, toggleMute, selectTrack],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={current.audioUrl}
        preload="metadata"
        crossOrigin="anonymous"
        controlsList="nodownload noplaybackrate noremoteplayback"
        onContextMenu={(e) => e.preventDefault()}
        onPlay={() => {
          setIsPlaying(true);
          setLoadError(null);
        }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onPlaying={() => setIsBuffering(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onProgress={(e) => {
          const a = e.currentTarget;
          if (a.buffered.length && a.duration) {
            setBuffered(a.buffered.end(a.buffered.length - 1) / a.duration);
          }
        }}
        onError={() => {
          setIsBuffering(false);
          setIsPlaying(false);
          setLoadError("Unable to stream this track.");
        }}
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

