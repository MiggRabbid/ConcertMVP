import type { GatsbyConfig } from "gatsby";
import { siteConfig } from "./src/app/config/site";

const config: GatsbyConfig = {
  pathPrefix: "/ConcertMVP/getsby",
  siteMetadata: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteUrl: siteConfig.siteUrl,
  },
  plugins: [],
};

export default config;
