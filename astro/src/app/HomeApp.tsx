import { useCallback, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { SocialRail } from "./components/layout/SocialRail";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { HeroSection } from "./components/sections/HeroSection";
import { MissionSection } from "./components/sections/MissionSection";
import { ProgrammeSection } from "./components/sections/ProgrammeSection";
import { useFooterData } from "./hooks/useFooterData";
import { useHeaderData } from "./hooks/useHeaderData";
import { useLocale } from "./hooks/useLocale";
import { useMainData } from "./hooks/useMainData";
import { bnc } from "./lib/bem";
import { cn } from "./lib/classNames";
import { createFontFaceCss } from "./styles/fontFace";
import type { FooterData, HeaderData, MainData } from "./types/home";
import "./styles/main.css";

const concertApp = new bnc("concert-app");
const requestState = new bnc("request-state");
const primaryButton = new bnc("primary-button");

interface HomeAppProps {
  initialHeaderData: HeaderData;
  initialMainData: MainData;
  initialFooterData: FooterData;
  assetBase: string;
}

export function HomeApp({ initialHeaderData, initialMainData, initialFooterData, assetBase }: HomeAppProps) {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const headerRequest = useHeaderData(locale, { data: initialHeaderData, locale: "ru" });
  const mainRequest = useMainData(locale, { data: initialMainData, locale: "ru" });
  const footerRequest = useFooterData(locale, { data: initialFooterData, locale: "ru" });
  const appStyles = {
    "--concert-hall-image": `url("${assetBase}concert-assets/004-dc99272e.webp")`,
    "--concert-architecture-image": `url("${assetBase}concert-assets/086-be082844.webp")`,
  } as CSSProperties;

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
          <ProgrammeSection categories={mainRequest.data.categories} assetBase={assetBase} />
          <MissionSection content={mainRequest.data.mission} assetBase={assetBase} />
          <ExperienceSection content={mainRequest.data.experience} assetBase={assetBase} />
        </main>
      )}

      {footerRequest.data && <Footer data={footerRequest.data} />}
    </div>
  );
}
