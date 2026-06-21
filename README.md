# bio-website

A personal bio/link page built with Next.js 16 and Tailwind CSS.

## Features

- **Click-to-enter** splash screen with background video and looping audio
- **Live Discord presence** via [Lanyard](https://github.com/Phineas/lanyard) WebSocket — shows online status, current activity, avatar decoration, and guild tag
- **Social links** — Instagram, GitHub, Steam, personal site
- **View counter** — persistent page view count backed by Upstash Redis in production
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
- **View counter** — copy `.env.example` to `.env.local` and add your Upstash Redis REST credentials

## Deployment

Deploy on [Vercel](https://vercel.com), then:

1. Create an Upstash Redis database from the Vercel Marketplace or Upstash Console.
2. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to the Vercel project's environment variables.
3. Redeploy the project so the function receives the new variables.

The API also recognizes the older `KV_REST_API_URL` and `KV_REST_API_TOKEN`
variable names. Local development falls back to `data/views.json` when Redis
credentials are not configured.

To preserve the current local count, run this command in the Upstash Redis
console before the first visit:

```text
SET bio-website:views 12
```
