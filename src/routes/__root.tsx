import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { PlayerProvider } from "@/components/player/PlayerContext";
import { MusicPlayer } from "@/components/player/MusicPlayer";
import { CopyrightNotice } from "@/components/CopyrightNotice";
import { useEffect } from "react";
import { loadAllTracks } from "@/lib/content";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Walker's Music World" },
      { name: "description", content: "Where music meets emotion and energy" },
      { name: "author", content: "Walker's Music World" },
      { property: "og:title", content: "Walker's Music World" },
      { property: "og:description", content: "Where music meets emotion and energy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Walker's Music World" },
      { name: "twitter:description", content: "Where music meets emotion and energy" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  // Right-click protection across the whole app
  useEffect(() => {
    const onContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", onContext);
    return () => document.removeEventListener("contextmenu", onContext);
  }, []);

  return (
    <PlayerProvider tracks={loadAllTracks()}>
      <CopyrightNotice />
      <Outlet />
      <MusicPlayer />
    </PlayerProvider>
  );
}
