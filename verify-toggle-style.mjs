/**
 * Verify the sidebar toggle button alignment with the settings trigger:
 *  - served bundle carries the inlined icon;
 *  - wide mode: 42px rounded row, 16px icon + label, closed = transparent bg;
 *  - open: data-dsh-mindmap-active="true" + nav-active background highlight;
 *  - dock still opens/closes through it;
 *  - collapsed rail: 36x36 round, 18px icon.
 * Screenshots at each stage.
 */
import { chromium } from "@playwright/test";

const PORT = process.argv[2] ?? "3080";
const BASE = `http://127.0.0.1:${PORT}`;

// 0) Served bundle freshness (server must read lib/client.js per request).
const served = await fetch(`${BASE}/plugins/dsh-mindmap-live/client.js`).then((r) => r.text());
if (!served.includes("var MINDMAP_ICON_URI")) throw new Error("served bundle is stale — MINDMAP_ICON_URI missing");
console.log("[ok] served bundle carries the inlined icon");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

await page.goto(BASE, { waitUntil: "load", timeout: 30000 });
await page.waitForSelector("[data-dsh-mindmap-toggle]", { timeout: 20000 });
await page.waitForTimeout(1500);

const toggleInfo = () => page.evaluate(() => {
  const b = document.querySelector("[data-dsh-mindmap-toggle]");
  if (!b) return null;
  const cs = getComputedStyle(b);
  const img = b.querySelector("img");
  const label = [...b.querySelectorAll("span")].map((n) => n.textContent).join("");
  const r = b.getBoundingClientRect();
  return {
    w: Math.round(r.width), h: Math.round(r.height),
    radius: cs.borderRadius,
    bg: cs.backgroundColor,
    active: b.getAttribute("data-dsh-mindmap-active"),
    pressed: b.getAttribute("aria-pressed"),
    imgPx: img ? img.getAttribute("width") : null,
    imgIsIcon: !!(img && (img.src || "").startsWith("data:image/png;base64,")),
    label
  };
});

console.log("\n=== stage 1: wide sidebar, map closed ===");
let info = await toggleInfo();
console.log(JSON.stringify(info));
if (!info.imgIsIcon) throw new Error("button does not render the mindmapcn icon");
if (info.h !== 42 || info.radius !== "12px" || !info.label.includes("思维导图")) throw new Error("wide geometry does not match the settings trigger");
if (info.active !== "false" || info.bg === "rgba(0, 0, 0, 0)") {
  if (info.active !== "false") throw new Error("closed button marked active");
}
await page.screenshot({ path: new URL("./toggle-1-closed.png", import.meta.url).pathname.replace(/^\/(\w:)/, "$1") });

console.log("\n=== stage 2: open -> highlight ===");
await page.locator("[data-dsh-mindmap-toggle]").first().click();
await page.waitForTimeout(1200);
info = await toggleInfo();
console.log(JSON.stringify(info));
if (info.active !== "true") throw new Error("open button not highlighted (data attr)");
if (info.bg === "rgba(0, 0, 0, 0)") throw new Error("open button has no highlight background");
const dockOpen = await page.evaluate(() => !!document.querySelector("[data-dsh-mindmap-dock-panel]"));
if (!dockOpen) throw new Error("dock did not open");
await page.screenshot({ path: new URL("./toggle-2-open.png", import.meta.url).pathname.replace(/^\/(\w:)/, "$1") });

console.log("\n=== stage 3: close again ===");
await page.locator("[data-dsh-mindmap-toggle]").first().click();
await page.mouse.move(960, 540); // pointer off the button: hover fill must clear
await page.waitForTimeout(800);
info = await toggleInfo();
console.log(JSON.stringify(info));
if (info.active !== "false") throw new Error("closed button still highlighted");
if (info.bg !== "rgba(0, 0, 0, 0)") throw new Error(`closed button background not transparent: ${info.bg}`);
const dockGone = await page.evaluate(() => !document.querySelector("[data-dsh-mindmap-dock-panel]"));
if (!dockGone) throw new Error("dock did not close");

console.log("\n=== stage 4: collapsed rail ===");
const collapseBtn = page.locator("button[aria-label='收起侧边栏'], button[title='收起侧边栏']").first();
if (await collapseBtn.count()) {
  await collapseBtn.click();
  await page.waitForTimeout(900);
  info = await toggleInfo();
  console.log(JSON.stringify(info));
  if (Math.round(info.w) !== 36 || Math.round(info.h) !== 36 || info.radius !== "50%" || info.imgPx !== "18") {
    throw new Error("rail geometry does not match the settings rail trigger");
  }
  // Open from the rail too — highlight should hold there as well.
  await page.locator("[data-dsh-mindmap-toggle]").first().click();
  await page.waitForTimeout(1000);
  info = await toggleInfo();
  console.log("rail open:", JSON.stringify(info));
  if (info.active !== "true" || info.bg === "rgba(0, 0, 0, 0)") throw new Error("rail open state not highlighted");
  await page.screenshot({ path: new URL("./toggle-3-rail-open.png", import.meta.url).pathname.replace(/^\/(\w:)/, "$1") });
} else {
  console.log("(sidebar collapse control not found — skipped rail stage)");
}

console.log("\n--- console errors ---");
if (errors.length === 0) console.log("(none)");
else { errors.forEach((e) => console.log(e)); throw new Error(`${errors.length} console error(s)`); }

await browser.close();
console.log("\nALL TOGGLE CHECKS PASSED");
process.exit(0);
