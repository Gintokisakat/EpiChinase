"use server";

import { createClient } from "@/lib/supabase/server";
import { convertFields } from "@/lib/hanzi";

export interface ReorderQuestion {
  id: number;
  original: string;
  tokens: string[];
  pinyin: string;
  english: string;
  audio: string | null;
}

export async function getReorderQuestions(count = 10) {
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
    .select("id, chinese, pinyin, english, audio");

  if (!cards || cards.length < count) return [];

  const suitable = cards.filter((c) => {
    const len = [...c.chinese].length;
    return len >= 4 && len <= 12;
  });

  const shuffled = suitable.sort(() => Math.random() - 0.5).slice(0, count);

  return shuffled.map((card) => {
    const tokens = [...card.chinese].sort(() => Math.random() - 0.5);
    const question: ReorderQuestion = {
      id: card.id,
      original: card.chinese,
      tokens,
      pinyin: card.pinyin,
      english: card.english,
      audio: card.audio,
    };
    return convertFields(question, hanziMode, pinyinMode);
  });
}
