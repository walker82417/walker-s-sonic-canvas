import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Music2, Users, Heart, Target, Mail, Instagram, Youtube, Bell } from "lucide-react";
import { SOCIAL } from "@/lib/data";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About | Walker's Music World" },
      { name: "description", content: "The story behind Walker's Music World, a fan home celebrating Alan Walker and the global Walker community." },
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
            Hey Walkers! A place created out of pure love for Alan Walker's music, bringing together fans who share the same
            passion. We vibe as one big Walker family.
          </p>
        </header>

        <section className="mt-12 grid gap-4 md:grid-cols-2">
          {[
            { icon: Music2, t: "The Music", d: "Celebrating Alan Walker's journey, his sound, and the moments that move us." },
            { icon: Users, t: "The Community", d: "We share updates, relive unforgettable moments, and keep the Walker spirit alive." },
            { icon: Heart, t: "Why It Exists", d: "Built with the idea of celebrating the music and the community. Nothing more, nothing less." },
            { icon: Target, t: "Next Goal", d: "50K subscribers. Let's make it happen together, one Walker at a time." },
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
          <h2 className="text-2xl font-bold tracking-tight">A note from Walker</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              Hey Walkers! Welcome to Walker's Music World, a place I created out of pure love for Alan Walker's music. This
              channel is all about bringing together fans who share the same passion for his music.
            </p>
            <p>
              Here, we vibe as one big Walker family. We share updates, relive unforgettable moments, and keep the Walker
              spirit alive.
            </p>
            <p>
              Why this channel is special: it is built with the idea of celebrating Alan Walker's journey, music, and
              community. Nothing more, nothing less.
            </p>
            <p>
              Got a favorite Alan Walker track? Drop it in the comments on YouTube, I would love to know. Thanks for being
              part of this journey. Let's keep walking to the rhythm of greatness.
            </p>
            <p className="text-foreground">Walker#82417</p>
            <p className="text-xs">#WalkersMusicWorld #AlanWalker #MusicCommunity #50KTarget</p>
          </div>

          <a
            href={SOCIAL.youtube}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-glow transition hover:scale-[1.03]"
          >
            <Bell className="size-4" /> Subscribe on YouTube
          </a>
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

        <section className="mt-8 glass rounded-2xl p-5 text-xs text-muted-foreground">
          All original music and video content copyright belongs to the respective owners. Please check the description on
          each video where every credit is mentioned.
        </section>
      </div>
    </AppLayout>
  );
}
