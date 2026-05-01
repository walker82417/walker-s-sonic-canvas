import { Link, useLocation } from "@tanstack/react-router";
import { Home, Video, Library, ListMusic, Info, Mail, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/videos", label: "Videos", icon: Video },
  { to: "/vault", label: "Walker Vault", icon: Library },
  { to: "/playlists", label: "Playlists", icon: ListMusic },
  { to: "/about", label: "About", icon: Info },
  { to: "/contact", label: "Contact", icon: Mail },
] as const;

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-2 p-4 md:flex">
      <div className="glass mb-2 rounded-2xl p-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-foreground/95 text-background font-bold">W</div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">WALKER'S</div>
            <div className="text-[10px] tracking-[0.18em] text-muted-foreground">MUSIC WORLD</div>
          </div>
        </Link>
      </div>

      <nav className="glass flex-1 rounded-2xl p-3">
        <ul className="space-y-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-foreground/5 text-foreground"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
            <Headphones className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">LOSSLESS AUDIO</div>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">
              Experience every detail in high quality sound.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
