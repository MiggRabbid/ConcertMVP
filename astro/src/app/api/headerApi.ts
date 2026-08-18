import { httpClient } from "./httpClient";
import { getAssetBase } from "./publicPath";
import type { HeaderData, Locale } from "../types/home";

export const headerApi = {
  async getHeader(locale: Locale, signal?: AbortSignal): Promise<HeaderData> {
    const response = await httpClient.get<HeaderData>("/header", { params: { locale, assetBase: getAssetBase() }, signal });
    return response.data;
  },
};
