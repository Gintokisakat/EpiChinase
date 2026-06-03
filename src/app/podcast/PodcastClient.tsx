"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { PODCASTS, getLevelColor } from "@/lib/podcasts";

export default function PodcastClient() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const [current, setCurrent] = useState<string | null>(null);

  const activePodcast = PODCASTS.find((p) => p.id === current);

  return (
    <div className="flex min-h-dvh flex-col" style={{ background: "var(--bg-primary)" }}>
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/stats")} className="text-sm" style={{ color: "var(--text-secondary)" }}>← {t("stats", "back")}</button>
        <span className="text-lg font-bold text-jade-600">{lang === "es" ? "Podcasts" : "Podcasts"}</span>
        <span className="w-12" />
      </header>

      <main className="flex flex-1 flex-col gap-4 px-6 py-4">
        {activePodcast && (
          <div className="overflow-hidden rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--bg-card-border)" }}>
            <div className="aspect-video w-full">
              <iframe
                src={activePodcast.url}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="px-4 py-3">
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{activePodcast.title}</h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{activePodcast.description}</p>
            </div>
          </div>
        )}

        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
          {lang === "es" ? "Episodios" : "Episodes"}
        </h2>

        <div className="flex flex-col gap-3">
          {PODCASTS.map((pod) => (
            <button
              key={pod.id}
              onClick={() => setCurrent(pod.id)}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-left transition-all ${
                current === pod.id ? "ring-2 ring-jade-500" : ""
              }`}
              style={{ background: "var(--bg-card)", border: "1px solid var(--bg-card-border)" }}
            >
              <span className="text-2xl">{pod.image}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{pod.title}</p>
                <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-secondary)" }}>{pod.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${getLevelColor(pod.level)}`}>
                    {pod.level}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{pod.duration}</span>
                </div>
              </div>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {current === pod.id ? "▶" : "▶"}
              </span>
            </button>
          ))}
        </div>

        <p className="text-center text-[10px] px-4" style={{ color: "var(--text-muted)" }}>
          {lang === "es"
            ? "Los episodios se reproducen a través de YouTube. Pueden contener anuncios."
            : "Episodes play via YouTube. May contain ads."}
        </p>
      </main>
    </div>
  );
}
