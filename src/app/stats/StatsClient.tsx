"use client";

import { useRouter } from "next/navigation";
import Dragon from "@/components/dragon/Dragon";

interface DayData {
  date: string;
  count: number;
}

interface Stats {
  xp: number;
  streak: number;
  dragonLevel: number;
  dailyXpGoal: number;
  totalLearned: number;
  dueCount: number;
  todayCount: number;
  dailyHistory: DayData[];
}

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function StatsClient({ stats }: { stats: Stats }) {
  const router = useRouter();
  const maxCount = Math.max(1, ...stats.dailyHistory.map((d) => d.count));

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-ink/50">← Volver</button>
        <span className="text-lg font-bold text-jade-600">Estadísticas</span>
        <span className="w-12" />
      </header>

      <main className="flex flex-1 flex-col items-center gap-6 px-6 py-6">
        <Dragon mood="happy" width={72} height={76} />

        <div className="grid w-full max-w-md grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-2xl border border-ink/5 bg-white/60 px-4 py-4">
            <span className="text-2xl">📚</span>
            <span className="mt-1 text-lg font-bold text-ink">{stats.totalLearned}</span>
            <span className="text-[10px] text-ink/40">Aprendidas</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-ink/5 bg-white/60 px-4 py-4">
            <span className="text-2xl">🔥</span>
            <span className="mt-1 text-lg font-bold text-ink">{stats.streak}</span>
            <span className="text-[10px] text-ink/40">Racha (días)</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-ink/5 bg-white/60 px-4 py-4">
            <span className="text-2xl">⭐</span>
            <span className="mt-1 text-lg font-bold text-ink">{stats.xp}</span>
            <span className="text-[10px] text-ink/40">XP total</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <h2 className="mb-3 text-sm font-semibold text-ink/50 uppercase tracking-wide">Actividad (30 días)</h2>
          <div className="flex items-end gap-[3px] h-28">
            {stats.dailyHistory.map((day) => {
              const pct = (day.count / maxCount) * 100;
              const isToday = day.date === new Date().toISOString().slice(0, 10);
              return (
                <div
                  key={day.date}
                  title={`${formatDate(day.date)}: ${day.count} tarjetas`}
                  className={`flex-1 rounded-t-sm transition-all ${
                    day.count === 0
                      ? "bg-ink/5"
                      : isToday
                        ? "bg-gold-400"
                        : "bg-jade-400"
                  }`}
                  style={{ height: `${Math.max(4, pct)}%` }}
                />
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-ink/30">
            <span>{formatDate(stats.dailyHistory[0]?.date ?? "")}</span>
            <span>hoy</span>
          </div>
        </div>

        <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl border border-ink/5 bg-white/60 px-5 py-4">
          <div className="flex justify-between">
            <span className="text-sm text-ink/50">Nivel del dragón</span>
            <span className="text-sm font-bold text-ink">{stats.dragonLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-ink/50">Repasos hoy</span>
            <span className="text-sm font-bold text-ink">{stats.todayCount} / {stats.dailyXpGoal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-ink/50">Pendientes de repaso</span>
            <span className="text-sm font-bold text-red-500">{stats.dueCount}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
