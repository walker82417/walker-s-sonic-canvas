import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { usePlayer } from "@/components/player/PlayerContext";
import { cn } from "@/lib/utils";
import { Search, Heart } from "lucide-react";
import { formatTime } from "@/lib/lrc";
import { CreditsButton } from "@/components/CreditsButton";
import type { MusicCategory } from "@/lib/data";

export const Route = createFileRoute("/player")({
  component: PlayerPage,
  head: () => ({
    meta: [
      { title: "Walker Player | Walker's Music World" },
      {
        name: "description",
        content: "Browse the full library, play songs and follow along with the lyrics.",
      },
    ],
  }),
});

function PlayerPage() {
  return (
    <AppLayout>
      <Inner />
    </AppLayout>
  );
}

const CATEGORIES: { id: MusicCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "official", label: "Official" },
  { id: "remix", label: "Remix" },
  { id: "cover", label: "Covers" },
];

function Inner() {
  const { tracks, current, isPlaying, selectTrack } = usePlayer();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<MusicCategory | "all">("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return tracks.filter((t) => {
      if (t.vaultType) return false;
      if (cat !== "all" && t.category !== cat) return false;
      if (!needle) return true;
      return t.title.toLowerCase().includes(needle) || t.artist.toLowerCase().includes(needle);
    });
  }, [tracks, q, cat]);

  return (
    <div className="mx-auto w-full max-w-[100svw] overflow-hidden px-3 py-5 sm:px-4 md:px-6 lg:px-8 2xl:max-w-screen-2xl 2xl:px-10 2xl:py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Walker Player
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Library</h1>
      </header>

      <section className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="glass relative flex min-w-0 flex-1 basis-full items-center gap-2 rounded-full px-4 py-2 sm:basis-[220px]">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search songs"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex max-w-full gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  cat === c.id
                    ? "bg-foreground text-background"
                    : "bg-foreground/5 text-muted-foreground hover:text-foreground",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="player-surface ring-soft w-full max-w-full overflow-hidden rounded-2xl">
          <ul className="divide-y divide-border">
            {filtered.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                No songs found.
              </li>
            )}
            {filtered.map((t, i) => {
              const active = t.id === current.id;
              return (
                <li key={t.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => selectTrack(t.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectTrack(t.id);
                      }
                    }}
                    className={cn(
                      "group flex w-full max-w-full cursor-pointer items-center gap-2 px-2 py-3 text-left transition hover:bg-foreground/5 sm:gap-3 sm:px-3",
                      active && "bg-foreground/5",
                    )}
                  >
                    <div className="grid w-6 shrink-0 place-items-center text-xs tabular-nums text-muted-foreground sm:w-7">
                      {active && isPlaying ? (
                        <span className="flex h-3 items-end gap-0.5">
                          <span className="h-2 w-0.5 animate-pulse bg-primary" />
                          <span className="h-3 w-0.5 animate-pulse bg-primary [animation-delay:120ms]" />
                          <span className="h-1.5 w-0.5 animate-pulse bg-primary [animation-delay:240ms]" />
                        </span>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <img
                      src={t.artwork}
                      alt=""
                      loading="lazy"
                      className="size-10 shrink-0 rounded-md bg-black/40 object-contain sm:size-11"
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "line-clamp-2 text-sm font-semibold leading-snug sm:truncate",
                          active && "text-primary",
                        )}
                      >
                        {t.title}
                      </div>
                      <div className="line-clamp-1 text-xs text-muted-foreground">
                        {t.artist} {t.category ? `· ${t.category}` : ""}
                      </div>
                    </div>
                    <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">
                      {t.duration ? formatTime(t.duration) : "-"}
                    </span>
                    <div className="ml-2 hidden sm:block">
                      <CreditsButton
                        title={t.title}
                        artist={t.artist}
                        credits={t.credits}
                        compact
                      />
                    </div>
                    <Heart className="ml-2 hidden size-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100 sm:block" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
