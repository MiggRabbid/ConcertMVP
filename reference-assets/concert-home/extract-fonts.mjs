import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

import { chromium } from "/root/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs";

const output = "reference-assets/concert-home/source-fonts";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const cssUrl = "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Tenor+Sans&display=swap";
const cssResponse = await context.request.get(cssUrl, {
  headers: {
    "user-agent": "Mozilla/5.0 AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36",
  },
});
const css = await cssResponse.text();
await writeFile(join(output, "fonts.css"), css);
const urls = [...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map((match) => match[1]);

const manifest = [];
for (const [index, url] of [...new Set(urls)].entries()) {
  const response = await context.request.get(url);
  if (!response.ok()) continue;
  const body = await response.body();
  const suffix = extname(new URL(url).pathname) || ".woff2";
  const filename = `${String(index + 1).padStart(2, "0")}${suffix}`;
  await writeFile(join(output, filename), body);
  manifest.push({ filename, url, bytes: body.length });
}

await writeFile(join(output, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ downloaded: manifest.length, manifest }));
await browser.close();
