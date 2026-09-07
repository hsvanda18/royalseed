/**
 * Inspection capture. Settles entrance motion before shooting so an element
 * mid-animation is never mistaken for a missing element, then validates each
 * file is non-blank before it is handed on.
 */
import { chromium } from "playwright";
import { mkdir, stat } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:4173/";
const OUT = ".impeccable/review";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chromium" });
const results = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    locale: "pt-PT",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  // Walk the whole sheet so every IntersectionObserver region inks in, then
  // return to the top for a full-page capture from the document origin.
  await page.evaluate(async () => {
    // The sheet sets scroll-behavior: smooth, which turns every scrollTo
    // into an animation the capture would outrun — regions would never
    // reach the viewport and would shoot as blank.
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < html.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo(0, html.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
    await new Promise((r) => setTimeout(r, 400));
  });

  // Let the longest transition (1500ms draw) finish before shooting.
  await page.waitForTimeout(2000);

  await page.screenshot({ path: `${OUT}/${vp.name}.png`, fullPage: true });
  await page.screenshot({ path: `${OUT}/${vp.name}-hero.png`, fullPage: false });

  // The phase axis at its last stop, where the estimate appears.
  await page.evaluate(() => {
    const el = document.getElementById("phase-axis");
    if (!el) return;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    ).set;
    setter.call(el, "3");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${vp.name}-axis-end.png`, fullPage: false });

  const metrics = await page.evaluate(() => ({
    docWidth: document.documentElement.scrollWidth,
    winWidth: window.innerWidth,
    overflowing: [...document.querySelectorAll("*")]
      .filter((n) => n.scrollWidth > document.documentElement.clientWidth + 2)
      .slice(0, 8)
      .map((n) => `${n.tagName}.${(n.className?.baseVal ?? n.className ?? "").toString().slice(0, 70)}`),
  }));

  results.push({ vp: vp.name, errors, metrics });
  await ctx.close();
}

// English pass, desktop only: the copy is a full peer and its measure differs.
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await page.evaluate(async () => {
    // The sheet sets scroll-behavior: smooth, which turns every scrollTo
    // into an animation the capture would outrun — regions would never
    // reach the viewport and would shoot as blank.
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < html.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo(0, html.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/desktop-en.png`, fullPage: true });
  await ctx.close();
}

await browser.close();

// Validate: a capture is evidence only if the file exists and has bulk.
const files = [
  "desktop.png",
  "desktop-hero.png",
  "desktop-axis-end.png",
  "mobile.png",
  "mobile-hero.png",
  "mobile-axis-end.png",
  "desktop-en.png",
];
for (const f of files) {
  const s = await stat(`${OUT}/${f}`);
  console.log(`${f.padEnd(22)} ${(s.size / 1024).toFixed(0).padStart(6)} KB${s.size < 12000 ? "  ⚠ SUSPICIOUSLY SMALL" : ""}`);
}
console.log("\n" + JSON.stringify(results, null, 2));
