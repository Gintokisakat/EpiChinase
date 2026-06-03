"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Dragon from "@/components/dragon/Dragon";
import PracticeClient from "./PracticeClient";

type QuestionType = "translate" | "listen" | "pinyin" | "cloze";
type FilterMode = QuestionType | "mixed";

interface Question {
  type: QuestionType;
  chinese: string;
  pinyin: string;
  english: string;
  audio: string | null;
  options: string[];
  correctAnswer: string;
  prompt: string;
  displayText?: string;
}

const modes: { type: FilterMode; icon: string; title: string; desc: string }[] = [
  { type: "translate", icon: "📖", title: "Traducción", desc: "Elegí el significado en inglés" },
  { type: "listen", icon: "🎧", title: "Escuchar", desc: "Identificá el carácter por audio" },
  { type: "pinyin", icon: "🔤", title: "Pinyin", desc: "Elegí el pinyin correcto" },
  { type: "cloze", icon: "✍️", title: "Completar", desc: "Elegí el carácter que falta en la oración" },
  { type: "mixed", icon: "🎲", title: "Mixto", desc: "Todos los tipos mezclados" },
];

export default function PracticeMenu({ questions }: { questions: Question[] }) {
  const [selectedType, setSelectedType] = useState<FilterMode | null>(null);

  if (selectedType) {
    const filtered: Question[] = selectedType === "mixed"
      ? questions
      : questions.filter((q): q is Question => q.type === selectedType);
    return <PracticeClient initialQuestions={filtered} />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-rice">
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => {
          if (typeof window !== "undefined") window.location.href = "/dashboard";
        }} className="text-sm text-ink/50">← Volver</button>
        <span className="text-lg font-bold text-jade-600">Practicar</span>
        <span className="w-12" />
      </header>

      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-8">
        <Dragon mood="studying" width={80} height={84} />
        <h2 className="text-center text-sm text-ink/50">Elegí el tipo de ejercicio</h2>

        <div className="flex w-full max-w-sm flex-col gap-4">
          {modes.map((mode) => (
            <button
              key={mode.type}
              onClick={() => setSelectedType(mode.type)}
              className="flex items-center gap-4 rounded-2xl border border-ink/5 bg-white px-5 py-4 text-left transition-all hover:border-jade-300 hover:shadow-md active:scale-[0.98]"
            >
              <span className="text-2xl">{mode.icon}</span>
              <div>
                <p className="font-bold text-ink">{mode.title}</p>
                <p className="text-xs text-ink/40">{mode.desc}</p>
              </div>
              <span className="ml-auto text-ink/20">→</span>
            </button>
          ))}
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3 border-t border-ink/5 pt-6">
          <Link
            href="/turbo"
            className="flex items-center gap-4 rounded-2xl border-2 border-gold-300 bg-gradient-to-r from-gold-50 to-white px-5 py-4 text-left transition-all hover:shadow-md active:scale-[0.98]"
          >
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-bold text-ink">Modo Turbo</p>
              <p className="text-xs text-ink/40">60 segundos, puntaje y rachas</p>
            </div>
            <span className="ml-auto text-gold-500">→</span>
          </Link>
          <Link
            href="/pop"
            className="flex items-center gap-4 rounded-2xl border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-white px-5 py-4 text-left transition-all hover:shadow-md active:scale-[0.98]"
          >
            <span className="text-2xl">🫧</span>
            <div>
              <p className="font-bold text-ink">Burbujas</p>
              <p className="text-xs text-ink/40">Atrapá la palabra correcta antes que caiga</p>
            </div>
            <span className="ml-auto text-purple-500">→</span>
          </Link>
          <Link
            href="/reorder"
            className="flex items-center gap-4 rounded-2xl border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-white px-5 py-4 text-left transition-all hover:shadow-md active:scale-[0.98]"
          >
            <span className="text-2xl">🧩</span>
            <div>
              <p className="font-bold text-ink">Reordenar</p>
              <p className="text-xs text-ink/40">Ordená los caracteres para formar la oración</p>
            </div>
            <span className="ml-auto text-blue-500">→</span>
          </Link>
          <Link
            href="/dictation"
            className="flex items-center gap-4 rounded-2xl border-2 border-teal-300 bg-gradient-to-r from-teal-50 to-white px-5 py-4 text-left transition-all hover:shadow-md active:scale-[0.98]"
          >
            <span className="text-2xl">🎤</span>
            <div>
              <p className="font-bold text-ink">Dictado</p>
              <p className="text-xs text-ink/40">Escuchá y escribí el pinyin correcto</p>
            </div>
            <span className="ml-auto text-teal-500">→</span>
          </Link>
          <Link
            href="/tone"
            className="flex items-center gap-4 rounded-2xl border-2 border-pink-300 bg-gradient-to-r from-pink-50 to-white px-5 py-4 text-left transition-all hover:shadow-md active:scale-[0.98]"
          >
            <span className="text-2xl">🎵</span>
            <div>
              <p className="font-bold text-ink">Tonos</p>
              <p className="text-xs text-ink/40">Escuchá y elegí el tono correcto</p>
            </div>
            <span className="ml-auto text-pink-500">→</span>
          </Link>
          <Link
            href="/speech"
            className="flex items-center gap-4 rounded-2xl border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 to-white px-5 py-4 text-left transition-all hover:shadow-md active:scale-[0.98]"
          >
            <span className="text-2xl">🗣️</span>
            <div>
              <p className="font-bold text-ink">Hablar</p>
              <p className="text-xs text-ink/40">Practicá pronunciación con tu voz</p>
            </div>
            <span className="ml-auto text-indigo-500">→</span>
          </Link>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-3 border-t border-ink/5 pt-6">
          <Link href="/search" className="flex items-center gap-4 rounded-2xl border border-ink/5 bg-white px-5 py-4 text-left transition-all hover:border-jade-300">
            <span className="text-2xl">🔍</span>
            <div>
              <p className="font-bold text-ink">Buscar palabras</p>
              <p className="text-xs text-ink/40">Encontrá tarjetas por texto</p>
            </div>
            <span className="ml-auto text-ink/20">→</span>
          </Link>
          <Link href="/stroke" className="flex items-center gap-4 rounded-2xl border border-ink/5 bg-white px-5 py-4 text-left transition-all hover:border-jade-300">
            <span className="text-2xl">✏️</span>
            <div>
              <p className="font-bold text-ink">Orden de trazos</p>
              <p className="text-xs text-ink/40">Animación de escritura de caracteres</p>
            </div>
            <span className="ml-auto text-ink/20">→</span>
          </Link>
          <Link href="/reader" className="flex items-center gap-4 rounded-2xl border border-ink/5 bg-white px-5 py-4 text-left transition-all hover:border-jade-300">
            <span className="text-2xl">📄</span>
            <div>
              <p className="font-bold text-ink">Lector</p>
              <p className="text-xs text-ink/40">Pegá texto y tocá caracteres para ver significado</p>
            </div>
            <span className="ml-auto text-ink/20">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
