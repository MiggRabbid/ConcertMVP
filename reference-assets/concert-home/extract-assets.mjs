import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

import { chromium } from "/root/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs";

const root = "reference-assets/concert-home/source-assets";
const manifestPath = "reference-assets/concert-home/asset-manifest.json";
const origin = "https://concert.sirius.ru/";

await mkdir(root, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "ru-RU",
  timezoneId: "Europe/Moscow",
});
const page = await context.newPage();
await page.goto(origin, { waitUntil: "domcontentloaded", timeout: 60_000 });
await page.waitForTimeout(5_000);

const entries = new Map();

for (let y = 0; y < 15_000; y += 700) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(180);

  const batch = await page.evaluate(() => {
    const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
    const items = [];

    for (const image of document.images) {
      const rect = image.getBoundingClientRect();
      const src = image.currentSrc || image.src;
      if (!src || image.naturalWidth < 160 || image.naturalHeight < 100) continue;
      items.push({
        kind: "image",
        url: src,
        alt: image.alt,
        width: image.naturalWidth,
        height: image.naturalHeight,
        y: Math.round(rect.top + scrollY),
        context: normalize(image.closest("section, article, div")?.textContent).slice(0, 180),
      });
    }

    for (const element of document.querySelectorAll("body *")) {
      const rect = element.getBoundingClientRect();
      if (rect.width < 160 || rect.height < 100) continue;
      const background = getComputedStyle(element).backgroundImage;
      if (!background || background === "none") continue;
      for (const match of background.matchAll(/url\(["']?(.*?)["']?\)/g)) {
        const url = match[1];
        if (!url || url.startsWith("data:")) continue;
        items.push({
          kind: "background",
          url,
          alt: "",
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          y: Math.round(rect.top + scrollY),
          context: normalize(element.textContent).slice(0, 180),
        });
      }
    }

    return items;
  });

  for (const entry of batch) {
    if (!entries.has(entry.url)) entries.set(entry.url, entry);
  }
}

const manifest = [];
let index = 1;
for (const entry of [...entries.values()].sort((left, right) => left.y - right.y)) {
  try {
    const response = await context.request.get(entry.url, { timeout: 30_000 });
    if (!response.ok()) continue;
    const body = await response.body();
    const contentType = response.headers()["content-type"] ?? "";
    const extensionFromUrl = extname(new URL(entry.url).pathname).toLowerCase();
    const extension = [".png", ".jpg", ".jpeg", ".webp", ".svg"].includes(extensionFromUrl)
      ? extensionFromUrl
      : contentType.includes("png")
        ? ".png"
        : contentType.includes("svg")
          ? ".svg"
          : contentType.includes("webp")
            ? ".webp"
            : ".jpg";
    const hash = createHash("sha1").update(entry.url).digest("hex").slice(0, 8);
    const filename = `${String(index).padStart(3, "0")}-${hash}${extension}`;
    await writeFile(join(root, filename), body);
    manifest.push({ ...entry, filename, bytes: body.length, contentType });
    index += 1;
  } catch (error) {
    manifest.push({ ...entry, error: error instanceof Error ? error.message : String(error) });
  }
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ manifestPath, downloaded: manifest.filter((item) => item.filename).length }));

await browser.close();
