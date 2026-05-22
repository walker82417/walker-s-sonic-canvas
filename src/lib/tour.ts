export interface TourEvent {
  id: string;
  dateLabel: string;
  title: string;
  location: string;
  startsAt: string;
  liveUntil: string;
  timezone: string;
}

export const tourEvents: TourEvent[] = [
  {
    id: "red-rocks-2026",
    dateLabel: "Sat, May 30",
    title: "Red Rocks Amphitheatre",
    location: "Morrison, CO, United States",
    startsAt: "2026-05-30T20:00:00-06:00",
    liveUntil: "2026-05-31T02:00:00-06:00",
    timezone: "MDT",
  },
  {
    id: "sunsation-2026",
    dateLabel: "Fri, Jun 5",
    title: "Sunsation Festival 2026",
    location: "Trois-Rivieres, QC, Canada",
    startsAt: "2026-06-05T20:00:00-04:00",
    liveUntil: "2026-06-06T02:00:00-04:00",
    timezone: "EDT",
  },
  {
    id: "marquee-new-york-2026",
    dateLabel: "Sat, Jun 6",
    title: "Marquee New York",
    location: "New York City, NY, United States",
    startsAt: "2026-06-06T22:00:00-04:00",
    liveUntil: "2026-06-07T04:00:00-04:00",
    timezone: "EDT",
  },
  {
    id: "beyond-wonderland-chicago-2026",
    dateLabel: "Sun, Jun 7",
    title: "Beyond Wonderland Chicago 2026",
    location: "Chicago, IL, United States",
    startsAt: "2026-06-07T20:00:00-05:00",
    liveUntil: "2026-06-08T02:00:00-05:00",
    timezone: "CDT",
  },
  {
    id: "fm-city-fest-2026",
    dateLabel: "Jun 19 - Jun 20",
    title: "FM city fest 2026",
    location: "Frydek-Mistek, Czechia",
    startsAt: "2026-06-19T18:00:00+02:00",
    liveUntil: "2026-06-20T23:59:00+02:00",
    timezone: "CEST",
  },
  {
    id: "escapade-2026",
    dateLabel: "Jun 26 - Jun 28",
    title: "Escapade 2026",
    location: "Ottawa, ON, Canada",
    startsAt: "2026-06-26T18:00:00-04:00",
    liveUntil: "2026-06-28T23:59:00-04:00",
    timezone: "EDT",
  },
  {
    id: "butterfly-festival-2026",
    dateLabel: "Fri, Jun 26",
    title: "Butterfly Festival 2026",
    location: "Goteborg, Sweden",
    startsAt: "2026-06-26T20:00:00+02:00",
    liveUntil: "2026-06-27T02:00:00+02:00",
    timezone: "CEST",
  },
  {
    id: "vibe-festival-2026",
    dateLabel: "Sun, Jul 5",
    title: "VIBE Festival 2026",
    location: "Targu Mures, Romania",
    startsAt: "2026-07-05T20:00:00+03:00",
    liveUntil: "2026-07-06T02:00:00+03:00",
    timezone: "EEST",
  },
  {
    id: "big-day-summer-2026",
    dateLabel: "Jul 10 - Jul 11",
    title: "Big Day Summer Festival 2026",
    location: "Vaasa, Finland",
    startsAt: "2026-07-10T18:00:00+03:00",
    liveUntil: "2026-07-11T23:59:00+03:00",
    timezone: "EEST",
  },
  {
    id: "tomorrowland-belgium-2026",
    dateLabel: "Jul 17 - Jul 26",
    title: "Tomorrowland Belgium 2026",
    location: "Boom, Belgium",
    startsAt: "2026-07-17T18:00:00+02:00",
    liveUntil: "2026-07-26T23:59:00+02:00",
    timezone: "CEST",
  },
  {
    id: "moon-and-stars-locarno-2026",
    dateLabel: "Fri, Jul 17",
    title: "Moon and Stars Locarno 2026",
    location: "Locarno, Switzerland",
    startsAt: "2026-07-17T20:00:00+02:00",
    liveUntil: "2026-07-18T02:00:00+02:00",
    timezone: "CEST",
  },
  {
    id: "autostadt-sommerfestival-2026",
    dateLabel: "Wed, Jul 29",
    title: "Autostadt Sommerfestival 2026",
    location: "Wolfsburg, Germany",
    startsAt: "2026-07-29T20:00:00+02:00",
    liveUntil: "2026-07-30T02:00:00+02:00",
    timezone: "CEST",
  },
  {
    id: "summer-sound-2026",
    dateLabel: "Jul 31 - Aug 1",
    title: "Summer Sound Festival 2026",
    location: "Liepaja, Latvia",
    startsAt: "2026-07-31T18:00:00+03:00",
    liveUntil: "2026-08-01T23:59:00+03:00",
    timezone: "EEST",
  },
  {
    id: "tampere-city-festival-2026",
    dateLabel: "Aug 7 - Aug 8",
    title: "Tampere City Festival 2026",
    location: "Tampere, Finland",
    startsAt: "2026-08-07T18:00:00+03:00",
    liveUntil: "2026-08-08T23:59:00+03:00",
    timezone: "EEST",
  },
  {
    id: "villa-negri-2026",
    dateLabel: "Fri, Aug 21",
    title: "Villa Negri",
    location: "Bassano Del Grappa, Italy",
    startsAt: "2026-08-21T20:00:00+02:00",
    liveUntil: "2026-08-22T02:00:00+02:00",
    timezone: "CEST",
  },
  {
    id: "fajer-festiwal-2026",
    dateLabel: "Sat, Aug 29",
    title: "Fajer Festiwal",
    location: "Chorzow, Poland",
    startsAt: "2026-08-29T20:00:00+02:00",
    liveUntil: "2026-08-30T02:00:00+02:00",
    timezone: "CEST",
  },
];

export function getActiveTourEvent(now = new Date()) {
  const time = now.getTime();
  return tourEvents.find((event) => {
    const start = new Date(event.startsAt).getTime();
    const end = new Date(event.liveUntil).getTime();
    return time >= start && time <= end;
  });
}

export function getNextTourEvent(now = new Date()) {
  const time = now.getTime();
  return tourEvents.find((event) => new Date(event.liveUntil).getTime() > time);
}
