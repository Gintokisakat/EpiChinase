"use server";

import { createClient } from "@/lib/supabase/server";
import { convertFields } from "@/lib/hanzi";

export interface DictationQuestion {
  id: number;
  audio: string;
  pinyin: string;
  chinese: string;
  english: string;
}

export async function getDictationQuestions(count = 10) {
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
    .select("id, chinese, pinyin, english, audio")
    .not("audio", "is", null);

  if (!cards || cards.length < count) return [];

  const shuffled = cards.sort(() => Math.random() - 0.5).slice(0, count);

  return shuffled.map((card) => convertFields({
    id: card.id,
    audio: card.audio!,
    pinyin: card.pinyin,
    chinese: card.chinese,
    english: card.english,
  }, hanziMode, pinyinMode));
}
