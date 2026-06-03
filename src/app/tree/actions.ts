"use server";

import { createClient } from "@/lib/supabase/server";

export interface LevelData {
  level: number;
  name: string;
  total: number;
  learned: number;
  unlocked: boolean;
}

const LEVEL_NAMES = [
  "Principiante", "Básico", "Elemental", "Inicial", "Intermedio",
  "Medio", "Avanzado", "Superior", "Experto", "Maestro",
];

export async function getTreeData(): Promise<LevelData[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: ids } = await supabase
    .from("cards")
    .select("id")
    .order("id", { ascending: true });

  if (!ids || ids.length === 0) return [];

  const levelSize = Math.ceil(ids.length / 10);
  const levels: { minId: number; maxId: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const start = i * levelSize;
    const end = Math.min(start + levelSize, ids.length);
    levels.push({ minId: ids[start].id, maxId: ids[end - 1].id });
  }

  const { data: userCards } = await supabase
    .from("user_cards")
    .select("card_id")
    .eq("user_id", user.id)
    .neq("state", 0);

  const learnedSet = new Set(userCards?.map((uc) => uc.card_id) ?? []);

  return levels.map((l, i) => {
    const count = ids.filter((c) => c.id >= l.minId && c.id <= l.maxId).length;
    const learned = ids.filter((c) => c.id >= l.minId && c.id <= l.maxId && learnedSet.has(c.id)).length;
    return {
      level: i + 1,
      name: LEVEL_NAMES[i],
      total: count,
      learned,
      unlocked: learned > 0 || i === 0,
    };
  });
}
