"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FSRS, Rating } from "ts-fsrs";
import Dragon from "@/components/dragon/Dragon";

interface CardData {
  card_id: number;
  difficulty: number;
  stability: number;
  retrievability: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number;
  due: string;
  card: {
    id: number;
    chinese: string;
    pinyin: string;
    english: string;
    audio: string | null;
    tags: string[];
  };
}

export default function ReviewClient({
  initialCards,
}: {
  initialCards: CardData[];
}) {
  const router = useRouter();
  const [cards, setCards] = useState(initialCards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const f = new FSRS({});

  const current = cards[index];

  const handleRating = useCallback(
    async (rating: Rating) => {
      if (!current) return;
      const supabase = createClient();

      const now = new Date();
      const card = {
        due: now,
        stability: current.stability,
        difficulty: current.difficulty,
        elapsed_days: current.elapsed_days,
        scheduled_days: current.scheduled_days,
        reps: current.reps,
        lapses: current.lapses,
        state: current.state,
        learning_steps: 0,
        last_elapsed_days: current.elapsed_days,
      };

      const { card: updated } = f.next(card, now, rating as 1 | 2 | 3 | 4);

      await supabase
        .from("user_cards")
        .update({
          difficulty: updated.difficulty,
          stability: updated.stability,
          elapsed_days: updated.elapsed_days,
          scheduled_days: updated.scheduled_days,
          reps: updated.reps,
          lapses: updated.lapses,
          state: updated.state,
          due: updated.due.toISOString(),
          last_review: now.toISOString(),
        })
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .eq("card_id", current.card_id);

      setFlipped(false);
      if (index < cards.length - 1) {
        setIndex((i) => i + 1);
      } else {
        router.push("/dashboard");
      }
    },
    [current, index, cards.length, router, f],
  );

  if (!current) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-rice px-6 text-center">
        <Dragon mood="celebrating" width={100} height={105} className="mb-4" />
        <h2 className="text-xl font-bold text-ink">¡Sin tarjetas pendientes!</h2>
        <p className="mt-2 text-sm text-ink/50">
          Vuelve más tarde o aprende nuevas tarjetas.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-xl bg-jade-500 px-6 py-3 text-sm font-semibold text-white"
        >
          Volver al dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-ink/50"
        >
          ← Volver
        </button>
        <span className="text-sm text-ink/40">
          {index + 1} / {cards.length}
        </span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 gap-4">
        <Dragon mood="studying" width={64} height={64} />
        <div
          onClick={() => setFlipped(true)}
          className="flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-3xl border border-ink/5 bg-white p-10 text-center shadow-lg transition-all hover:shadow-xl min-h-[320px]"
        >
          {!flipped ? (
            <>
              <p className="text-4xl font-bold text-ink">
                {current.card.chinese}
              </p>
              {current.card.audio && (
                <audio
                  src={`/audio/${current.card.audio}`}
                  autoPlay
                  className="mt-4"
                />
              )}
            </>
          ) : (
            <>
              <p className="mb-2 text-2xl text-jade-600">
                {current.card.pinyin}
              </p>
              <p className="text-xl text-ink/70">{current.card.english}</p>
            </>
          )}
        </div>

        {flipped && (
          <div className="mt-8 flex gap-3">
            {[
              { label: "Olvidé", rating: Rating.Again, cls: "bg-red-400" },
              {
                label: "Difícil",
                rating: Rating.Hard,
                cls: "bg-orange-400",
              },
              {
                label: "Bien",
                rating: Rating.Good,
                cls: "bg-jade-500",
              },
              { label: "Fácil", rating: Rating.Easy, cls: "bg-gold-500" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleRating(btn.rating)}
                className={`rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform active:scale-95 ${btn.cls}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
