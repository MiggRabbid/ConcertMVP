import { mainApi } from "../api/mainApi";
import type { Locale } from "../types/home";
import { useApiData } from "./useApiData";

const requestMain = mainApi.getMain.bind(mainApi);

export const useMainData = (locale: Locale) => useApiData(locale, requestMain);
