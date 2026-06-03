"use server";

import { createClient } from "@/lib/supabase/server";

type ExerciseType = "translate" | "listen" | "pinyin";

interface RawQuestion {
  type: ExerciseType;
  chinese: string;
  pinyin: string;
  audio: string | null;
  options: string[];
  correctAnswer: string;
  prompt: string;
}

function pick<T>(arr: T[], count: number): T[] {
  return arr.sort(() => Math.random() - 0.5).slice(0, count);
}

export async function getPracticeQuestions(count = 12) {
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

  const types: ExerciseType[] = ["translate", "listen", "pinyin"];
  const questions: RawQuestion[] = [];
  let idx = 0;

  while (questions.length < count) {
    const type = types[idx % types.length];
    const card = shuffled[questions.length];

    let options: string[];
    let correctAnswer: string;
    let prompt: string;

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
    }

    questions.push({
      type,
      chinese: card.chinese,
      pinyin: card.pinyin,
      audio: card.audio,
      options: options.sort(() => Math.random() - 0.5),
      correctAnswer,
      prompt,
    });

    idx++;
  }

  return questions.sort(() => Math.random() - 0.5);
}
