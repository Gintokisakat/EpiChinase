import { getDashboardStats, getWordOfDay } from "./actions";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const wordOfDay = await getWordOfDay();

  if (!stats) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-rice">
        <p className="text-ink/50">Redirigiendo...</p>
      </div>
    );
  }

  return <DashboardClient stats={stats} wordOfDay={wordOfDay} />;
}
