import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

/**
 * Page wrapper. PlayerProvider, CopyrightNotice and MusicPlayer live in the
 * root route so they persist across navigation (and the audio element keeps
 * playing without remounting).
 */
export function AppLayout({
  children,
  hideFooter = false,
}: {
  children: ReactNode;
  // kept for backwards compatibility with old route call sites
  tracks?: unknown;
  hideFooter?: boolean;
}) {
  return (
    <div className="min-h-dvh w-full max-w-[100svw] overflow-x-hidden">
      <Sidebar />
      <main className="w-full max-w-[100svw] overflow-x-hidden pb-32">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
