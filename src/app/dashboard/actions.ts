"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { count: dueCount } = await supabase
    .from("user_cards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("due", new Date().toISOString())
    .neq("state", 0);

  const { count: newCount } = await supabase
    .from("user_cards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("state", 0);

  const { count: totalCards } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true });

  const { data: profile } = await supabase
    .from("profiles")
    .select("streak, xp, dragon_level")
    .eq("id", user.id)
    .single();

  return {
    email: user.email,
    dueCount: dueCount ?? 0,
    newCount: newCount ?? 0,
    totalCards: totalCards ?? 7335,
    streak: profile?.streak ?? 0,
    xp: profile?.xp ?? 0,
    dragonLevel: profile?.dragon_level ?? 1,
  };
}

export async function getDueCards(limit = 20) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: userCards } = await supabase
    .from("user_cards")
    .select("card_id, difficulty, stability, retrievability, elapsed_days, scheduled_days, reps, lapses, state, due")
    .eq("user_id", user.id)
    .lte("due", new Date().toISOString())
    .neq("state", 0)
    .order("due")
    .limit(limit);

  if (!userCards || userCards.length === 0) return [];

  const cardIds = userCards.map((uc) => uc.card_id);
  const { data: cardData } = await supabase
    .from("cards")
    .select("*")
    .in("id", cardIds);

  if (!cardData) return [];

  return userCards.map((uc) => ({
    ...uc,
    card: cardData.find((c) => c.id === uc.card_id),
  }));
}

export async function getNewCards(limit = 5) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: existingIds } = await supabase
    .from("user_cards")
    .select("card_id")
    .eq("user_id", user.id);

  const learnedIds = new Set((existingIds ?? []).map((r) => r.card_id));

  const { data: cards } = await supabase
    .from("cards")
    .select("*")
    .limit(limit + learnedIds.size * 2);

  if (!cards) return [];

  return cards.filter((c) => !learnedIds.has(c.id)).slice(0, limit);
}
