import { useCallback, useEffect, useState } from "react";

import type { Locale } from "../types/home";

export type RequestStatus = "loading" | "success" | "error";
export type ApiRequest<T> = (locale: Locale, signal?: AbortSignal) => Promise<T>;

export interface InitialApiData<T> {
  data: T;
  locale: Locale;
}

export function useApiData<T>(locale: Locale, request: ApiRequest<T>, initialData?: InitialApiData<T>) {
  const [data, setData] = useState<T | null>(initialData?.data ?? null);
  const [status, setStatus] = useState<RequestStatus>(initialData ? "success" : "loading");
  const [requestKey, setRequestKey] = useState(0);
  const [resolvedRequest, setResolvedRequest] = useState(
    initialData ? { locale: initialData.locale, requestKey: 0 } : null,
  );

  const reload = useCallback(() => setRequestKey((value) => value + 1), []);

  useEffect(() => {
    if (resolvedRequest?.locale === locale && resolvedRequest.requestKey === requestKey) return;

    const controller = new AbortController();
    setStatus("loading");

    request(locale, controller.signal)
      .then((response) => {
        setData(response);
        setResolvedRequest({ locale, requestKey });
        setStatus("success");
      })
      .catch((error: unknown) => {
        if (isCanceled(error)) return;
        setStatus("error");
      });

    return () => controller.abort();
  }, [locale, request, requestKey, resolvedRequest]);

  return { data, status, reload };
}

function isCanceled(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ERR_CANCELED";
}
