"use client";

import { logout } from "@/app/auth/actions";
import Link from "next/link";
import Dragon from "@/components/dragon/Dragon";

interface Stats {
  email: string | undefined;
  dueCount: number;
  newCount: number;
  totalCards: number;
  streak: number;
  xp: number;
  dragonLevel: number;
}

export default function DashboardClient({ stats }: { stats: Stats }) {
  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between border-b border-ink/5 px-6 py-4">
        <div className="flex items-center gap-2">
          <Dragon mood="happy" width={36} height={36} className="inline-block" />
          <span className="text-lg font-bold text-jade-600">Epichinese</span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-ink/10 px-4 py-2 text-sm text-ink/60 transition-colors hover:border-ink/20 hover:text-ink"
          >
            Cerrar sesión
          </button>
        </form>
      </header>

      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-8">
        <div className="text-center">
          <Dragon
            mood={stats.dueCount > 0 ? "studying" : "happy"}
            width={110}
            height={115}
          />
          <h1 className="mt-2 text-xl font-bold text-ink">
            Nivel {stats.dragonLevel}
          </h1>
          <p className="text-sm text-ink/50">{stats.email ?? "estudiante"}</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-jade-400" />
          Racha:{" "}
          <strong className="text-jade-600">{stats.streak} días</strong>
          <span className="mx-2 text-ink/20">|</span>
          XP:{" "}
          <strong className="text-gold-600">{stats.xp}</strong>
        </div>

        <div className="grid w-full max-w-md grid-cols-2 gap-4">
          <Link
            href="/review"
            className="flex flex-col items-center gap-2 rounded-2xl border border-ink/5 bg-white/60 p-6 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <span className="text-3xl">📖</span>
            <span className="text-sm font-semibold text-ink">Repasar</span>
            <span className="text-xs text-ink/40">
              {stats.dueCount} tarjetas pendientes
            </span>
          </Link>
          <Link
            href="/learn"
            className="flex flex-col items-center gap-2 rounded-2xl border border-ink/5 bg-white/60 p-6 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <span className="text-3xl">📚</span>
            <span className="text-sm font-semibold text-ink">Aprender</span>
            <span className="text-xs text-ink/40">
              {stats.newCount} nuevas
            </span>
          </Link>
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-ink/5 bg-white/60 p-6 backdrop-blur-sm transition-colors hover:bg-white">
            <span className="text-3xl">🎯</span>
            <span className="text-sm font-semibold text-ink">Practicar</span>
            <span className="text-xs text-ink/40">Ejercicios rápidos</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-ink/5 bg-white/60 p-6 backdrop-blur-sm transition-colors hover:bg-white">
            <span className="text-3xl">🏆</span>
            <span className="text-sm font-semibold text-ink">Logros</span>
            <span className="text-xs text-ink/40">
              {stats.streak > 0 ? `Racha de ${stats.streak} días` : "Próximamente"}
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
