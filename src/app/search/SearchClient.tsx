"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Dragon from "@/components/dragon/Dragon";
import type { SearchResult } from "./actions";

export default function SearchClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<number | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearched(true);
    const { searchCards } = await import("./actions");
    const res = await searchCards(query.trim());
    setResults(res);
    setSearching(false);
  }, [query]);

  const handleAdd = useCallback(async (cardId: number) => {
    setAdding(cardId);
    const { addCardToReview } = await import("./actions");
    await addCardToReview(cardId);
    setAdding(null);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-ink/50">← Volver</button>
        <span className="text-lg font-bold text-jade-600">Buscar</span>
        <span className="w-12" />
      </header>

      <main className="flex flex-1 flex-col items-center gap-6 px-6 py-8">
        <Dragon mood="studying" width={64} height={64} />
        <div className="flex w-full max-w-sm gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Buscá en chino, pinyin o inglés..."
            className="flex-1 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-jade-400"
          />
          <button
            onClick={handleSearch}
            disabled={searching || !query.trim()}
            className="rounded-xl bg-jade-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {searching ? "..." : "🔍"}
          </button>
        </div>

        {searched && results.length === 0 && !searching && (
          <p className="text-sm text-ink/40">Sin resultados para &quot;{query}&quot;</p>
        )}

        <div className="flex w-full max-w-sm flex-col gap-3">
          {results.map((card) => (
            <div key={card.id} className="flex items-center justify-between rounded-2xl border border-ink/5 bg-white px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-ink">{card.chinese}</p>
                <p className="text-sm text-jade-600">{card.pinyin}</p>
                <p className="text-xs text-ink/40 truncate">{card.english}</p>
              </div>
              <button
                onClick={() => handleAdd(card.id)}
                disabled={adding === card.id}
                className="ml-3 shrink-0 rounded-lg bg-jade-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {adding === card.id ? "..." : "+ Aprender"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
