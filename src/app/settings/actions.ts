"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("daily_xp_goal, daily_new_limit, hanzi_mode, pinyin_mode, language, dark_mode")
    .eq("id", user.id)
    .single();

  return {
    dailyXpGoal: data?.daily_xp_goal ?? 30,
    dailyNewLimit: data?.daily_new_limit ?? 10,
    hanziMode: data?.hanzi_mode ?? "simplified",
    pinyinMode: data?.pinyin_mode ?? "tones",
    language: (data?.language as "es" | "en") ?? "es",
    darkMode: data?.dark_mode ?? false,
  };
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const dailyXpGoal = Math.max(1, Math.min(500, parseInt(formData.get("dailyXpGoal") as string) || 30));
  const dailyNewLimit = Math.max(1, Math.min(100, parseInt(formData.get("dailyNewLimit") as string) || 10));
  const hanziMode = formData.get("hanziMode") as string;
  const pinyinMode = formData.get("pinyinMode") as string;
  const language = formData.get("language") as string;
  const darkMode = formData.get("darkMode") === "true";

  const updates: Record<string, unknown> = { daily_xp_goal: dailyXpGoal, daily_new_limit: dailyNewLimit };
  if (hanziMode === "simplified" || hanziMode === "traditional") {
    updates.hanzi_mode = hanziMode;
  }
  if (pinyinMode === "tones" || pinyinMode === "numbers") {
    updates.pinyin_mode = pinyinMode;
  }
  if (language === "es" || language === "en") {
    updates.language = language;
  }
  updates.dark_mode = darkMode;

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) throw new Error("Failed to update settings");
}
