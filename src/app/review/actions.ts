"use server";

import { createClient } from "@/lib/supabase/server";

const XP_REWARDS: Record<number, number> = {
  1: 0,
  2: 5,
  3: 10,
  4: 15,
};

export async function awardXP(rating: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { xp: 0, streak: 0, xpToday: 0 };

  const xpGained = XP_REWARDS[rating] ?? 0;
  const today = new Date().toISOString().slice(0, 10);

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, streak, last_study_date")
    .eq("id", user.id)
    .single();

  let newStreak = profile?.streak ?? 0;
  const lastDate = profile?.last_study_date;

  if (lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    newStreak = lastDate === yesterdayStr ? newStreak + 1 : 1;
  }

  await supabase
    .from("profiles")
    .update({
      xp: (profile?.xp ?? 0) + xpGained,
      streak: newStreak,
      last_study_date: today,
    })
    .eq("id", user.id);

  const { data: todayData } = await supabase
    .from("user_cards")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("last_review", today)
    .neq("state", 0);

  return { xp: xpGained, streak: newStreak, xpToday: (todayData?.length ?? 0) };
}
