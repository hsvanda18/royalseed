/** Per-region crops at legible scale. A full-page thumbnail hides exactly
 *  the failures that matter. */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:4173/";
const OUT = ".impeccable/review/crops";
const WIDTH = Number(process.env.W ?? 1440);
const TAG = process.env.TAG ?? "d";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chromium" });
const ctx = await browser.newContext({
  viewport: { width: WIDTH, height: 1000 },
  deviceScaleFactor: 2,
  locale: "pt-PT",
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

await page.evaluate(async () => {
  const html = document.documentElement;
  html.style.scrollBehavior = "auto";
  const step = window.innerHeight * 0.7;
  for (let y = 0; y < html.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 160));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 300));
});
await page.waitForTimeout(1200);

// Freeze every transition so element screenshots can settle. Reduced motion
// already lands each region at its final state, so nothing is hidden.
await page.addStyleTag({
  content: "*,*::before,*::after{transition:none!important;animation:none!important}html{scroll-behavior:auto!important}",
});
await page.waitForTimeout(300);

for (const id of ["plan", "charter", "product", "method", "origin", "people", "contact"]) {
  const el = page.locator(`#${id}`);
  await el.screenshot({ path: `${OUT}/${TAG}-${id}.png` });
  console.log(`${TAG}-${id}.png`);
}

// The plan at its final phase stop, where block, lattice and estimate all show.
await page.evaluate(() => {
  const el = document.getElementById("phase-axis");
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  ).set;
  setter.call(el, "3");
  el.dispatchEvent(new Event("input", { bubbles: true }));
});
await page.waitForTimeout(1000);
await page.locator("#plan").screenshot({ path: `${OUT}/${TAG}-plan-full.png` });
console.log(`${TAG}-plan-full.png`);

await browser.close();
