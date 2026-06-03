"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dragon from "@/components/dragon/Dragon";
import { playCorrect, playIncorrect, playFanfare } from "@/lib/sounds";

interface PopWord {
  id: number;
  hanzi: string;
  pinyin: string;
}

interface Bubble {
  id: string;
  hanzi: string;
  pinyin: string;
  isCorrect: boolean;
  left: number;
  duration: number;
  delay: number;
}

const LS_KEY = "epichinese_pop_high";
const POINTS_PER_HIT = 10;
const LIVES = 3;
const BUBBLE_COUNT = 5;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

export default function PopClient({ initialWords }: { initialWords: PopWord[] }) {
  const router = useRouter();
  const [words] = useState(initialWords);
  const [started, setStarted] = useState(false);
  const [lives, setLives] = useState(LIVES);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentPinyin, setCurrentPinyin] = useState("");
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [roundKey, setRoundKey] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem(LS_KEY) || "0", 10);
  });
  const usedIds = useRef<Set<number>>(new Set());
  const activePinyinRef = useRef("");
  const roundRef = useRef(0);

  const startRound = useCallback(() => {
    const available = words.filter((w) => !usedIds.current.has(w.id));
    if (available.length < BUBBLE_COUNT) usedIds.current.clear();

    const pool = available.length >= BUBBLE_COUNT ? available : words;
    const correct = shuffle(pool)[0];
    usedIds.current.add(correct.id);

    const distractors = pick(pool.filter((w) => w.id !== correct.id), BUBBLE_COUNT - 1);

    const all = shuffle([correct, ...distractors]).map((w, i) => ({
      id: `b-${roundRef.current}-${i}`,
      hanzi: w.hanzi,
      pinyin: w.pinyin,
      isCorrect: w.id === correct.id,
      left: 5 + Math.random() * 75,
      duration: 4 + Math.random() * 2.5,
      delay: Math.random() * 0.3,
    }));

    activePinyinRef.current = correct.pinyin;
    setCurrentPinyin(correct.pinyin);
    setBubbles(all);
    roundRef.current++;
    setRoundKey((k) => k + 1);
  }, [words]);

  const loseLife = useCallback(() => {
    setLives((l) => {
      if (l <= 1) {
        const finalScore = score;
        if (finalScore > parseInt(localStorage.getItem(LS_KEY) || "0", 10)) {
          localStorage.setItem(LS_KEY, String(finalScore));
        }
        playFanfare();
        setGameOver(true);
        return 0;
      }
      setCombo(0);
      return l - 1;
    });
    if (lives > 1) startRound();
  }, [lives, score, startRound]);

  useEffect(() => {
    if (!started || gameOver) return;
    startRound();
  }, [started, gameOver, startRound]);

  useEffect(() => {
    if (!started || gameOver || bubbles.length === 0) return;

    const maxDuration = Math.max(...bubbles.map((b) => (b.duration + b.delay) * 1000));
    const timer = setTimeout(() => {
      if (!gameOver) loseLife();
    }, maxDuration + 200);

    return () => clearTimeout(timer);
  }, [bubbles, started, gameOver, loseLife]);

  const handleTap = useCallback(
    (bubble: Bubble) => {
      if (gameOver) return;
      if (bubble.isCorrect) {
        playCorrect();
        const newCombo = combo + 1;
        const mult = newCombo >= 5 ? 3 : newCombo >= 3 ? 2 : 1;
        setScore((s) => s + POINTS_PER_HIT * mult);
        setCombo(newCombo);
        startRound();
      } else {
        playIncorrect();
        setCombo(0);
      }
    },
    [combo, gameOver, startRound],
  );

  const comboLabel = combo >= 5 ? "🔥🔥🔥" : combo >= 3 ? "🔥🔥" : combo >= 1 ? "🔥" : "";

  if (!started) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-rice px-6 text-center">
        <Dragon mood="happy" width={100} height={105} className="mb-4" />
        <h2 className="text-xl font-bold text-ink">Burbujas 🫧</h2>
        <p className="mt-2 text-sm text-ink/50">
          Tocá la palabra correcta según el pinyin mostrado. ¡No dejes que caigan!
        </p>
        <p className="mt-1 text-xs text-ink/30">
          Racha 3 → x2, 5+ → x3 | High score: {highScore}
        </p>
        <button
          onClick={() => setStarted(true)}
          className="mt-6 rounded-xl bg-jade-500 px-8 py-3 text-sm font-semibold text-white"
        >
          ¡Empezar!
        </button>
        <button onClick={() => router.push("/dashboard")} className="mt-3 text-sm text-ink/40">
          Volver
        </button>
      </div>
    );
  }

  if (gameOver) {
    const isNew = score > highScore;
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-rice px-6 text-center">
        <Dragon mood={isNew ? "celebrating" : "happy"} width={100} height={105} className="mb-4" />
        <h2 className="text-xl font-bold text-ink">¡Game Over!</h2>
        <p className="mt-2 text-3xl font-bold text-gold-500">{score} pts</p>
        {isNew && <p className="mt-1 text-sm text-gold-600">✨ ¡Nuevo récord!</p>}
        <p className="mt-1 text-xs text-ink/40">
          Mejor racha: {combo} {combo >= 3 ? "🔥" : ""}
        </p>
        <button
          onClick={() => {
            setLives(LIVES);
            setScore(0);
            setCombo(0);
            setGameOver(false);
            usedIds.current.clear();
            roundRef.current = 0;
            setStarted(true);
          }}
          className="mt-6 rounded-xl bg-jade-500 px-8 py-3 text-sm font-semibold text-white"
        >
          Jugar de nuevo
        </button>
        <button onClick={() => router.push("/dashboard")} className="mt-3 text-sm text-ink/40">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900">
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <div className="flex gap-1">
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i} className="text-xl">❤️</span>
          ))}
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">{score} pts</p>
          {comboLabel && <p className="text-xs text-gold-400">{comboLabel} x{combo >= 5 ? 3 : combo >= 3 ? 2 : 1}</p>}
        </div>
        <button onClick={() => router.push("/dashboard")} className="text-sm text-white/50">
          ✕
        </button>
      </div>

      <div className="relative z-10 mx-auto mt-4 max-w-xs rounded-xl bg-white/10 px-6 py-3 text-center backdrop-blur-sm">
        <p className="text-xs text-white/50">Tocá el carácter para</p>
        <p className="text-xl font-bold text-gold-300">{currentPinyin}</p>
      </div>

      <div className="absolute inset-x-0 top-32" key={roundKey}>
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={() => handleTap(b)}
            className={`absolute rounded-full px-4 py-2 text-lg font-bold shadow-lg transition-transform active:scale-90 ${
              b.isCorrect
                ? "bg-gradient-to-br from-jade-400 to-emerald-600 text-white"
                : "bg-gradient-to-br from-rose-400 to-pink-600 text-white/80"
            }`}
            style={{
              left: `${b.left}%`,
              animation: `drop ${b.duration}s linear ${b.delay}s`,
              transform: "translateX(-50%)",
            }}
          >
            {b.hanzi}
          </button>
        ))}
      </div>
    </div>
  );
}
