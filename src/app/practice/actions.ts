"use server";

import { createClient } from "@/lib/supabase/server";
import { convertFields } from "@/lib/hanzi";

export type ExerciseType = "translate" | "listen" | "pinyin" | "cloze";

export interface RawQuestion {
  type: ExerciseType;
  chinese: string;
  pinyin: string;
  english: string;
  audio: string | null;
  options: string[];
  correctAnswer: string;
  prompt: string;
  displayText?: string;
}

function pick<T>(arr: T[], count: number): T[] {
  return arr.sort(() => Math.random() - 0.5).slice(0, count);
}

function makeCloze(text: string): { display: string; answer: string } {
  const chars = [...text];
  if (chars.length < 3) return { display: text, answer: chars[0] ?? "" };
  const maxLen = Math.min(2, Math.max(1, Math.floor(chars.length / 4)));
  const len = Math.random() < 0.6 ? 1 : maxLen;
  const start = Math.floor(Math.random() * (chars.length - len));
  const answer = chars.slice(start, start + len).join("");
  chars.splice(start, len, "____");
  return { display: chars.join(""), answer };
}

export async function getPracticeQuestions(count = 12) {
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
    .limit(80);

  if (!cards || cards.length < count) return [];

  const shuffled = cards.sort(() => Math.random() - 0.5);
  const pool = shuffled.slice(count).map((c) => convertFields(c, hanziMode, pinyinMode));

  const types: ExerciseType[] = ["translate", "listen", "pinyin", "cloze"];
  const questions: RawQuestion[] = [];
  let idx = 0;

  while (questions.length < count) {
    const type = types[idx % types.length];
    const card = convertFields(shuffled[questions.length], hanziMode, pinyinMode);

    let options: string[];
    let correctAnswer: string;
    let prompt: string;
    let displayText: string | undefined;

    switch (type) {
      case "translate": {
        correctAnswer = card.english;
        prompt = "Elegí la traducción correcta";
        options = [correctAnswer, ...pick(pool.filter((c) => c.id !== card.id), 3).map((c) => c.english)];
        break;
      }
      case "listen": {
        correctAnswer = card.chinese;
        prompt = "Escuchá y elegí el carácter correcto";
        options = [correctAnswer, ...pick(pool.filter((c) => c.id !== card.id), 3).map((c) => c.chinese)];
        break;
      }
      case "pinyin": {
        correctAnswer = card.pinyin;
        prompt = "Elegí el pinyin correcto";
        options = [correctAnswer, ...pick(pool.filter((c) => c.id !== card.id), 3).map((c) => c.pinyin)];
        break;
      }
      case "cloze": {
        const { display, answer } = makeCloze(card.chinese);
        displayText = display;
        correctAnswer = answer;
        prompt = "Completá la oración";
        const poolChars = pool
          .filter((c) => c.chinese !== card.chinese)
          .flatMap((c) => [...c.chinese]);
        const distractorCount = Math.min(3, poolChars.length);
        const distractors: string[] = [];
        for (let i = 0; i < distractorCount; i++) {
          const idx = Math.floor(Math.random() * poolChars.length);
          distractors.push(poolChars.splice(idx, 1)[0]);
        }
        options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
        break;
      }
    }

    questions.push({
      type,
      chinese: card.chinese,
      pinyin: card.pinyin,
      english: card.english,
      audio: card.audio,
      options: options.sort(() => Math.random() - 0.5),
      correctAnswer,
      prompt,
      displayText,
    });

    idx++;
  }

  return questions.sort(() => Math.random() - 0.5);
}
