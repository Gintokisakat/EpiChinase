"use client";

import { useRouter } from "next/navigation";
import Dragon from "@/components/dragon/Dragon";
import type { LevelData } from "./actions";

export default function TreeClient({ levels }: { levels: LevelData[] }) {
  const router = useRouter();
  const totalLearned = levels.reduce((s, l) => s + l.learned, 0);
  const totalCards = levels.reduce((s, l) => s + l.total, 0);
  const currentLevel = levels.filter((l) => l.learned > 0).length || 1;

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-ink/50">← Volver</button>
        <span className="text-lg font-bold text-jade-600">Árbol de progreso</span>
        <span className="w-12" />
      </header>

      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-ink">{totalLearned} / {totalCards}</p>
          <p className="text-sm text-ink/40">tarjetas aprendidas</p>
        </div>

        <div className="relative flex flex-col items-center gap-0">
          {levels.map((lv, i) => {
            const isCurrent = lv.level === currentLevel;
            const isCompleted = lv.learned >= lv.total * 0.8;
            const progress = lv.total > 0 ? Math.round((lv.learned / lv.total) * 100) : 0;

            return (
              <div key={lv.level} className="flex flex-col items-center">
                {i > 0 && (
                  <div className="h-8 w-0.5 bg-ink/10" />
                )}
                <div
                  className={`relative flex w-full max-w-xs items-center gap-4 rounded-2xl border-2 px-5 py-4 transition-all ${
                    isCurrent
                      ? "border-jade-400 bg-jade-50 shadow-md"
                      : isCompleted
                      ? "border-green-300 bg-green-50"
                      : "border-ink/5 bg-white"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                      isCompleted
                        ? "bg-green-400 text-white"
                        : isCurrent
                        ? "bg-jade-500 text-white"
                        : "bg-ink/5 text-ink/40"
                    }`}
                  >
                    {isCompleted ? "✓" : lv.level}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold ${isCurrent ? "text-jade-700" : "text-ink"}`}>
                      {lv.name}
                    </p>
                    <p className="text-xs text-ink/40">
                      {lv.learned} / {lv.total} · {progress}%
                    </p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isCompleted ? "bg-green-400" : "bg-jade-400"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  {isCurrent && (
                    <Dragon mood="studying" width={36} height={36} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
