# Epichinese - Project Context

## Overview
Epichinese is a free Chinese learning PWA web app targeting English speakers. Combines Anki-based SRS content with Duolingo-style gamification.

## Brand
- **Name:** Epi (prefix: Epichinese)
- **Domain:** epichinese.app (future)
- **Colors:** Jade green (#5ABF9E) primary, Gold (#D4A843) achievements, Ink (#1A1A2E) text, Rice (#F5F0E8) bg
- **Mascot:** Dragon emoji from chr-1x/dragn-emoji (CC BY-NC-SA 4.0), recolored jade green
- **Fonts:** Noto Sans SC + Inter (Google Fonts)

## Architecture
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Hosting:** Vercel (free, pending deploy)
- **SRS Engine:** ts-fsrs
- **Animations:** framer-motion + canvas-confetti

## Development Rules
- Local-first: everything runs on localhost:3000 first
- No secrets committed to repo (.env.local for all keys)
- Content from CC-licensed Anki decks only
- opencode (big-pickle) writes ALL code, content, and assets — no other agents
- Context shared via CONTEXT.md + TASKS.md — NOT via conversation history

## Agent Conventions
- opencode = single agent for all code, content, and assets
- Anki extraction via Python (genanki) run locally
- Dragon mascot as SVG emoji from chr-1x/dragn-emoji
- CachyOS (Arch Linux) — Fish shell default
- Run dev server: `bash -c 'source ~/.nvm/nvm.sh && cd /tmp/epichinese && npm run dev'`
- GitHub PAT in remote URL, cleaned after each push

## Project Audit (June 2026)

### What's Solid
- **Architecture**: Next.js 16 + TypeScript + Tailwind v4 + Supabase — modern, well-chosen stack
- **Structure**: Server components by default, client only where needed. Clean separation via server actions.
- **Supabase helpers**: Three clients (browser, server, middleware) properly implemented with `@supabase/ssr`
- **SRS**: ts-fsrs correctly wired into Review + Learn flows with all 4 rating levels
- **Auth**: Login/signup with server actions + middleware session refresh
- **Visual identity**: Jade + gold + rice palette, dragon mascot cohesive across app
- **Content**: 7335 real Chinese sentences with 4649 audio files extracted from CC-licensed Anki deck
- **Responsive**: Mobile-first layout, proper spacing and breakpoints

### Critical Bugs (P0)
1. `retrievability` never written to DB in review flow — FSRS algorithm undercut
2. Audio files not served — `/audio/` path doesn't exist, 404 on every card
3. No `profiles` table creation SQL or auto-insert trigger — profile rows don't auto-create
4. Middleware only protects `/dashboard` — `/review` and `/learn` are exposed
5. No error boundaries — any runtime crash = full app crash
6. `user?.id` can be undefined on expired sessions, causing DB errors

### Functional Gaps (P1)
- No loading states in Review (race condition on ratings)
- Streak/XP/dragon_level are display-only, never incremented
- `getNewCards` uses inefficient query (filters in JS instead of SQL)
- Dashboard "Practicar" and "Logros" buttons are non-functional
- No error handling for failed Supabase writes
- `canvas-confetti` and `framer-motion` installed but unused
- `dragncute.svg` in public/ never used

### Quality & UX (P2)
- No dragon emoji attribution (CC BY-NC-SA 4.0)
- No service worker (PWA not installable, no offline)
- Audio autoplay blocked on mobile (no play button)
- No audio in Learn flow
- No search/filter by tags (GIN-indexed but no UI)
- No loading.tsx or error.tsx routes
- No confetti on review completion
- No password reset flow

### Future (P3/P4)
- Upload audio to Supabase Storage
- Practice exercises (tone drills, radical puzzles, stroke order)
- Dragon evolution system
- Achievements & study statistics
- Onboarding flow
- Deploy to Vercel
- i18n (English UI)
- OAuth social login
- Dark mode

## Dependencies
- **Installed:** next, react, react-dom, @supabase/supabase-js, @supabase/ssr, ts-fsrs, framer-motion, canvas-confetti
- **Unused:** framer-motion, canvas-confetti (dead weight)
- **Needed:** @serwist/next (PWA service worker)

## Technical Notes
- Web Speech API: SpeechRecognition works in Chrome/Edge; PWA targets Chrome/Android
- Anki .apkg = ZIP + SQLite (collection.anki21); Spoonfed fields: [English, Pinyin, Chinese, Audio]
- New cards: `due: now` on insert so they appear in review immediately
- Supabase service_role key available for seeding (not stored in .env.local)
- Dragon emoji attribution: "dragn-emoji" by khr / chr-1x, CC BY-NC-SA 4.0
