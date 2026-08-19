import React from "react";

import { siteConfig } from "../../config/site";
import type { Locale } from "../../types/home";
import type { LanguageLinks } from "../../types/page";

interface SeoProps {
  locale: Locale;
  title: string;
  description: string;
  canonical: string;
  assetBase: string;
  languageLinks: LanguageLinks;
  type?: "website" | "event";
  image?: string;
  jsonLd?: Record<string, unknown>;
}

function absoluteUrl(path: string): string {
  return new URL(path, new URL(siteConfig.siteUrl).origin).toString();
}

export function Seo({
  locale,
  title,
  description,
  canonical,
  assetBase,
  languageLinks,
  type = "website",
  image,
  jsonLd,
}: SeoProps) {
  const socialImage = image ? absoluteUrl(image) : undefined;

  return (
    <>
      <html lang={locale} />
      <title>{title}</title>
      <meta name="theme-color" content="#000000" />
      <meta name="description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={locale === "ru" ? siteConfig.name : "Sirius Concert Centre"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {socialImage && <meta property="og:image" content={socialImage} />}
      <meta name="twitter:card" content={socialImage ? "summary_large_image" : "summary"} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="ru" href={absoluteUrl(languageLinks.ru)} />
      <link rel="alternate" hrefLang="en" href={absoluteUrl(languageLinks.en)} />
      <link rel="alternate" hrefLang="x-default" href={absoluteUrl(languageLinks.ru)} />
      <link rel="icon" href={`${assetBase}concert-assets/008-dc7f22d8.svg`} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  );
}
