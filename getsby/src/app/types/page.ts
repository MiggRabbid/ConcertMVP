import type { ConcertPageData } from "./concert";
import type { FooterData, HeaderData } from "./home";

export interface ConcertPageContext {
  assetBase: string;
  initialHeaderData: HeaderData;
  initialConcertData: ConcertPageData;
  initialFooterData: FooterData;
  pagePath: string;
}
