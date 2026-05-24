import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ExternalLink, MapPin, Radio, Ticket, Timer } from "lucide-react";
import { getActiveTourEvent, getNextTourEvent, tourEvents, type TourEvent } from "@/lib/tour";

export function TourCountdown() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const active = useMemo(() => getActiveTourEvent(now), [now]);
  const next = useMemo(() => getNextTourEvent(now), [now]);
  const featured = active ?? next;
  const countdown = featured ? formatCountdown(now, active ? featured.liveUntil : featured.startsAt) : null;

  if (!featured) {
    return (
      <section className="mx-3 mt-14 md:mx-4">
        <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
          Tour schedule complete. New dates will appear here once confirmed.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-3 mt-14 md:mx-4">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Live shows
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Alan Walker Tour</h2>
        </div>
        <p className="max-w-xl text-sm text-muted-foreground">
          Countdown uses the venue timezone for each show, then automatically advances to the next date.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)]">
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className="player-surface ring-soft relative overflow-hidden rounded-2xl p-6 md:p-8"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <motion.div
            className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.8, 0.45] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
              {active ? <Radio className="size-3.5 animate-pulse" /> : <Timer className="size-3.5" />}
              {active ? "Live now" : "Next show"}
            </span>
            <span className="rounded-full bg-foreground/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {featured.timezone}
            </span>
          </div>

          <h3 className="mt-5 text-2xl font-bold tracking-tight md:text-4xl">{featured.title}</h3>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" /> {featured.dateLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" /> {featured.location}
            </span>
          </div>

          {countdown && (
            <div className="mt-7 grid grid-cols-2 gap-2 text-center min-[420px]:grid-cols-4">
              <TimeBox label="Days" value={countdown.days} />
              <TimeBox label="Hours" value={countdown.hours} />
              <TimeBox label="Min" value={countdown.minutes} />
              <TimeBox label="Sec" value={countdown.seconds} />
            </div>
          )}

          <p className="mt-5 text-sm text-muted-foreground">
            {active
              ? "The live window is active for this show and will roll forward automatically afterward."
              : `Starts at ${formatVenueTime(featured)} venue time.`}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={featured.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-2 text-xs font-semibold transition hover:bg-foreground/10"
            >
              <MapPin className="size-4" /> Location
            </a>
            <a
              href={featured.ticketUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-glow transition hover:scale-[1.03]"
            >
              <Ticket className="size-4" /> Tickets
            </a>
          </div>
        </motion.article>

        <aside className="glass flex max-h-[520px] min-h-0 flex-col overflow-hidden rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Upcoming
            </p>
            <span className="text-xs text-muted-foreground">{tourEvents.length} shows</span>
          </div>
          <div className="tour-scroll min-h-0 flex-1 space-y-2 overflow-y-auto pr-2">
            {tourEvents.map((event) => (
              <TourRow key={event.id} event={event} active={event.id === featured.id} />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function TourRow({ event, active }: { event: TourEvent; active: boolean }) {
  return (
    <div className={active ? "rounded-xl bg-primary/12 p-3 ring-1 ring-primary/25" : "rounded-xl bg-foreground/5 p-3"}>
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-semibold">{event.title}</p>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {event.dateLabel}
        </span>
      </div>
      <p className="mt-1 truncate text-xs text-muted-foreground">{event.location}</p>
      <div className="mt-3 flex gap-2">
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground/5 px-2 py-1.5 text-[11px] font-semibold text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
        >
          <MapPin className="size-3.5" /> Map
        </a>
        <a
          href={event.ticketUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/15 px-2 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary/25"
        >
          <ExternalLink className="size-3.5" /> Ticket
        </a>
      </div>
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="rounded-xl bg-foreground/5 px-2 py-3 ring-1 ring-foreground/5">
      <div className="relative h-8 overflow-hidden text-2xl font-bold tabular-nums text-glow md:h-10 md:text-3xl">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={`${label}-${display}`}
            initial={{ y: 22, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -22, opacity: 0, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.7 }}
            className="absolute inset-0 grid place-items-center"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function formatCountdown(now: Date, targetIso: string) {
  const diff = Math.max(0, new Date(targetIso).getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function formatVenueTime(event: TourEvent) {
  const [, time = "20:00"] = event.startsAt.split("T");
  return `${time.slice(0, 5)} ${event.timezone}`;
}
