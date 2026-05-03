import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Headphones, Sparkles, Disc3, Library, Send, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Walker's Music World — Where Music Meets Emotion and Energy" },
      { name: "description", content: "Walker's Music World — cinematic lossless audio, synced lyrics, curated YouTube videos and a vault of unreleased work." },
      { property: "og:title", content: "Walker's Music World" },
      { property: "og:description", content: "Where Music Meets Emotion and Energy." },
    ],
  }),
});

function Index() {
  return (
    <AppLayout>
      {/* HERO */}
      <section className="relative isolate mx-4 my-4 overflow-hidden rounded-3xl">
        <img src={heroBg} alt="" className="absolute inset-0 size-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="relative flex min-h-[82vh] flex-col items-center justify-center px-6 py-24 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-xs tracking-widest text-muted-foreground backdrop-blur"
          >
            <Sparkles className="size-3" /> LOSSLESS · FLAC · WAV · SYNCED LYRICS
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="max-w-4xl text-5xl font-bold tracking-tight text-glow md:text-7xl"
          >
            Walker's Music World
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
          >
            Where music meets emotion and energy. Cinematic streaming, real-time lyrics, every detail in studio quality.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/player" className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background shadow-glow transition hover:scale-[1.03]">
              <Play className="size-4 fill-current" /> Open the Player
            </Link>
            <Link to="/videos" className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-7 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-foreground/10">
              <Headphones className="size-4" /> Watch Videos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-4 mt-8 grid gap-4 md:grid-cols-3">
        {[
          { t: "Lossless Streaming", d: "24-bit / 96 KHz FLAC and WAV. Pure detail, no compromise." },
          { t: "Synced Lyrics", d: "Lyrics that move with the music in real time. Tap any line to seek." },
          { t: "Cinematic UI", d: "Glassmorphic, minimal and built for the listening experience." },
        ].map((f) => (
          <div key={f.t} className="glass rounded-2xl p-6">
            <h3 className="text-base font-semibold">{f.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </section>

      {/* EXPLORE TILES */}
      <section className="mx-4 mt-10">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Explore the world</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Tile to="/videos" icon={Headphones} title="Videos" desc="Live sessions, covers and visuals." />
          <Tile to="/vault" icon={Library} title="Walker Vault" desc="Unreleased music and demos." />
          <Tile to="/player" icon={Disc3} title="Music Player" desc="Cinematic immersive listening." />
          <Tile to="/submissions" icon={Send} title="Submissions" desc="Share your own creativity." />
        </div>
      </section>
    </AppLayout>
  );
}

function Tile({ to, icon: Icon, title, desc }: { to: "/videos" | "/vault" | "/player" | "/submissions"; icon: typeof Headphones; title: string; desc: string }) {
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
