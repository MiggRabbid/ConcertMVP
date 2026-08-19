import path from "node:path";
import type { GatsbyNode } from "gatsby";

import { getConcertPages } from "./src/data/concerts";
import { getFooterData, getHeaderData, getMainData } from "./src/data/site";
import { createLanguageLinks } from "./src/lib/paths";
import type { Locale } from "./src/types/home";

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const assetBase = process.env.GATSBY_ASSET_BASE ?? "/";
  const homeTemplate = path.resolve("./src/templates/home.tsx");
  const concertTemplate = path.resolve("./src/templates/concert.tsx");

  for (const locale of ["ru", "en"] satisfies Locale[]) {
    const localePrefix = locale === "en" ? "/en" : "";
    const homePath = `${localePrefix}/`;
    actions.createPage({
      path: homePath,
      component: homeTemplate,
      context: {
        assetBase,
        locale,
        headerData: getHeaderData(locale, assetBase),
        mainData: getMainData(locale, assetBase),
        footerData: getFooterData(locale),
        languageLinks: createLanguageLinks(assetBase),
        pagePath: homePath,
      },
    });

    for (const concertData of getConcertPages(locale, assetBase)) {
      const { project, event } = concertData;
      const logicalPath = `/projects/${project.id}/concerts/${event.id}`;
      const pagePath = `${localePrefix}${logicalPath}/`;
      actions.createPage({
        path: pagePath,
        component: concertTemplate,
        context: {
          assetBase,
          locale,
          headerData: getHeaderData(locale, assetBase),
          concertData,
          footerData: getFooterData(locale),
          languageLinks: createLanguageLinks(assetBase, logicalPath),
          pagePath,
        },
      });
    }
  }
};
