import React from "react";
import type { HeadFC, PageProps } from "gatsby";

import { HomeApp } from "../app/HomeApp";
import { getFooterMock, getHeaderMock } from "../app/mocks/home";

const initialHeaderData = getHeaderMock("ru");
const initialFooterData = getFooterMock("ru");

export default function IndexPage(_: PageProps) {
  return <HomeApp initialHeaderData={initialHeaderData} initialFooterData={initialFooterData} />;
}

export const Head: HeadFC = () => (
  <>
    <html lang="ru" />
    <title>Концертный центр «Сириус»</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Афиша и пространство Концертного центра «Сириус»" />
    <link rel="icon" href="/concert-assets/008-dc7f22d8.svg" />
  </>
);
