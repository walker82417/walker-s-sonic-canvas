import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin, Radio, Timer } from "lucide-react";
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
        <article className="player-surface ring-soft rounded-2xl p-6 md:p-8">
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
            <div className="mt-7 grid grid-cols-4 gap-2 text-center">
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
        </article>

        <aside className="glass max-h-[420px] overflow-hidden rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Upcoming
            </p>
            <span className="text-xs text-muted-foreground">{tourEvents.length} shows</span>
          </div>
          <div className="space-y-2 overflow-auto pr-1">
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
    <div className={active ? "rounded-xl bg-primary/12 p-3" : "rounded-xl bg-foreground/5 p-3"}>
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-semibold">{event.title}</p>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {event.dateLabel}
        </span>
      </div>
      <p className="mt-1 truncate text-xs text-muted-foreground">{event.location}</p>
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-foreground/5 px-2 py-3">
      <div className="text-2xl font-bold tabular-nums md:text-3xl">{String(value).padStart(2, "0")}</div>
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
