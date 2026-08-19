import type { ConcertPageData } from "../types/concert";
import type { Locale } from "../types/home";
import { getMainData } from "./site";

export function getConcertPages(locale: Locale, assetBase = "/"): ConcertPageData[] {
  return getMainData(locale, assetBase).categories.flatMap((project) => (
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
