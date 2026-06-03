import { getDashboardStats, getWordOfDay } from "./actions";
import DashboardClient from "./DashboardClient";

import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const wordOfDay = await getWordOfDay();

  if (!stats) {
    return (
      <div className="flex min-h-dvh items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <p style={{ color: "var(--text-secondary)" }}>Redirigiendo...</p>
      </div>
    );
  }

  if (!stats.onboarded && stats.xp === 0 && stats.totalLearned === 0) {
    redirect("/onboarding");
  }

  return <DashboardClient stats={stats} wordOfDay={wordOfDay} />;
}
