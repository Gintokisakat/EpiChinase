import { createClient } from "@/lib/supabase/server";
import { getNewCards } from "../dashboard/actions";
import LearnClient from "./LearnClient";

export default async function LearnPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let dailyNewLimit = 5;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("daily_new_limit")
      .eq("id", user.id)
      .single();
    if (profile) dailyNewLimit = profile.daily_new_limit;
  }

  const cards = await getNewCards(dailyNewLimit);

  const today = new Date().toISOString().slice(0, 10);
  const { count: learnedToday } = await supabase
    .from("user_cards")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user?.id ?? "")
    .eq("state", 0);

  return <LearnClient initialCards={cards} dailyNewLimit={dailyNewLimit} learnedToday={learnedToday ?? 0} />;
}
