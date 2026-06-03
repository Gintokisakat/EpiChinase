"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import translations, { Lang } from "./translations";

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (section: string, key: string, defaultValue?: string) => string;
};

const LangContext = createContext<LangContextType>({
  lang: "es",
  setLang: () => {},
  t: (section: string, key: string, dflt?: string) => dflt ?? key,
});

export function useTranslation() {
  return useContext(LangContext);
}

function deepGet(obj: any, path: string): string | undefined {
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    current = current?.[part];
    if (current === undefined) return undefined;
  }
  return current;
}

export function TranslationProvider({ children, initialLang = "es" }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback(async (l: Lang) => {
    setLangState(l);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ language: l }).eq("id", user.id);
    }
    localStorage.setItem("lang", l);
  }, []);

  const t = useCallback((section: string, key: string, defaultValue?: string): string => {
    const val = deepGet(translations[lang], `${section}.${key}`);
    if (val !== undefined && typeof val === "string") return val;
    const esVal = deepGet(translations.es, `${section}.${key}`);
    if (esVal !== undefined && typeof esVal === "string") return esVal;
    return defaultValue ?? key;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}
