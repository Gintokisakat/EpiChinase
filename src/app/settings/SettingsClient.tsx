"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSettings } from "./actions";
import Dragon from "@/components/dragon/Dragon";

interface Settings {
  dailyXpGoal: number;
  dailyNewLimit: number;
}

export default function SettingsClient({ settings: initial }: { settings: Settings }) {
  const router = useRouter();
  const [dailyXpGoal, setDailyXpGoal] = useState(initial.dailyXpGoal);
  const [dailyNewLimit, setDailyNewLimit] = useState(initial.dailyNewLimit);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.set("dailyXpGoal", String(dailyXpGoal));
    fd.set("dailyNewLimit", String(dailyNewLimit));
    try {
      await updateSettings(fd);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      alert("Error al guardar");
    }
    setSaving(false);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-ink/50">← Volver</button>
        <span className="text-lg font-bold text-jade-600">Ajustes</span>
        <span className="w-12" />
      </header>

      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-8">
        <Dragon mood="happy" width={80} height={84} />
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">Meta diaria de XP</label>
            <input
              type="number"
              min={1}
              max={500}
              value={dailyXpGoal}
              onChange={(e) => setDailyXpGoal(Number(e.target.value))}
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-center text-lg font-bold text-ink outline-none focus:border-jade-400"
            />
            <p className="mt-1 text-xs text-ink/40">Tarjetas repasadas por día para cumplir la meta</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">Palabras nuevas por día</label>
            <input
              type="number"
              min={1}
              max={100}
              value={dailyNewLimit}
              onChange={(e) => setDailyNewLimit(Number(e.target.value))}
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-center text-lg font-bold text-ink outline-none focus:border-jade-400"
            />
            <p className="mt-1 text-xs text-ink/40">Límite de tarjetas nuevas que podés aprender por día</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-jade-500 px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
          >
            {saving ? "Guardando..." : done ? "✓ Guardado" : "Guardar"}
          </button>
        </form>
      </main>
    </div>
  );
}
