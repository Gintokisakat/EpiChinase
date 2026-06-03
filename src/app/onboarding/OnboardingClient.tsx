"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Dragon from "@/components/dragon/Dragon";
import { finishOnboarding } from "./actions";

const STEPS = [
  {
    title: "¡Bienvenido a EpiChinés!",
    description: "Tu compañero para aprender chino mandarín de forma divertida y efectiva.",
  },
  {
    title: "Repaso inteligente",
    description: "Usamos SRS (Spaced Repetition) para que recuerdes cada palabra en el momento justo. Como Anki, pero más divertido.",
  },
  {
    title: "Minijuegos y práctica",
    description: "Traducción, dictado, tonos, burbujas, turbo... ¡nunca fue tan entretenido estudiar chino!",
  },
];

export default function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    await finishOnboarding();
    router.push("/dashboard");
  };

  const { title, description } = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-jade-100 to-rice px-8">
      <Dragon mood="happy" width={150} height={150} />

      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-4 text-base text-ink/60 leading-relaxed">{description}</p>
      </div>

      <div className="mt-12 flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all ${
              i === step ? "w-6 bg-jade-500" : "bg-ink/20"
            }`}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {isLast ? (
          <button
            onClick={handleFinish}
            disabled={loading}
            className="rounded-2xl bg-jade-500 px-12 py-4 text-lg font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "..." : "¡Comenzar!"}
          </button>
        ) : (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="rounded-2xl bg-jade-500 px-12 py-4 text-lg font-bold text-white shadow-lg transition-all active:scale-95"
          >
            Siguiente
          </button>
        )}
        <button
          onClick={handleFinish}
          className="text-sm text-ink/40 underline underline-offset-2"
        >
          Saltar tutorial
        </button>
      </div>
    </div>
  );
}
