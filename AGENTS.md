# Epichinese Agent Instructions

## Shared Context
Always read `CONTEXT.md` and `TASKS.md` at the start of a session. Update `TASKS.md` when completing items.

## Code Style
- TypeScript strict mode, no `any` types
- Mobile-first responsive design
- No comments in code (unless absolutely necessary)
- Tailwind CSS v4 utility classes
- Server components by default, client components only when needed (interactivity, browser APIs)

## File Structure
```
src/
  app/       - Next.js App Router (pages, layouts, API routes)
  components/ - React components (grouped by feature)
  lib/       - Utilities, Supabase helpers, types
  hooks/     - Custom React hooks
types/       - Shared TypeScript types
```

## Git Workflow
- No commits without explicit user request
- After each major feature phase, ask user: "¿Hago commit/push?"
- Use conventional commits format
