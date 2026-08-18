import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { SocialRail } from "./components/layout/SocialRail";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { HeroSection } from "./components/sections/HeroSection";
import { MissionSection } from "./components/sections/MissionSection";
import { ProgrammeSection } from "./components/sections/ProgrammeSection";
import { EventModal } from "./components/ui/EventModal";
import { useFooterData } from "./hooks/useFooterData";
import { useHeaderData } from "./hooks/useHeaderData";
import { useMainData } from "./hooks/useMainData";
import { i18n } from "./i18n";
import { bnc } from "./lib/bem";
import { cn } from "./lib/classNames";
import type { ConcertEvent, FooterData, HeaderData, Locale } from "./types/home";
import "./styles/main.css";

const savedLocaleKey = "concert-locale";
const concertApp = new bnc("concert-app");
const requestState = new bnc("request-state");
const primaryButton = new bnc("primary-button");

interface HomeAppProps {
  initialHeaderData: HeaderData;
  initialFooterData: FooterData;
}

export function HomeApp({ initialHeaderData, initialFooterData }: HomeAppProps) {
  const { t } = useTranslation();
  const [locale, setLocale] = useState<Locale>("ru");
  const [selectedEvent, setSelectedEvent] = useState<ConcertEvent | null>(null);
  const headerRequest = useHeaderData(locale, { data: initialHeaderData, locale: "ru" });
  const mainRequest = useMainData(locale);
  const footerRequest = useFooterData(locale, { data: initialFooterData, locale: "ru" });

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(savedLocaleKey);
    if (savedLocale === "en" || savedLocale === "ru") setLocale(savedLocale);
  }, []);

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    window.localStorage.setItem(savedLocaleKey, locale);
  }, [locale]);

  const closeEvent = useCallback(() => setSelectedEvent(null), []);
  const reload = useCallback(() => {
    headerRequest.reload();
    mainRequest.reload();
    footerRequest.reload();
  }, [footerRequest.reload, headerRequest.reload, mainRequest.reload]);

  return (
    <div className={concertApp}>
      {headerRequest.data && (
        <>
          <Header data={headerRequest.data} locale={locale} onLocaleChange={setLocale} />
          <SocialRail />
        </>
      )}

      {mainRequest.status === "error" ? (
        <main className={cn(requestState, requestState.mod("error"))}>
          <p className={requestState.el("message")}>{t("common.error")}</p>
          <button className={primaryButton} type="button" onClick={reload}>{t("common.retry")}</button>
        </main>
      ) : !mainRequest.data ? (
        <main className={requestState} aria-live="polite">
          <span className={requestState.el("mark")}><img src="/concert-assets/008-dc7f22d8.svg" alt="" /></span>
          <p className={requestState.el("message")}>{t("common.loading")}</p>
        </main>
      ) : (
        <main>
          <HeroSection slides={mainRequest.data.heroSlides} />
          <ProgrammeSection categories={mainRequest.data.categories} onEventSelect={setSelectedEvent} />
          <MissionSection content={mainRequest.data.mission} />
          <ExperienceSection content={mainRequest.data.experience} />
        </main>
      )}

      {footerRequest.data && <Footer data={footerRequest.data} />}
      <EventModal event={selectedEvent} onClose={closeEvent} />
    </div>
  );
}
