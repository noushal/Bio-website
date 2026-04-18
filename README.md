# bio-website

A personal bio/link page built with Next.js 16 and Tailwind CSS.

## Features

- **Click-to-enter** splash screen with background video and looping audio
- **Live Discord presence** via [Lanyard](https://github.com/Phineas/lanyard) WebSocket — shows online status, current activity, avatar decoration, and guild tag
- **Social links** — Instagram, GitHub, Steam, personal site
- **View counter** — persistent page view count tracked via a local JSON file API route
- **Volume control** — mute toggle with an expandable slider

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [use-lanyard](https://github.com/joshhighet/use-lanyard) — Discord rich presence
- [lucide-react](https://lucide.dev/) + [react-icons](https://react-icons.github.io/react-icons/)
- [Vercel Analytics](https://vercel.com/analytics)

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

- **Discord ID** — update `DISCORD_ID` in `app/page.tsx` to your own Discord user ID
- **Audio** — replace `public/audio.mp3` with your track
- **Background video** — swap the `src` on the `<video>` element in `app/page.tsx`
- **Social links** — edit the links array near the bottom of `app/page.tsx`

## Deployment

Deploy on [Vercel](https://vercel.com). The view counter writes to `app/views.json`, so it requires a persistent filesystem (not compatible with serverless edge functions by default — self-host or replace with a database if you need accurate counts at scale).
