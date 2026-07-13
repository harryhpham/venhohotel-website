"use client";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "vi" | "en";

const LANGUAGE_STORAGE_KEY = "venho-language";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "vi", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      const initialLang: Lang = saved === "en" ? "en" : "vi";
      setLangState(initialLang);
      document.documentElement.lang = initialLang;
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const setLang = useCallback((nextLang: Lang) => {
    setLangState(nextLang);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
    document.documentElement.lang = nextLang;
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
