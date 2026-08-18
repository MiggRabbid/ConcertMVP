import { headerApi } from "../api/headerApi";
import type { Locale } from "../types/home";
import { useApiData, type InitialApiData } from "./useApiData";
import type { HeaderData } from "../types/home";

const requestHeader = headerApi.getHeader.bind(headerApi);

export const useHeaderData = (locale: Locale, initialData?: InitialApiData<HeaderData>) => (
  useApiData(locale, requestHeader, initialData)
);
