# Epichinese - Project Context

## Overview
Epichinese is a free Chinese learning PWA web app targeting English speakers. Combines Anki-based SRS content with Duolingo-style gamification.

## Brand
- **Name:** Epi (prefix: Epichinese, Epijapanese, Epispanish, etc.)
- **Domain:** epichinese.app (future)
- **Colors:** Jade green (#56BFA0) primary, Gold (#D4A843) achievements, Ink (#1A1A2E) text, Rice paper (#F5F0E8) bg
- **Mascot:** Kawaii dragon
- **Fonts:** Noto Sans SC + Inter (Google Fonts)

## Architecture
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Hosting:** Vercel (free)
- **SRS Engine:** ts-fsrs
- **Animations:** framer-motion + canvas-confetti

## Development Rules
- Local-first: everything runs on localhost:3000 first
- No secrets committed to repo (.env.local for all keys)
- Content from CC-licensed Anki decks only
- Agent split: opencode (opencode/big-pickle) writes code; Kimi handles Chinese content/extraction/translation/mascot
- Context shared via this file + TASKS.md — NOT via conversation history

## Agent Conventions
- opencode = single agent for all code, content, and assets
- Anki extraction via Python (genanki + pypinyin) run locally
- Dragon mascot as inline SVG
- pinyin generated via pypinyin library
