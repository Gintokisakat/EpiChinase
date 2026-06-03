"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Dragon from "@/components/dragon/Dragon";

export default function StrokeClient() {
  const router = useRouter();
  const [char, setChar] = useState("好");
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);

  const loadCharacter = useCallback(async (c: string) => {
    if (!c || !containerRef.current) return;
    const HanziWriter = (await import("hanzi-writer")).default;
    if (writerRef.current) writerRef.current.destroy();
    writerRef.current = HanziWriter.create(containerRef.current, c, {
      width: 250,
      height: 250,
      padding: 10,
      strokeColor: "#4a5568",
      radicalColor: "#5ABF9E",
      delayBetweenStrokes: 300,
    });
    writerRef.current.animateCharacter();
  }, []);

  useEffect(() => {
    loadCharacter(char);
  }, [char, loadCharacter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setChar(input.trim()[0]);
      setInput("");
    }
  };

  const handleRandom = useCallback(async () => {
    const { searchCards } = await import("./actions");
    const cards = await searchCards("");
    if (cards.length > 0) {
      const random = cards[Math.floor(Math.random() * cards.length)];
      const ch = [...random.chinese].find((c) => c.charCodeAt(0) > 128);
      if (ch) setChar(ch);
    }
  }, []);

  const handleAnimate = useCallback(() => {
    if (writerRef.current) {
      writerRef.current.animateCharacter();
    }
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-ink/50">← Volver</button>
        <span className="text-lg font-bold text-jade-600">Orden de trazos</span>
        <span className="w-12" />
      </header>

      <main className="flex flex-1 flex-col items-center gap-6 px-6 py-8">
        <Dragon mood="studying" width={56} height={60} />
        <p className="text-center text-2xl font-bold text-ink">{char}</p>

        <div ref={containerRef} className="rounded-2xl border border-ink/10 bg-white p-4" />

        <div className="flex gap-3">
          <button onClick={handleAnimate} className="rounded-xl bg-jade-500 px-5 py-3 text-sm font-semibold text-white transition-transform active:scale-95">
            ▶ Reproducir
          </button>
          <button onClick={handleRandom} className="rounded-xl border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition-transform active:scale-95">
            🎲 Aleatorio
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full max-w-xs gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ingresá un carácter chino..."
            maxLength={1}
            className="flex-1 rounded-xl border border-ink/10 bg-white px-4 py-3 text-center text-lg font-bold text-ink outline-none focus:border-jade-400"
          />
          <button type="submit" disabled={!input.trim()} className="rounded-xl bg-jade-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            Ver
          </button>
        </form>

        <p className="text-center text-xs text-ink/30">Escribí un carácter chino para ver su orden de trazos</p>
      </main>
    </div>
  );
}
