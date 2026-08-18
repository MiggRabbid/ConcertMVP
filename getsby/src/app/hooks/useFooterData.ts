import { footerApi } from "../api/footerApi";
import type { Locale } from "../types/home";
import { useApiData, type InitialApiData } from "./useApiData";
import type { FooterData } from "../types/home";

const requestFooter = footerApi.getFooter.bind(footerApi);

export const useFooterData = (locale: Locale, initialData?: InitialApiData<FooterData>) => (
  useApiData(locale, requestFooter, initialData)
);
