import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Bell, ArrowRight, Disc3, Library, Send, Youtube, Instagram, Mail } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SOCIAL } from "@/lib/data";
import { loadAllVideos } from "@/lib/content";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Walker's Music World, A Home for Every Walker" },
      { name: "description", content: "Walker's Music World, the official YouTube channel home celebrating Alan Walker's music and the global Walker community." },
      { property: "og:title", content: "Walker's Music World" },
      { property: "og:description", content: "Where music meets emotion and energy." },
    ],
  }),
});

function Index() {
  const videos = loadAllVideos();
  const featured = videos.slice(0, 6);

  return (
    <AppLayout>
      {/* HERO — channel intro */}
      <section className="relative isolate mx-3 my-3 overflow-hidden rounded-3xl md:mx-4 md:my-4">
        <img src={heroBg} alt="" className="absolute inset-0 size-full object-cover opacity-50" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute -top-32 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative grid min-h-[88vh] place-items-center px-6 py-20 text-center">
          <div className="flex max-w-3xl flex-col items-center">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-[11px] tracking-[0.25em] text-muted-foreground backdrop-blur"
            >
              YOUTUBE · WALKER'S MUSIC WORLD
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight text-glow md:text-7xl"
            >
              Walker's Music World
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg"
            >
              Where music meets emotion and energy. A home for every Walker out there, built out of pure love for Alan Walker's sound and the family that lives inside it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background shadow-glow transition hover:scale-[1.03]"
              >
                <Bell className="size-4" /> Subscribe on YouTube
              </a>
              <Link
                to="/videos"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-7 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-foreground/10"
              >
                <Play className="size-4 fill-current" /> Watch the videos
              </Link>
            </motion.div>

            <div className="mt-10 flex items-center gap-5 text-muted-foreground">
              <a href={SOCIAL.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="transition hover:text-primary">
                <Youtube className="size-5" />
              </a>
              <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="transition hover:text-primary">
                <Instagram className="size-5" />
              </a>
              <a href={`mailto:${SOCIAL.email}`} aria-label="Email" className="transition hover:text-primary">
                <Mail className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST VIDEOS */}
      <section className="mx-3 mt-12 md:mx-4">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">From the channel</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Latest videos</h2>
          </div>
          <Link to="/videos" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary">
            See all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v) => (
            <Link
              key={v.id}
              to="/videos"
              className="group overflow-hidden rounded-2xl glass shadow-elevated transition hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="relative aspect-video bg-black">
                <img src={v.thumbnail} alt={v.title} loading="lazy" className="size-full object-cover transition group-hover:scale-105" />
                <span className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                  <span className="grid size-14 place-items-center rounded-full bg-foreground/90 text-background shadow-glow">
                    <Play className="size-6 fill-current pl-0.5" />
                  </span>
                </span>
                {v.category && (
                  <span className="absolute left-3 top-3 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest backdrop-blur">
                    {v.category}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="truncate font-semibold">{v.title}</h3>
                <p className="text-xs text-muted-foreground">Walker's Music World</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* EXPLORE TILES */}
      <section className="mx-3 mt-14 md:mx-4">
        <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Explore the world</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Tile to="/videos" icon={Youtube} title="Videos" desc="Official, remixes, covers, live and more." />
          <Tile to="/vault" icon={Library} title="Walker Vault" desc="Unreleased music and behind the scenes." />
          <Tile to="/player" icon={Disc3} title="Music Player" desc="Sit back and let the music play." />
          <Tile to="/submissions" icon={Send} title="Submissions" desc="Share your own creativity with us." />
        </div>
      </section>

      {/* COMMUNITY CALL */}
      <section className="mx-3 mt-14 md:mx-4">
        <div className="glass relative overflow-hidden rounded-3xl p-8 md:p-12">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-accent/20 blur-3xl" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">The Walker family</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Help us reach the next milestone, 50K Walkers strong.
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Subscribe, share a video with a friend, and drop your favourite Alan Walker track in the comments. Every Walker counts.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={SOCIAL.youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-glow transition hover:scale-[1.03]"
            >
              <Bell className="size-4" /> Subscribe
            </a>
            <Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-foreground/10">
              Read the story <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function Tile({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: "/videos" | "/vault" | "/player" | "/submissions";
  icon: typeof Disc3;
  title: string;
  desc: string;
}) {
  return (
    <Link to={to} className="group glass relative overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-glow">
      <div className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <ArrowRight className="absolute right-5 top-5 size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}
