import React from "react";
import type { HeadFC, PageProps } from "gatsby";

import { SiteLayout } from "../components/layout/SiteLayout";
import { Seo } from "../components/seo/Seo";
import { ExperienceSection } from "../components/sections/ExperienceSection";
import { HeroSection } from "../components/sections/HeroSection";
import { MissionSection } from "../components/sections/MissionSection";
import { ProgrammeSection } from "../components/sections/ProgrammeSection";
import { siteConfig } from "../config/site";
import { getMessages } from "../i18n/messages";
import type { HomePageContext } from "../types/page";

export default function HomePage({ pageContext }: PageProps<object, HomePageContext>) {
  const { assetBase, locale, headerData, mainData, footerData, languageLinks } = pageContext;
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
      <main>
        <HeroSection slides={mainData.heroSlides} brandImage={headerData.logo} messages={messages} />
        <ProgrammeSection categories={mainData.categories} assetBase={assetBase} locale={locale} messages={messages} />
        <MissionSection content={mainData.mission} assetBase={assetBase} messages={messages} />
        <ExperienceSection content={mainData.experience} assetBase={assetBase} />
      </main>
    </SiteLayout>
  );
}

export const Head: HeadFC<object, HomePageContext> = ({ pageContext }) => {
  const isRu = pageContext.locale === "ru";
  const title = isRu ? siteConfig.name : "Sirius Concert Centre";
  const description = isRu ? siteConfig.description : "Programme and spaces of the Sirius Concert Centre";
  const canonical = new URL(pageContext.pagePath.replace(/^\//, ""), siteConfig.siteUrl).toString();

  return <Seo {...pageContext} title={title} description={description} canonical={canonical} />;
};
