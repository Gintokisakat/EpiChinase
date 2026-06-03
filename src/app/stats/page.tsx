import { getStats } from "./actions";
import StatsClient from "./StatsClient";

export default async function StatsPage() {
  const stats = await getStats();
  if (!stats) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-rice">
        <p className="text-ink/50">Redirigiendo...</p>
      </div>
    );
  }
  return <StatsClient stats={stats} />;
}
