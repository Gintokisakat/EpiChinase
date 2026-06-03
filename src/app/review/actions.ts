"use server";

import { createClient } from "@/lib/supabase/server";
import { checkAndAwardAchievements, getUserAchievements } from "@/app/actions/achievements";

const XP_REWARDS: Record<number, number> = {
  1: 0,
  2: 5,
  3: 10,
  4: 15,
};

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 5000];

function computeLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export async function awardXP(rating: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { xp: 0, streak: 0, xpToday: 0, newLevel: 0 };

  const xpGained = XP_REWARDS[rating] ?? 0;
  const today = new Date().toISOString().slice(0, 10);

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, streak, last_study_date, dragon_level")
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

  const newXp = (profile?.xp ?? 0) + xpGained;
  const newLevel = computeLevel(newXp);
  const leveledUp = newLevel > (profile?.dragon_level ?? 1);

  await supabase
    .from("profiles")
    .update({
      xp: newXp,
      dragon_level: newLevel,
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

  const { unlocked } = await getUserAchievements();
  const newAchievements = await checkAndAwardAchievements(unlocked);

  return { xp: xpGained, streak: newStreak, xpToday: todayData?.length ?? 0, newLevel: leveledUp ? newLevel : 0, newAchievements };
}
