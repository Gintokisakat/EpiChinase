"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { getDailyQuests, claimQuest } from "@/app/actions/quests";

interface Quest {
  id: string;
  progress: number;
  goal: number;
  completed: boolean;
  xpReward: number;
}

export default function DailyQuests() {
  const { t, lang } = useTranslation();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailyQuests().then((data) => {
      setQuests(data.quests);
      setLoading(false);
    });
  }, []);

  const handleClaim = async (id: string) => {
    const result = await claimQuest(id);
    if (result.xp) {
      setQuests((prev) =>
        prev.map((q) => (q.id === id ? { ...q, completed: true } : q))
      );
    }
  };

  if (loading) return null;

  const active = quests.filter((q) => !q.completed);

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
        {t("quests", "title")}
      </h2>
      <div className="flex flex-col gap-2">
        {quests.map((q) => {
          const pct = Math.min(100, (q.progress / q.goal) * 100);
          const isComplete = q.completed;
          return (
            <div
              key={q.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: "var(--bg-card)", border: "1px solid var(--bg-card-border)" }}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {t("quests", q.id === "streak3" ? "streak3" : q.id)}
                  </span>
                  {isComplete ? (
                    <span className="rounded-full bg-jade-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-jade-600">
                      {t("quests", "completed")}
                    </span>
                  ) : (
                    <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                      {q.progress}/{q.goal}
                    </span>
                  )}
                </div>
                <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                  {t("quests", q.id + "Desc")}
                </p>
                {!isComplete && (
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--bg-card-border)" }}>
                    <div
                      className="h-full rounded-full bg-jade-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gold-500">+{q.xpReward}</span>
                {isComplete ? (
                  <span className="text-sm">✅</span>
                ) : q.progress >= q.goal ? (
                  <button
                    onClick={() => handleClaim(q.id)}
                    className="rounded-full bg-jade-500 px-3 py-1 text-[10px] font-semibold text-white transition-transform active:scale-95"
                  >
                    {t("quests", "claim")}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
