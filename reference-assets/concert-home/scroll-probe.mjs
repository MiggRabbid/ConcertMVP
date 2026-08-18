import { chromium } from "/root/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs";

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function probe(reducedMotion, prefix) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    locale: "ru-RU",
    reducedMotion,
  });
  const page = await context.newPage();
  await page.goto("https://concert.sirius.ru/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(1_500);
  await page.evaluate(() => window.scrollTo({ top: 10_400, behavior: "instant" }));

  for (const [delay, name] of [[20, "start"], [430, "middle"], [750, "end"]]) {
    await page.waitForTimeout(delay);
    const state = await page.evaluate(() => ({
      scrollY,
      animations: document.getAnimations({ subtree: true }).map((animation) => {
        const target = animation.effect?.target;
        const timing = animation.effect?.getComputedTiming?.();
        return {
          target: target instanceof Element
            ? `${target.tagName.toLowerCase()}#${target.id}.${[...target.classList].join(".")}`
            : null,
          playState: animation.playState,
          currentTime: animation.currentTime,
          duration: timing?.duration,
          easing: timing?.easing,
          fill: timing?.fill,
          keyframes: animation.effect?.getKeyframes?.().map((frame) => ({
            offset: frame.offset,
            opacity: frame.opacity,
            transform: frame.transform,
            easing: frame.easing,
          })),
        };
      }),
    }));
    console.log(JSON.stringify({ type: `${prefix}-${name}`, data: state }));
    await page.screenshot({
      path: `reference-assets/concert-home/${prefix}-${name}.png`,
    });
  }

  await context.close();
}

await probe("no-preference", "18-scroll-reveal");
await probe("reduce", "19-reduced-motion");
await browser.close();
