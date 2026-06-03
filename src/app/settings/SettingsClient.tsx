"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateSettings } from "./actions";
import Dragon from "@/components/dragon/Dragon";
import { useTranslation } from "@/lib/i18n";

interface Settings {
  dailyXpGoal: number;
  dailyNewLimit: number;
  hanziMode: string;
  pinyinMode: string;
  language: "es" | "en";
  darkMode: boolean;
}

export default function SettingsClient({ settings: initial }: { settings: Settings }) {
  const router = useRouter();
  const { t, setLang } = useTranslation();
  const [dailyXpGoal, setDailyXpGoal] = useState(initial.dailyXpGoal);
  const [dailyNewLimit, setDailyNewLimit] = useState(initial.dailyNewLimit);
  const [hanziMode, setHanziMode] = useState(initial.hanziMode);
  const [pinyinMode, setPinyinMode] = useState(initial.pinyinMode);
  const [language, setLanguage] = useState(initial.language);
  const [darkMode, setDarkMode] = useState(initial.darkMode);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setLang(language);
    localStorage.setItem("lang", language);
  }, [language, setLang]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("dark", String(darkMode));
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.set("dailyXpGoal", String(dailyXpGoal));
    fd.set("dailyNewLimit", String(dailyNewLimit));
    fd.set("hanziMode", hanziMode);
    fd.set("pinyinMode", pinyinMode);
    fd.set("language", language);
    fd.set("darkMode", String(darkMode));
    try {
      await updateSettings(fd);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      alert("Error saving");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-dvh flex-col" style={{ background: "var(--bg-primary)" }}>
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/dashboard")} className="text-sm" style={{ color: "var(--text-secondary)" }}>← {t("stats", "back")}</button>
        <span className="text-lg font-bold text-jade-600">{t("settings", "title")}</span>
        <span className="w-12" />
      </header>

      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-8">
        <Dragon mood="happy" width={80} height={84} />
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-6">
          <div>
            <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t("settings", "dailyGoal")}</label>
            <input
              type="number"
              min={1}
              max={500}
              value={dailyXpGoal}
              onChange={(e) => setDailyXpGoal(Number(e.target.value))}
              className="w-full rounded-xl px-4 py-3 text-center text-lg font-bold outline-none"
              style={{ background: "var(--bg-card)", border: "1px solid var(--bg-card-border)", color: "var(--text-primary)" }}
            />
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{t("settings", "dailyGoal")}</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t("settings", "dailyNewLimit")}</label>
            <input
              type="number"
              min={1}
              max={100}
              value={dailyNewLimit}
              onChange={(e) => setDailyNewLimit(Number(e.target.value))}
              className="w-full rounded-xl px-4 py-3 text-center text-lg font-bold outline-none"
              style={{ background: "var(--bg-card)", border: "1px solid var(--bg-card-border)", color: "var(--text-primary)" }}
            />
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{t("settings", "dailyNewLimit")}</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t("settings", "hanziMode")}</label>
            <div className="flex overflow-hidden rounded-xl" style={{ border: "1px solid var(--bg-card-border)" }}>
              <button
                type="button"
                onClick={() => setHanziMode("simplified")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  hanziMode === "simplified" ? "bg-jade-500 text-white" : "text-secondary bg-card"
                }`}
              >
                {t("settings", "simplified")}
              </button>
              <button
                type="button"
                onClick={() => setHanziMode("traditional")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  hanziMode === "traditional" ? "bg-jade-500 text-white" : "text-secondary bg-card"
                }`}
              >
                {t("settings", "traditional")}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t("settings", "pinyinMode")}</label>
            <div className="flex overflow-hidden rounded-xl" style={{ border: "1px solid var(--bg-card-border)" }}>
              <button
                type="button"
                onClick={() => setPinyinMode("tones")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  pinyinMode === "tones" ? "bg-jade-500 text-white" : "text-secondary bg-card"
                }`}
              >
                {t("settings", "toneMarks")}
              </button>
              <button
                type="button"
                onClick={() => setPinyinMode("numbers")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  pinyinMode === "numbers" ? "bg-jade-500 text-white" : "text-secondary bg-card"
                }`}
              >
                {t("settings", "toneNumbers")}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t("settings", "language")}</label>
            <div className="flex overflow-hidden rounded-xl" style={{ border: "1px solid var(--bg-card-border)" }}>
              <button
                type="button"
                onClick={() => setLanguage("es")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  language === "es" ? "bg-jade-500 text-white" : "text-secondary bg-card"
                }`}
              >
                {t("settings", "spanish")}
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  language === "en" ? "bg-jade-500 text-white" : "text-secondary bg-card"
                }`}
              >
                {t("settings", "english")}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--bg-card)", border: "1px solid var(--bg-card-border)" }}>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t("settings", "darkMode")}</span>
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`h-7 w-12 rounded-full transition-colors ${darkMode ? "bg-jade-500" : "bg-ink/20"}`}
            >
              <div className={`h-6 w-6 rounded-full bg-white shadow transition-transform ${darkMode ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-jade-500 px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
          >
            {saving ? "..." : done ? "✓" : t("settings", "dailyGoal")}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-red-400 underline underline-offset-2"
        >
          {t("settings", "logout")}
        </button>
      </main>
    </div>
  );
}
