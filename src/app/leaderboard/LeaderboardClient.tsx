"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";

interface Entry {
  rank: number;
  isUser: boolean;
  xp: number;
  level: number;
  streak: number;
}

interface Props {
  entries: Entry[];
  userRank: number;
  userXp: number;
}

function Crown({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xl">👑</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="text-sm font-bold text-ink/30 w-8 text-center">{rank}</span>;
}

export default function LeaderboardClient({ entries, userRank, userXp }: Props) {
  const router = useRouter();
  const { t, lang } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col" style={{ background: "var(--bg-primary)" }}>
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/stats")} className="text-sm" style={{ color: "var(--text-secondary)" }}>← {t("stats", "back")}</button>
        <span className="text-lg font-bold text-jade-600">{t("leaderboard", "title")}</span>
        <span className="w-12" />
      </header>
      <main className="flex flex-1 flex-col px-6 py-4">
        <p className="mb-4 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          {lang === "es" ? `Tu puesto: #${userRank} · ${userXp} XP` : `Your rank: #${userRank} · ${userXp} XP`}
        </p>
        <div className="flex flex-col gap-2">
          {entries.map((e) => (
            <div
              key={e.rank}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                e.isUser ? "bg-jade-500/10 border border-jade-500/30" : ""
              }`}
              style={{ background: e.isUser ? undefined : "var(--bg-card)", border: e.isUser ? undefined : "1px solid var(--bg-card-border)" }}
            >
              <Crown rank={e.rank} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: e.isUser
                        ? "var(--color-jade-500)"
                        : `hsl(${(e.rank * 37) % 360}, 50%, 50%)`,
                    }}
                  >
                    {e.level}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {t("tree", "level")} {e.level}
                  </span>
                  {e.isUser && (
                    <span className="rounded bg-jade-500/20 px-2 py-0.5 text-[10px] text-jade-600 font-semibold">
                      {lang === "es" ? "Tú" : "You"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                <span>🔥 {e.streak}</span>
                <span className="font-bold text-jade-500">{e.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
