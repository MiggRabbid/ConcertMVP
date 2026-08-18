import { useEffect, useState } from "react";

import { i18n } from "../i18n";
import type { Locale } from "../types/home";

const savedLocaleKey = "concert-locale";

export function useLocale() {
  const [locale, setLocale] = useState<Locale>("ru");

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(savedLocaleKey);
    if (savedLocale === "en" || savedLocale === "ru") setLocale(savedLocale);
  }, []);

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    window.localStorage.setItem(savedLocaleKey, locale);
  }, [locale]);

  return { locale, setLocale };
}
