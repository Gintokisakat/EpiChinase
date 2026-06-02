"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FSRS, Rating, createEmptyCard } from "ts-fsrs";

interface NewCard {
  id: number;
  chinese: string;
  pinyin: string;
  english: string;
  audio: string | null;
  tags: string[];
}

export default function LearnClient({
  initialCards,
}: {
  initialCards: NewCard[];
}) {
  const router = useRouter();
  const [cards, setCards] = useState(initialCards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const f = new FSRS({});

  const current = cards[index];

  const addCard = useCallback(
    async (rating: Rating) => {
      if (!current) return;
      setLoading(true);
      const supabase = createClient();
      const now = new Date();

      const empty = createEmptyCard(now);
      const { card } = f.next(empty, now, rating as 1 | 2 | 3 | 4);

      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from("user_cards").insert({
        user_id: user?.id,
        card_id: current.id,
        difficulty: card.difficulty,
        stability: card.stability,
        elapsed_days: card.elapsed_days,
        scheduled_days: card.scheduled_days,
        reps: card.reps,
        lapses: card.lapses,
        state: card.state,
        due: now.toISOString(),
        last_review: now.toISOString(),
      });

      setFlipped(false);
      setLoading(false);

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
        <span className="mb-4 text-6xl">🐉</span>
        <h2 className="text-xl font-bold text-ink">¡No hay más tarjetas nuevas!</h2>
        <p className="mt-2 text-sm text-ink/50">
          Todas las tarjetas disponibles ya están en tu cola de repaso.
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
          Nueva {index + 1} / {cards.length}
        </span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div
          onClick={() => setFlipped(true)}
          className="flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-3xl border border-ink/5 bg-white p-10 text-center shadow-lg transition-all hover:shadow-xl min-h-[320px]"
        >
          {!flipped ? (
            <>
              <p className="mb-2 text-sm text-ink/30">Chino</p>
              <p className="text-4xl font-bold text-ink">
                {current.chinese}
              </p>
            </>
          ) : (
            <>
              <p className="mb-2 text-sm text-ink/30">Pinyin</p>
              <p className="mb-6 text-2xl text-jade-600">{current.pinyin}</p>
              <p className="mb-2 text-sm text-ink/30">Español</p>
              <p className="text-xl text-ink/70">{current.english}</p>
            </>
          )}
        </div>

        {flipped && (
          <div className="mt-8 flex gap-3">
            {[
              { label: "Olvidé", rating: Rating.Again, cls: "bg-red-400" },
              { label: "Difícil", rating: Rating.Hard, cls: "bg-orange-400" },
              { label: "Bien", rating: Rating.Good, cls: "bg-jade-500" },
              { label: "Fácil", rating: Rating.Easy, cls: "bg-gold-500" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => addCard(btn.rating)}
                disabled={loading}
                className={`rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50 ${btn.cls}`}
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
