import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { getFooterMock, getHeaderMock, getMainMock } from "../mocks/home";
import type { Locale } from "../types/home";

export const httpClient = axios.create({
  baseURL: "/api",
  timeout: 5_000,
  headers: { Accept: "application/json" },
});

const mock = new AxiosMockAdapter(httpClient, { delayResponse: 420 });
const getLocale = (value: unknown): Locale => value === "en" ? "en" : "ru";

mock.onGet("/header").reply((config) => [200, getHeaderMock(getLocale(config.params?.locale))]);
mock.onGet("/main").reply((config) => [200, getMainMock(getLocale(config.params?.locale))]);
mock.onGet("/footer").reply((config) => [200, getFooterMock(getLocale(config.params?.locale))]);
