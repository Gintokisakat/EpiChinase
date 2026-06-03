"use server";

import { createClient } from "@/lib/supabase/server";
import { ALL_ACHIEVEMENTS } from "@/lib/achievements";

export async function getUserAchievements() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { unlocked: [] as string[] };

  const { data } = await supabase
    .from("achievements")
    .select("achievement_id")
    .eq("user_id", user.id);

  return { unlocked: (data ?? []).map((r) => r.achievement_id) };
}

export async function checkAndAwardAchievements(unlocked: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, streak, dragon_level, last_study_date")
    .eq("id", user.id)
    .single();

  if (!profile) return [];

  const { count: totalReviews } = await supabase
    .from("user_cards")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .neq("state", 0);

  const newAchievements: string[] = [];
  const unlockedSet = new Set(unlocked);

  const checks: { id: string; check: boolean }[] = [
    { id: "first_review", check: (totalReviews ?? 0) >= 1 },
    { id: "steady_learner", check: (totalReviews ?? 0) >= 10 },
    { id: "dedicated_scholar", check: (totalReviews ?? 0) >= 100 },
    { id: "streak_starter", check: (profile.streak ?? 0) >= 3 },
    { id: "streak_master", check: (profile.streak ?? 0) >= 7 },
    { id: "streak_legend", check: (profile.streak ?? 0) >= 30 },
    { id: "first_steps", check: (profile.dragon_level ?? 1) >= 2 },
    { id: "rising_star", check: (profile.dragon_level ?? 1) >= 5 },
    { id: "dragon_master", check: (profile.dragon_level ?? 1) >= 10 },
    { id: "devoted", check: (profile.streak ?? 0) >= 7 },
  ];

  for (const { id, check } of checks) {
    if (unlockedSet.has(id)) continue;
    if (check) newAchievements.push(id);
  }

  if (newAchievements.length > 0) {
    const { error } = await supabase.from("achievements").insert(
      newAchievements.map((id) => ({ user_id: user.id, achievement_id: id }))
    );
    if (error) console.error("Failed to award achievements:", error);
  }

  return newAchievements;
}

export async function awardAchievement(achievementId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: existing } = await supabase
    .from("achievements")
    .select("id")
    .eq("user_id", user.id)
    .eq("achievement_id", achievementId)
    .maybeSingle();

  if (existing) return false;

  const { error } = await supabase.from("achievements").insert({
    user_id: user.id,
    achievement_id: achievementId,
  });

  return !error;
}
