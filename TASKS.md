# Epichinese — Roadmap & Task List

## Design Direction
- **UX inspirado en react-duolingo** para ejercicios interactivos: progress bar, feedback inmediato (verde/rojo), scorecard al final
- **Navegación base** actual (dashboard → review/learn) se mantiene
- **SRS tipo Anki** para repaso espaciado, **ejercicios tipo Duolingo** para práctica
- Gamificación: XP, rachas, daily goal, sonidos, bottom nav

## Status
- ✅ Completed
- 🔵 In Progress
- ⬜ Pending

---

## Foundation ✅
- [x] Next.js 16 + TypeScript + Tailwind v4
- [x] Supabase project + Email auth + RLS + schema
- [x] 7335 cards seeded from Spoonfed Chinese (CC BY 2.0)
- [x] Auth pages (login, signup) + middleware + session refresh
- [x] Dashboard with stats + landing page
- [x] Review page (ts-fsrs SRS, 4 ratings, retrievability)
- [x] Learn page (add new cards to SRS)
- [x] Dragon mascot (chr-1x/dragn-emoji, 3 moods, recolored jade)
- [x] PWA manifest + SVG icons
- [x] Audio serving via `/api/audio/[filename]`
- [x] Error boundaries (`error.tsx`)
- [x] Profiles table + auto-create trigger on signup
- [x] CONTEXT.md + TASKS.md

---

## Core Features ✅
- [x] XP awards per rating + animated popup
- [x] Streak tracking (auto-update on review)
- [x] Daily XP goal + progress bar on dashboard
- [x] Word of the Day on dashboard (deterministic, audio + study button)
- [x] Settings page (daily XP goal + daily new word limit)
- [x] Show next interval on rating buttons (como Anki)
- [x] Bottom navigation bar (5 tabs: Inicio, Repasar, Aprender, Practicar, Stats)
- [x] Stats page (30-day activity chart, totals)
- [x] Recent words section on dashboard
- [x] New word daily limit enforced in /learn
- [x] Celebration screen after learning new words
- [x] Audio on card reveal + on back of flashcard
- [x] Sound effects (correct/incorrect/fanfare via Web Audio API)
- [x] Dragon emoji attribution footer (CC BY-NC-SA 4.0)
- [x] Fix `getNewCards` query (SQL NOT IN)
- [x] Fix audio overlapping bug

---

## Practice Exercises ✅
- [x] `/practice` route with type selector (Traducción, Escuchar, Pinyin, Mixto)
- [x] Multiple choice (hanzi → english)
- [x] Listen & pick (audio → hanzi)
- [x] Pinyin match (hanzi → pinyin)
- [x] Exercise session flow (progress bar, answer, feedback green/red, continue)
- [x] Scorecard at end (correct/incorrect per question)
- [x] +10 XP on completion
- [x] Sound effects per answer + fanfare on completion

---

## Games ✅
- [x] **Turbo mode** `/turbo`: 60s timed, combo (x2 a 3, x3 a 5+), high score
- [x] **Burbujas** `/pop`: palabras cayendo, pinyin prompt, 3 vidas, combo scoring

---

## Pendientes

### P1 — Must Have
- [x] **Keyboard shortcuts in review** — ← Hard, → Easy, space to flip
- [x] **Audio in Learn flow** — Play audio when learning new cards
- [x] **PWA service worker** — Offline support via `@serwist/next`

### P2 — Should Have
- [x] **Pinyin style toggle** — Tone marks (nǐ hǎo) vs numbers (ni3 hao3)
- [x] **Simplified/Traditional toggle** — opencc-js conversion
- [x] **Fill-in-the-blank** — Sentence with blank, pick correct word
- [x] **Sentence reorder** — Shuffle characters, tap to order
- [x] **Dictation exercise** — Play audio, type pinyin with tone marks
- [ ] **Confetti on review complete** — `canvas-confetti`
- [ ] **Animate dragon with framer-motion** — Or remove unused deps

### P3 — Content
- [x] **Interactive article reader** — Paste Chinese text, clickable characters with definitions
- [x] **Stroke order animations** — hanzi-writer
- [x] **Tone practice** — Hear word, pick correct pinyin with tones
- [x] **Speech practice** — Web Speech API pronunciation
- [x] **Search/filter by text** — Buscar tarjetas por chino/pinyin/inglés
- [ ] **Upload audio to Supabase Storage** — For production

### P4 — Future
- [x] **Dragon evolution** — Changes at XP milestones (5 tiers with CSS filters + accessories)
- [ ] **Achievements / badges**
- [ ] **Onboarding flow**
- [ ] **Deploy to Vercel**
- [ ] **i18n / dark mode / OAuth**
- [ ] **Leaderboard / daily quests / shop**
- [ ] **Podcast player**

---

## Known Issues
- `canvas-confetti`, `framer-motion` installed but unused
- `dragncute.svg` unused
- Middleware uses deprecated file convention (migrate to `proxy`)
- Audio files only work locally via `AUDIO_DIR` env var
- Build requires `--webpack` flag (Turbopack incompatible with `@serwist/next`)
