import { mainApi } from "../api/mainApi";
import type { Locale, MainData } from "../types/home";
import { useApiData, type InitialApiData } from "./useApiData";

const requestMain = mainApi.getMain.bind(mainApi);

export const useMainData = (locale: Locale, initialData?: InitialApiData<MainData>) => (
  useApiData(locale, requestMain, initialData)
);
