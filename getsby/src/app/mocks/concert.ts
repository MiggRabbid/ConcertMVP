import type { ConcertPageData } from "../types/concert";
import type { Locale } from "../types/home";
import { getMainMock } from "./home";

export function getConcertMocks(locale: Locale, assetBase = "/"): ConcertPageData[] {
  return getMainMock(locale, assetBase).categories.flatMap((project) => (
    project.events.map((event) => ({
      project: {
        id: project.id,
        title: project.title,
        period: project.period,
      },
      event,
    }))
  ));
}

export function getConcertMock(
  locale: Locale,
  projectId: string,
  concertId: string,
  assetBase = "/",
): ConcertPageData | null {
  return getConcertMocks(locale, assetBase).find(({ project, event }) => (
    project.id === projectId && event.id === concertId
  )) ?? null;
}
