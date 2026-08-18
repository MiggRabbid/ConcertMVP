import React from "react";
import type { HeadFC, PageProps } from "gatsby";

import { HomeApp } from "../app/HomeApp";
import { getFooterMock, getHeaderMock } from "../app/mocks/home";

const assetBase = process.env.GATSBY_ASSET_BASE ?? "/";
const initialHeaderData = getHeaderMock("ru", assetBase);
const initialFooterData = getFooterMock("ru");

export default function IndexPage(_: PageProps) {
  return <HomeApp initialHeaderData={initialHeaderData} initialFooterData={initialFooterData} assetBase={assetBase} />;
}

export const Head: HeadFC = () => (
  <>
    <html lang="ru" data-asset-base={assetBase} />
    <title>Концертный центр «Сириус»</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Афиша и пространство Концертного центра «Сириус»" />
    <link rel="icon" href={`${assetBase}concert-assets/008-dc7f22d8.svg`} />
  </>
);
