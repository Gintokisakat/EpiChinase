"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, streak, dragon_level, daily_xp_goal, created_at")
    .eq("id", user.id)
    .single();

  const { count: totalLearned } = await supabase
    .from("user_cards")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .neq("state", 0);

  const { count: dueCount } = await supabase
    .from("user_cards")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("due", new Date().toISOString())
    .neq("state", 0);

  const today = new Date().toISOString().slice(0, 10);

  const { count: todayCount } = await supabase
    .from("user_cards")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("last_review", today)
    .neq("state", 0);

  const cards = await supabase
    .from("user_cards")
    .select("last_review, state")
    .eq("user_id", user.id)
    .neq("state", 0)
    .not("last_review", "is", null)
    .order("last_review", { ascending: false });

  const dayCounts: Record<string, number> = {};
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 29);

  for (let d = new Date(weekAgo); d <= new Date(); d.setDate(d.getDate() + 1)) {
    dayCounts[d.toISOString().slice(0, 10)] = 0;
  }

  if (cards.data) {
    for (const c of cards.data) {
      const day = c.last_review!.slice(0, 10);
      if (dayCounts[day] !== undefined) dayCounts[day]++;
    }
  }

  const dailyHistory = Object.entries(dayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  return {
    xp: profile?.xp ?? 0,
    streak: profile?.streak ?? 0,
    dragonLevel: profile?.dragon_level ?? 1,
    dailyXpGoal: profile?.daily_xp_goal ?? 30,
    totalLearned: totalLearned ?? 0,
    dueCount: dueCount ?? 0,
    todayCount: todayCount ?? 0,
    dailyHistory,
  };
}
