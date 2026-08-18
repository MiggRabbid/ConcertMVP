import { chromium, devices } from "/root/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs";

const url = "https://concert.sirius.ru/";
const outputDirectory = "reference-assets/concert-home";
const browser = await chromium.launch({ channel: "chrome", headless: true });

async function createPage(contextOptions = {}) {
  const context = await browser.newContext({
    locale: "ru-RU",
    timezoneId: "Europe/Moscow",
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
    ...contextOptions,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15_000);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(1_000);
  return { context, page };
}

function log(type, data) {
  console.log(JSON.stringify({ type, data }));
}

async function activeCarouselState(page) {
  return page.evaluate(() => {
    const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
    const candidates = [...document.querySelectorAll(
      ".slick-current, .slick-active, .t-slds__item_active, [aria-hidden=false]",
    )]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 100 && rect.height > 100 && rect.top < innerHeight && rect.bottom > 0;
      })
      .map((element) => ({
        className: element.className,
        text: normalize(element.textContent).slice(0, 240),
        rect: {
          x: Math.round(element.getBoundingClientRect().x),
          y: Math.round(element.getBoundingClientRect().y),
          width: Math.round(element.getBoundingClientRect().width),
          height: Math.round(element.getBoundingClientRect().height),
        },
      }));
    return candidates;
  });
}

async function targetStyle(page, exactText) {
  return page.evaluate((text) => {
    const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
    const element = [...document.querySelectorAll("body *")].find((candidate) => {
      const rect = candidate.getBoundingClientRect();
      return normalize(candidate.textContent) === text && rect.width > 0 && rect.height > 0;
    });
    if (!element) return null;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      tag: element.tagName.toLowerCase(),
      className: element.className,
      parentClassName: element.parentElement?.className,
      rect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y + scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      color: style.color,
      backgroundColor: style.backgroundColor,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      textTransform: style.textTransform,
      transition: style.transition,
      transform: style.transform,
      opacity: style.opacity,
    };
  }, exactText);
}

const { context: desktopContext, page: desktop } = await createPage();

for (let second = 1; second <= 13; second += 2) {
  if (second > 1) await desktop.waitForTimeout(2_000);
  log(`hero-carousel-${second}s`, await activeCarouselState(desktop));
}

const representativeTexts = [
  "АФИША",
  "МЕЖДУНАРОДНЫЙ ФЕСТИВАЛЬ ИСКУССТВ ДЛЯ ДЕТЕЙ И МОЛОДЁЖИ «СИРИУС — РОЗА ХУТОР»",
  "КОНЦЕРТ «МУЗЫКА ДЛЯ ФОРТЕПИАНО И КЛАРНЕТА»",
  "БОЛЬШАЯ МИССИЯ",
  "НЕПОВТОРИМАЯ АРХИТЕКТУРА",
  "БЕЗУПРЕЧНАЯ АКУСТИКА",
  "ПРИРОДА ИСКУССТВА",
];

for (const text of representativeTexts) {
  log("typography", { text, style: await targetStyle(desktop, text) });
}

const fixedElements = await desktop.evaluate(() => {
  return [...document.querySelectorAll("body *")]
    .filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (style.position === "fixed" || style.position === "sticky") && rect.width > 15 && rect.height > 15;
    })
    .map((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        tag: element.tagName.toLowerCase(),
        id: element.id,
        className: element.className,
        text: element.textContent?.replace(/\s+/g, " ").trim().slice(0, 120),
        position: style.position,
        zIndex: style.zIndex,
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      };
    });
});
log("fixed-elements", fixedElements);

const menuTrigger = desktop.locator('a[href="#menuopen"]').filter({ visible: true }).first();
log("menu-trigger-before-click", await menuTrigger.evaluate((element) => ({
  tag: element.tagName.toLowerCase(),
  className: element.className,
  href: element.getAttribute("href"),
  rect: element.getBoundingClientRect().toJSON(),
})));
await menuTrigger.click();
await desktop.waitForTimeout(700);
await desktop.screenshot({ path: `${outputDirectory}/12-desktop-menu-open.png` });
const menuState = await desktop.evaluate(() => {
  const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
  const visible = (element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.opacity !== "0";
  };
  return {
    bodyOverflow: getComputedStyle(document.body).overflow,
    visibleLinks: [...document.querySelectorAll("a")]
      .filter(visible)
      .map((element) => ({ text: normalize(element.textContent), href: element.href }))
      .filter((item) => item.text)
      .slice(0, 80),
    overlays: [...document.querySelectorAll("body *")]
      .filter((element) => {
        if (!visible(element)) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return (
          (style.position === "fixed" || style.position === "absolute") &&
          rect.width >= innerWidth * 0.8 &&
          rect.height >= innerHeight * 0.8
        );
      })
      .map((element) => {
        const style = getComputedStyle(element);
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className: element.className,
          background: style.background,
          opacity: style.opacity,
          transform: style.transform,
          transition: style.transition,
          zIndex: style.zIndex,
        };
      }),
  };
});
log("desktop-menu-open", menuState);

