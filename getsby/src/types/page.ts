import type { ConcertPageData } from "./concert";
import type { FooterData, HeaderData, Locale, MainData } from "./home";

export type LanguageLinks = Record<Locale, string>;

export interface SitePageContext {
  assetBase: string;
  locale: Locale;
  headerData: HeaderData;
  footerData: FooterData;
  languageLinks: LanguageLinks;
  pagePath: string;
}

export interface HomePageContext extends SitePageContext {
  mainData: MainData;
}

export interface ConcertPageContext extends SitePageContext {
  concertData: ConcertPageData;
}
