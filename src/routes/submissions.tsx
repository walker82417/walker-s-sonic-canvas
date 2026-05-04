import { createFileRoute } from "@tanstack/react-router";
import { Mail, Instagram, Youtube, Music, Video, Sparkles, Copy } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SOCIAL } from "@/lib/data";
import { useState } from "react";

export const Route = createFileRoute("/submissions")({
  component: SubmissionsPage,
  head: () => ({
    meta: [
      { title: "Submissions | Walker's Music World" },
      { name: "description", content: "Submit your music, covers and visuals to be featured on Walker's Music World." },
    ],
  }),
});

function SubmissionsPage() {
  return (
    <AppLayout>
      <SubmissionsInner />
    </AppLayout>
  );
}

function SubmissionsInner() {
  const [copied, setCopied] = useState(false);
  const subject = encodeURIComponent("Submission — Walker's Music World");
  const body = encodeURIComponent(
    [
      "Hey Walker's Music World team,",
      "",
      "Artist / creator name:",
      "Track or video title:",
      "Genre / mood:",
      "Streaming or upload link (Drive, Dropbox, SoundCloud, YouTube, etc.):",
      "Instagram / socials:",
      "Short story behind the work:",
      "",
      "Thanks for considering my submission.",
    ].join("\n"),
  );
  const mailto = `mailto:${SOCIAL.email}?subject=${subject}&body=${body}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SOCIAL.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">For the Walkers</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl text-glow">Submit Your Creativity</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Walker's Music World was built to amplify the community. We promote your work for free because this platform
          exists because of you. If you're an artist, producer, vocalist or visual creator, send us your work and we will
          showcase it to a wider audience of fellow Walkers.
        </p>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { icon: Music, t: "Music", d: "Originals, covers and beats. Send a high quality audio file or a streaming link." },
          { icon: Video, t: "Videos", d: "Music videos, live sessions, lyric visuals." },
          { icon: Sparkles, t: "Visuals", d: "Cover art, motion design, photography." },
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

      <section className="mt-10 glass rounded-3xl p-6 md:p-10">
        <h2 className="text-2xl font-bold tracking-tight">How to submit</h2>
        <ol className="mt-5 space-y-3 text-sm text-muted-foreground md:text-base">
          <li><span className="mr-2 font-semibold text-foreground">1.</span> Upload your work to Google Drive, Dropbox, SoundCloud or YouTube (unlisted is fine).</li>
          <li><span className="mr-2 font-semibold text-foreground">2.</span> Tap the button below to open a pre-filled email with everything we need.</li>
          <li><span className="mr-2 font-semibold text-foreground">3.</span> We listen to every submission. If it fits the world, we'll reach out within 7 to 10 days.</li>
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={mailto}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-glow transition hover:scale-[1.03]"
          >
            <Mail className="size-4" /> Open email submission
          </a>
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-foreground/10"
          >
            <Copy className="size-4" /> {copied ? "Copied" : SOCIAL.email}
          </button>
        </div>

        <div className="mt-8 grid gap-3 text-sm md:grid-cols-3">
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
  );
}
