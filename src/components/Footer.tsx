import { Mail, Instagram, Youtube } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SOCIAL } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mx-4 mb-4 mt-12 rounded-3xl glass px-6 py-10 md:px-10">
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-foreground/95 text-background font-bold">W</div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">WALKER'S MUSIC WORLD</div>
              <div className="text-[10px] tracking-[0.18em] text-muted-foreground">WHERE MUSIC MEETS EMOTION</div>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A fan home built out of love for Alan Walker, celebrating the music, the moments and the global Walker community.
          </p>
          <p className="mt-3 max-w-sm text-xs text-muted-foreground">
            All original music and video content copyright belongs to the respective owners.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/videos" className="hover:text-primary">Videos</Link></li>
            <li><Link to="/vault" className="hover:text-primary">Walker Vault</Link></li>
            <li><Link to="/player" className="hover:text-primary">Music Player</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/submissions" className="hover:text-primary">Submissions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Connect</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={SOCIAL.youtube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary">
                <Youtube className="size-4" /> {SOCIAL.youtubeHandle}
              </a>
            </li>
            <li>
              <a href={`mailto:${SOCIAL.email}`} className="inline-flex items-center gap-2 hover:text-primary">
                <Mail className="size-4" /> {SOCIAL.email}
              </a>
            </li>
            <li>
              <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary">
                <Instagram className="size-4" /> {SOCIAL.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
        <span>© {new Date().getFullYear()} Walker's Music World. A fan made tribute. All rights to the original creators.</span>
        <span>Walker#82417</span>
      </div>
    </footer>
  );
}
