"use server";

import { createClient } from "@/lib/supabase/server";

export async function lookupCharacter(char: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("cards")
    .select("chinese, pinyin, english")
    .ilike("chinese", `%${char}%`)
    .limit(5);

  return data ?? [];
}
