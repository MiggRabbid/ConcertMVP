import React from "react";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
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
  assetBase: string;
}

export function HomeApp({ initialHeaderData, initialFooterData, assetBase }: HomeAppProps) {
  const { t } = useTranslation();
  const [locale, setLocale] = useState<Locale>("ru");
  const [selectedEvent, setSelectedEvent] = useState<ConcertEvent | null>(null);
  const headerRequest = useHeaderData(locale, { data: initialHeaderData, locale: "ru" });
  const mainRequest = useMainData(locale);
  const footerRequest = useFooterData(locale, { data: initialFooterData, locale: "ru" });
  const appStyles = {
    "--concert-hall-image": `url("${assetBase}concert-assets/004-dc99272e.webp")`,
    "--concert-architecture-image": `url("${assetBase}concert-assets/086-be082844.webp")`,
  } as CSSProperties;

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
    <div className={concertApp} style={appStyles}>
      <style dangerouslySetInnerHTML={{ __html: createFontFaceCss(assetBase) }} />
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
          <span className={requestState.el("mark")}><img src={initialHeaderData.logo} alt="" /></span>
          <p className={requestState.el("message")}>{t("common.loading")}</p>
        </main>
      ) : (
        <main>
          <HeroSection slides={mainRequest.data.heroSlides} brandImage={headerRequest.data?.logo ?? initialHeaderData.logo} />
          <ProgrammeSection categories={mainRequest.data.categories} onEventSelect={setSelectedEvent} />
          <MissionSection content={mainRequest.data.mission} assetBase={assetBase} />
          <ExperienceSection content={mainRequest.data.experience} assetBase={assetBase} />
        </main>
      )}

      {footerRequest.data && <Footer data={footerRequest.data} />}
      <EventModal event={selectedEvent} onClose={closeEvent} />
    </div>
  );
}

function createFontFaceCss(assetBase: string): string {
  return `
    @font-face { font-family: "Montserrat"; font-style: normal; font-weight: 300 700; font-display: swap; src: url("${assetBase}concert-fonts/02.woff2") format("woff2"); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
    @font-face { font-family: "Montserrat"; font-style: normal; font-weight: 300 700; font-display: swap; src: url("${assetBase}concert-fonts/05.woff2") format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191-2193, U+2212, U+2215; }
    @font-face { font-family: "Tenor Sans"; font-style: normal; font-weight: 400; font-display: swap; src: url("${assetBase}concert-fonts/06.woff2") format("woff2"); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
    @font-face { font-family: "Tenor Sans"; font-style: normal; font-weight: 400; font-display: swap; src: url("${assetBase}concert-fonts/08.woff2") format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191-2193, U+2212, U+2215; }
  `;
}
