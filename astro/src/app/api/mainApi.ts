import { httpClient } from "./httpClient";
import { getAssetBase } from "./publicPath";
import type { Locale, MainData } from "../types/home";

export const mainApi = {
  async getMain(locale: Locale, signal?: AbortSignal): Promise<MainData> {
    const response = await httpClient.get<MainData>("/main", { params: { locale, assetBase: getAssetBase() }, signal });
    return response.data;
  },
};
