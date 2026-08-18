import { useCallback, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { SocialRail } from "./components/layout/SocialRail";
import { ConcertDetail } from "./components/sections/ConcertDetail";
import { useConcertData } from "./hooks/useConcertData";
import { useFooterData } from "./hooks/useFooterData";
import { useHeaderData } from "./hooks/useHeaderData";
import { useLocale } from "./hooks/useLocale";
import { bnc } from "./lib/bem";
import { cn } from "./lib/classNames";
import { createFontFaceCss } from "./styles/fontFace";
import type { ConcertPageData } from "./types/concert";
import type { FooterData, HeaderData } from "./types/home";
import "./styles/main.css";

interface ConcertPageAppProps {
  initialHeaderData: HeaderData;
  initialConcertData: ConcertPageData;
  initialFooterData: FooterData;
  assetBase: string;
}

const concertApp = new bnc("concert-app");
const requestState = new bnc("request-state");
const primaryButton = new bnc("primary-button");

export function ConcertPageApp({ initialHeaderData, initialConcertData, initialFooterData, assetBase }: ConcertPageAppProps) {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const { project, event } = initialConcertData;
  const headerRequest = useHeaderData(locale, { data: initialHeaderData, locale: "ru" });
  const concertRequest = useConcertData(locale, project.id, event.id, { data: initialConcertData, locale: "ru" });
  const footerRequest = useFooterData(locale, { data: initialFooterData, locale: "ru" });
  const appStyles = {
    "--concert-hall-image": `url("${assetBase}concert-assets/004-dc99272e.webp")`,
    "--concert-architecture-image": `url("${assetBase}concert-assets/086-be082844.webp")`,
  } as CSSProperties;

  const reload = useCallback(() => {
    headerRequest.reload();
    concertRequest.reload();
    footerRequest.reload();
  }, [concertRequest.reload, footerRequest.reload, headerRequest.reload]);

  return (
    <div className={concertApp} style={appStyles}>
      <style dangerouslySetInnerHTML={{ __html: createFontFaceCss(assetBase) }} />
      {headerRequest.data && (
        <>
          <Header data={headerRequest.data} locale={locale} onLocaleChange={setLocale} />
          <SocialRail />
        </>
      )}
      {concertRequest.status === "error" && !concertRequest.data ? (
        <main className={cn(requestState, requestState.mod("error"))}>
          <p className={requestState.el("message")}>{t("common.error")}</p>
          <button className={primaryButton} type="button" onClick={reload}>{t("common.retry")}</button>
        </main>
      ) : concertRequest.data ? (
        <ConcertDetail data={concertRequest.data} homeHref={initialHeaderData.homeHref} />
      ) : null}
      {footerRequest.data && <Footer data={footerRequest.data} />}
    </div>
  );
}
