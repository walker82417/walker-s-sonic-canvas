import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { VaultCard } from "@/components/VaultCard";
import { VideoCard } from "@/components/VideoCard";
import { fetchGithubData } from "@/lib/fetchGithubData";
import { vaultVideos, VAULT_TYPES, type VaultType } from "@/lib/data";
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
            onClick={() => { router.invalidate(); reset(); }}
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
      { title: "Walker Vault | Walker's Music World" },
      { name: "description", content: "Unreleased tracks, demos and behind the scenes from Walker's Music World." },
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
  const { tracks } = Route.useLoaderData();
  const [filter, setFilter] = useState<VaultType | "all">("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const filteredTracks = (tracks as import("@/lib/data").Track[]).filter((t) => {
    if (filter !== "all" && t.vaultType !== filter) return false;
    if (q && !`${t.title} ${t.artist}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const filteredVideos = vaultVideos.filter((v) => {
    if (filter !== "all" && v.vaultType !== filter) return false;
    if (q && !v.title.toLowerCase().includes(q)) return false;
    return true;
  });

  const showMusic = filter === "all" || filter === "unreleased-music" || filter === "demo";
  const showVideo = filter === "all" || filter === "unreleased-video" || filter === "bts";

  return (
    <div className="px-4 py-6 md:px-10 md:py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Walker Vault</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">Unreleased & Behind the Scenes</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A private corner of the world. Demos, scrapped takes, video sketches and the work in between.
        </p>
      </header>

      <div className="glass mb-6 flex flex-col gap-4 rounded-2xl p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <div className="flex items-center gap-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the vault..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="-mx-1 flex flex-wrap gap-2 overflow-x-auto">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All</FilterChip>
          {VAULT_TYPES.map((t) => (
            <FilterChip key={t.id} active={filter === t.id} onClick={() => setFilter(t.id)}>
              {t.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {showMusic && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold tracking-tight">Audio</h2>
          {filteredTracks.length === 0 ? (
            <EmptyHint />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTracks.map((t: import("@/lib/data").Track) => <VaultCard key={t.id} track={t} />)}
            </div>
          )}
        </section>
      )}

      {showVideo && (
        <section>
          <h2 className="mb-4 text-xl font-bold tracking-tight">Video</h2>
          {filteredVideos.length === 0 ? (
            <EmptyHint />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          )}
        </section>
      )}

      <div className="mt-12 glass rounded-2xl p-6 text-sm text-muted-foreground">
        We promote your work for free. This platform exists because of you, and it is here to support every fellow Walker's
        creativity by sharing it with the world. Send us your work via{" "}
        <Link to="/submissions" className="text-primary underline">Submissions</Link> and let's amplify it together.
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition",
        active
          ? "border-transparent bg-foreground text-background shadow-glow"
          : "border-border bg-foreground/5 text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function EmptyHint() {
  return (
    <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
      Nothing in this filter yet. Check back soon.
    </div>
  );
}
