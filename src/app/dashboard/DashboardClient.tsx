"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Dragon from "@/components/dragon/Dragon";
import DailyQuests from "@/components/DailyQuests";

interface Word {
  chinese: string;
  pinyin: string;
  english: string;
}

interface WordOfDay {
  id: number;
  chinese: string;
  pinyin: string;
  english: string;
  audio: string | null;
}

interface Stats {
  email: string | undefined;
  dueCount: number;
  newCount: number;
  totalCards: number;
  totalLearned: number;
  streak: number;
  xp: number;
  dragonLevel: number;
  dailyXpGoal: number;
  xpToday: number;
  recentWords: Word[];
  onboarded: boolean;
}

export default function DashboardClient({ stats, wordOfDay }: { stats: Stats; wordOfDay: WordOfDay | null }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!stats.onboarded && stats.xp === 0 && stats.totalLearned === 0) {
      router.replace("/onboarding");
    }
  }, [stats.onboarded, stats.xp, stats.totalLearned, router]);

  const handleAddWord = async () => {
    if (!wordOfDay || adding) return;
    setAdding(true);
    const { addWordOfDay } = await import("./actions");
    const result = await addWordOfDay(wordOfDay.id);
    if (result.success) {
      setAdded(true);
      setTimeout(() => router.push("/review"), 800);
    } else {
      if (result.error === "already added") setAdded(true);
      setAdding(false);
    }
  };

  const playAudio = (filename: string) => {
    new Audio(`/api/audio/${filename}`).play().catch(() => {});
  };

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between border-b border-ink/5 px-6 py-4">
        <div className="flex items-center gap-2">
          <Dragon mood="happy" width={36} height={36} className="inline-block" level={stats.dragonLevel} />
          <span className="text-lg font-bold text-jade-600">Epichinese</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/settings" className="rounded-lg border border-ink/10 px-3 py-2 text-sm text-ink/60 transition-colors hover:border-ink/20 hover:text-ink">
            ⚙️
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-8">
        <div className="text-center">
          <Dragon
            mood={stats.dueCount > 0 ? "studying" : "happy"}
            width={110}
            height={115}
            level={stats.dragonLevel}
          />
          <h1 className="mt-2 text-xl font-bold text-ink">
            Nivel {stats.dragonLevel}
          </h1>
          <p className="text-sm text-ink/50">{stats.email ?? "estudiante"}</p>
        </div>

        {wordOfDay && (
          <div className="w-full max-w-md rounded-2xl border border-jade-200/50 bg-gradient-to-br from-jade-50 to-white px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-jade-600 uppercase tracking-wide">Palabra del día</span>
              <span className="text-[10px] text-ink/30">{new Date().toLocaleDateString("es", { day: "numeric", month: "short" })}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-ink">{wordOfDay.chinese}</p>
                <p className="text-sm text-jade-600">{wordOfDay.pinyin}</p>
                <p className="text-xs text-ink/50">{wordOfDay.english}</p>
              </div>
              <div className="flex gap-2">
                {wordOfDay.audio && (
                  <button
                    onClick={() => playAudio(wordOfDay.audio!)}
                    className="rounded-lg bg-jade-100 px-3 py-2 text-sm text-jade-700"
                  >
                    🔊
                  </button>
                )}
                <button
                  onClick={handleAddWord}
                  disabled={adding || added}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold text-white transition-all ${
                    added ? "bg-green-500" : "bg-jade-500 hover:bg-jade-600"
                  } disabled:opacity-50`}
                >
                  {added ? "✓ Agregada" : adding ? "..." : "+ Estudiar"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full max-w-md flex-col gap-3">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="text-lg">🔥</span>
              <strong className="text-jade-600">{stats.streak} días</strong>
            </span>
            <span className="text-ink/20">|</span>
            <span className="flex items-center gap-1">
              <span className="text-lg">⭐</span>
              <strong className="text-gold-600">{stats.xp} XP</strong>
            </span>
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between text-xs text-ink/50 mb-1">
              <span>XP hoy: {stats.xpToday} / {stats.dailyXpGoal}</span>
              <span>{Math.round(Math.min(100, (stats.xpToday / stats.dailyXpGoal) * 100))}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-jade-400 to-gold-400 transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.xpToday / stats.dailyXpGoal) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <DailyQuests />

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
          <Link
            href="/practice"
            className="flex flex-col items-center gap-2 rounded-2xl border border-ink/5 bg-white/60 p-6 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <span className="text-3xl">🎯</span>
            <span className="text-sm font-semibold text-ink">Practicar</span>
            <span className="text-xs text-ink/40">Ejercicios rápidos</span>
          </Link>
          <Link
            href="/stats"
            className="flex flex-col items-center gap-2 rounded-2xl border border-ink/5 bg-white/60 p-6 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <span className="text-3xl">📊</span>
            <span className="text-sm font-semibold text-ink">Estadísticas</span>
            <span className="text-xs text-ink/40">{stats.totalLearned} palabras</span>
          </Link>
        </div>

        {stats.recentWords.length > 0 && (
          <div className="w-full max-w-md">
            <h2 className="mb-3 text-sm font-semibold text-ink/50 uppercase tracking-wide">Últimas palabras aprendidas</h2>
            <div className="flex flex-col gap-2">
              {stats.recentWords.map((w) => (
                <div
                  key={w.chinese}
                  className="flex items-center justify-between rounded-2xl border border-ink/5 bg-white/60 px-4 py-3"
                >
                  <div>
                    <p className="font-bold text-ink">{w.chinese}</p>
                    <p className="text-xs text-jade-600">{w.pinyin}</p>
                  </div>
                  <p className="text-xs text-ink/50">{w.english}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
