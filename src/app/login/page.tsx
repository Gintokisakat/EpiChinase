"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/auth/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-rice px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-4xl">🐉</span>
          <h1 className="mt-4 text-2xl font-bold text-ink">Bienvenido de vuelta</h1>
          <p className="mt-1 text-sm text-ink/60">Continúa tu racha de estudio</p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            required
            className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-jade-500 focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-jade-500 focus:outline-none"
          />
          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-jade-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-jade-600 disabled:opacity-50"
          >
            {pending ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/50">
          ¿No tienes cuenta?{" "}
          <Link href="/signup" className="font-medium text-jade-500 hover:text-jade-600">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
