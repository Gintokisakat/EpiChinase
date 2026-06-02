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

## Progress
### Done
- Node.js 24 LTS + npm via nvm
- GitHub repo (Gintokisakat/EpiChinase)
- Next.js 16.2.7 project with TypeScript + Tailwind CSS v4
- Dependencies: @supabase/supabase-js, @supabase/ssr, framer-motion, canvas-confetti, ts-fsrs
- Supabase project + Email auth enabled
- SQL schema: cards, user_cards tables + RLS + profile trigger
- 7335 cards extracted from Spoonfed Chinese .apkg (CC BY 2.0)
- Cards seeded to Supabase
- Auth pages (login, signup) with server actions
- Middleware for route protection + session refresh
- Dashboard with stats (due count, new count, streak, XP)
- Review page with ts-fsrs SRS (4 ratings)
- Learn page: add new cards to SRS queue
- Dragon mascot using chr-1x/dragn-emoji (3 moods: happy, studying, celebrating)
- PWA manifest + SVG icons
- Tailwind custom theme (jade green palette)
- GitHub commits pushed

### Needs Work
- Upload 4649 audio files to Supabase Storage
- Add gamification (streak tracking, XP rewards, dragon level evolution)
- Practice exercises (tone drills, radical puzzles)
- Deploy to Vercel for user testing
- PWA polish (service worker, offline support)
- Attribution for dragon emoji (CC BY-NC-SA 4.0)

## Technical Notes
- Web Speech API: SpeechRecognition works in Chrome/Edge; PWA targets Chrome/Android
- Anki .apkg = ZIP + SQLite (collection.anki21); Spoonfed fields: [English, Pinyin, Chinese, Audio]
- New cards: `due: now` on insert so they appear in review immediately
- Supabase service_role key available for seeding (not stored in .env.local)
- Dragon emoji attribution: "dragn-emoji" by khr / chr-1x, CC BY-NC-SA 4.0
