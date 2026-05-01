import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { tracks } from "@/lib/data";
import { VaultCard } from "@/components/VaultCard";

export const Route = createFileRoute("/playlists")({
  component: () => (
    <AppLayout>
      <div className="px-4 py-6 md:px-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Playlists</h1>
          <p className="mt-2 text-muted-foreground">Curated collections from the vault.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tracks.map((t) => <VaultCard key={t.id} track={t} />)}
        </div>
      </div>
    </AppLayout>
  ),
  head: () => ({ meta: [{ title: "Playlists | Walker's Music World" }] }),
});
