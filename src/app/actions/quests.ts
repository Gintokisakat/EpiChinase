"use server";

import { createClient } from "@/lib/supabase/server";

const QUESTS = [
  { id: "review5", goal: 5, xpReward: 15, key: "review5" },
  { id: "learn3", goal: 3, xpReward: 15, key: "learn3" },
  { id: "practice1", goal: 1, xpReward: 10, key: "practice1" },
  { id: "streak3", goal: 3, xpReward: 20, key: "streak3" },
  { id: "perfect", goal: 1, xpReward: 25, key: "perfect" },
];

export async function getDailyQuests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { quests: [] };

  const today = new Date().toISOString().slice(0, 10);

  let quests = await supabase
    .from("daily_quests")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today);

  let existing = quests.data ?? [];

  if (existing.length === 0) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("streak")
      .eq("id", user.id)
      .single();

    const { count: reviewsToday } = await supabase
      .from("user_cards")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("last_review", today)
      .neq("state", 0);

    const { count: newToday } = await supabase
      .from("user_cards")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("last_review", today)
      .eq("state", 0);

    const streak = profile?.streak ?? 0;

    const progressMap: Record<string, number> = {
      review5: reviewsToday ?? 0,
      learn3: newToday ?? 0,
      practice1: 0,
      streak3: streak,
      perfect: 0,
    };

    const inserts = QUESTS.map((q) => ({
      user_id: user.id,
      quest_id: q.id,
      progress: progressMap[q.id] ?? 0,
      goal: q.goal,
      completed: (progressMap[q.id] ?? 0) >= q.goal,
      date: today,
    }));

    const { data: inserted } = await supabase
      .from("daily_quests")
      .insert(inserts)
      .select();

    existing = inserted ?? [];
  }

  return {
    quests: existing.map((q) => {
      const def = QUESTS.find((d) => d.id === q.quest_id);
      return {
        id: q.quest_id,
        progress: q.progress,
        goal: q.goal,
        completed: q.completed,
        xpReward: def?.xpReward ?? 10,
      };
    }),
  };
}

export async function claimQuest(questId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No user" };

  const today = new Date().toISOString().slice(0, 10);

  const { data: quest } = await supabase
    .from("daily_quests")
    .select("*")
    .eq("user_id", user.id)
    .eq("quest_id", questId)
    .eq("date", today)
    .single();

  if (!quest || !quest.completed) return { error: "Not completed" };

  const def = QUESTS.find((q) => q.id === questId);
  if (!def) return { error: "Unknown quest" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", user.id)
    .single();

  await supabase
    .from("profiles")
    .update({ xp: (profile?.xp ?? 0) + def.xpReward })
    .eq("id", user.id);

  await supabase
    .from("daily_quests")
    .update({ completed: true })
    .eq("id", quest.id);

  return { xp: def.xpReward };
}
