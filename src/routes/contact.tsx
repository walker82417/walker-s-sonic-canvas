import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/contact")({
  component: () => (
    <AppLayout>
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
        <p className="mt-4 text-muted-foreground">
          Reach out at <a className="text-primary underline" href="mailto:hello@walkers.music">hello@walkers.music</a>.
        </p>
      </div>
    </AppLayout>
  ),
  head: () => ({ meta: [{ title: "Contact | Walker's Music World" }] }),
});
