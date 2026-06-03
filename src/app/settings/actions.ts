"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("daily_xp_goal, daily_new_limit")
    .eq("id", user.id)
    .single();

  return {
    dailyXpGoal: data?.daily_xp_goal ?? 30,
    dailyNewLimit: data?.daily_new_limit ?? 10,
  };
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const dailyXpGoal = Math.max(1, Math.min(500, parseInt(formData.get("dailyXpGoal") as string) || 30));
  const dailyNewLimit = Math.max(1, Math.min(100, parseInt(formData.get("dailyNewLimit") as string) || 10));

  const { error } = await supabase
    .from("profiles")
    .update({ daily_xp_goal: dailyXpGoal, daily_new_limit: dailyNewLimit })
    .eq("id", user.id);

  if (error) throw new Error("Failed to update settings");
}
