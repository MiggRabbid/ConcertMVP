import { chromium, devices } from "/root/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ ...devices["iPhone 13"], locale: "ru-RU" });
const page = await context.newPage();
await page.goto("https://concert.sirius.ru/", { waitUntil: "domcontentloaded", timeout: 60_000 });
await page.waitForTimeout(4_000);

const result = await page.evaluate(() => {
  const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
  const feedElements = [...document.querySelectorAll('[class*="feed"]')]
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        className: element.className,
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y + scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        scrollLeft: element.scrollLeft,
        overflowX: style.overflowX,
        touchAction: style.touchAction,
        transform: style.transform,
        transition: style.transition,
        text: normalize(element.textContent).slice(0, 140),
      };
    })
    .filter((item) => item.rect.width > 0 && item.rect.height > 0 && item.rect.y < 7_000);

  const horizontalOverflow = [...document.querySelectorAll("body *")]
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 80 && element.scrollWidth > element.clientWidth + 40;
    })
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        className: element.className,
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y + scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        overflowX: style.overflowX,
        touchAction: style.touchAction,
        transform: style.transform,
        transition: style.transition,
        text: normalize(element.textContent).slice(0, 120),
      };
    })
    .slice(0, 100);

  return { feedElements, horizontalOverflow };
});

console.log(JSON.stringify(result));
await context.close();
await browser.close();
