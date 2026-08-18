import { useCallback } from "react";

import { concertApi } from "../api/concertApi";
import type { ConcertPageData } from "../types/concert";
import type { Locale } from "../types/home";
import { useApiData, type InitialApiData } from "./useApiData";

export function useConcertData(
  locale: Locale,
  projectId: string,
  concertId: string,
  initialData?: InitialApiData<ConcertPageData>,
) {
  const requestConcert = useCallback(
    (requestLocale: Locale, signal?: AbortSignal) => (
      concertApi.getConcert(projectId, concertId, requestLocale, signal)
    ),
    [concertId, projectId],
  );

  return useApiData(locale, requestConcert, initialData);
}
