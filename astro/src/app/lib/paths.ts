import type { Locale } from "../types/home";

export function normalizeBase(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

export function createLocalizedHref(assetBase: string, locale: Locale, pathname = "/"): string {
  const base = normalizeBase(assetBase);
  const path = pathname.replace(/^\/+|\/+$/g, "");
  const localePrefix = locale === "en" ? "en/" : "";
  return `${base}${localePrefix}${path}${path ? "/" : ""}`;
}

export function createConcertHref(
  assetBase: string,
  locale: Locale,
  projectId: string,
  concertId: string,
): string {
  return createLocalizedHref(
    assetBase,
    locale,
    `projects/${encodeURIComponent(projectId)}/concerts/${encodeURIComponent(concertId)}`,
  );
}

export function createLanguageLinks(assetBase: string, pathname = "/") {
  return {
    ru: createLocalizedHref(assetBase, "ru", pathname),
    en: createLocalizedHref(assetBase, "en", pathname),
  } satisfies Record<Locale, string>;
}
