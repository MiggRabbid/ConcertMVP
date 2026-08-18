import React from "react";
import type { HeadFC, PageProps } from "gatsby";

import { ConcertPageApp } from "../app/ConcertPageApp";
import { siteConfig } from "../app/config/site";
import { toIsoDateTime } from "../app/lib/date";
import type { ConcertPageContext } from "../app/types/page";

export default function ConcertPage({ pageContext }: PageProps<object, ConcertPageContext>) {
  return (
    <ConcertPageApp
      initialHeaderData={pageContext.initialHeaderData}
      initialConcertData={pageContext.initialConcertData}
      initialFooterData={pageContext.initialFooterData}
      assetBase={pageContext.assetBase}
    />
  );
}

export const Head: HeadFC<object, ConcertPageContext> = ({ pageContext }) => {
  const { event } = pageContext.initialConcertData;
  const title = `${event.title} — Концертный центр «Сириус»`;
  const canonical = new URL(pageContext.pagePath.replace(/^\//, ""), siteConfig.siteUrl).toString();
  const socialImage = new URL(event.image, siteConfig.siteUrl).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.title,
    description: event.description,
    image: socialImage,
    startDate: toIsoDateTime(event.date, event.time),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venue,
      address: pageContext.initialHeaderData.location.replace("\n", ", "),
    },
  };
  return (
    <>
      <html lang="ru" data-asset-base={pageContext.assetBase} />
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content={event.description} />
      <meta property="og:type" content="event" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={event.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={socialImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={canonical} />
      <link rel="icon" href={`${pageContext.assetBase}concert-assets/008-dc7f22d8.svg`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
};
