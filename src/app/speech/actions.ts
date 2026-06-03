"use server";

import { createClient } from "@/lib/supabase/server";
import { convertFields } from "@/lib/hanzi";

export interface SpeechCard {
  id: number;
  chinese: string;
  pinyin: string;
  english: string;
}

export async function getSpeechCards(count = 10) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("hanzi_mode, pinyin_mode")
    .eq("id", user.id)
    .single();
  const hanziMode = profile?.hanzi_mode ?? "simplified";
  const pinyinMode = profile?.pinyin_mode ?? "tones";

  const { data: cards } = await supabase
    .from("cards")
    .select("id, chinese, pinyin, english")
    .limit(80);

  if (!cards || cards.length < count) return [];
  return cards.sort(() => Math.random() - 0.5).slice(0, count).map((c) => convertFields(c, hanziMode, pinyinMode));
}
