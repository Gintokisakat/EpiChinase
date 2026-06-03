"use server";

import { createClient } from "@/lib/supabase/server";
import { convertFields } from "@/lib/hanzi";
import { pinyinToNumbers, numbersToTones } from "@/lib/pinyin";

export interface ToneQuestion {
  id: number;
  chinese: string;
  audio: string;
  options: string[];
  correctAnswer: string;
}

export async function getToneQuestions(count = 10) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("hanzi_mode, pinyin_mode")
    .eq("id", user.id)
    .single();
  const hanziMode = profile?.hanzi_mode ?? "simplified";

  const { data: cards } = await supabase
    .from("cards")
    .select("id, chinese, pinyin, english, audio")
    .not("audio", "is", null)
    .limit(80);

  if (!cards || cards.length < count) return [];

  const shuffled = cards.sort(() => Math.random() - 0.5).slice(0, count);

  return shuffled.map((card) => {
    const correctNum = pinyinToNumbers(card.pinyin);

    const wrongOptions = new Set<string>();
    while (wrongOptions.size < 3) {
      const wrong = correctNum.replace(/[1-5]/g, () => String(Math.floor(Math.random() * 4) + 1));
      if (wrong !== correctNum) wrongOptions.add(numbersToTones(wrong));
    }

    const options = [numbersToTones(correctNum), ...wrongOptions].sort(() => Math.random() - 0.5);

    return convertFields({
      id: card.id,
      chinese: card.chinese,
      audio: card.audio!,
      options,
      correctAnswer: numbersToTones(correctNum),
    }, hanziMode, "tones");
  });
}
