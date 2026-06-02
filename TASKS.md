# Epichinese - Task List

## Status Legend
- ⬜ Pending
- 🔵 In Progress
- ✅ Completed
- ❌ Blocked

---

## Phase 0: Foundation Setup ✅

- [x] Install Node.js 24 + npm (via nvm)
- [x] Clone GitHub repo (Gintokisakat/EpiChinase)
- [x] Create Next.js 16 project with TypeScript + Tailwind
- [x] Install deps: Supabase, framer-motion, canvas-confetti, ts-fsrs
- [x] Configure Tailwind theme (jade green palette)
- [x] Create project docs (CONTEXT.md, TASKS.md)
- [x] Set up PWA manifest + SVG icons
- [x] Build landing page (hero + login/signup CTA)
- [x] Set up Supabase project + auth schema
- [x] Create Supabase client helpers (browser + server)
- [x] Create auth UI (login/signup pages + server actions)
- [x] First commit + push

## Phase 1: Auth & Dashboard ✅

- [x] Auth routes with middleware (protected /dashboard, /review, /learn)
- [x] Login page with email/password
- [x] Signup page with email/password (confirm email disabled for dev)
- [x] Dashboard with stats (due cards, new cards, streak, XP)
- [x] Dragon mascot with mood states

## Phase 2: SRS Engine & Review ✅

- [x] ts-fsrs integration
- [x] Review page with flashcard UI
- [x] 4 rating buttons (Again, Hard, Good, Easy)
- [x] Learn page to add new cards to SRS
- [x] Dragon celebrating on review completion

## Phase 3: Content & Exercises ⬜

- [ ] Upload 4649 audio files to Supabase Storage
- [ ] Audio playback in review (play button on cards)
- [ ] Practice exercises: tone drills
- [ ] Practice exercises: radical puzzles
- [ ] Practice exercises: stroke order

## Phase 4: Gamification & Polish ⬜

- [ ] Streak tracking (daily login bonus)
- [ ] XP rewards system
- [ ] Dragon level evolution based on XP
- [ ] Achievements / badges
- [ ] Deploy to Vercel
- [ ] PWA service worker + offline support
- [ ] Add attribution for dragon emoji (CC BY-NC-SA 4.0)
- [ ] Testing with real users

## Known Issues
- Middleware uses deprecated file convention (should migrate to "proxy")
- Dragon-ref.svg and dragon.svg in public/ are unused leftovers
