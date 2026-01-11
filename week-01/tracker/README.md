# Omnissiah Protocol

A Warhammer 40K Adeptus Mechanicus-themed tracker for the 10 Sacred Rites of AI Fluency.

*"The flesh is weak. The machine is strong."*

> **Want to see how this was built?** Check out the [Build Log](./BUILD-LOG.md) for the full process - including the prompts used, design evolution, and iterative feedback that shaped the final product.

---

## Features

- **10 Sacred Rites** - Compact grid view with individual progress tracking
- **Cogitator Records** - Notes field for each rite
- **Sacred Metrics** - 5-cog rating system (Outcome, Efficiency, Reproducibility)
- **Path to Enlightenment** - Overall sanctification progress
- **Machine Spirit Dialogs** - Typewriter-style messages with digital click sounds
- **Dual Mode** - Authenticated mode (saves progress) or Demo mode (no persistence)
- **Mobile-First Design** - Bottom navigation, touch-friendly
- **PWA Support** - Install as app on iOS/Android/Desktop

## The Build Story

This project was built entirely with Claude Code over a single session. Here's how it came together and the challenges along the way.

### Design Direction: Adeptus Mechanicus Aesthetic

The brief was to build a "motivating and fun" resolution tracker. Rather than a generic productivity app, I went with a Warhammer 40K Adeptus Mechanicus theme - the machine-worshipping tech-priests of the 41st millennium.

**Key design choices:**
- **Phosphor green** (`#39ff14`) as the primary color, evoking old CRT terminals and cogitator screens
- **Amber-red** (`#ff4a1c`) for callouts and warnings - initially orange, but adjusted to be "more red" for better contrast
- **Cinzel font** for headers (gothic, ecclesiastical feel) paired with **Share Tech Mono** for data
- **CRT effects** - scanlines, noise textures, and subtle glow effects
- Dark background with metallic plate styling for cards

### Machine Spirit Dialog System

Originally attempted to integrate ElevenLabs voice synthesis for a "Machine Spirit" that would speak to the user. After experimenting with voice parameters (trying to get a "dark, low, bassy, scratchy" voice), I pivoted to a text-based system instead.

The final implementation:
- Typewriter effect with character-by-character animation
- **Web Audio API** for synthetic digital click sounds (no audio files needed)
- Sounds generated procedurally: square wave + triangle wave through a bandpass filter
- Click sound tuning took several iterations - started too low/long, then too high, finally settled on 400-500Hz at 10ms

```typescript
// The click generator creates sounds on-the-fly
osc.type = "square";
osc.frequency.setValueAtTime(400 + Math.random() * 100, now);
```

### Splash Screen & Audio Permissions

Browsers block audio playback until user interaction. The solution: a splash screen that serves double duty:
1. Enables audio context on first click
2. Lets users choose between authenticated mode (saves data) or demo mode

### Authentication & Demo Mode

Implemented a dual-mode system:
- **Authenticated mode**: Basic auth via browser's built-in dialog, progress saved to localStorage
- **Demo mode**: Full app functionality without persistence - great for trying it out

**The data loss bug**: Early implementation had a subtle bug where the save logic ran in "splash" mode because it checked `!isDemo` instead of `mode === "authenticated"`. This overwrote localStorage with initial data when visiting the splash screen. Fixed by explicitly checking for authenticated mode before saving.

**Splash screen behavior**: Users wanted the splash to show on *every* visit, not just the first. The cookie tracks auth vs demo for persistence purposes, but a query parameter (`?session=start`) controls whether to skip the splash after successful auth/demo selection.

### Card Layout Challenges

The rite cards went through several iterations:
1. **Initial problem**: Titles getting cut off with `line-clamp-2`
2. **First fix**: Removed line clamp, but cards had unequal heights
3. **Final solution**: CSS Grid with `auto-rows-fr` for equal-height rows, flexbox inside cards with `flex-grow` on titles

```css
grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
auto-rows-fr; /* All rows same height */
```

### What Didn't Work

- **SVG Aquila graphics**: Attempted to add Adeptus Mechanicus eagle iconography, but the generated SVGs looked bad. Removed in favor of simple cog emoji (`⚙`).
- **ElevenLabs voice**: The API worked, but getting the right voice character proved difficult. Text-based Machine Spirit ended up being more atmospheric anyway.

## Tech Stack

- **Next.js 16** (App Router) with Turbopack
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** for animations
- **Web Audio API** for procedural sound generation
- **localStorage** for state persistence
- **Basic Auth** via Next.js middleware

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

5. Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Import repo at [vercel.com](https://vercel.com)
2. Set **Root Directory** to `week-01/tracker`
3. Add environment variables:
   - `BASIC_AUTH_USER`
   - `BASIC_AUTH_PASSWORD`
4. Deploy

## Security Notes

- Never commit `.env.local` or real credentials
- Set production credentials via Vercel dashboard only
- Basic auth is transmitted over HTTPS

---

*Part of the [AI Resolution 2026](../../README.md) project - Rite I: The Rite of First Forging*

*The Omnissiah protects.*
