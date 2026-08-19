import React from "react";
import type { HeadFC, PageProps } from "gatsby";

import { SiteLayout } from "../components/layout/SiteLayout";
import { Seo } from "../components/seo/Seo";
import { ConcertDetail } from "../components/sections/ConcertDetail";
import { siteConfig } from "../config/site";
import { getMessages } from "../i18n/messages";
import { toIsoDateTime } from "../lib/date";
import type { ConcertPageContext } from "../types/page";

export default function ConcertPage({ pageContext }: PageProps<object, ConcertPageContext>) {
  const { assetBase, locale, headerData, concertData, footerData, languageLinks } = pageContext;
  const messages = getMessages(locale);

  return (
    <SiteLayout
      assetBase={assetBase}
      header={headerData}
      footer={footerData}
      locale={locale}
      languageLinks={languageLinks}
      messages={messages}
    >
      <ConcertDetail data={concertData} homeHref={headerData.homeHref} messages={messages} />
    </SiteLayout>
  );
}

export const Head: HeadFC<object, ConcertPageContext> = ({ pageContext }) => {
  const { event } = pageContext.concertData;
  const siteName = pageContext.locale === "ru" ? siteConfig.name : "Sirius Concert Centre";
  const title = `${event.title} — ${siteName}`;
  const canonical = new URL(pageContext.pagePath.replace(/^\//, ""), siteConfig.siteUrl).toString();
  const socialImage = new URL(event.image, new URL(siteConfig.siteUrl).origin).toString();
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
      address: pageContext.headerData.location.replace("\n", ", "),
    },
  };
  return <Seo {...pageContext} title={title} description={event.description} canonical={canonical} type="event" image={socialImage} jsonLd={jsonLd} />;
};
