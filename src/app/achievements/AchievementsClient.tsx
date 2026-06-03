"use client";

import { ALL_ACHIEVEMENTS, AchievementDef } from "@/lib/achievements";

interface UnlockedEntry {
  achievement_id: string;
  unlocked_at: string;
}

interface Props {
  unlocked: UnlockedEntry[];
}

export default function AchievementsClient({ unlocked }: Props) {
  const unlockedIds = new Set(unlocked.map((u) => u.achievement_id));

  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-ink">Achievements</h1>
      <p className="text-center text-sm text-ink/60">
        {unlocked.length} / {ALL_ACHIEVEMENTS.length} desbloqueados
      </p>
      <div className="grid grid-cols-2 gap-3">
        {ALL_ACHIEVEMENTS.map((ach) => {
          const unlockedEntry = unlocked.find((u) => u.achievement_id === ach.id);
          const isUnlocked = !!unlockedEntry;
          return (
            <div
              key={ach.id}
              className={`flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all ${
                isUnlocked
                  ? "bg-jade text-white shadow-md"
                  : "bg-ink/5 text-ink/40"
              }`}
            >
              <span className="text-3xl" style={{ filter: isUnlocked ? "none" : "grayscale(1) opacity(0.4)" }}>
                {ach.icon}
              </span>
              <span className={`text-sm font-semibold ${isUnlocked ? "text-white" : "text-ink/50"}`}>
                {ach.title}
              </span>
              <span className={`text-xs ${isUnlocked ? "text-white/80" : "text-ink/40"}`}>
                {ach.description}
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
