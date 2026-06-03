"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FSRS, Rating, createEmptyCard } from "ts-fsrs";
import Dragon from "@/components/dragon/Dragon";

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
  dailyNewLimit,
  learnedToday,
}: {
  initialCards: NewCard[];
  dailyNewLimit: number;
  learnedToday: number;
}) {
  const router = useRouter();
  const [cards, setCards] = useState(initialCards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [learned, setLearned] = useState<NewCard[]>([]);
  const [done, setDone] = useState(false);
  const f = new FSRS({});
  const current = cards[index];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((filename: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const el = new Audio(`/api/audio/${filename}`);
    audioRef.current = el;
    el.play().catch(() => {});
  }, []);

  useEffect(() => {
    const audio = current?.audio;
    if (audio) {
      const timer = setTimeout(() => playAudio(audio), 300);
      return () => clearTimeout(timer);
    }
  }, [current?.audio, current?.id, playAudio]);

  const addCard = useCallback(
    async (rating: Rating) => {
      if (!current) return;
      setLoading(true);
      const supabase = createClient();
      const now = new Date();

      const empty = createEmptyCard(now);
      const { card } = f.next(empty, now, rating as 1 | 2 | 3 | 4);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { error } = await supabase.from("user_cards").insert({
        user_id: user.id,
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

      if (error) {
        console.error("Failed to save card:", error);
        setLoading(false);
        return;
      }

      setLearned((prev) => [...prev, current]);
      setFlipped(false);
      setLoading(false);

      if (index < cards.length - 1) {
        setIndex((i) => i + 1);
      } else {
        setDone(true);
      }
    },
    [current, index, cards.length, router, f],
  );

  const keyActions = useMemo(
    () => ({
      " ": () => !loading && setFlipped(true),
      ArrowLeft: () => flipped && !loading && addCard(Rating.Hard),
      ArrowRight: () => flipped && !loading && addCard(Rating.Easy),
    }),
    [loading, flipped, addCard],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const action = keyActions[e.key as keyof typeof keyActions];
      if (action) {
        e.preventDefault();
        action();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keyActions]);

  if (done) {
    return (
      <div className="flex min-h-dvh flex-col bg-rice">
        <header className="flex items-center justify-center px-6 py-4">
          <span className="text-lg font-bold text-jade-600">¡Estudiaste {learned.length} palabras!</span>
        </header>
        <main className="flex flex-1 flex-col items-center gap-6 px-6 py-4">
          <Dragon mood="happy" width={100} height={105} />
          <p className="text-sm text-ink/50 text-center -mt-4">Bien hecho, estas palabras ya están en tu cola de repaso.</p>
          <div className="flex w-full max-w-md flex-col gap-3">
            {learned.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between rounded-2xl border border-ink/5 bg-white px-5 py-4"
              >
                <div>
                  <p className="text-lg font-bold text-ink">{w.chinese}</p>
                  <p className="text-sm text-jade-600">{w.pinyin}</p>
                </div>
                <p className="text-right text-sm text-ink/50">{w.english}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl bg-jade-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Ir al dashboard
          </button>
        </main>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-rice px-6 text-center">
        <Dragon mood="happy" width={100} height={105} className="mb-4" />
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
        <span className="text-xs text-ink/40 text-right">
          <span className="block">Nueva {index + 1} / {cards.length}</span>
          <span className="block">Hoy: {learnedToday + learned.length} / {dailyNewLimit}</span>
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
              {current.audio && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(current.audio!);
                  }}
                  className="mt-4 rounded-lg bg-jade-500 px-4 py-2 text-sm text-white"
                >
                  🔊 Escuchar
                </button>
              )}
            </>
          ) : (
            <>
              <p className="mb-2 text-sm text-ink/30">Pinyin</p>
              <p className="mb-6 text-2xl text-jade-600">{current.pinyin}</p>
              <p className="mb-2 text-sm text-ink/30">Español</p>
              <p className="text-xl text-ink/70">{current.english}</p>
              {current.audio && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(current.audio!);
                  }}
                  className="mt-4 rounded-lg bg-jade-500 px-4 py-2 text-sm text-white"
                >
                  🔊 Escuchar
                </button>
              )}
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
