# Omnissiah Protocol

A Warhammer 40K Adeptus Mechanicus-themed tracker for the 10 Sacred Rites of AI Fluency.

*"The flesh is weak. The machine is strong."*

## Features

- **10 Sacred Rites** - Compact grid view with individual progress tracking
- **Cogitator Records** - Notes field for each rite
- **Sacred Metrics** - 5-cog rating system (Outcome, Efficiency, Reproducibility)
- **Path to Enlightenment** - Overall sanctification progress
- **Mobile-First Design** - Bottom navigation, touch-friendly
- **PWA Support** - Install as app on iOS/Android/Desktop
- **Basic Authentication** - Secure access via middleware

## Design

Inspired by the Adeptus Mechanicus of Warhammer 40K:
- Phosphor green terminal aesthetic
- Gothic Cinzel headers + Share Tech Mono data
- CRT scanlines and noise textures
- Cog motifs and tech-priest iconography
- Grimdark machine cult language

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` from template:
```bash
cp .env.example .env.local
```

3. Edit `.env.local` with your credentials:
```
BASIC_AUTH_USER=your_username
BASIC_AUTH_PASSWORD=your_secure_password
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) and enter your credentials.

## Generating Icons

If you modify `public/icon.svg`, regenerate the PNG icons:
```bash
node scripts/generate-icons.mjs
```

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm i -g vercel
vercel login
cd week-01/tracker
vercel
```

### Option 2: GitHub Integration

1. Push repo to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Set **Root Directory** to `week-01/tracker`
4. Add environment variables:
   - `BASIC_AUTH_USER` = your username
   - `BASIC_AUTH_PASSWORD` = strong password
5. Deploy

## Security Notes

- Never commit `.env.local` or real credentials
- `.env.example` shows required variables with placeholders
- Set production credentials via Vercel dashboard only
- Basic auth transmitted over HTTPS

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Framer Motion
- localStorage persistence

---

*Part of the AI Resolution 2026 project - Rite I: The Rite of First Forging*

*The Omnissiah protects.*
