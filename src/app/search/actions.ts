"use server";

import { createClient } from "@/lib/supabase/server";

export interface SearchResult {
  id: number;
  chinese: string;
  pinyin: string;
  english: string;
  audio: string | null;
}

export async function searchCards(query: string): Promise<SearchResult[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("cards")
    .select("id, chinese, pinyin, english, audio")
    .or(`chinese.ilike.%${query}%,pinyin.ilike.%${query}%,english.ilike.%${query}%`)
    .limit(30);

  return data ?? [];
}

export async function addCardToReview(cardId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not authenticated" };

  const { data: existing } = await supabase
    .from("user_cards")
    .select("id")
    .eq("user_id", user.id)
    .eq("card_id", cardId)
    .maybeSingle();

  if (existing) return { error: "already in your queue" };

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
