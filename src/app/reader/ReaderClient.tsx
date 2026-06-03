"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Dragon from "@/components/dragon/Dragon";
import type { lookupCharacter } from "./actions";

interface LookupResult {
  chinese: string;
  pinyin: string;
  english: string;
}

export default function ReaderClient() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [lookupResults, setLookupResults] = useState<Record<string, LookupResult[]>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const handleCharClick = useCallback(async (char: string) => {
    if (loading) return;
    if (lookupResults[char]) {
      setSelectedChar(selectedChar === char ? null : char);
      return;
    }
    setLoading(char);
    const { lookupCharacter } = await import("./actions");
    const results = await lookupCharacter(char);
    setLookupResults((prev) => ({ ...prev, [char]: results }));
    setSelectedChar(char);
    setLoading(null);
  }, [loading, lookupResults, selectedChar]);

  const chars = [...new Set([...text.replace(/\s/g, "").replace(/[a-zA-Z0-9]/g, "")])].filter(
    (c) => c.charCodeAt(0) > 128,
  );

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-ink/50">← Volver</button>
        <span className="text-lg font-bold text-jade-600">Lector</span>
        <span className="w-12" />
      </header>

      <main className="flex flex-1 flex-col items-center gap-6 px-6 py-8">
        <Dragon mood="studying" width={56} height={60} />
        <p className="text-center text-sm text-ink/40">Pegá un texto en chino y tocá los caracteres para ver su significado</p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pegá aquí tu texto en chino..."
          rows={5}
          className="w-full max-w-lg rounded-xl border border-ink/10 bg-white px-4 py-3 text-lg leading-relaxed text-ink outline-none focus:border-jade-400 resize-none"
        />

        {text && (
          <div className="w-full max-w-lg rounded-2xl border border-ink/5 bg-white p-5 leading-loose">
            {[...text].map((char, i) => {
              const isChinese = char.charCodeAt(0) > 128;
              if (!isChinese) {
                return <span key={i} className="text-lg text-ink">{char}</span>;
              }
              const isLoading = loading === char;
              const isSelected = selectedChar === char;
              const hasData = lookupResults[char] && lookupResults[char].length > 0;
              return (
                <button
                  key={i}
                  onClick={() => handleCharClick(char)}
                  className={`inline-block text-lg transition-colors ${
                    isSelected
                      ? "rounded bg-jade-200 px-0.5 text-jade-900 font-bold"
                      : hasData
                      ? "text-ink hover:text-jade-600 cursor-pointer"
                      : "text-ink/50 cursor-pointer"
                  }`}
                >
                  {char}
                  {isLoading && <span className="ml-0.5 text-xs text-ink/30">...</span>}
                </button>
              );
            })}
          </div>
        )}

        {selectedChar && lookupResults[selectedChar] && (
          <div className="w-full max-w-lg rounded-2xl border-2 border-jade-200 bg-jade-50 px-5 py-4">
            <p className="mb-2 text-center text-2xl font-bold text-ink">{selectedChar}</p>
            {lookupResults[selectedChar].length === 0 ? (
              <p className="text-center text-sm text-ink/40">Sin resultados para este carácter</p>
            ) : (
              <div className="flex flex-col gap-2">
                {lookupResults[selectedChar].map((r, i) => (
                  <div key={i} className="rounded-xl bg-white px-4 py-3 text-sm">
                    <p className="font-bold text-ink">{r.chinese}</p>
                    <p className="text-xs text-jade-600">{r.pinyin}</p>
                    <p className="text-xs text-ink/40">{r.english}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
