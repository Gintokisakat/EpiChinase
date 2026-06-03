"use server";

import { createClient } from "@/lib/supabase/server";

export async function getShopData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { items: [], owned: [], userXp: 0 };

  const { data: items } = await supabase.from("shop_items").select("*").order("price");
  const { data: purchases } = await supabase
    .from("user_purchases")
    .select("item_id")
    .eq("user_id", user.id);
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", user.id)
    .single();

  return {
    items: items ?? [],
    owned: (purchases ?? []).map((p) => p.item_id),
    userXp: profile?.xp ?? 0,
  };
}

export async function buyItem(itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No user" };

  const { data: item } = await supabase
    .from("shop_items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (!item) return { error: "Item not found" };

  const { data: existing } = await supabase
    .from("user_purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("item_id", itemId)
    .maybeSingle();

  if (existing) return { error: "Already owned" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", user.id)
    .single();

  if ((profile?.xp ?? 0) < item.price) return { error: "Not enough XP" };

  await supabase
    .from("profiles")
    .update({ xp: (profile?.xp ?? 0) - item.price })
    .eq("id", user.id);

  await supabase.from("user_purchases").insert({
    user_id: user.id,
    item_id: itemId,
  });

  return { success: true };
}
