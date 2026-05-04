import { type ReactNode, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { MusicPlayer } from "./player/MusicPlayer";
import { PlayerProvider } from "./player/PlayerContext";
import { Footer } from "./Footer";
import { CopyrightNotice } from "./CopyrightNotice";
import type { Track } from "@/lib/data";

export function AppLayout({
  children,
  tracks,
  hideFooter = false,
}: {
  children: ReactNode;
  tracks?: Track[];
  hideFooter?: boolean;
}) {
  useEffect(() => {
    const onContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", onContext);
    return () => document.removeEventListener("contextmenu", onContext);
  }, []);

  return (
    <PlayerProvider tracks={tracks}>
      <CopyrightNotice />
      <div className="min-h-dvh">
        <Sidebar />
        <main className="pb-32">{children}</main>
        {!hideFooter && <Footer />}
      </div>
      <MusicPlayer />
    </PlayerProvider>
  );
}
