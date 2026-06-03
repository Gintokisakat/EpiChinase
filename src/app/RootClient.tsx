"use client";

import { useEffect, useState, ReactNode } from "react";
import { TranslationProvider } from "@/lib/i18n";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";

export default function RootClient({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [initialLang, setInitialLang] = useState<"es" | "en">("es");

  useEffect(() => {
    const savedDark = localStorage.getItem("dark") === "true";
    const savedLang = localStorage.getItem("lang") as "es" | "en" | null;
    if (savedLang) setInitialLang(savedLang);
    document.documentElement.classList.toggle("dark", savedDark);
    setMounted(true);
  }, []);

  return (
    <TranslationProvider initialLang={initialLang}>
      {children}
      <Footer />
      <BottomNav />
    </TranslationProvider>
  );
}
