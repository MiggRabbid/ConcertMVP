import { chromium, devices } from "/root/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const url = "https://concert.sirius.ru/";
const outputDirectory = "reference-assets/concert-home";

function log(type, data) {
  console.log(JSON.stringify({ type, data }));
}

async function createPage(options = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    locale: "ru-RU",
    timezoneId: "Europe/Moscow",
    ...options,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20_000);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(4_000);
  return { context, page };
}

const { context: tabContext, page: tabPage } = await createPage();
await tabPage.evaluate(() => window.scrollTo({ top: 920, behavior: "instant" }));
await tabPage.waitForTimeout(700);

const visibleTabs = await tabPage.evaluate(() => {
  const visible = (element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  };
  const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
  return [...document.querySelectorAll("button.t397__title, .t397__title")]
    .filter(visible)
    .map((element) => ({
      text: normalize(element.textContent),
      className: element.className,
      ariaSelected: element.getAttribute("aria-selected"),
      role: element.getAttribute("role"),
      rect: element.getBoundingClientRect().toJSON(),
    }));
});
log("visible-tabs", visibleTabs);

const mastersTab = tabPage.locator(".t397__title", { hasText: "Мастера музыки" }).filter({ visible: true }).first();
await mastersTab.click();
await tabPage.waitForTimeout(80);
log("tab-animation-80ms", await tabPage.evaluate(() => document.getAnimations({ subtree: true }).map((animation) => ({
  playState: animation.playState,
  duration: animation.effect?.getComputedTiming?.().duration,
  targetClass: animation.effect?.target instanceof Element ? animation.effect.target.className : null,
  keyframes: animation.effect?.getKeyframes?.().map((frame) => ({
    offset: frame.offset,
    opacity: frame.opacity,
    transform: frame.transform,
  })),
}))));
await tabPage.waitForTimeout(550);
await tabPage.screenshot({ path: `${outputDirectory}/20-desktop-tab-masters.png` });
log("tab-masters-state", await tabPage.evaluate(() => ({
  hash: location.hash,
  scrollY,
  documentHeight: document.documentElement.scrollHeight,
  activeTabs: [...document.querySelectorAll(".t397__title_active")].map((element) => element.textContent?.replace(/\s+/g, " ").trim()),
  visibleGroupText: [...document.querySelectorAll(".t397__tab")]
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })
    .map((element) => element.textContent?.replace(/\s+/g, " ").trim().slice(0, 220)),
})));
await tabContext.close();

const { context: modalContext, page: modalPage } = await createPage();
await modalPage.evaluate(() => window.scrollTo({ top: 1_500, behavior: "instant" }));
await modalPage.waitForTimeout(900);
const eventLink = modalPage.locator('a[href="#19aug"]').filter({ visible: true }).first();
log("event-link-before-click", await eventLink.evaluate((element) => ({
  text: element.textContent?.replace(/\s+/g, " ").trim(),
  className: element.className,
  rect: element.getBoundingClientRect().toJSON(),
})));
await eventLink.click();
await modalPage.waitForTimeout(800);
await modalPage.screenshot({ path: `${outputDirectory}/21-desktop-event-modal.png` });
log("event-modal", await modalPage.evaluate(() => {
  const visible = (element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.opacity !== "0";
  };
  const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
  const popup = [...document.querySelectorAll(".t-popup_show")].find(visible);
  const container = popup?.querySelector(".t-popup__container");
  const style = container ? getComputedStyle(container) : null;
  return {
    hash: location.hash,
    bodyOverflow: getComputedStyle(document.body).overflow,
    popupClassName: popup?.className,
    text: popup ? normalize(popup.innerText).slice(0, 2_500) : null,
    transition: style?.transition,
    transform: style?.transform,
    background: style?.background,
    links: popup ? [...popup.querySelectorAll("a")].filter(visible).map((link) => ({
      text: normalize(link.textContent),
      href: link.href,
    })) : [],
    images: popup ? [...popup.querySelectorAll("img")].filter(visible).map((image) => ({
      src: image.currentSrc || image.src,
      alt: image.alt,
      rect: image.getBoundingClientRect().toJSON(),
    })) : [],
    closeButtons: popup ? [...popup.querySelectorAll("button, [role=button], .t-popup__close")]
      .filter(visible)
      .map((element) => ({
        text: normalize(element.textContent),
        ariaLabel: element.getAttribute("aria-label"),
        className: element.className,
      })) : [],
  };
}));
await modalContext.close();

const { context: mobileModalContext, page: mobileModalPage } = await createPage({ ...devices["iPhone 13"] });
await mobileModalPage.evaluate(() => window.scrollTo({ top: 1_350, behavior: "instant" }));
await mobileModalPage.waitForTimeout(900);
const mobileEventLink = mobileModalPage.locator('a[href="#19aug"]').filter({ visible: true }).first();
await mobileEventLink.click();
await mobileModalPage.waitForTimeout(800);
await mobileModalPage.screenshot({ path: `${outputDirectory}/22-mobile-event-modal.png` });
await mobileModalContext.close();

await browser.close();
