export interface LyricLine {
  time: number;
  text: string;
}

/**
 * Parse LRC lyrics format. Supports:
 *   [mm:ss], [mm:ss.xx], [mm:ss.xxx]
 *   Multiple timestamps per line: [00:12.00][01:24.00] same text
 *   Metadata tags ([ar:], [ti:], [length:]) are ignored
 *   JSON arrays of {time,text} also accepted via parseLyrics()
 */
export function parseLRC(lrc: string): LyricLine[] {
  const lines: LyricLine[] = [];
  const tsRegex = /\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
  const metaRegex = /^\[[a-zA-Z]+:/;

  for (const raw of lrc.split(/\r?\n/)) {
    if (metaRegex.test(raw)) continue;
    const matches = [...raw.matchAll(tsRegex)];
    if (!matches.length) continue;
    const text = raw.replace(tsRegex, "").trim();
    if (!text) continue;
    for (const m of matches) {
      const min = parseInt(m[1], 10);
      const sec = parseInt(m[2], 10);
      const fracStr = m[3] ?? "0";
      const frac = parseInt(fracStr.padEnd(3, "0").slice(0, 3), 10);
      lines.push({ time: min * 60 + sec + frac / 1000, text });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

/** Parse either LRC text or a JSON array string of {time,text}. */
export function parseLyrics(input: string): LyricLine[] {
  const trimmed = input.trim();
  if (trimmed.startsWith("[") && trimmed.includes('"text"')) {
    try {
      const arr = JSON.parse(trimmed) as LyricLine[];
      return arr.filter((l) => typeof l.time === "number" && typeof l.text === "string")
        .sort((a, b) => a.time - b.time);
    } catch {
      // fall through to LRC
    }
  }
  return parseLRC(input);
}

export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
