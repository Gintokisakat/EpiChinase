import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

async function main() {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const raw = readFileSync(resolve(__dirname, "../data/cards.json"), "utf-8");
  const { cards } = JSON.parse(raw);

  const BATCH = 500;
  let inserted = 0;

  for (let i = 0; i < cards.length; i += BATCH) {
    const batch = cards.slice(i, i + BATCH).map((c: any) => ({
      id: c.id,
      chinese: c.chinese,
      pinyin: c.pinyin,
      english: c.english,
      audio: c.audio,
      tags: c.tags,
    }));

    const { error } = await supabase.from("cards").upsert(batch, {
      onConflict: "id",
      ignoreDuplicates: true,
    });

    if (error) {
      console.error(`Batch ${i / BATCH} failed:`, error.message);
      process.exit(1);
    }

    inserted += batch.length;
    console.log(`Inserted ${inserted}/${cards.length}`);
  }

  console.log(`✅ Done. ${inserted} cards seeded.`);
}

main();
