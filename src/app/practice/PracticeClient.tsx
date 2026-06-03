"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dragon from "@/components/dragon/Dragon";
import { awardXP } from "../review/actions";
import { playCorrect, playIncorrect, playFanfare } from "@/lib/sounds";
import confetti from "canvas-confetti";

interface Question {
  type: "translate" | "listen" | "pinyin" | "cloze";
  chinese: string;
  pinyin: string;
  english: string;
  audio: string | null;
  options: string[];
  correctAnswer: string;
  prompt: string;
  displayText?: string;
}

interface Result {
  question: string;
  correctAnswer: string;
  yourAnswer: string;
  correct: boolean;
  type: string;
}

export default function PracticeClient({
  initialQuestions,
}: {
  initialQuestions: Question[];
}) {
  const router = useRouter();
  const [questions] = useState(initialQuestions);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [results, setResults] = useState<Result[]>([]);
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
    if (current?.type === "listen" && current.audio) {
      const t = setTimeout(() => playAudio(current.audio!), 400);
      return () => clearTimeout(t);
    }
    }, [current?.type, current?.audio, current?.chinese, playAudio]);

  const handleSelect = useCallback((option: string) => {
    if (feedback) return;
    setSelected(option);
    const correct = option === current.correctAnswer;
    setFeedback(correct ? "correct" : "incorrect");
    if (correct) playCorrect();
    else playIncorrect();
  }, [feedback, current]);

  const handleContinue = useCallback(() => {
    const correct = selected === current.correctAnswer;
    setResults((prev) => [...prev, {
      question: current.chinese,
      correctAnswer: current.correctAnswer,
      yourAnswer: selected ?? "",
      correct,
      type: current.type,
    }]);
    setSelected(null);
    setFeedback(null);
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }, [selected, current, index, total]);

  const correctCount = results.filter((r) => r.correct).length;

  useEffect(() => {
    if (done && correctCount > 0) {
      playFanfare();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      awardXP(3).catch(() => {});
    }
  }, [done, correctCount]);

  const typeIcon: Record<string, string> = {
    translate: "📖",
    listen: "🎧",
    pinyin: "🔤",
    cloze: "✍️",
  };

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
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{typeIcon[r.type]}</span>
                      <div>
                        <p className="font-bold text-ink">{r.question}</p>
                        <p className="text-xs text-ink/40">{r.correctAnswer}</p>
                      </div>
                    </div>
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

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-ink/50">← Salir</button>
        <span className="flex items-center gap-1 text-sm text-ink/40">
          <span>{typeIcon[current.type]}</span>
          {index + 1} / {total}
        </span>
      </header>

      <div className="mx-6 mb-2 h-2 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-jade-400 transition-all duration-500"
          style={{ width: `${((index + (feedback ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-6 gap-6">
        <Dragon mood="studying" width={56} height={60} />
        <p className="text-center text-sm text-ink/40">{current.prompt}</p>

        {current.type === "translate" && (
          <p className="text-center text-3xl font-bold text-ink">{current.chinese}</p>
        )}

        {current.type === "listen" && (
          <>
            <p className="text-center text-3xl text-ink/30">🔊</p>
            {current.audio && (
              <button
                onClick={() => playAudio(current.audio!)}
                className="rounded-xl bg-jade-500 px-6 py-3 text-sm font-semibold text-white"
              >
                🔊 Repetir audio
              </button>
            )}
          </>
        )}

        {current.type === "pinyin" && (
          <p className="text-center text-3xl font-bold text-ink">{current.chinese}</p>
        )}

        {current.type === "cloze" && (
          <div className="w-full max-w-md text-center">
            <p className="text-2xl font-bold text-ink leading-relaxed">
              {(current.displayText ?? current.chinese).split("____").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="mx-1 inline-block min-w-[3rem] border-b-2 border-jade-500 text-jade-500">
                      ?
                    </span>
                  )}
                </span>
              ))}
            </p>
            <p className="mt-3 text-sm text-jade-600">{current.pinyin}</p>
            <p className="text-xs text-ink/40">{current.english}</p>
          </div>
        )}

        <div className="flex w-full max-w-sm flex-col gap-3">
          {current.options.map((option) => {
            let cls = "border-ink/10 bg-white hover:border-ink/20";
            if (feedback) {
              if (option === current.correctAnswer) cls = "border-green-400 bg-green-50";
              else if (option === selected) cls = "border-red-400 bg-red-50";
              else cls = "border-ink/5 bg-white/50 opacity-50";
            } else if (option === selected) {
              cls = "border-jade-400 bg-jade-50";
            }

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={!!feedback}
                className={`w-full rounded-xl border-2 px-5 py-4 text-left text-sm font-medium text-ink transition-all active:scale-[0.98] disabled:cursor-default ${cls}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </main>

      <div
        className={`fixed bottom-16 left-0 right-0 z-50 transition-transform duration-300 ${
          feedback ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className={`px-6 py-4 ${feedback === "correct" ? "bg-green-100" : "bg-red-100"}`}>
          <p className={`text-sm font-semibold ${feedback === "correct" ? "text-green-700" : "text-red-700"}`}>
            {feedback === "correct"
              ? `✓ Correcto — ${current.correctAnswer}`
              : `✗ Incorrecto — ${current.correctAnswer}`}
          </p>
          <button
            onClick={handleContinue}
            className={`mt-3 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white ${
              feedback === "correct" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {index < total - 1 ? "Siguiente" : "Ver resultados"}
          </button>
        </div>
      </div>

      <div className="h-28" />
    </div>
  );
}
