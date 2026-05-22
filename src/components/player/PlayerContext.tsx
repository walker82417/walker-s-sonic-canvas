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

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

interface PlayerState {
  tracks: Track[];
  currentIndex: number;
  current: Track;
  queue: Track[];
  upNext: Track[];
  isPlaying: boolean;
  shuffle: boolean;
  repeatMode: RepeatMode;
  externalVideoActive: boolean;
  isBuffering: boolean;
  loadError: string | null;
  hasStarted: boolean;
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
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  pauseForExternalVideo: () => void;
  resumeAfterExternalVideo: () => void;
  seek: (t: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  selectTrack: (id: string) => void;
}

export type RepeatMode = "off" | "all" | "one";

interface AudioAnalysis {
  trimStart: number;
  trimEnd: number;
  beatInterval: number;
  beatOffset: number;
  fadeSeconds: number;
  transitionAt: number;
  playableDuration: number;
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
  const [queueOrder, setQueueOrder] = useState<number[]>(() => tracks.map((_, i) => i));
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [externalVideoActive, setExternalVideoActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const buffersRef = useRef(new Map<string, AudioBuffer>());
  const analysisRef = useRef(new Map<string, AudioAnalysis>());
  const recentRef = useRef<string[]>([]);
  const startedAtRef = useRef(0);
  const pausedAtRef = useRef(0);
  const transitioningRef = useRef(false);
  const skipIndexPlaybackRef = useRef(false);
  const shouldAutoAdvanceRef = useRef(true);
  const playTokenRef = useRef(0);
  const resumeAfterVideoRef = useRef(false);

  const current = tracks[currentIndex];
  const currentRef = useRef(current);
  const currentIndexRef = useRef(currentIndex);
  const isPlayingRef = useRef(isPlaying);
  const volumeRef = useRef(volume);
  const mutedRef = useRef(muted);
  const queueOrderRef = useRef(queueOrder);
  const shuffleRef = useRef(shuffle);
  const repeatModeRef = useRef(repeatMode);

  useEffect(() => {
    currentRef.current = current;
    currentIndexRef.current = currentIndex;
  }, [current, currentIndex]);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    volumeRef.current = volume;
    mutedRef.current = muted;
    const ctx = contextRef.current;
    if (ctx) gainRef.current?.gain.setTargetAtTime(muted ? 0 : volume, ctx.currentTime, 0.02);
  }, [volume, muted]);
  useEffect(() => {
    queueOrderRef.current = queueOrder;
  }, [queueOrder]);
  useEffect(() => {
    shuffleRef.current = shuffle;
  }, [shuffle]);
  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  function getAudioContext() {
    if (!contextRef.current) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      contextRef.current = new AudioCtor();
    }
    return contextRef.current;
  }

  const getAnalysis = useCallback((track: Track, buffer: AudioBuffer) => {
    const cached = analysisRef.current.get(track.id);
    if (cached) return cached;
    const analysis = analyzeAudioBuffer(buffer);
    analysisRef.current.set(track.id, analysis);
    return analysis;
  }, []);

  const rememberPlay = useCallback((track: Track) => {
    recentRef.current = [track.id, ...recentRef.current.filter((id) => id !== track.id)].slice(0, 12);
  }, []);

  const nextIndexFrom = useCallback(
    (fromIndex: number, wrap = true): number | null => {
      const activeQueue = queueOrderRef.current.length ? queueOrderRef.current : tracks.map((_, i) => i);
      const pos = activeQueue.indexOf(fromIndex);
      if (pos === -1) {
        const next = fromIndex + 1;
        return next < tracks.length ? next : wrap ? 0 : null;
      }
      const nextPos = pos + 1;
      return nextPos < activeQueue.length ? activeQueue[nextPos] : wrap ? activeQueue[0] : null;
    },
    [tracks],
  );

  const prevIndexFrom = useCallback(
    (fromIndex: number, wrap = true): number | null => {
      const activeQueue = queueOrderRef.current.length ? queueOrderRef.current : tracks.map((_, i) => i);
      const pos = activeQueue.indexOf(fromIndex);
      if (pos === -1) {
        const prev = fromIndex - 1;
        return prev >= 0 ? prev : wrap ? tracks.length - 1 : null;
      }
      const prevPos = pos - 1;
      return prevPos >= 0 ? activeQueue[prevPos] : wrap ? activeQueue[activeQueue.length - 1] : null;
    },
    [tracks],
  );

  const cleanupBuffers = useCallback((keepIndex: number) => {
    const nextIdx = nextIndexFrom(keepIndex, repeatModeRef.current === "all");
    const prevIdx = prevIndexFrom(keepIndex, true);
    const keep = new Set(
      [tracks[keepIndex]?.id, nextIdx === null ? undefined : tracks[nextIdx]?.id, prevIdx === null ? undefined : tracks[prevIdx]?.id]
        .filter((id): id is string => Boolean(id)),
    );
    for (const key of buffersRef.current.keys()) {
      if (!keep.has(key)) buffersRef.current.delete(key);
    }
  }, [nextIndexFrom, prevIndexFrom, tracks]);

  const preloadTrack = useCallback(async (track: Track, retries = 3): Promise<AudioBuffer> => {
    const cached = buffersRef.current.get(track.id);
    if (cached) {
      getAnalysis(track, cached);
      return cached;
    }

    const ctx = getAudioContext();
    let lastError: unknown;
    for (let attempt = 0; attempt < retries; attempt += 1) {
      try {
        const response = await fetch(track.audioUrl, { mode: "cors" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
        buffersRef.current.set(track.id, buffer);
        getAnalysis(track, buffer);
        return buffer;
      } catch (error) {
        lastError = error;
        await new Promise((resolve) => window.setTimeout(resolve, 350 * (attempt + 1)));
      }
    }
    throw lastError instanceof Error ? lastError : new Error("Unable to decode audio");
  }, [getAnalysis]);

  const stopActiveSource = useCallback((fadeSeconds = 0.08) => {
    const ctx = contextRef.current;
    const source = sourceRef.current;
    const gain = gainRef.current;
    if (!ctx || !source || !gain) return;
    try {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeSeconds);
      source.stop(ctx.currentTime + fadeSeconds + 0.02);
    } catch {
      /* source may already be stopped */
    }
    sourceRef.current = null;
  }, []);

  const startBuffer = useCallback((track: Track, buffer: AudioBuffer, offset = 0, gainValue = mutedRef.current ? 0 : volumeRef.current) => {
    const ctx = getAudioContext();
    const analysis = getAnalysis(track, buffer);
    const safeOffset = clamp(
      offset > 0 ? offset : analysis.trimStart,
      analysis.trimStart,
      Math.max(analysis.trimStart, analysis.trimEnd - 0.05),
    );
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(0, safeOffset, Math.max(0.05, analysis.trimEnd - safeOffset));
    sourceRef.current = source;
    gainRef.current = gain;
    startedAtRef.current = ctx.currentTime - safeOffset;
    pausedAtRef.current = safeOffset;
    setDuration(analysis.playableDuration);
    source.onended = () => {
      if (sourceRef.current !== source || !shouldAutoAdvanceRef.current || transitioningRef.current || !isPlayingRef.current) {
        return;
      }

      if (repeatModeRef.current === "one") {
        pausedAtRef.current = analysis.trimStart;
        startBuffer(track, buffer, analysis.trimStart);
        setCurrentTime(0);
        return;
      }

      const nextIdx = nextIndexFrom(currentIndexRef.current, repeatModeRef.current === "all");
      if (nextIdx === null) {
        pausedAtRef.current = analysis.trimStart;
        setCurrentTime(analysis.playableDuration);
        setIsPlaying(false);
        shouldAutoAdvanceRef.current = false;
        return;
      }
      setCurrentIndex(nextIdx);
    };
    rememberPlay(track);
    return { source, gain, analysis, offset: safeOffset };
  }, [getAnalysis, nextIndexFrom, rememberPlay]);

  const playIndex = useCallback(async (index: number, offset = 0) => {
    const token = ++playTokenRef.current;
    const track = tracks[index];
    if (!track) return;
    setLoadError(null);
    setIsBuffering(true);
    shouldAutoAdvanceRef.current = false;
    stopActiveSource();
    try {
      const ctx = getAudioContext();
      await ctx.resume();
      const buffer = await preloadTrack(track);
      if (token !== playTokenRef.current) return;
      shouldAutoAdvanceRef.current = true;
      const started = startBuffer(track, buffer, offset);
      setCurrentTime(displayTimeFromActual(started.offset, started.analysis));
      setIsPlaying(true);
      setHasStarted(true);
      setIsBuffering(false);
      const nextIdx = nextIndexFrom(index, repeatModeRef.current === "all");
      if (nextIdx !== null) void preloadTrack(tracks[nextIdx]).catch(() => undefined);
      cleanupBuffers(index);
    } catch (e) {
      setIsBuffering(false);
      setIsPlaying(false);
      setLoadError(e instanceof Error ? e.message : "Unable to stream this track.");
    }
  }, [cleanupBuffers, nextIndexFrom, preloadTrack, startBuffer, stopActiveSource, tracks]);

  const play = useCallback(() => {
    void playIndex(currentIndexRef.current, pausedAtRef.current);
  }, [playIndex]);
  const pause = useCallback(() => {
    const ctx = contextRef.current;
    if (ctx) pausedAtRef.current = Math.max(0, ctx.currentTime - startedAtRef.current);
    shouldAutoAdvanceRef.current = false;
    stopActiveSource();
    setIsPlaying(false);
  }, [stopActiveSource]);
  const toggle = useCallback(() => {
    if (isPlayingRef.current) pause();
    else play();
  }, [play, pause]);

  const next = useCallback(
    () => {
      pausedAtRef.current = 0;
      const nextIdx = nextIndexFrom(currentIndexRef.current, true);
      if (nextIdx !== null) setCurrentIndex(nextIdx);
    },
    [nextIndexFrom],
  );
  const prev = useCallback(
    () => {
      pausedAtRef.current = 0;
      const prevIdx = prevIndexFrom(currentIndexRef.current, true);
      if (prevIdx !== null) setCurrentIndex(prevIdx);
    },
    [prevIndexFrom],
  );
  const toggleShuffle = useCallback(() => {
    setShuffle((enabled) => {
      const nextEnabled = !enabled;
      if (!nextEnabled) {
        setQueueOrder(tracks.map((_, i) => i));
        return false;
      }
      setQueueOrder(buildFewerRepeatsQueue(tracks, currentIndexRef.current, recentRef.current));
      return true;
    });
  }, [tracks]);
  const toggleRepeat = useCallback(() => {
    setRepeatMode((mode) => (mode === "off" ? "all" : mode === "all" ? "one" : "off"));
  }, []);
  const pauseForExternalVideo = useCallback(() => {
    resumeAfterVideoRef.current = isPlayingRef.current;
    setExternalVideoActive(true);
    if (isPlayingRef.current) pause();
  }, [pause]);
  const resumeAfterExternalVideo = useCallback(() => {
    setExternalVideoActive(false);
    if (resumeAfterVideoRef.current) {
      resumeAfterVideoRef.current = false;
      play();
    }
  }, [play]);
  const seek = useCallback((t: number) => {
    const track = currentRef.current;
    const buffer = buffersRef.current.get(track.id);
    const analysis = buffer ? getAnalysis(track, buffer) : null;
    const actualTime = analysis ? actualTimeFromDisplay(t, analysis) : t;
    setCurrentTime(analysis ? displayTimeFromActual(actualTime, analysis) : t);
    pausedAtRef.current = actualTime;
    if (isPlayingRef.current) void playIndex(currentIndexRef.current, actualTime);
  }, [getAnalysis, playIndex]);
  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    setMuted(v === 0);
  }, []);
  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);
  const selectTrack = useCallback(
    (id: string) => {
      const idx = tracks.findIndex((t) => t.id === id);
      if (idx >= 0) {
        pausedAtRef.current = 0;
        if (shuffleRef.current) setQueueOrder(buildFewerRepeatsQueue(tracks, idx, recentRef.current));
        setCurrentIndex(idx);
        setIsPlaying(true);
        setHasStarted(true);
      }
    },
    [tracks],
  );

  useEffect(() => {
    setBuffered(0);
    setCurrentTime(0);
    setLoadError(null);
    if (skipIndexPlaybackRef.current) {
      skipIndexPlaybackRef.current = false;
    } else if (isPlaying && !transitioningRef.current) {
      void playIndex(currentIndex, 0);
    }
    // Media Session (lockscreen / notification controls, keeps audio alive in background)
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: current.title,
          artist: current.artist,
          album: "Walker's Music World",
          artwork: current.artwork
            ? [
                { src: current.artwork, sizes: "512x512", type: "image/jpeg" },
                { src: current.artwork, sizes: "256x256", type: "image/jpeg" },
              ]
            : [],
        });
        navigator.mediaSession.setActionHandler("play", () => play());
        navigator.mediaSession.setActionHandler("pause", () => pause());
        navigator.mediaSession.setActionHandler("previoustrack", () => prev());
        navigator.mediaSession.setActionHandler("nexttrack", () => next());
        navigator.mediaSession.setActionHandler("seekto", (d) => {
          if (typeof d.seekTime === "number") seek(d.seekTime);
        });
      } catch {
        /* noop */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const ctx = contextRef.current;
      const buffer = buffersRef.current.get(currentRef.current.id);
      if (!ctx || !isPlayingRef.current || !buffer) return;

      const analysis = getAnalysis(currentRef.current, buffer);
      const elapsed = Math.min(analysis.trimEnd, Math.max(0, ctx.currentTime - startedAtRef.current));
      const remaining = analysis.trimEnd - elapsed;
      setCurrentTime(displayTimeFromActual(elapsed, analysis));
      setDuration(analysis.playableDuration);
      const upcomingIdx = nextIndexFrom(currentIndexRef.current, repeatModeRef.current === "all");
      setBuffered(upcomingIdx !== null && buffersRef.current.has(tracks[upcomingIdx]?.id) ? 1 : 0.35);

      if (remaining <= 10 && upcomingIdx !== null) {
        void preloadTrack(tracks[upcomingIdx]).catch(() => undefined);
      }

      const shouldBeatTransition = elapsed >= analysis.transitionAt || remaining <= Math.min(analysis.fadeSeconds, 0.45);
      if (repeatModeRef.current !== "one" && upcomingIdx !== null && shouldBeatTransition && remaining > 0.12 && !transitioningRef.current) {
        const nextIdx = upcomingIdx;
        const nextTrack = tracks[nextIdx];
        if (!nextTrack) return;
        transitioningRef.current = true;
        void preloadTrack(nextTrack)
          .then((nextBuffer) => {
            const activeSource = sourceRef.current;
            const activeGain = gainRef.current;
            const now = ctx.currentTime;
            const nextNodes = startBuffer(nextTrack, nextBuffer, 0, 0);
            const fadeDuration = Math.max(0.08, remaining);
            activeGain?.gain.linearRampToValueAtTime(0, now + fadeDuration);
            nextNodes.gain.gain.linearRampToValueAtTime(mutedRef.current ? 0 : volumeRef.current, now + fadeDuration);
            window.setTimeout(() => {
              shouldAutoAdvanceRef.current = false;
              try {
                activeSource?.stop();
              } catch {
                /* noop */
              }
              shouldAutoAdvanceRef.current = true;
              sourceRef.current = nextNodes.source;
              gainRef.current = nextNodes.gain;
              pausedAtRef.current = 0;
              skipIndexPlaybackRef.current = true;
              setCurrentIndex(nextIdx);
              setCurrentTime(0);
              cleanupBuffers(nextIdx);
              transitioningRef.current = false;
            }, Math.max(80, fadeDuration * 1000));
          })
          .catch(() => {
            transitioningRef.current = false;
          });
      }
    }, 200);

    const onVisible = () => {
      if (!document.hidden) void contextRef.current?.resume();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [cleanupBuffers, getAnalysis, nextIndexFrom, preloadTrack, startBuffer, tracks]);

  // Reflect playback state to OS
  useEffect(() => {
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    }
  }, [isPlaying]);

  const queue = useMemo(() => {
    const activeOrder = queueOrder.length ? queueOrder : tracks.map((_, i) => i);
    const currentPos = activeOrder.indexOf(currentIndex);
    const orderedIndices =
      currentPos === -1
        ? [currentIndex]
        : repeatMode === "all"
          ? [...activeOrder.slice(currentPos), ...activeOrder.slice(0, currentPos)]
          : activeOrder.slice(currentPos);

    return orderedIndices.map((index) => tracks[index]).filter((track): track is Track => Boolean(track));
  }, [currentIndex, queueOrder, repeatMode, tracks]);

  const upNext = useMemo(() => (repeatMode === "one" ? [current] : queue.slice(1)), [current, queue, repeatMode]);

  const value = useMemo<PlayerState>(
    () => ({
      tracks,
      currentIndex,
      current,
      queue,
      upNext,
      isPlaying,
      shuffle,
      repeatMode,
      externalVideoActive,
      isBuffering,
      loadError,
      hasStarted,
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
      toggleShuffle,
      toggleRepeat,
      pauseForExternalVideo,
      resumeAfterExternalVideo,
      seek,
      setVolume,
      toggleMute,
      selectTrack,
    }),
    [tracks, currentIndex, current, queue, upNext, isPlaying, shuffle, repeatMode, externalVideoActive, isBuffering, loadError, hasStarted, buffered, currentTime, duration, volume, muted, play, pause, toggle, next, prev, toggleShuffle, toggleRepeat, pauseForExternalVideo, resumeAfterExternalVideo, seek, setVolume, toggleMute, selectTrack],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="none" controlsList="nodownload noplaybackrate noremoteplayback" onContextMenu={(e) => e.preventDefault()} />
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}

