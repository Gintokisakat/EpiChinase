import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-rice px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-4xl">🐉</span>
          <h1 className="mt-4 text-2xl font-bold text-ink">Crea tu cuenta</h1>
          <p className="mt-1 text-sm text-ink/60">
            Tu dragón te espera
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-jade-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-jade-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-jade-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-jade-600"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/50">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-jade-500 hover:text-jade-600">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
