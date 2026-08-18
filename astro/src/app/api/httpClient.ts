import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { getConcertMock } from "../mocks/concert";
import { getFooterMock, getHeaderMock, getMainMock } from "../mocks/home";
import type { Locale } from "../types/home";

export const httpClient = axios.create({
  baseURL: "/api",
  timeout: 5_000,
  headers: { Accept: "application/json" },
});

const mock = new AxiosMockAdapter(httpClient, { delayResponse: 420 });
const getLocale = (value: unknown): Locale => value === "en" ? "en" : "ru";
const getAssetBase = (value: unknown): string => typeof value === "string" ? value : "/";

mock.onGet("/header").reply((config) => [200, getHeaderMock(getLocale(config.params?.locale), getAssetBase(config.params?.assetBase))]);
mock.onGet("/main").reply((config) => [200, getMainMock(getLocale(config.params?.locale), getAssetBase(config.params?.assetBase))]);
mock.onGet("/footer").reply((config) => [200, getFooterMock(getLocale(config.params?.locale))]);
mock.onGet(/^\/projects\/[^/]+\/concerts\/[^/]+$/).reply((config) => {
  const match = config.url?.match(/^\/projects\/([^/]+)\/concerts\/([^/]+)$/);
  if (!match) return [400, { message: "Invalid concert route" }];

  const data = getConcertMock(
    getLocale(config.params?.locale),
    decodeURIComponent(match[1]),
    decodeURIComponent(match[2]),
    getAssetBase(config.params?.assetBase),
  );

  return data ? [200, data] : [404, { message: "Concert not found" }];
});
