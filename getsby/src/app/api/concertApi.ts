import type { ConcertPageData } from "../types/concert";
import type { Locale } from "../types/home";
import { httpClient } from "./httpClient";
import { getAssetBase } from "./publicPath";

export const concertApi = {
  async getConcert(
    projectId: string,
    concertId: string,
    locale: Locale,
    signal?: AbortSignal,
  ): Promise<ConcertPageData> {
    const response = await httpClient.get<ConcertPageData>(
      `/projects/${encodeURIComponent(projectId)}/concerts/${encodeURIComponent(concertId)}`,
      { params: { locale, assetBase: getAssetBase() }, signal },
    );
    return response.data;
  },
};
