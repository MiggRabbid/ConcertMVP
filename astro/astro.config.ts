import { defineConfig } from "astro/config";

const base = process.env.PUBLIC_BASE_PATH ?? "/";

export default defineConfig({
  site: "https://miggrabbid.github.io",
  base,
  i18n: {
    defaultLocale: "ru",
    locales: ["ru", "en"],
    routing: { prefixDefaultLocale: false },
  },
});
