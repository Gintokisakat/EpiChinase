# Epichinese 🇨🇳

Aprende chino mandarín con SRS, ejercicios interactivos y gamificación. PWA mobile-first, 100% gratuita.

## Stack

- **Frontend:** Next.js 16 + TypeScript + Tailwind v4
- **Backend/Database:** Supabase (PostgreSQL, Auth, RLS)
- **SRS:** ts-fsrs (Free Spaced Repetition Scheduler v5)
- **Contenido:** 7335 tarjetas de Spoonfed Chinese (CC BY 2.0)
- **Mascota:** chr-1x/dragn-emoji (CC BY-NC-SA 4.0)

## Features

- 📖 **Repaso SRS** — Flashcard con algoritmo FSRS, 4 ratings, intervalos visibles
- 📚 **Aprender** — Agregá tarjetas nuevas a tu cola con límite diario
- 🎯 **Practicar** — Ejercicios interactivos: traducción, escuchar, pinyin, mixto
- ⚡ **Modo Turbo** — 60s cronometrado con combo de puntos
- 🫧 **Burbujas** — Minijuego de palabras cayendo
- 📊 **Estadísticas** — Gráfico de actividad 30 días, progreso total
- ⚙️ **Ajustes** — Meta diaria de XP y palabras nuevas
- 🔥 **Gamificación** — XP, rachas, daily goal, sonidos, Word of the Day
- 🐉 **Dragón mascota** — 3 estados de ánimo según progreso
- 📱 **PWA** — Instalable en Android/Chrome

## Getting Started

```bash
nvm use 24
npm install
npm run dev
```

Requiere archivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
AUDIO_DIR=/tmp/epichinese/data/media
```

## Scripts

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Atribuciones

- **Dragon emoji** by [khr / chr-1x](https://github.com/chr-1x/dragn-emoji), CC BY-NC-SA 4.0
- **Contenido** de Spoonfed Chinese, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)
- **Algoritmo SRS** [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs), MIT
