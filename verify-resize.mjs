/**
 * Verify the dock panel's draggable divider: drag resize, live layout bridge,
 * min/max clamping, persistence across reload, double-click reset.
 */
import { chromium } from "@playwright/test";

const PORT = process.argv[2] ?? "3080";
const BASE = `http://127.0.0.1:${PORT}`;

async function api(method, payload) {
  const res = await fetch(`${BASE}/api/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: "resizeverify", method, payload })
  });
  const json = await res.json();
  if (!json.result?.ok) throw new Error(`${method} failed`);
  return json.result.value;
}
async function rpcUpdate(sessionId, tree) {
  await fetch(`${BASE}/mindmap/update`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: "resizeverify", method: "update", payload: { sessionId, tree } })
  });
}

const tree = {
  nodeData: { id: "root", topic: "拖拽验证根", expanded: true, children: [] },
  arrows: [], summaries: [], direction: 2
};
const { sessionId } = await api("session.create", {});
await rpcUpdate(sessionId, tree);
console.log("[seed]", sessionId);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));

await page.addInitScript(([sid]) => {
  localStorage.setItem("dsh.sessions.current", JSON.stringify({ sessionId: sid }));
}, [sessionId]);
await page.goto(BASE, { waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(4500);

await page.locator("[data-dsh-mindmap-toggle]").first().click();
await page.waitForTimeout(1200);

// No preset buttons anymore.
const presetCount = await page.locator("[data-dsh-mindmap-dock-panel] button", { hasText: /^(窄|中|宽)$/ }).count();
console.log("[check] preset buttons remaining:", presetCount);
if (presetCount !== 0) throw new Error("width preset buttons still present");

const info = () => page.evaluate(() => ({
  // rect includes the 1px left border; style width is what we control
  w: Math.round(document.querySelector("[data-dsh-mindmap-dock-panel]").getBoundingClientRect().width),
  sw: parseInt(document.querySelector("[data-dsh-mindmap-dock-panel]").style.width, 10),
  cssVar: document.body.style.getPropertyValue("--dsh-mindmap-dock-w"),
  centerPad: getComputedStyle(document.querySelector('[class*="_centerCol"]')).paddingRight
}));

const startW = (await info()).sw;
console.log("[start] style width:", startW);

// --- drag left edge of the resizer handle by -150px (panel grows) ---
const handle = page.locator("[data-dsh-mindmap-resizer]");
const box = await handle.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + 400);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 - 75, box.y + 400, { steps: 8 });
const midW = (await info()).w;
await page.mouse.move(box.x + box.width / 2 - 150, box.y + 400, { steps: 8 });
await page.mouse.up();
await page.waitForTimeout(300);
const dragged = await info();
console.log("[drag-150] mid-drag:", midW, "-> committed:", JSON.stringify(dragged));
if (dragged.sw !== startW + 150) throw new Error(`drag resize wrong: ${dragged.sw} vs ${startW + 150}`);
if (dragged.cssVar !== `${dragged.sw}px`) throw new Error("css var not synced");
// mid-drag the pointer had travelled 75 of the 150px — preview must reflect it
if (Math.abs(midW - (startW + 75)) > 20) throw new Error(`no live preview during drag: ${midW} vs ~${startW + 75}`);

// --- persistence across reload ---
await page.reload({ waitUntil: "load" });
await page.waitForTimeout(4500);
// the persisted store also restores view="dock" — only click when closed
if ((await page.locator("[data-dsh-mindmap-dock-panel]").count()) === 0) {
  await page.locator("[data-dsh-mindmap-toggle]").first().click();
  await page.waitForTimeout(1200);
}
const reloaded = await info();
console.log("[reload]", JSON.stringify(reloaded));
if (reloaded.sw !== dragged.sw) throw new Error(`width not persisted: ${reloaded.sw} vs ${dragged.sw}`);

// --- double-click resets to default ---
const box2 = await page.locator("[data-dsh-mindmap-resizer]").boundingBox();
await page.mouse.dblclick(box2.x + box2.width / 2, box2.y + 400);
await page.waitForTimeout(300);
const reset = await info();
console.log("[dblclick-reset]", reset.sw);
if (reset.sw !== 520) throw new Error(`double-click reset wrong: ${reset.sw}`);

// --- max clamp: drag far into chat area ---
const box3 = await page.locator("[data-dsh-mindmap-resizer]").boundingBox();
await page.mouse.move(box3.x + box3.width / 2, box3.y + 400);
await page.mouse.down();
await page.mouse.move(-500, box3.y + 400, { steps: 10 });
await page.mouse.up();
await page.waitForTimeout(300);
const maxed = await info();
console.log("[clamp-max]", maxed.sw, "(expected 80% of 1920 =", Math.round(1920 * 0.8), ")");
if (maxed.sw !== Math.round(1920 * 0.8)) throw new Error(`max clamp wrong: ${maxed.sw}`);
// restore layout sanity: center column shifted accordingly
if (maxed.centerPad !== `${maxed.sw}px`) throw new Error(`center col padding not following: ${maxed.centerPad}`);

// --- min clamp: drag far right ---
const box4 = await page.locator("[data-dsh-mindmap-resizer]").boundingBox();
await page.mouse.move(box4.x + box4.width / 2, box4.y + 400);
await page.mouse.down();
await page.mouse.move(1900, box4.y + 400, { steps: 10 });
await page.mouse.up();
await page.waitForTimeout(300);
const mined = await info();
console.log("[clamp-min]", mined.sw);
if (mined.sw !== 300) throw new Error(`min clamp wrong: ${mined.sw}`);

console.log("\n--- console errors ---");
if (errors.length === 0) console.log("(none)");
else { errors.forEach((e) => console.log(e)); throw new Error(`${errors.length} console error(s)`); }

await browser.close();
import { rmSync } from "node:fs";
try { rmSync(`C:\\Users\\47235\\.dsh\\sessions\\--C-project--\\${sessionId}`, { recursive: true, force: true }); } catch {}
console.log("\nALL RESIZE CHECKS PASSED");
process.exit(0);