await desktop.keyboard.press("Escape");
await desktop.waitForTimeout(500);

await desktop.evaluate(() => window.scrollTo({ top: 1_500, behavior: "instant" }));
await desktop.waitForTimeout(800);
const firstCardLink = desktop.locator("a.t-feed__link.js-feed-post-link").filter({ visible: true }).first();
const hoverBefore = await firstCardLink.evaluate((element) => {
  const style = getComputedStyle(element);
  const card = element.closest(".t-feed__post-popup-trigger, .t-feed__col-grid__post-wrapper") ?? element.parentElement;
  const cardStyle = getComputedStyle(card);
  return {
    link: { color: style.color, opacity: style.opacity, transform: style.transform, transition: style.transition },
    card: { background: cardStyle.background, opacity: cardStyle.opacity, transform: cardStyle.transform, transition: cardStyle.transition },
  };
});
await firstCardLink.hover();
await desktop.waitForTimeout(350);
const hoverAfter = await firstCardLink.evaluate((element) => {
  const style = getComputedStyle(element);
  const card = element.closest(".t-feed__post-popup-trigger, .t-feed__col-grid__post-wrapper") ?? element.parentElement;
  const cardStyle = getComputedStyle(card);
  return {
    link: { color: style.color, opacity: style.opacity, transform: style.transform, transition: style.transition },
    card: { background: cardStyle.background, opacity: cardStyle.opacity, transform: cardStyle.transform, transition: cardStyle.transition },
  };
});
await desktop.screenshot({ path: `${outputDirectory}/13-desktop-card-hover.png` });
log("card-hover", { before: hoverBefore, after: hoverAfter });

await desktopContext.close();

const { context: revealContext, page: revealPage } = await createPage();
const missionText = revealPage.getByText("БОЛЬШАЯ МИССИЯ", { exact: true }).filter({ visible: true }).first();
await missionText.scrollIntoViewIfNeeded();
await revealPage.waitForTimeout(60);
const revealStart = await revealPage.evaluate(() => document.getAnimations({ subtree: true }).map((animation) => {
  const target = animation.effect?.target;
  const timing = animation.effect?.getComputedTiming?.();
  return {
    target: target instanceof Element ? `${target.tagName.toLowerCase()}.${[...target.classList].join(".")}` : null,
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
}));
await revealPage.screenshot({ path: `${outputDirectory}/14-mission-reveal-start.png` });
await revealPage.waitForTimeout(550);
await revealPage.screenshot({ path: `${outputDirectory}/15-mission-reveal-middle.png` });
await revealPage.waitForTimeout(700);
const revealEnd = await revealPage.evaluate(() => document.getAnimations({ subtree: true }).map((animation) => ({
  playState: animation.playState,
  currentTime: animation.currentTime,
  duration: animation.effect?.getComputedTiming?.().duration,
})));
log("mission-scroll-reveal", { start: revealStart, end: revealEnd });
await revealContext.close();

const { context: reducedContext, page: reducedPage } = await createPage({ reducedMotion: "reduce" });
await reducedPage.getByText("БОЛЬШАЯ МИССИЯ", { exact: true }).filter({ visible: true }).first().scrollIntoViewIfNeeded();
await reducedPage.waitForTimeout(100);
const reducedAnimations = await reducedPage.evaluate(() => ({
  mediaMatches: matchMedia("(prefers-reduced-motion: reduce)").matches,
  animations: document.getAnimations({ subtree: true }).map((animation) => ({
    playState: animation.playState,
    duration: animation.effect?.getComputedTiming?.().duration,
    targetClass: animation.effect?.target instanceof Element ? animation.effect.target.className : null,
  })),
}));
log("reduced-motion", reducedAnimations);
await reducedContext.close();

const { context: mobileContext, page: mobile } = await createPage({ ...devices["iPhone 13"] });
const mobileMenuTrigger = mobile.locator('a[href="#menuopen"]').filter({ visible: true }).first();
log("mobile-menu-trigger-before-click", await mobileMenuTrigger.evaluate((element) => ({
  tag: element.tagName.toLowerCase(),
  className: element.className,
  href: element.getAttribute("href"),
  rect: element.getBoundingClientRect().toJSON(),
})));
await mobileMenuTrigger.click();
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: `${outputDirectory}/16-mobile-menu-open.png` });
log("mobile-menu-text", await mobile.locator("body").innerText());
await mobileContext.close();

await browser.close();
