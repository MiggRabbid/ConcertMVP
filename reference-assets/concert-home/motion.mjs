import { chromium, devices } from "/root/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs";

const url = "https://concert.sirius.ru/";
const outputDirectory = "reference-assets/concert-home";
const browser = await chromium.launch({ channel: "chrome", headless: true });

function log(type, data) {
  console.log(JSON.stringify({ type, data }));
}

async function createPage(options = {}) {
  const context = await browser.newContext({
    locale: "ru-RU",
    timezoneId: "Europe/Moscow",
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
    ...options,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20_000);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(1_500);
  return { context, page };
}

async function scrollToExactText(page, text) {
  return page.evaluate((targetText) => {
    const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
    const candidates = [...document.querySelectorAll("body *")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return normalize(element.textContent) === targetText && rect.width > 0 && rect.height > 0;
      })
      .sort((first, second) => {
        const firstRect = first.getBoundingClientRect();
        const secondRect = second.getBoundingClientRect();
        return firstRect.width * firstRect.height - secondRect.width * secondRect.height;
      });
    const element = candidates[0];
    if (!element) return null;
    element.scrollIntoView({ block: "center", behavior: "instant" });
    const rect = element.getBoundingClientRect();
    return {
      tag: element.tagName.toLowerCase(),
      className: element.className,
      y: Math.round(rect.top + scrollY),
      scrollY,
    };
  }, text);
}

async function animationSnapshot(page) {
  return page.evaluate(() => document.getAnimations({ subtree: true }).map((animation) => {
    const target = animation.effect?.target;
    const timing = animation.effect?.getComputedTiming?.();
    const rect = target instanceof Element ? target.getBoundingClientRect() : null;
    return {
      target: target instanceof Element
        ? `${target.tagName.toLowerCase()}#${target.id}.${[...target.classList].join(".")}`
        : null,
      targetRect: rect ? {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      } : null,
      playState: animation.playState,
      currentTime: animation.currentTime,
      duration: timing?.duration,
      iterations: timing?.iterations,
      direction: timing?.direction,
      easing: timing?.easing,
      fill: timing?.fill,
      keyframes: animation.effect?.getKeyframes?.().map((frame) => ({
        offset: frame.offset,
        opacity: frame.opacity,
        transform: frame.transform,
        clipPath: frame.clipPath,
        easing: frame.easing,
      })),
    };
  }));
}

async function styleForExactText(page, text) {
  return page.evaluate((targetText) => {
    const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
    const candidates = [...document.querySelectorAll("body *")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return normalize(element.textContent) === targetText && rect.width > 0 && rect.height > 0;
      })
      .sort((first, second) => {
        const firstRect = first.getBoundingClientRect();
        const secondRect = second.getBoundingClientRect();
        return firstRect.width * firstRect.height - secondRect.width * secondRect.height;
      });
    const element = candidates[0];
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
      opacity: style.opacity,
      transform: style.transform,
      transition: style.transition,
    };
  }, text);
}

const { context: revealContext, page: revealPage } = await createPage();

const styleTargets = [
  "АФИША",
  "КОНЦЕРТ «МУЗЫКА ДЛЯ ФОРТЕПИАНО И КЛАРНЕТА»",
  "БОЛЬШАЯ МИССИЯ",
  "НЕПОВТОРИМАЯ АРХИТЕКТУРА",
  "БЕЗУПРЕЧНАЯ АКУСТИКА",
  "ПРИРОДА ИСКУССТВА",
];

for (const text of styleTargets) {
  log("typography", { text, style: await styleForExactText(revealPage, text) });
}

log("mission-target", await scrollToExactText(revealPage, "БОЛЬШАЯ МИССИЯ"));
await revealPage.waitForTimeout(20);
log("mission-animation-20ms", await animationSnapshot(revealPage));
await revealPage.screenshot({ path: `${outputDirectory}/14-mission-reveal-start.png` });
await revealPage.waitForTimeout(430);
log("mission-animation-450ms", await animationSnapshot(revealPage));
await revealPage.screenshot({ path: `${outputDirectory}/15-mission-reveal-middle.png` });
await revealPage.waitForTimeout(800);
log("mission-animation-1250ms", await animationSnapshot(revealPage));
await revealPage.screenshot({ path: `${outputDirectory}/17-mission-reveal-end.png` });
await revealContext.close();

const { context: reducedContext, page: reducedPage } = await createPage({ reducedMotion: "reduce" });
log("reduced-motion-target", await scrollToExactText(reducedPage, "БОЛЬШАЯ МИССИЯ"));
await reducedPage.waitForTimeout(60);
log("reduced-motion", {
  mediaMatches: await reducedPage.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
  animations: await animationSnapshot(reducedPage),
});
await reducedContext.close();

const { context: mobileContext, page: mobilePage } = await createPage({ ...devices["iPhone 13"] });
const mobileSliders = await mobilePage.evaluate(() => {
  const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
  return [...document.querySelectorAll(".slick-slider")]
    .map((slider) => {
      const rect = slider.getBoundingClientRect();
      const track = slider.querySelector(".slick-track");
      const trackStyle = track ? getComputedStyle(track) : null;
      return {
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y + scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        text: normalize(slider.textContent).slice(0, 180),
        slides: slider.querySelectorAll(".slick-slide").length,
        currentSlides: [...slider.querySelectorAll(".slick-current, .slick-active")].map((element) => ({
          text: normalize(element.textContent).slice(0, 120),
          ariaHidden: element.getAttribute("aria-hidden"),
        })),
        trackTransform: trackStyle?.transform,
        trackTransition: trackStyle?.transition,
        dots: slider.querySelectorAll(".slick-dots li").length,
        arrows: slider.querySelectorAll(".slick-arrow").length,
      };
    })
    .filter((slider) => slider.rect.width > 0 && slider.rect.height > 0);
});
log("mobile-sliders", mobileSliders);

const mobileMenuTrigger = mobilePage.locator('a[href="#menuopen"]').filter({ visible: true }).first();
log("mobile-menu-trigger", await mobileMenuTrigger.evaluate((element) => ({
  className: element.className,
  ariaLabel: element.getAttribute("aria-label"),
  text: element.textContent?.replace(/\s+/g, " ").trim(),
  rect: element.getBoundingClientRect().toJSON(),
})));
await mobileMenuTrigger.click();
await mobilePage.waitForTimeout(700);
await mobilePage.screenshot({ path: `${outputDirectory}/16-mobile-menu-open.png` });
const mobileMenu = await mobilePage.evaluate(() => {
  const visible = (element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.opacity !== "0";
  };
  const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
  const popup = [...document.querySelectorAll(".t-popup_show")].find(visible);
  return {
    bodyOverflow: getComputedStyle(document.body).overflow,
    popupClassName: popup?.className,
    popupTransition: popup ? getComputedStyle(popup).transition : null,
    popupText: popup ? normalize(popup.textContent) : null,
    visibleLinks: popup
      ? [...popup.querySelectorAll("a")].filter(visible).map((link) => ({ text: normalize(link.textContent), href: link.href }))
      : [],
  };
});
log("mobile-menu", mobileMenu);
await mobileContext.close();

await browser.close();
