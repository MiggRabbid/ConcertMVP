import { httpClient } from "./httpClient";
import type { FooterData, Locale } from "../types/home";

export const footerApi = {
  async getFooter(locale: Locale, signal?: AbortSignal): Promise<FooterData> {
    const response = await httpClient.get<FooterData>("/footer", { params: { locale }, signal });
    return response.data;
  },
};
