import { type ReactNode, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { MusicPlayer } from "./player/MusicPlayer";
import { PlayerProvider } from "./player/PlayerContext";
import type { Track } from "@/lib/data";

export function AppLayout({ children, tracks }: { children: ReactNode; tracks?: Track[] }) {
  // Basic protection: disable right-click globally
  useEffect(() => {
    const onContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", onContext);
    return () => document.removeEventListener("contextmenu", onContext);
  }, []);

  return (
    <PlayerProvider tracks={tracks}>
      <div className="flex min-h-dvh">
        <Sidebar />
        <main className="flex-1 pb-32 md:pb-28">{children}</main>
      </div>
      <MusicPlayer />
    </PlayerProvider>
  );
}

