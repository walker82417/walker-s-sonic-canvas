import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/about")({
  component: () => (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">About</h1>
        <p className="mt-4 text-muted-foreground">
          Walker's Music World is a cinematic listening platform built for people who care about
          sound. Lossless streaming, synced lyrics, no clutter.
        </p>
      </div>
    </AppLayout>
  ),
  head: () => ({ meta: [{ title: "About | Walker's Music World" }] }),
});
