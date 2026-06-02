import Link from "next/link";
import Dragon from "@/components/dragon/Dragon";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-rice font-sans">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Dragon mood="happy" width={36} height={36} className="inline-block" />
          <span className="text-xl font-bold text-jade-600">Epichinese</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-jade-500 px-4 py-2 text-sm font-medium text-jade-600 transition-colors hover:bg-jade-50"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-jade-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-jade-600"
          >
            Registrarse
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <Dragon mood="happy" width={120} height={126} className="mb-6" />
        <h1 className="mb-4 max-w-2xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Aprende chino mandarín
          <span className="text-jade-500"> jugando</span>
        </h1>
        <p className="mb-10 max-w-md text-lg leading-relaxed text-ink/70">
          Repaso espaciado inteligente, ejercicios interactivos y un dragón que
          te acompaña. Gratis, sin anuncios, para siempre.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-xl bg-jade-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-jade-500/25 transition-all hover:bg-jade-600 hover:shadow-xl hover:shadow-jade-500/30"
          >
            Empezar ahora
          </Link>
          <Link
            href="#features"
            className="rounded-xl border border-ink/10 px-8 py-4 text-lg font-medium text-ink/60 transition-colors hover:border-ink/20 hover:text-ink"
          >
            Cómo funciona
          </Link>
        </div>
      </main>

      <section
        id="features"
        className="grid grid-cols-1 gap-8 px-6 py-20 sm:grid-cols-3 sm:px-12"
      >
        {[
          {
            emoji: "🧠",
            title: "SRS Inteligente",
            desc: "Algoritmo FSRS optimizado para recordar vocabulario para siempre.",
          },
          {
            emoji: "🎮",
            title: "Gamificación",
            desc: "Rachas, logros, ejercicios por tiempo y un dragón que evoluciona.",
          },
          {
            emoji: "📚",
            title: "Contenido Real",
            desc: "Frases del día a día extraídas de Anki decks CC. HSK integrado.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-ink/5 bg-white/60 p-8 text-center backdrop-blur-sm"
          >
            <span className="mb-4 block text-4xl">{f.emoji}</span>
            <h3 className="mb-2 text-lg font-semibold text-ink">{f.title}</h3>
            <p className="text-sm leading-relaxed text-ink/60">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
