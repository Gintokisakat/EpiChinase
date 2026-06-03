import { getLeaderboard } from "./actions";
import LeaderboardClient from "./LeaderboardClient";

export default async function LeaderboardPage() {
  const data = await getLeaderboard();
  return <LeaderboardClient {...data} />;
}
