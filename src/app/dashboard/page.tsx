"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/auth/actions";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
      else setEmail(data.user.email ?? "");
    });
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between border-b border-ink/5 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐉</span>
          <span className="text-lg font-bold text-jade-600">Epichinese</span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-ink/10 px-4 py-2 text-sm text-ink/60 transition-colors hover:border-ink/20 hover:text-ink"
          >
            Cerrar sesión
          </button>
        </form>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-6xl">🐉</span>
        <h1 className="mb-2 text-2xl font-bold text-ink">
          ¡Bienvenido, estudiante!
        </h1>
        <p className="mb-1 text-sm text-ink/50">{email}</p>
        <p className="mb-8 text-sm text-ink/40">Comienza tu viaje con el chino mandarín</p>

        <div className="grid w-full max-w-md grid-cols-2 gap-4">
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-ink/5 bg-white/60 p-6 backdrop-blur-sm transition-colors hover:bg-white">
            <span className="text-3xl">📖</span>
            <span className="text-sm font-semibold text-ink">Repasar</span>
            <span className="text-xs text-ink/40">0 tarjetas pendientes</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-ink/5 bg-white/60 p-6 backdrop-blur-sm transition-colors hover:bg-white">
            <span className="text-3xl">📚</span>
            <span className="text-sm font-semibold text-ink">Aprender</span>
            <span className="text-xs text-ink/40">0 lecciones nuevas</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-ink/5 bg-white/60 p-6 backdrop-blur-sm transition-colors hover:bg-white">
            <span className="text-3xl">🎯</span>
            <span className="text-sm font-semibold text-ink">Practicar</span>
            <span className="text-xs text-ink/40">Ejercicios rápidos</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-ink/5 bg-white/60 p-6 backdrop-blur-sm transition-colors hover:bg-white">
            <span className="text-3xl">🏆</span>
            <span className="text-sm font-semibold text-ink">Logros</span>
            <span className="text-xs text-ink/40">0 de 20 desbloqueados</span>
          </button>
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm text-ink/40">
          <span className="inline-block h-2 w-2 rounded-full bg-jade-400" />
          Racha actual: <strong className="text-jade-600">0 días</strong>
        </div>
      </main>
    </div>
  );
}
