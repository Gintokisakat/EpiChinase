"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dragon from "@/components/dragon/Dragon";
import { playCorrect, playIncorrect, playFanfare } from "@/lib/sounds";
import confetti from "canvas-confetti";
import type { ReorderQuestion } from "./actions";

export default function ReorderClient({ questions: initial }: { questions: ReorderQuestion[] }) {
  const router = useRouter();
  const [questions] = useState(initial);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [results, setResults] = useState<{ original: string; correct: boolean }[]>([]);
  const [done, setDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = questions[index];
  const total = questions.length;

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
    if (audio && current?.original) {
      const t = setTimeout(() => playAudio(audio), 400);
      return () => clearTimeout(t);
    }
  }, [current?.audio, current?.original, current?.id, playAudio]);

  const handleTap = useCallback((tokenIdx: number) => {
    if (feedback) return;
    if (selected.includes(tokenIdx)) {
      setSelected((prev) => prev.filter((i) => i !== tokenIdx));
    } else {
      setSelected((prev) => [...prev, tokenIdx]);
    }
  }, [feedback, selected]);

  const handleCheck = useCallback(() => {
    if (!current) return;
    const answer = selected.map((i) => current.tokens[i]).join("");
    const correct = answer === current.original;
    setFeedback(correct ? "correct" : "incorrect");
    if (correct) playCorrect();
    else playIncorrect();
  }, [current, selected]);

  const handleContinue = useCallback(() => {
    if (!current) return;
    setResults((prev) => [...prev, { original: current.original, correct: feedback === "correct" }]);
    setSelected([]);
    setFeedback(null);
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }, [current, index, total, feedback]);

  const correctCount = results.filter((r) => r.correct).length;

  useEffect(() => {
    if (done && correctCount > 0) {
      playFanfare();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [done, correctCount]);

  if (!current || done) {
    return (
      <div className="flex min-h-dvh flex-col bg-rice">
        <header className="flex items-center justify-center px-6 py-4">
          <span className="text-lg font-bold text-jade-600">
            {done ? `¡Completaste ${total} ejercicios!` : "Sin ejercicios"}
          </span>
        </header>
        <main className="flex flex-1 flex-col items-center gap-6 px-6 py-4">
          <Dragon mood={correctCount === total ? "celebrating" : "happy"} width={100} height={105} />
          {done && (
            <>
              <p className="text-center text-sm text-ink/50">
                Acertaste <strong className="text-jade-600">{correctCount}</strong> de {total}
              </p>
              <div className="flex w-full max-w-md flex-col gap-2">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                      r.correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}
                  >
                    <p className="font-bold text-ink">{r.original}</p>
                    <span className="text-xl">{r.correct ? "✅" : "❌"}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {!done && (
            <p className="text-sm text-ink/50">No hay suficientes tarjetas para armar ejercicios.</p>
          )}
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl bg-jade-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Volver al dashboard
          </button>
        </main>
      </div>
    );
  }

  const remaining = current.tokens.filter((_, i) => !selected.includes(i));
  const answerText = selected.map((i) => current.tokens[i]).join("");

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-ink/50">← Salir</button>
        <span className="text-sm text-ink/40">{index + 1} / {total}</span>
      </header>

      <div className="mx-6 mb-2 h-2 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-jade-400 transition-all duration-500"
          style={{ width: `${((index + (feedback ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <Dragon mood="studying" width={56} height={60} />
        {current.audio && (
          <button
            onClick={() => playAudio(current.audio!)}
            className="rounded-lg bg-jade-500 px-4 py-2 text-sm text-white"
          >
            🔊 Escuchar
          </button>
        )}
        <p className="text-center text-sm text-ink/40">Ordená los caracteres para formar la oración</p>

        <div className="flex min-h-[48px] flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/20 bg-white/50 px-4 py-3">
          {selected.length === 0 ? (
            <span className="text-sm text-ink/30">Tocá los caracteres en orden</span>
          ) : (
            selected.map((tokenIdx) => (
              <button
                key={tokenIdx}
                onClick={() => handleTap(tokenIdx)}
                className="rounded-lg bg-jade-100 px-3 py-2 text-xl font-bold text-jade-700 transition-transform active:scale-90"
              >
                {current.tokens[tokenIdx]}
              </button>
            ))
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {current.tokens.map((token, i) => {
            if (selected.includes(i)) return null;
            return (
              <button
                key={i}
                onClick={() => handleTap(i)}
                className="rounded-xl border-2 border-ink/10 bg-white px-4 py-3 text-xl font-bold text-ink transition-all active:scale-90 hover:border-jade-300"
              >
                {token}
              </button>
            );
          })}
        </div>

        {!feedback && selected.length > 0 && (
          <button
            onClick={handleCheck}
            className="rounded-xl bg-jade-500 px-8 py-3 text-sm font-semibold text-white transition-transform active:scale-95"
          >
            Verificar
          </button>
        )}
      </main>

      {feedback && (
        <div className={`px-6 py-4 ${feedback === "correct" ? "bg-green-100" : "bg-red-100"}`}>
          <p className={`text-sm font-semibold ${feedback === "correct" ? "text-green-700" : "text-red-700"}`}>
            {feedback === "correct" ? "✓ Correcto" : `✗ Incorrecto — ${current.original}`}
          </p>
          <p className="mt-1 text-xs text-ink/50">{current.pinyin}</p>
          <p className="text-xs text-ink/50">{current.english}</p>
          <button
            onClick={handleContinue}
            className={`mt-3 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white ${
              feedback === "correct" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {index < total - 1 ? "Siguiente" : "Ver resultados"}
          </button>
        </div>
      )}

      <div className="h-28" />
    </div>
  );
}
