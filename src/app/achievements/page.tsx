import { createClient } from "@/lib/supabase/server";
import AchievementsClient from "./AchievementsClient";

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("achievements")
    .select("achievement_id, unlocked_at")
    .eq("user_id", user.id)
    .order("unlocked_at", { ascending: false });

  const unlocked = data ?? [];

  return <AchievementsClient unlocked={unlocked} />;
}
