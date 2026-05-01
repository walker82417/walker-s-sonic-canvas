export interface LyricLine {
  time: number;
  text: string;
}

/** Parse LRC format: [mm:ss.xx] line text */
export function parseLRC(lrc: string): LyricLine[] {
  const lines: LyricLine[] = [];
  const regex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;
  for (const raw of lrc.split(/\r?\n/)) {
    const matches = [...raw.matchAll(regex)];
    if (!matches.length) continue;
    const text = raw.replace(regex, "").trim();
    if (!text) continue;
    for (const m of matches) {
      const min = parseInt(m[1], 10);
      const sec = parseInt(m[2], 10);
      const ms = m[3] ? parseInt(m[3].padEnd(3, "0"), 10) : 0;
      lines.push({ time: min * 60 + sec + ms / 1000, text });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
