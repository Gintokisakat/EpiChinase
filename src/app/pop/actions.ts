"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPopWords(count = 40) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: cards } = await supabase
    .from("cards")
    .select("id, chinese, pinyin, english")
    .limit(120);

  if (!cards) return [];
  return cards.sort(() => Math.random() - 0.5).slice(0, count).map((c) => ({
    id: c.id,
    hanzi: c.chinese,
    pinyin: c.pinyin,
  }));
}
