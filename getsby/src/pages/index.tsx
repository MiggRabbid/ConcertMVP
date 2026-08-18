import React from "react";
import type { HeadFC, PageProps } from "gatsby";

import { HomeApp } from "../app/HomeApp";
import { siteConfig } from "../app/config/site";
import { getFooterMock, getHeaderMock, getMainMock } from "../app/mocks/home";

const assetBase = process.env.GATSBY_ASSET_BASE ?? "/";
const initialHeaderData = getHeaderMock("ru", assetBase);
const initialMainData = getMainMock("ru", assetBase);
const initialFooterData = getFooterMock("ru");

export default function IndexPage(_: PageProps) {
  return (
    <HomeApp
      initialHeaderData={initialHeaderData}
      initialMainData={initialMainData}
      initialFooterData={initialFooterData}
      assetBase={assetBase}
    />
  );
}

export const Head: HeadFC = () => (
  <>
    <html lang="ru" data-asset-base={assetBase} />
    <title>Концертный центр «Сириус»</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Афиша и пространство Концертного центра «Сириус»" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={siteConfig.name} />
    <meta property="og:title" content={siteConfig.name} />
    <meta property="og:description" content={siteConfig.description} />
    <meta property="og:url" content={siteConfig.siteUrl} />
    <meta name="twitter:card" content="summary" />
    <link rel="canonical" href={siteConfig.siteUrl} />
    <link rel="icon" href={`${assetBase}concert-assets/008-dc7f22d8.svg`} />
  </>
);