function analyzeAudioBuffer(buffer: AudioBuffer): AudioAnalysis {
  const sampleRate = buffer.sampleRate;
  const frameSize = 2048;
  const hopSize = 1024;
  const frameCount = Math.max(1, Math.floor((buffer.length - frameSize) / hopSize));
  const channelCount = Math.min(2, buffer.numberOfChannels);
  const channels = Array.from({ length: channelCount }, (_, index) => buffer.getChannelData(index));
  const energies: number[] = [];

  for (let frame = 0; frame < frameCount; frame += 1) {
    const start = frame * hopSize;
    let sum = 0;
    let count = 0;
    for (let channel = 0; channel < channelCount; channel += 1) {
      const data = channels[channel];
      for (let sample = 0; sample < frameSize; sample += 2) {
        const value = data[start + sample] ?? 0;
        sum += value * value;
        count += 1;
      }
    }
    energies.push(Math.sqrt(sum / Math.max(1, count)));
  }

  const peak = energies.reduce((max, energy) => Math.max(max, energy), 0.001);
  const sorted = [...energies].sort((a, b) => a - b);
  const p90 = sorted[Math.floor(sorted.length * 0.9)] ?? peak;
  const silenceThreshold = clamp(Math.max(peak * 0.012, p90 * 0.045), 0.0025, 0.025);
  const firstActiveFrame = findSustainedEnergy(energies, silenceThreshold, 1);
  const lastActiveFrame = findSustainedEnergy(energies, silenceThreshold, -1);
  const hopSeconds = hopSize / sampleRate;
  const rawTrimStart = Math.max(0, firstActiveFrame * hopSeconds - 0.04);
  const rawTrimEnd = Math.min(buffer.duration, (lastActiveFrame * hopSize + frameSize) / sampleRate + 0.14);
  const trimStart = rawTrimEnd - rawTrimStart > 8 ? rawTrimStart : 0;
  const trimEnd = rawTrimEnd - trimStart > 8 ? rawTrimEnd : buffer.duration;
  const onsets = energies.map((energy, index) => Math.max(0, energy - (energies[index - 1] ?? energy) * 1.08));
  const beatInterval = estimateBeatInterval(onsets, hopSeconds);
  const beatOffset = estimateBeatOffset(onsets, hopSeconds, trimStart, beatInterval);
  const fadeSeconds = clamp(beatInterval * 4, 1.2, 3.6);
  const targetTransition = Math.max(trimStart, trimEnd - fadeSeconds);
  const transitionAt = alignToBeatBefore(targetTransition, beatOffset, beatInterval, trimStart);

  return {
    trimStart,
    trimEnd,
    beatInterval,
    beatOffset,
    fadeSeconds,
    transitionAt,
    playableDuration: Math.max(0.05, trimEnd - trimStart),
  };
}

