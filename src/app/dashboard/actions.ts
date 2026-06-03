"use server";

import { createClient } from "@/lib/supabase/server";
import { convertFields } from "@/lib/hanzi";

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

  const { count: totalLearned } = await supabase
    .from("user_cards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .neq("state", 0);

  const { count: totalCards } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true });

  const { data: profile } = await supabase
    .from("profiles")
    .select("streak, xp, dragon_level, daily_xp_goal, hanzi_mode, pinyin_mode, onboarded")
    .eq("id", user.id)
    .single();


  const hanziMode = profile?.hanzi_mode ?? "simplified";
  const pinyinMode = profile?.pinyin_mode ?? "tones";

  const today = new Date().toISOString().slice(0, 10);
  const { count: xpToday } = await supabase
    .from("user_cards")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("last_review", today)
    .neq("state", 0);

  const { data: recentCards } = await supabase
    .from("user_cards")
    .select("card_id, last_review")
    .eq("user_id", user.id)
    .neq("state", 0)
    .order("last_review", { ascending: false })
    .limit(5);

  let recentWords: { chinese: string; pinyin: string; english: string }[] = [];
  if (recentCards && recentCards.length > 0) {
    const ids = recentCards.map((r) => r.card_id);
    const { data: words } = await supabase
      .from("cards")
      .select("id, chinese, pinyin, english")
      .in("id", ids);
    if (words) {
      const wordMap = new Map(words.map((w) => [w.id, w]));
      recentWords = ids
        .map((id) => wordMap.get(id))
        .filter(Boolean)
        .map((w) => convertFields(w, hanziMode, pinyinMode)) as { chinese: string; pinyin: string; english: string }[];
    }
  }

  return {
    email: user.email,
    dueCount: dueCount ?? 0,
    newCount: newCount ?? 0,
    totalLearned: totalLearned ?? 0,
    totalCards: totalCards ?? 7335,
    streak: profile?.streak ?? 0,
    xp: profile?.xp ?? 0,
    dragonLevel: profile?.dragon_level ?? 1,
    dailyXpGoal: profile?.daily_xp_goal ?? 30,
    xpToday: xpToday ?? 0,
    recentWords,
    onboarded: profile?.onboarded ?? false,
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("hanzi_mode, pinyin_mode")
    .eq("id", user.id)
    .single();
  const hanziMode = profile?.hanzi_mode ?? "simplified";
  const pinyinMode = profile?.pinyin_mode ?? "tones";

  const cardIds = userCards.map((uc) => uc.card_id);
  const { data: cardData } = await supabase
    .from("cards")
    .select("*")
    .in("id", cardIds);

  if (!cardData) return [];

  return userCards.map((uc) => ({
    ...uc,
    card: convertFields(cardData.find((c) => c.id === uc.card_id), hanziMode, pinyinMode),
  }));
}

export async function getWordOfDay() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let hanziMode = "simplified";
  let pinyinMode = "tones";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("hanzi_mode, pinyin_mode")
      .eq("id", user.id)
      .single();
    hanziMode = profile?.hanzi_mode ?? "simplified";
    pinyinMode = profile?.pinyin_mode ?? "tones";
  }

  const today = new Date().toISOString().slice(0, 10);
  let seed = 0;
  for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i) * (i + 1);

  const { data: cards } = await supabase
    .from("cards")
    .select("id, chinese, pinyin, english, audio");

  if (!cards || cards.length === 0) return null;
  return convertFields(cards[seed % cards.length], hanziMode, pinyinMode);
}

export async function addWordOfDay(cardId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not authenticated" };

  const { data: existing } = await supabase
    .from("user_cards")
    .select("id")
    .eq("user_id", user.id)
    .eq("card_id", cardId)
    .maybeSingle();

  if (existing) return { error: "already added" };

  const now = new Date();
  const { error } = await supabase.from("user_cards").insert({
    user_id: user.id,
    card_id: cardId,
    due: now.toISOString(),
    last_review: now.toISOString(),
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function getNewCards(limit = 5) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("hanzi_mode, pinyin_mode")
    .eq("id", user.id)
    .single();
  const hanziMode = profile?.hanzi_mode ?? "simplified";
  const pinyinMode = profile?.pinyin_mode ?? "tones";

  const { data: existingIds } = await supabase
    .from("user_cards")
    .select("card_id")
    .eq("user_id", user.id);

  const learnedIds = (existingIds ?? []).map((r) => r.card_id);

  let query = supabase.from("cards").select("*");
  if (learnedIds.length > 0) {
    query = query.not("id", "in", `(${learnedIds.join(",")})`);
  }
  const { data: cards } = await query.limit(limit);

  return (cards ?? []).map((c) => convertFields(c, hanziMode, pinyinMode));
}
