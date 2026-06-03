"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dragon from "@/components/dragon/Dragon";
import { playCorrect, playIncorrect, playFanfare } from "@/lib/sounds";

interface TurboQuestion {
  id: number;
  chinese: string;
  options: string[];
  correctAnswer: string;
}

const LS_KEY = "epichinese_turbo_high";

function getHighScore(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(LS_KEY) || "0", 10);
}

function setHighScore(score: number) {
  localStorage.setItem(LS_KEY, String(score));
}

export default function TurboClient({
  initialQuestions,
}: {
  initialQuestions: TurboQuestion[];
}) {
  const router = useRouter();
  const [questions] = useState(initialQuestions);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [highScore] = useState(getHighScore);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionPool = useRef([...questions]);

  const current = questionPool.current[index % questionPool.current.length];

  const nextQuestion = useCallback(() => {
    setSelected(null);
    setFeedback(null);
    if (index + 1 >= questionPool.current.length) {
      questionPool.current = [...questionPool.current].sort(() => Math.random() - 0.5);
    }
    setIndex((i) => i + 1);
  }, [index]);

  const handleSelect = useCallback(
    (option: string) => {
      if (feedback || finished) return;
      setSelected(option);
      const correct = option === current.correctAnswer;
      setFeedback(correct ? "correct" : "incorrect");

      if (correct) {
        playCorrect();
        const newCombo = combo + 1;
        const multiplier = newCombo >= 5 ? 3 : newCombo >= 3 ? 2 : 1;
        setScore((s) => s + 10 * multiplier);
        setCombo(newCombo);
        if (newCombo > maxCombo) setMaxCombo(newCombo);
      } else {
        playIncorrect();
        setCombo(0);
      }

      setTimeout(nextQuestion, 600);
    },
    [feedback, finished, current, combo, maxCombo, nextQuestion],
  );

  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setFinished(true);
          playFanfare();
          if (score > highScore) setHighScore(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished, score, highScore]);

  const comboLabel = combo >= 5 ? "🔥🔥🔥" : combo >= 3 ? "🔥🔥" : combo >= 1 ? "🔥" : "";

  if (!started) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-rice px-6 text-center">
        <Dragon mood="happy" width={100} height={105} className="mb-4" />
        <h2 className="text-xl font-bold text-ink">Modo Turbo</h2>
        <p className="mt-2 text-sm text-ink/50">60 segundos. Respondé lo más rápido posible.</p>
        <p className="mt-1 text-xs text-ink/30">
          Racha de 3 → x2, 5+ → x3 | High score: {highScore}
        </p>
        <button
          onClick={() => setStarted(true)}
          className="mt-6 rounded-xl bg-jade-500 px-8 py-3 text-sm font-semibold text-white"
        >
          ¡Empezar!
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-3 text-sm text-ink/40"
        >
          Volver
        </button>
      </div>
    );
  }

  if (finished) {
    const isNew = score > highScore;
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-rice px-6 text-center">
        <Dragon mood={isNew ? "celebrating" : "happy"} width={100} height={105} className="mb-4" />
        <h2 className="text-xl font-bold text-ink">¡Tiempo!</h2>
        <p className="mt-2 text-3xl font-bold text-gold-500">{score} pts</p>
        {isNew && <p className="mt-1 text-sm text-gold-600">✨ ¡Nuevo récord!</p>}
        <p className="mt-2 text-xs text-ink/40">
          Mejor racha: {maxCombo} {maxCombo >= 3 ? "🔥" : ""}
        </p>
        <button
          onClick={() => {
            setScore(0);
            setCombo(0);
            setMaxCombo(0);
            setTimeLeft(60);
            setIndex(0);
            setFinished(false);
            setStarted(true);
            questionPool.current = [...questions].sort(() => Math.random() - 0.5);
          }}
          className="mt-6 rounded-xl bg-jade-500 px-8 py-3 text-sm font-semibold text-white"
        >
          Jugar de nuevo
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-3 text-sm text-ink/40"
        >
          Volver al dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between px-6 py-3">
        <span className="text-sm font-bold text-ink">
          {comboLabel} {score} pts
        </span>
        <span className={`text-sm font-bold ${timeLeft <= 10 ? "text-red-500" : "text-ink"}`}>
          {timeLeft}s
        </span>
        <span className="text-xs text-ink/30">
          {combo >= 3 ? `${combo} racha` : ""}
        </span>
      </header>

      <div className="mx-6 mb-2 h-2 overflow-hidden rounded-full bg-ink/10">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            timeLeft <= 10 ? "bg-red-500" : timeLeft <= 20 ? "bg-gold-500" : "bg-jade-400"
          }`}
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-6 gap-6">
        <Dragon mood="studying" width={48} height={52} />
        <p className="text-center text-4xl font-bold text-ink">{current.chinese}</p>

        <div className="flex w-full max-w-sm flex-col gap-3">
          {current.options.map((option) => {
            let cls = "border-ink/10 bg-white hover:border-ink/20";
            if (feedback) {
              if (option === current.correctAnswer) cls = "border-green-400 bg-green-50";
              else if (option === selected) cls = "border-red-400 bg-red-50";
              else cls = "border-ink/5 bg-white/50 opacity-50";
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
    </div>
  );
}
