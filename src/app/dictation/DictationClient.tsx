"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dragon from "@/components/dragon/Dragon";
import { arePinyinEqual } from "@/lib/pinyin";
import { playCorrect, playIncorrect, playFanfare } from "@/lib/sounds";
import confetti from "canvas-confetti";
import type { DictationQuestion } from "./actions";

export default function DictationClient({ questions: initial }: { questions: DictationQuestion[] }) {
  const router = useRouter();
  const [questions] = useState(initial);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [results, setResults] = useState<{ chinese: string; correct: boolean }[]>([]);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = questions[index];
  const total = questions.length;

  const playAudio = useCallback(() => {
    if (!current?.audio) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const el = new Audio(`/api/audio/${current.audio}`);
    audioRef.current = el;
    el.play().catch(() => {});
  }, [current?.audio]);

  useEffect(() => {
    const t = setTimeout(playAudio, 400);
    return () => clearTimeout(t);
  }, [current?.id, playAudio]);

  const handleCheck = useCallback(() => {
    if (!current || feedback) return;
    const correct = arePinyinEqual(input.trim(), current.pinyin);
    setFeedback(correct ? "correct" : "incorrect");
    if (correct) playCorrect();
    else playIncorrect();
  }, [current, input, feedback]);

  const handleContinue = useCallback(() => {
    if (!current) return;
    setResults((prev) => [...prev, { chinese: current.chinese, correct: feedback === "correct" }]);
    setInput("");
    setFeedback(null);
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }, [current, index, total, feedback]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (feedback) handleContinue();
      else handleCheck();
    }
  }, [feedback, handleCheck, handleContinue]);

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
            {done ? `¡Completaste ${total} dictados!` : "Sin ejercicios"}
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
                    <p className="font-bold text-ink">{r.chinese}</p>
                    <span className="text-xl">{r.correct ? "✅" : "❌"}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {!done && (
            <p className="text-sm text-ink/50">No hay suficientes tarjetas con audio para armar ejercicios.</p>
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
        <p className="text-center text-sm text-ink/40">Escuchá y escribí el pinyin</p>

        <button
          onClick={playAudio}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-jade-100 text-4xl transition-transform active:scale-90 hover:bg-jade-200"
        >
          🔊
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => !feedback && setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ej: ni3 hao3"
          autoFocus
          disabled={!!feedback}
          className="w-full max-w-xs rounded-xl border-2 border-ink/10 bg-white px-5 py-4 text-center text-lg font-bold text-ink outline-none transition-all focus:border-jade-400 disabled:opacity-50"
        />

        <p className="text-center text-xs text-ink/30">Podés usar tildes (nǐ hǎo) o números (ni3 hao3)</p>

        {!feedback && input.trim() && (
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
            {feedback === "correct"
              ? `✓ Correcto — ${current.pinyin}`
              : `✗ Correcto era — ${current.pinyin}`}
          </p>
          <p className="mt-1 text-xs text-ink/50">{current.chinese} — {current.english}</p>
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
