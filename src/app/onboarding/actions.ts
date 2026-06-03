"use server";

import { createClient } from "@/lib/supabase/server";

export async function finishOnboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No user" };

  const { error } = await supabase
    .from("profiles")
    .update({ onboarded: true })
    .eq("id", user.id);

  return { error: error?.message };
}