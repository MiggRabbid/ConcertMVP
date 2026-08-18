import { mkdir } from "node:fs/promises";

import { chromium, devices } from "/root/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs";

const output = "reference-assets/implementation-qa";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function revealPage(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 650) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(55);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(250);
}

async function runDesktop(name, url) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    locale: "ru-RU",
    timezoneId: "Europe/Moscow",
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => message.type() === "error" && errors.push(`console: ${message.text()}`));

  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.locator(".hero").waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${output}/${name}-desktop-hero.png` });

  await page.locator(".menu-trigger").click();
  await page.waitForTimeout(560);
  const menuOpen = await page.locator(".menu-overlay").evaluate((element) => element.classList.contains("menu-overlay-open"));
  await page.screenshot({ path: `${output}/${name}-desktop-menu.png` });
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "EN", exact: true }).click();
  await page.waitForFunction(() => document.documentElement.lang === "en");
  await page.waitForTimeout(600);
  const englishTitle = await page.locator(".hero-slide h1").first().textContent();
  await page.getByRole("button", { name: "RU", exact: true }).click();
  await page.waitForFunction(() => document.documentElement.lang === "ru");
  await page.waitForTimeout(600);

  await page.evaluate(() => window.scrollTo({ top: document.querySelector("#programme").offsetTop + 180, behavior: "instant" }));
  await page.waitForTimeout(1_100);
  await page.screenshot({ path: `${output}/${name}-desktop-programme.png` });
  await page.locator(".event-card button").first().click();
  await page.locator(".event-modal").waitFor({ state: "visible" });
  await page.waitForTimeout(480);
  const modalState = await page.locator(".event-modal").evaluate((element) => {
    const panel = element.querySelector(".event-modal__panel");
    return {
      rect: element.getBoundingClientRect().toJSON(),
      zIndex: getComputedStyle(element).zIndex,
      background: getComputedStyle(element).backgroundColor,
      panelRect: panel.getBoundingClientRect().toJSON(),
      panelDisplay: getComputedStyle(panel).display,
    };
  });
  await page.screenshot({ path: `${output}/${name}-desktop-modal.png` });
  const modalOpen = await page.locator(".event-modal").isVisible();
  await page.locator(".event-modal__close").click();

  await revealPage(page);
  await page.screenshot({ path: `${output}/${name}-desktop-full.png`, fullPage: true });

  await page.evaluate(() => window.scrollTo({ top: document.querySelector("#architecture").offsetTop, behavior: "instant" }));
  await page.waitForTimeout(1_100);
  await page.screenshot({ path: `${output}/${name}-desktop-architecture.png` });

  const metrics = await page.evaluate(() => ({
    title: document.title,
    language: document.documentElement.lang,
    bodyHeight: document.documentElement.scrollHeight,
    bodyWidth: document.documentElement.scrollWidth,
    viewportWidth: innerWidth,
    menuButtons: document.querySelectorAll(".menu-overlay__link").length,
    cards: document.querySelectorAll(".event-card").length,
    revealed: document.querySelectorAll('.reveal[data-visible="true"]').length,
    revealTotal: document.querySelectorAll(".reveal").length,
    emptyLinks: [...document.querySelectorAll("a")].filter((link) => !link.getAttribute("href")).length,
    imagesWithoutAlt: [...document.images].filter((image) => !image.hasAttribute("alt")).length,
  }));

  await context.close();
  return { name, errors, menuOpen, modalOpen, modalState, englishTitle, metrics };
}

async function runMobile(name, url) {
  const context = await browser.newContext({
    ...devices["iPhone 13"],
    locale: "ru-RU",
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => message.type() === "error" && errors.push(`console: ${message.text()}`));

  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.locator(".hero").waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForTimeout(700);
  const initialViewport = await page.evaluate(() => {
    const header = document.querySelector(".site-header");
    const actions = document.querySelector(".site-header__actions");
    const trigger = document.querySelector(".menu-trigger");
    const triggerRect = trigger.getBoundingClientRect();
    const hit = document.elementFromPoint(
      triggerRect.left + triggerRect.width / 2,
      triggerRect.top + triggerRect.height / 2,
    );
    return {
      innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      header: header.getBoundingClientRect().toJSON(),
      headerPosition: getComputedStyle(header).position,
      headerZIndex: getComputedStyle(header).zIndex,
      headerActions: actions.getBoundingClientRect().toJSON(),
      trigger: triggerRect.toJSON(),
      hit: { tag: hit?.tagName, className: hit?.className ?? "" },
    };
  });
  await page.screenshot({ path: `${output}/${name}-mobile-hero.png` });

  await page.locator(".menu-trigger").click();
  await page.waitForTimeout(560);
  const menuOpen = await page.locator(".menu-overlay").evaluate((element) => element.classList.contains("menu-overlay-open"));
  await page.screenshot({ path: `${output}/${name}-mobile-menu.png` });
  await page.keyboard.press("Escape");

  await page.evaluate(() => window.scrollTo({ top: document.querySelector("#programme").offsetTop + 120, behavior: "instant" }));
  await page.waitForTimeout(1_100);
  const track = page.locator(".event-grid").first();
  const overflow = await track.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  await track.evaluate((element) => element.scrollTo({ left: element.clientWidth, behavior: "instant" }));
  await page.waitForTimeout(250);
  const scrolledLeft = await track.evaluate((element) => element.scrollLeft);

  const overflowingElements = await page.evaluate(() => {
    const viewport = innerWidth;
    return [...document.querySelectorAll("body *")]
      .filter((element) => !element.closest(".hero__track, .event-grid, .menu-overlay"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === "string" ? element.className : "",
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          text: element.textContent?.trim().slice(0, 48) ?? "",
        };
      })
      .filter(({ left, right, width }) => width > 0 && (left < -1 || right > viewport + 1))
      .slice(0, 30);
  });

  await revealPage(page);
  await page.screenshot({ path: `${output}/${name}-mobile-full.png`, fullPage: true });

  const metrics = await page.evaluate(() => ({
    innerHeight,
    heroHeight: Math.round(document.querySelector(".hero").getBoundingClientRect().height),
    bodyHeight: document.documentElement.scrollHeight,
    bodyWidth: document.documentElement.scrollWidth,
    viewportWidth: innerWidth,
    selectVisible: getComputedStyle(document.querySelector(".programme__select")).display !== "none",
    tabsVisible: getComputedStyle(document.querySelector(".programme__tabs")).display !== "none",
  }));

  await context.close();
  return { name, errors, menuOpen, initialViewport, overflow, scrolledLeft, overflowingElements, metrics };
}

const result = {
  mobile: [
    await runMobile("astro", "http://127.0.0.1:4321/"),
    await runMobile("gatsby", "http://127.0.0.1:9000/"),
  ],
  desktop: [
    await runDesktop("astro", "http://127.0.0.1:4321/"),
    await runDesktop("gatsby", "http://127.0.0.1:9000/"),
  ],
};

console.log(JSON.stringify(result, null, 2));
await browser.close();
