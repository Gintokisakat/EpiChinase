# Epichinese - Roadmap & Task List

## Status
- ⬜ Pending
- 🔵 In Progress
- ✅ Completed
- ❌ Blocked

---

## Phase 0: Foundation ✅

- [x] Next.js 16 + TypeScript + Tailwind v4 project setup
- [x] Supabase project + Email auth + RLS
- [x] 7335 cards seeded from Spoonfed Chinese (CC BY 2.0)
- [x] Auth pages (login, signup) + middleware + session refresh
- [x] Dashboard with stats + landing page
- [x] Review page (ts-fsrs SRS, 4 ratings)
- [x] Learn page (add new cards to SRS)
- [x] Dragon mascot (chr-1x/dragn-emoji, 3 moods, recolored jade)
- [x] PWA manifest + SVG icons
- [x] CONTEXT.md + TASKS.md

---

## Phase 1: Fix Critical Bugs 🔵

### P0 — Must Fix

- [ ] **Fix `retrievability` never updated in review** — `FSRS.next()` returns `card.retrievability` but the Supabase update query doesn't include it. This undermines the FSRS algorithm.
- [ ] **Fix audio serving** — `ReviewClient.tsx` references `/audio/` which doesn't exist. Options: (a) copy files to `public/audio/`, (b) upload to Supabase Storage + signed URLs, (c) custom API route.
- [ ] **Create `profiles` table migration + auto-insert trigger** — `profiles` table is referenced by dashboard but has no `CREATE TABLE` SQL and no trigger to auto-create rows on user signup.
- [ ] **Protect `/review` and `/learn` in middleware** — Currently only `/dashboard` is protected. Add paths to `config.matcher`.
- [ ] **Add error boundaries** — Create `error.tsx` for each route group to prevent full-app crashes.
- [ ] **Handle user ID being undefined** — If session expires, `user?.id` could be undefined causing DB errors. Add guard checks.

---

## Phase 2: Functional Gaps

### P1 — Must Have

- [ ] **Add loading states to Review flow** — `handleRating` has no loading flag; user can click multiple ratings before first completes. Add `isSubmitting` state.
- [ ] **Implement streak/XP/dragon_level update logic** — Currently display-only. Add triggers: XP for reviews, streak for daily study, level-up formula.
- [ ] **Fix `getNewCards` inefficient query** — Fetches `limit + learnedIds.size * 2` from DB and filters in JS. Should use SQL `NOT IN` subquery.
- [ ] **Make dashboard buttons functional or hide them** — "Practicar" and "Logros" buttons have no onClick handlers.
- [ ] **Add error handling for Supabase mutations** — Review and Learn flows silently ignore failed writes. Add try/catch + user feedback (toast/alert).
- [ ] **Handle concurrent sessions** — If user has two tabs open, rating the same card twice should be handled (use optimistic locking or disable after first click).

### P1 — Cleanup

- [ ] **Remove unused dead dependencies** — `canvas-confetti` and `framer-motion` are installed but never imported. Remove them or start using them.
- [ ] **Remove unused SVG** — `public/dragncute.svg` is never used by the Dragon component.
- [ ] **Remove unused SVGs** — `public/dragon.svg` and `public/dragon-ref.svg` from previous attempts.
- [ ] **Migrate middleware to `proxy` convention** — Next.js warns that middleware file convention is deprecated.

---

## Phase 3: Quality & UX

### P2 — Should Have

- [ ] **Add dragon emoji attribution** — CC BY-NC-SA 4.0 requires credit. Add footer text: "Dragon emoji by khr / chr-1x, CC BY-NC-SA 4.0".
- [ ] **Add PWA service worker** — Use `@serwist/next` to make the app installable with offline support.
- [ ] **Add audio controls** — Replace `autoPlay` with a play button for user-initiated playback (respects mobile autoplay policies).
- [ ] **Add audio to Learn flow** — New cards should also play audio.
- [ ] **Add responsive refinements** — Fix dragon hardcoded pixel sizes, rating button overflow on small screens, dashboard grid on 320px.
- [ ] **Add search/filter by tags** — Cards have GIN-indexed tags (HSK levels etc.) but no UI to filter. Add tag selector to filter review/learn queries.
- [ ] **Add loading.tsx** — Route-level loading states for review, learn, and dashboard pages.
- [ ] **Add confetti on review complete** — `canvas-confetti` is installed. Use it when review session finishes + dragon celebrates.
- [ ] **Add "study now" quick action on dashboard** — One-click to start review + learn combined session.
- [ ] **Add password reset flow** — "Forgot password?" link + Supabase `resetPasswordForEmail()`.

### P2 — Animations

- [ ] **Animate dragon with framer-motion** — Bounce on celebrating, wiggle on studying, entrance animations. (Or remove framer-motion if not going to animate.)

---

## Phase 4: Content & Audio

### P3 — Nice to Have

- [ ] **Upload 4649 audio files to Supabase Storage** — Create bucket `audio`, upload with proper naming, generate signed URLs for playback.
- [ ] **Audio preloading / caching** — Prefetch next 2-3 audio files during review for seamless playback.
- [ ] **Practice exercises: tone drills** — Listen to audio + identify tone (1ˉ 2ˊ 3ˇ 4ˋ).
- [ ] **Practice exercises: radical puzzles** — Match radicals to characters.
- [ ] **Practice exercises: stroke order** — Animated stroke order diagrams for common characters.

---

## Phase 5: Gamification & Polish

### P4 — Future

- [ ] **Dragon evolution system** — Dragon grows/transforms at XP milestones (level 5, 10, 25, 50, 100).
- [ ] **Achievements / badges** — "First review", "7-day streak", "100 cards", "Perfect week" etc.
- [ ] **Study statistics page** — Charts for daily reviews, retention rate, time spent.
- [ ] **Onboarding flow** — First-time user gets guided tour of dashboard → learn → review.
- [ ] **Deploy to Vercel** — Connect GitHub repo to Vercel, add env vars, deploy.
- [ ] **Testing with real users** — Share URL, collect feedback.
- [ ] **i18n support** — English UI option for English-speaking learners.
- [ ] **OAuth/social login** — Google, GitHub sign-in options.
- [ ] **Dark mode** — `prefers-color-scheme: dark` support.

---

## Known Issues
- `retrievability` never written to DB in review flow (P0)
- Audio files not served (P0)
- No `profiles` table auto-creation (P0)
- Middleware only protects `/dashboard` (P0)
- `canvas-confetti`, `framer-motion` unused (P1)
- `dragncute.svg` unused (P1)
