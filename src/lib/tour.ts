export interface TourEvent {
  id: string;
  dateLabel: string;
  title: string;
  location: string;
  startsAt: string;
  liveUntil: string;
  timezone: string;
  mapUrl: string;
  ticketUrl: string;
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
    mapUrl: googleMapsUrl("Red Rocks Amphitheatre, Morrison, CO, United States"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "sunsation-2026",
    dateLabel: "Fri, Jun 5",
    title: "Sunsation Festival 2026",
    location: "Trois-Rivieres, QC, Canada",
    startsAt: "2026-06-05T20:00:00-04:00",
    liveUntil: "2026-06-06T02:00:00-04:00",
    timezone: "EDT",
    mapUrl: googleMapsUrl("Sunsation Festival, Trois-Rivieres, QC, Canada"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "marquee-new-york-2026",
    dateLabel: "Sat, Jun 6",
    title: "Marquee New York",
    location: "New York City, NY, United States",
    startsAt: "2026-06-06T22:00:00-04:00",
    liveUntil: "2026-06-07T04:00:00-04:00",
    timezone: "EDT",
    mapUrl: googleMapsUrl("Marquee New York, New York City, NY, United States"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "beyond-wonderland-chicago-2026",
    dateLabel: "Sun, Jun 7",
    title: "Beyond Wonderland Chicago 2026",
    location: "Chicago, IL, United States",
    startsAt: "2026-06-07T20:00:00-05:00",
    liveUntil: "2026-06-08T02:00:00-05:00",
    timezone: "CDT",
    mapUrl: googleMapsUrl("Beyond Wonderland Chicago, Chicago, IL, United States"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "fm-city-fest-2026",
    dateLabel: "Jun 19 - Jun 20",
    title: "FM city fest 2026",
    location: "Frydek-Mistek, Czechia",
    startsAt: "2026-06-19T18:00:00+02:00",
    liveUntil: "2026-06-20T23:59:00+02:00",
    timezone: "CEST",
    mapUrl: googleMapsUrl("FM city fest, Frydek-Mistek, Czechia"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "escapade-2026",
    dateLabel: "Jun 26 - Jun 28",
    title: "Escapade 2026",
    location: "Ottawa, ON, Canada",
    startsAt: "2026-06-26T18:00:00-04:00",
    liveUntil: "2026-06-28T23:59:00-04:00",
    timezone: "EDT",
    mapUrl: googleMapsUrl("Escapade Music Festival, Ottawa, ON, Canada"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "butterfly-festival-2026",
    dateLabel: "Fri, Jun 26",
    title: "Butterfly Festival 2026",
    location: "Goteborg, Sweden",
    startsAt: "2026-06-26T20:00:00+02:00",
    liveUntil: "2026-06-27T02:00:00+02:00",
    timezone: "CEST",
    mapUrl: googleMapsUrl("Butterfly Festival, Goteborg, Sweden"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "vibe-festival-2026",
    dateLabel: "Sun, Jul 5",
    title: "VIBE Festival 2026",
    location: "Targu Mures, Romania",
    startsAt: "2026-07-05T20:00:00+03:00",
    liveUntil: "2026-07-06T02:00:00+03:00",
    timezone: "EEST",
    mapUrl: googleMapsUrl("VIBE Festival, Targu Mures, Romania"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "big-day-summer-2026",
    dateLabel: "Jul 10 - Jul 11",
    title: "Big Day Summer Festival 2026",
    location: "Vaasa, Finland",
    startsAt: "2026-07-10T18:00:00+03:00",
    liveUntil: "2026-07-11T23:59:00+03:00",
    timezone: "EEST",
    mapUrl: googleMapsUrl("Big Day Summer Festival, Vaasa, Finland"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "tomorrowland-belgium-2026",
    dateLabel: "Jul 17 - Jul 26",
    title: "Tomorrowland Belgium 2026",
    location: "Boom, Belgium",
    startsAt: "2026-07-17T18:00:00+02:00",
    liveUntil: "2026-07-26T23:59:00+02:00",
    timezone: "CEST",
    mapUrl: googleMapsUrl("Tomorrowland, Boom, Belgium"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "moon-and-stars-locarno-2026",
    dateLabel: "Fri, Jul 17",
    title: "Moon and Stars Locarno 2026",
    location: "Locarno, Switzerland",
    startsAt: "2026-07-17T20:00:00+02:00",
    liveUntil: "2026-07-18T02:00:00+02:00",
    timezone: "CEST",
    mapUrl: googleMapsUrl("Moon and Stars Locarno, Locarno, Switzerland"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "autostadt-sommerfestival-2026",
    dateLabel: "Wed, Jul 29",
    title: "Autostadt Sommerfestival 2026",
    location: "Wolfsburg, Germany",
    startsAt: "2026-07-29T20:00:00+02:00",
    liveUntil: "2026-07-30T02:00:00+02:00",
    timezone: "CEST",
    mapUrl: googleMapsUrl("Autostadt Sommerfestival, Wolfsburg, Germany"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "summer-sound-2026",
    dateLabel: "Jul 31 - Aug 1",
    title: "Summer Sound Festival 2026",
    location: "Liepaja, Latvia",
    startsAt: "2026-07-31T18:00:00+03:00",
    liveUntil: "2026-08-01T23:59:00+03:00",
    timezone: "EEST",
    mapUrl: googleMapsUrl("Summer Sound Festival, Liepaja, Latvia"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "tampere-city-festival-2026",
    dateLabel: "Aug 7 - Aug 8",
    title: "Tampere City Festival 2026",
    location: "Tampere, Finland",
    startsAt: "2026-08-07T18:00:00+03:00",
    liveUntil: "2026-08-08T23:59:00+03:00",
    timezone: "EEST",
    mapUrl: googleMapsUrl("Tampere City Festival, Tampere, Finland"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "villa-negri-2026",
    dateLabel: "Fri, Aug 21",
    title: "Villa Negri",
    location: "Bassano Del Grappa, Italy",
    startsAt: "2026-08-21T20:00:00+02:00",
    liveUntil: "2026-08-22T02:00:00+02:00",
    timezone: "CEST",
    mapUrl: googleMapsUrl("Villa Negri, Bassano Del Grappa, Italy"),
    ticketUrl: "https://alanwalker.com/",
  },
  {
    id: "fajer-festiwal-2026",
    dateLabel: "Sat, Aug 29",
    title: "Fajer Festiwal",
    location: "Chorzow, Poland",
    startsAt: "2026-08-29T20:00:00+02:00",
    liveUntil: "2026-08-30T02:00:00+02:00",
    timezone: "CEST",
    mapUrl: googleMapsUrl("Fajer Festiwal, Chorzow, Poland"),
    ticketUrl: "https://alanwalker.com/",
  },
];

function googleMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

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
