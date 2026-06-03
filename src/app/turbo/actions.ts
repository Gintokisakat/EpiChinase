"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTurboQuestions(count = 15) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: cards } = await supabase
    .from("cards")
    .select("id, chinese, pinyin, english, audio")
    .limit(80);

  if (!cards || cards.length < count) return [];

  const shuffled = cards.sort(() => Math.random() - 0.5);
  const pool = shuffled.slice(count);

  return shuffled.slice(0, count).map((card) => {
    const distractors = pool
      .filter((c) => c.id !== card.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.english);

    const options = [card.english, ...distractors].sort(() => Math.random() - 0.5);

    return {
      id: card.id,
      chinese: card.chinese,
      options,
      correctAnswer: card.english,
    };
  });
}

export async function saveHighScore(score: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("turbo_high_score")
    .eq("id", user.id)
    .single();

  if (!profile || score > (profile.turbo_high_score ?? 0)) {
    await supabase
      .from("profiles")
      .update({ turbo_high_score: score })
      .eq("id", user.id);
  }
}