function findSustainedEnergy(energies: number[], threshold: number, direction: 1 | -1) {
  const start = direction === 1 ? 0 : energies.length - 1;
  const end = direction === 1 ? energies.length : -1;
  for (let index = start; index !== end; index += direction) {
    const first = energies[index] ?? 0;
    const second = energies[index + direction] ?? first;
    const third = energies[index + direction * 2] ?? second;
    if (first > threshold && second > threshold && third > threshold) return index;
  }
  return direction === 1 ? 0 : Math.max(0, energies.length - 1);
}

function estimateBeatInterval(onsets: number[], hopSeconds: number) {
  let bestLag = Math.round(0.5 / hopSeconds);
  let bestScore = 0;
  const minLag = Math.max(1, Math.round((60 / 180) / hopSeconds));
  const maxLag = Math.max(minLag + 1, Math.round((60 / 80) / hopSeconds));

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let score = 0;
    for (let index = lag; index < onsets.length; index += 1) {
      score += onsets[index] * onsets[index - lag];
    }
    if (score > bestScore) {
      bestScore = score;
      bestLag = lag;
    }
  }

  return clamp(bestLag * hopSeconds, 0.33, 0.75);
}

function estimateBeatOffset(onsets: number[], hopSeconds: number, trimStart: number, beatInterval: number) {
  const start = Math.max(0, Math.floor(trimStart / hopSeconds));
  const searchFrames = Math.max(8, Math.floor((beatInterval * 8) / hopSeconds));
  const end = Math.min(onsets.length, start + searchFrames);
  let bestFrame = start;
  let bestOnset = 0;

  for (let index = start; index < end; index += 1) {
    if ((onsets[index] ?? 0) > bestOnset) {
      bestOnset = onsets[index];
      bestFrame = index;
    }
  }

  return bestFrame * hopSeconds;
}

