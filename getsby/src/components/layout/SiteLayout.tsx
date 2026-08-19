import React, { type CSSProperties, type PropsWithChildren } from "react";

import type { Messages } from "../../i18n/messages";
import { createFontFaceCss } from "../../styles/fontFace";
import type { FooterData, HeaderData, Locale } from "../../types/home";
import type { LanguageLinks } from "../../types/page";
import { bnc } from "../../lib/bem";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SocialRail } from "./SocialRail";
import "../../styles/main.css";

interface SiteLayoutProps extends PropsWithChildren {
  assetBase: string;
  header: HeaderData;
  footer: FooterData;
  locale: Locale;
  languageLinks: LanguageLinks;
  messages: Messages;
}

const concertApp = new bnc("concert-app");

export function SiteLayout({
  assetBase,
  header,
  footer,
  locale,
  languageLinks,
  messages,
  children,
}: SiteLayoutProps) {
  const appStyles = {
    "--concert-hall-image": `url("${assetBase}concert-assets/004-dc99272e.webp")`,
    "--concert-architecture-image": `url("${assetBase}concert-assets/086-be082844.webp")`,
  } as CSSProperties;

  return (
    <div className={concertApp} style={appStyles}>
      <style dangerouslySetInnerHTML={{ __html: createFontFaceCss(assetBase) }} />
      <Header data={header} locale={locale} languageLinks={languageLinks} messages={messages} />
      <SocialRail label={messages.common.social} />
      {children}
      <Footer data={footer} />
    </div>
  );
}
