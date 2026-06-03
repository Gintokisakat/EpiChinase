"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Dragon from "@/components/dragon/Dragon";
import { playCorrect, playIncorrect, playFanfare } from "@/lib/sounds";
import confetti from "canvas-confetti";
import type { SpeechCard } from "./actions";

export default function SpeechClient({ cards: initial }: { cards: SpeechCard[] }) {
  const router = useRouter();
  const [cards] = useState(initial);
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<string>("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [results, setResults] = useState<{ chinese: string; correct: boolean }[]>([]);
  const [done, setDone] = useState(false);
  const [supported] = useState(() => typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window));

  const current = cards[index];
  const total = cards.length;

  const handleListen = useCallback(() => {
    if (listening || !current || feedback) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    setListening(true);
    setResult("");

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setResult(transcript);
      setListening(false);
      const correct = transcript.trim() === current.chinese;
      setFeedback(correct ? "correct" : "incorrect");
      if (correct) playCorrect();
      else playIncorrect();
    };

    recognition.onerror = () => {
      setListening(false);
      setResult("Error de micrófono");
    };

    recognition.start();
  }, [listening, current, feedback]);

  const handleContinue = useCallback(() => {
    if (!current) return;
    setResults((prev) => [...prev, { chinese: current.chinese, correct: feedback === "correct" }]);
    setResult("");
    setFeedback(null);
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }, [current, index, total, feedback]);

  const correctCount = results.filter((r) => r.correct).length;

  if (done) {
    return (
      <div className="flex min-h-dvh flex-col bg-rice">
        <header className="flex items-center justify-center px-6 py-4">
          <span className="text-lg font-bold text-jade-600">¡Completaste {total} ejercicios!</span>
        </header>
        <main className="flex flex-1 flex-col items-center gap-6 px-6 py-4">
          <Dragon mood={correctCount === total ? "celebrating" : "happy"} width={100} height={105} />
          <p className="text-center text-sm text-ink/50">Acertaste <strong className="text-jade-600">{correctCount}</strong> de {total}</p>
          <div className="flex w-full max-w-md flex-col gap-2">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${r.correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <p className="font-bold text-ink">{r.chinese}</p>
                <span className="text-xl">{r.correct ? "✅" : "❌"}</span>
              </div>
            ))}
          </div>
          <button onClick={() => router.push("/dashboard")} className="rounded-xl bg-jade-500 px-6 py-3 text-sm font-semibold text-white">Volver al dashboard</button>
        </main>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-rice px-6 text-center">
        <Dragon mood="happy" width={100} height={105} className="mb-4" />
        <h2 className="text-xl font-bold text-ink">Sin tarjetas</h2>
        <button onClick={() => router.push("/dashboard")} className="mt-6 rounded-xl bg-jade-500 px-6 py-3 text-sm font-semibold text-white">Volver al dashboard</button>
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
        <div className="h-full rounded-full bg-jade-400 transition-all duration-500" style={{ width: `${((index + (feedback ? 1 : 0)) / total) * 100}%` }} />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <Dragon mood="studying" width={56} height={60} />
        <p className="text-center text-sm text-ink/40">Leé y decí la palabra en chino</p>

        <p className="text-center text-3xl font-bold text-ink">{current.chinese}</p>
        <p className="text-center text-sm text-jade-600">{current.pinyin}</p>
        <p className="text-center text-xs text-ink/40">{current.english}</p>

        {!supported ? (
          <p className="text-center text-sm text-red-500">Reconocimiento de voz no disponible en este navegador. Probá con Chrome.</p>
        ) : (
          <>
            {!feedback && (
              <button
                onClick={handleListen}
                disabled={listening}
                className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl transition-all active:scale-90 ${listening ? "bg-red-100 animate-pulse" : "bg-jade-100 hover:bg-jade-200"}`}
              >
                {listening ? "🎙️" : "🗣️"}
              </button>
            )}

            {listening && <p className="text-sm text-ink/40 animate-pulse">Escuchando...</p>}
            {result && !feedback && <p className="text-sm text-ink/50">Reconocido: {result}</p>}

            {feedback && (
              <div className={`w-full max-w-sm rounded-2xl px-5 py-4 text-center ${feedback === "correct" ? "bg-green-100" : "bg-red-100"}`}>
                <p className={`text-sm font-semibold ${feedback === "correct" ? "text-green-700" : "text-red-700"}`}>
                  {feedback === "correct" ? "✓ Correcto" : `✗ Se esperaba: ${current.chinese}`}
                </p>
                {result && <p className="text-xs text-ink/40 mt-1">Dijiste: {result}</p>}
                <button onClick={handleContinue}
                  className={`mt-3 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white ${feedback === "correct" ? "bg-green-500" : "bg-red-500"}`}>
                  {index < total - 1 ? "Siguiente" : "Ver resultados"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <div className="h-28" />
    </div>
  );
}
