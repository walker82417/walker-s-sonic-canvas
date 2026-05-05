# Content folders

Drop your music and videos here. They are picked up automatically by the website on the next build.

## Music — `src/content/music/<category>/`

Categories: `official`, `remix`, `cover`.

### Option A — drop an audio file

Drop an `.mp3`, `.m4a`, `.wav`, or `.ogg` file into the right subfolder. The
filename (without extension) becomes the track title. Example:

    src/content/music/cover/Faded.mp3
    src/content/music/remix/Alone-Walker-Remix.mp3

Optionally add a same-named `.lrc` lyrics file next to it for synced lyrics:

    src/content/music/cover/Faded.lrc

Optionally add a same-named `.jpg` / `.png` for cover art:

    src/content/music/cover/Faded.jpg

### Option B — link to an external audio URL

Edit `src/content/music/manifest.ts` and add an entry under the right
category. Use this when the file lives on GitHub raw, a CDN, or anywhere else.

## Videos — `src/content/videos/<category>/`

Categories: `official`, `remix`, `cover`, `live`, `lyrics`, `blog`.

Edit `src/content/videos/manifest.ts` and add entries with a YouTube ID,
title, description and credits. Each entry is filed under one category.
