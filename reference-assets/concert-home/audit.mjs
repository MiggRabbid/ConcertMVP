import { chromium, devices } from "/root/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs";

const baseUrl = "https://concert.sirius.ru/";
const outputDirectory = "reference-assets/concert-home";

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function loadPage(contextOptions) {
  const context = await browser.newContext({
    locale: "ru-RU",
    timezoneId: "Europe/Moscow",
    reducedMotion: "no-preference",
    ...contextOptions,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15_000);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(6_000);
  return { context, page };
}

const { context: desktopContext, page: desktop } = await loadPage({
  viewport: { width: 1440, height: 1000 },
});

await desktop.screenshot({
  path: `${outputDirectory}/02-desktop-hero.png`,
});

const summary = await desktop.evaluate(() => {
  const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
  const selectorFor = (element) => {
    if (!(element instanceof Element)) return null;
    const id = element.id ? `#${element.id}` : "";
    const classes = [...element.classList].slice(0, 4).map((item) => `.${item}`).join("");
    return `${element.tagName.toLowerCase()}${id}${classes}`;
  };
  const elementInfo = (element) => {
    const rect = element.getBoundingClientRect();
    return {
      selector: selectorFor(element),
      text: normalize(element.textContent).slice(0, 240),
      ariaLabel: element.getAttribute("aria-label"),
      href: element instanceof HTMLAnchorElement ? element.href : null,
      y: Math.round(rect.top + window.scrollY),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  };

  const sections = [...document.querySelectorAll("header, main > *, section, footer")]
    .map(elementInfo)
    .filter((item) => item.height > 80);

  const motionElements = [...document.querySelectorAll("body *")]
    .map((element) => {
      const style = getComputedStyle(element);
      if (
        style.animationName === "none" &&
        style.transitionDuration.split(",").every((duration) => duration.trim() === "0s") &&
        style.transform === "none" &&
        style.scrollBehavior !== "smooth"
      ) {
        return null;
      }
      return {
        ...elementInfo(element),
        animationName: style.animationName,
        animationDuration: style.animationDuration,
        animationTimingFunction: style.animationTimingFunction,
        animationIterationCount: style.animationIterationCount,
        transitionProperty: style.transitionProperty,
        transitionDuration: style.transitionDuration,
        transitionTimingFunction: style.transitionTimingFunction,
        transform: style.transform,
        opacity: style.opacity,
      };
    })
    .filter(Boolean)
    .slice(0, 500);

  const runningAnimations = document.getAnimations({ subtree: true }).map((animation) => {
    const target = animation.effect?.target;
    const timing = animation.effect?.getComputedTiming?.();
    return {
      target: selectorFor(target),
      playState: animation.playState,
      currentTime: animation.currentTime,
      duration: timing?.duration,
      iterations: timing?.iterations,
      direction: timing?.direction,
      easing: timing?.easing,
      fill: timing?.fill,
      keyframes: animation.effect?.getKeyframes?.().map((frame) => ({
        offset: frame.offset,
        easing: frame.easing,
        opacity: frame.opacity,
        transform: frame.transform,
        clipPath: frame.clipPath,
      })),
    };
  });

  const cssMotionRules = [];
  const visitRules = (rules, source) => {
    for (const rule of rules ?? []) {
      if (rule.cssRules) visitRules(rule.cssRules, source);
      if (rule.constructor.name.includes("Keyframes")) {
        cssMotionRules.push({ type: "keyframes", source, name: rule.name, cssText: rule.cssText });
      }
      if (rule.style && (rule.style.animation || rule.style.transition || rule.style.transform)) {
        cssMotionRules.push({
          type: "style",
          source,
          selector: rule.selectorText,
          animation: rule.style.animation,
          transition: rule.style.transition,
          transform: rule.style.transform,
        });
      }
    }
  };
  for (const styleSheet of document.styleSheets) {
    try {
      visitRules(styleSheet.cssRules, styleSheet.href ?? "inline");
    } catch {
      cssMotionRules.push({ type: "unreadable-stylesheet", source: styleSheet.href });
    }
  }

  return {
    title: document.title,
    url: location.href,
    viewport: { width: innerWidth, height: innerHeight },
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    bodyText: normalize(document.body.innerText),
    headings: [...document.querySelectorAll("h1, h2, h3, h4")].map(elementInfo),
    links: [...document.querySelectorAll("a")].map(elementInfo),
    buttons: [...document.querySelectorAll("button, [role=button]")].map(elementInfo),
    images: [...document.images].map((image) => ({
      ...elementInfo(image),
      src: image.currentSrc || image.src,
      alt: image.alt,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      loading: image.loading,
    })),
    scripts: [...document.scripts].map((script) => script.src).filter(Boolean),
    styleSheets: [...document.styleSheets].map((sheet) => sheet.href ?? "inline"),
    sections,
    motionElements,
    runningAnimations,
    cssMotionRules: cssMotionRules.slice(0, 500),
  };
});

console.log(JSON.stringify({ type: "desktop-summary", data: summary }));

const capturePoints = [
  ["03-desktop-intro-end.png", 760],
  ["04-desktop-program-top.png", 1450],
  ["05-desktop-program-middle.png", 4200],
  ["06-desktop-program-bottom.png", 8100],
  ["07-desktop-mission.png", 10400],
  ["08-desktop-partners.png", 11900],
  ["09-desktop-footer.png", Math.max(0, summary.document.height - 1000)],
];

for (const [filename, requestedY] of capturePoints) {
  const y = Math.min(requestedY, summary.document.height - 1000);
  await desktop.evaluate((nextY) => window.scrollTo({ top: nextY, behavior: "instant" }), y);
  await desktop.waitForTimeout(1_500);
  const state = await desktop.evaluate(() => ({
    scrollY,
    animations: document.getAnimations({ subtree: true }).map((animation) => ({
      target: animation.effect?.target instanceof Element
        ? `${animation.effect.target.tagName.toLowerCase()}.${[...animation.effect.target.classList].join(".")}`
        : null,
      playState: animation.playState,
      currentTime: animation.currentTime,
      duration: animation.effect?.getComputedTiming?.().duration,
    })),
  }));
  console.log(JSON.stringify({ type: "scroll-state", filename, data: state }));
  await desktop.screenshot({ path: `${outputDirectory}/${filename}` });
}

await desktopContext.close();

const { context: mobileContext, page: mobile } = await loadPage({
  ...devices["iPhone 13"],
});

await mobile.screenshot({ path: `${outputDirectory}/10-mobile-hero.png` });
await mobile.screenshot({ path: `${outputDirectory}/11-mobile-full.png`, fullPage: true });

const mobileSummary = await mobile.evaluate(() => {
  const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? "";
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    headings: [...document.querySelectorAll("h1, h2, h3, h4")].map((element) => ({
      tag: element.tagName.toLowerCase(),
      text: normalize(element.textContent),
      rect: Object.fromEntries(
        ["x", "y", "width", "height"].map((key) => [key, Math.round(element.getBoundingClientRect()[key])]),
      ),
    })),
    buttons: [...document.querySelectorAll("button, [role=button]")].map((element) => ({
      text: normalize(element.textContent),
      ariaLabel: element.getAttribute("aria-label"),
      className: element.className,
      rect: Object.fromEntries(
        ["x", "y", "width", "height"].map((key) => [key, Math.round(element.getBoundingClientRect()[key])]),
      ),
    })),
  };
});

console.log(JSON.stringify({ type: "mobile-summary", data: mobileSummary }));

await mobileContext.close();
await browser.close();
