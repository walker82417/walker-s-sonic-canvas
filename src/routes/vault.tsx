import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Heart, MoreHorizontal, Loader2, AlertTriangle } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { LyricsSync } from "@/components/player/LyricsSync";
import { VaultCard } from "@/components/VaultCard";
import { usePlayer } from "@/components/player/PlayerContext";
import { fetchGithubData } from "@/lib/fetchGithubData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vault")({
  component: VaultPage,
  loader: () => fetchGithubData(),
  pendingComponent: () => (
    <div className="grid min-h-dvh place-items-center text-muted-foreground">
      <div className="flex items-center gap-3">
        <Loader2 className="size-5 animate-spin text-primary" />
        <span className="text-sm">Loading the vault...</span>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="grid min-h-dvh place-items-center px-6">
        <div className="glass max-w-md rounded-2xl p-6 text-center">
          <AlertTriangle className="mx-auto mb-3 size-8 text-destructive" />
          <h2 className="text-lg font-semibold">Couldn't load the vault</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="mt-5 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background"
          >
            Retry
          </button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => <div className="p-10 text-center">Not found</div>,
  head: () => ({
    meta: [
      { title: "Walker Vault — Lossless Audio | Walker's Music World" },
      {
        name: "description",
        content:
          "Stream Walker's Vault — lossless FLAC and WAV with real-time synced lyrics and a cinematic player.",
      },
    ],
  }),
});

function VaultPage() {
  const { tracks } = Route.useLoaderData();
  return (
    <AppLayout tracks={tracks}>
      <VaultInner />
    </AppLayout>
  );
}

function VaultInner() {
  const { tracks, current, currentTime, seek } = usePlayer();
  const [tab, setTab] = useState<"lyrics" | "info">("lyrics");

  return (
    <div className="px-4 py-4 md:px-6">
      {/* Top search bar */}
      <div className="glass mb-4 flex items-center gap-3 rounded-2xl px-5 py-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          placeholder="Search for songs, videos, artists..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Now playing + lyrics */}
      <div className="glass grid gap-6 rounded-3xl p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <div className="overflow-hidden rounded-2xl shadow-elevated">
            <img
              src={current.artwork}
              alt={current.title}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="mt-5 flex items-start justify-between gap-3">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                {current.title}
                <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">HQ</span>
              </h1>
              <p className="mt-1 text-muted-foreground">{current.artist}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="grid size-10 place-items-center rounded-full glass hover:text-primary" aria-label="Like">
                <Heart className="size-4" />
              </button>
              <button className="grid size-10 place-items-center rounded-full glass" aria-label="More">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>
          {/* Faux waveform for cinematic feel */}
          <div className="mt-5 flex h-14 items-center gap-[3px]">
            {Array.from({ length: 80 }).map((_, i) => {
              const progress = currentTime / (current.duration || 1);
              const played = i / 80 < progress;
              const h = 20 + Math.abs(Math.sin(i * 0.7)) * 80;
              return (
                <span
                  key={i}
                  className={cn("w-[3px] rounded-full transition-colors", played ? "bg-foreground/80" : "bg-foreground/20")}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex min-h-[520px] flex-col">
          <div className="flex items-center justify-between border-b border-border">
            <div className="flex gap-6">
              {(["lyrics", "info"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "relative pb-3 text-sm font-semibold uppercase tracking-widest transition",
                    tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
                  )}
                >
                  {t}
                  {tab === t && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {tab === "lyrics" ? (
              <LyricsSync lyrics={current.lyrics} currentTime={currentTime} onSeek={seek} />
            ) : (
              <div className="space-y-4 py-6 text-sm">
                <Info label="Title" value={current.title} />
                <Info label="Artist" value={current.artist} />
                <Info label="Format" value={current.format} />
                <Info label="Quality" value={current.quality} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Library */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold tracking-tight">From the Vault</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tracks.map((t) => (
            <VaultCard key={t.id} track={t} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/50 pb-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
