import { type ReactNode, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { MusicPlayer } from "./player/MusicPlayer";
import { PlayerProvider } from "./player/PlayerContext";

export function AppLayout({ children }: { children: ReactNode }) {
  // Basic protection: disable right-click globally
  useEffect(() => {
    const onContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", onContext);
    return () => document.removeEventListener("contextmenu", onContext);
  }, []);

  return (
    <PlayerProvider>
      <div className="flex min-h-dvh">
        <Sidebar />
        <main className="flex-1 pb-32">{children}</main>
      </div>
      <MusicPlayer />
    </PlayerProvider>
  );
}
