"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Language preference. "en" = English first, Urdu under it. "ur" = Urdu first.
// The layout never flips; only Urdu text spans are right-to-left (see <Bi>).

const LangContext = createContext({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("app_lang");
      if (saved === "ur" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l) => {
    setLangState(l);
    try {
      localStorage.setItem("app_lang", l);
    } catch {}
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
