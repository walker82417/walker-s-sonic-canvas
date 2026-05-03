import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Video, Library, Disc3, Info, Send, Headphones, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/videos", label: "Videos", icon: Video },
  { to: "/vault", label: "Walker Vault", icon: Library },
  { to: "/player", label: "Music Player", icon: Disc3 },
  { to: "/about", label: "About", icon: Info },
  { to: "/submissions", label: "Submissions", icon: Send },
] as const;

export function Sidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false); // desktop hover-reveal
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sheet on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Desktop edge hover detection
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      if (e.clientX <= 16) setOpen(true);
      else if (e.clientX > 280) setOpen(false);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="glass fixed left-3 top-3 z-50 grid size-10 place-items-center rounded-full md:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </button>

      {/* Edge hover hint (desktop) */}
      <div
        className={cn(
          "fixed left-0 top-0 z-30 hidden h-dvh w-2 md:block",
          "before:absolute before:inset-y-1/3 before:left-0 before:w-[3px] before:rounded-r-full before:bg-foreground/15 before:transition before:content-['']",
          open ? "before:opacity-0" : "before:opacity-100",
        )}
        aria-hidden
      />

      {/* Backdrop (mobile only) */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-md md:hidden"
        />
      )}

      <aside
        onMouseLeave={() => setOpen(false)}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-dvh w-72 shrink-0 flex-col gap-2 p-4",
          "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-[-100%]",
          open && "md:translate-x-0",
        )}
      >
        <div className="glass mb-2 flex items-center justify-between gap-3 rounded-2xl p-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-foreground/95 text-background font-bold">W</div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">WALKER'S</div>
              <div className="text-[10px] tracking-[0.18em] text-muted-foreground">MUSIC WORLD</div>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-muted-foreground md:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
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
                Every detail in studio quality.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
