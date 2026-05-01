import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { VideoCard } from "@/components/VideoCard";
import { videos } from "@/lib/data";

export const Route = createFileRoute("/videos")({
  component: VideosPage,
  head: () => ({
    meta: [
      { title: "Videos | Walker's Music World" },
      { name: "description", content: "Watch curated YouTube videos from Walker's Music World." },
    ],
  }),
});

function VideosPage() {
  return (
    <AppLayout>
      <div className="px-4 py-6 md:px-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Videos</h1>
          <p className="mt-2 text-muted-foreground">Live sessions, covers and visual experiences.</p>
        </header>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
