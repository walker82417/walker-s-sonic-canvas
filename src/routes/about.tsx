import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Headphones, Sparkles, Music2, Users, Mail, Instagram, Youtube } from "lucide-react";
import { SOCIAL } from "@/lib/data";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Walker's Music World" },
      { name: "description", content: "The story behind Walker's Music World — cinematic lossless audio, synced lyrics and a community of walkers." },
    ],
  }),
});

function AboutPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">About the channel</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-6xl text-glow">Walker's Music World</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Where music meets emotion and energy. A cinematic listening home for covers, originals, unreleased gems and the
            community of walkers who feel every note.
          </p>
        </header>

        <section className="mt-12 grid gap-4 md:grid-cols-2">
          {[
            { icon: Music2, t: "The Sound", d: "Lossless FLAC and WAV. Mixed and mastered to preserve every detail, from breath to reverb tail." },
            { icon: Headphones, t: "The Experience", d: "Synced lyrics, glassmorphic visuals and a player designed for full attention, not background noise." },
            { icon: Sparkles, t: "The Vault", d: "Unreleased tracks, demos and behind-the-scenes content reserved for the community of walkers." },
            { icon: Users, t: "The Community", d: "Submissions from fellow creators get featured here. Walker's Music World is a stage we share." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="glass rounded-2xl p-6">
              <div className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 glass rounded-3xl p-6 md:p-10">
          <h2 className="text-2xl font-bold tracking-tight">The Story</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              Walker's Music World started as a single voice singing into a quiet room and grew into a place where music feels
              cinematic again. We obsess over sound quality, the spacing between lyrics, and the small moments most platforms
              compress away.
            </p>
            <p>
              Every release on this site is delivered in the highest quality our listeners can stream. Every video is curated.
              Every submission is heard. If you're here, you're a walker.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold tracking-tight">Get in touch</h2>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <a href={SOCIAL.youtube} target="_blank" rel="noreferrer" className="glass flex items-center gap-3 rounded-xl p-4 hover:text-primary">
              <Youtube className="size-4" /> {SOCIAL.youtubeHandle}
            </a>
            <a href={`mailto:${SOCIAL.email}`} className="glass flex items-center gap-3 rounded-xl p-4 hover:text-primary">
              <Mail className="size-4" /> {SOCIAL.email}
            </a>
            <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" className="glass flex items-center gap-3 rounded-xl p-4 hover:text-primary">
              <Instagram className="size-4" /> {SOCIAL.instagramHandle}
            </a>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
