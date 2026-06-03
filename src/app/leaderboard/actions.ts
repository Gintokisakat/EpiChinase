"use server";

import { createClient } from "@/lib/supabase/server";

export async function getLeaderboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { entries: [], userRank: 0, userXp: 0 };

  const { data } = await supabase
    .from("profiles")
    .select("id, xp, dragon_level, streak")
    .order("xp", { ascending: false })
    .limit(100);

  const entries = (data ?? []).map((p, i) => ({
    rank: i + 1,
    isUser: p.id === user.id,
    xp: p.xp ?? 0,
    level: p.dragon_level ?? 1,
    streak: p.streak ?? 0,
  }));

  const userRank = entries.find((e) => e.isUser)?.rank ?? 0;
  const userEntry = data?.find((p) => p.id === user.id);
  const userXp = userEntry?.xp ?? 0;

  return { entries, userRank, userXp };
}
