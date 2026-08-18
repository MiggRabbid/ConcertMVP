import { httpClient } from "./httpClient";
import type { Locale, MainData } from "../types/home";

export const mainApi = {
  async getMain(locale: Locale, signal?: AbortSignal): Promise<MainData> {
    const response = await httpClient.get<MainData>("/main", { params: { locale }, signal });
    return response.data;
  },
};
