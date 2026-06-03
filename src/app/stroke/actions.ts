"use server";

import { createClient } from "@/lib/supabase/server";

export async function searchCards(query: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let q = supabase.from("cards").select("id, chinese").limit(50);
  if (query) {
    q = supabase.from("cards").select("id, chinese").or(`chinese.ilike.%${query}%`).limit(50);
  }
  const { data } = await q;
  return data ?? [];
}
