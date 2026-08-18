import { httpClient } from "./httpClient";
import type { HeaderData, Locale } from "../types/home";

export const headerApi = {
  async getHeader(locale: Locale, signal?: AbortSignal): Promise<HeaderData> {
    const response = await httpClient.get<HeaderData>("/header", { params: { locale }, signal });
    return response.data;
  },
};
