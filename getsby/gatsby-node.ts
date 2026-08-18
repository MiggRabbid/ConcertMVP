import path from "node:path";
import type { GatsbyNode } from "gatsby";

import { getConcertMocks } from "./src/app/mocks/concert";
import { getFooterMock, getHeaderMock } from "./src/app/mocks/home";

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const assetBase = process.env.GATSBY_ASSET_BASE ?? "/";
  const component = path.resolve("./src/templates/concert.tsx");
  const initialHeaderData = getHeaderMock("ru", assetBase);
  const initialFooterData = getFooterMock("ru");

  for (const initialConcertData of getConcertMocks("ru", assetBase)) {
    const { project, event } = initialConcertData;
    const pagePath = `/projects/${project.id}/concerts/${event.id}/`;
    actions.createPage({
      path: pagePath,
      component,
      context: {
        assetBase,
        initialHeaderData,
        initialConcertData,
        initialFooterData,
        pagePath,
      },
    });
  }
};