function alignToBeatBefore(target: number, beatOffset: number, beatInterval: number, minTime: number) {
  if (target <= minTime || beatInterval <= 0) return minTime;
  const steps = Math.floor((target - beatOffset) / beatInterval);
  return clamp(beatOffset + steps * beatInterval, minTime, target);
}

function displayTimeFromActual(actualTime: number, analysis: AudioAnalysis) {
  return clamp(actualTime - analysis.trimStart, 0, analysis.playableDuration);
}

function actualTimeFromDisplay(displayTime: number, analysis: AudioAnalysis) {
  return clamp(analysis.trimStart + displayTime, analysis.trimStart, Math.max(analysis.trimStart, analysis.trimEnd - 0.05));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildFewerRepeatsQueue(tracks: Track[], currentIndex: number, recentIds: string[]) {
  const rest = tracks.map((_, i) => i).filter((i) => i !== currentIndex);
  const candidates = Array.from({ length: 16 }, () => spreadArtists(shuffleArray(rest), tracks));

  const scored = candidates
    .map((candidate) => {
      const order = [currentIndex, ...candidate];
      let score = 0;
      const lastArtistPos = new Map<string, number>();
      order.forEach((trackIndex, position) => {
        const track = tracks[trackIndex];
        const recentPos = recentIds.indexOf(track.id);
        if (recentPos >= 0) score -= (recentIds.length - recentPos) * Math.max(1, tracks.length - position);
        const lastPos = lastArtistPos.get(track.artist);
        if (lastPos !== undefined) score += Math.min(8, position - lastPos) * 3;
        lastArtistPos.set(track.artist, position);
      });
      return { order, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.order ?? tracks.map((_, i) => i);
}

function shuffleArray<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function spreadArtists(indices: number[], tracks: Track[]) {
  const groups = new Map<string, number[]>();
  indices.forEach((index) => {
    const artist = tracks[index].artist;
    groups.set(artist, [...(groups.get(artist) ?? []), index]);
  });

  const orderedGroups = [...groups.values()].sort((a, b) => b.length - a.length);
  const output: (number | undefined)[] = Array(indices.length);
  for (const group of orderedGroups) {
    const spacing = output.length / group.length;
    group.forEach((index, n) => {
      let pos = Math.round(n * spacing + Math.random() * Math.max(1, spacing * 0.45));
      while (output[pos % output.length] !== undefined) pos += 1;
      output[pos % output.length] = index;
    });
  }
  return output.filter((i): i is number => i !== undefined);
}

