/**
 * Verify the docked side-panel UX: chat and map side by side.
 * Stages: open dock -> layout shift -> fold works -> fullscreen switch ->
 * back to dock -> close. Screenshots at every stage.
 */
import { chromium } from "@playwright/test";

const PORT = process.argv[2] ?? "3080";
const BASE = `http://127.0.0.1:${PORT}`;

async function api(method, payload) {
  const res = await fetch(`${BASE}/api/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: "dockverify", method, payload })
  });
  const json = await res.json();
  if (!json.result?.ok) throw new Error(`${method} failed`);
  return json.result.value;
}
async function rpcUpdate(sessionId, tree) {
  await fetch(`${BASE}/mindmap/update`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: "dockverify", method: "update", payload: { sessionId, tree } })
  });
}

const tree = {
  nodeData: { id: "root", topic: "并排验证根", expanded: true, children: [
    { id: "br", topic: "可折叠分支", expanded: true, children: [
      { id: "l1", topic: "叶子一", children: [] },
      { id: "l2", topic: "叶子二", children: [] }
    ]}
  ]},
  arrows: [], summaries: [], direction: 2
};
const { sessionId } = await api("session.create", {});
await rpcUpdate(sessionId, tree);
console.log("[seed]", sessionId);

const browser = await chromium.launch();
// locale pinned: this spec clicks buttons by their zh titles; without it
// headless Chromium reports en-US and the plugin renders its English dictionary.
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, locale: "zh-CN" });
const errors = [];
const shots = (name) => page.screenshot({ path: `.dsh-plugins/dsh-mindmap-live/dock-${name}.png` });
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));

await page.addInitScript(([sid]) => {
  localStorage.setItem("dsh.sessions.current", JSON.stringify({ sessionId: sid }));
}, [sessionId]);
await page.goto(BASE, { waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(4500);

const layoutInfo = () => page.evaluate(() => {
  const centerCol = document.querySelector('[class*="_centerCol"]');
  const composer = document.querySelector('[data-slot="conversation.composer.bar"]') ||
                   document.querySelector('[data-slot*="composer"]');
  return {
    centerPadding: centerCol ? getComputedStyle(centerCol).paddingRight : null,
    bodyAttr: document.body.hasAttribute("data-dsh-mindmap-dock"),
    composerRect: composer ? (({ x, y, width, height }) => ({ x: Math.round(x), y: Math.round(y), w: Math.round(width), h: Math.round(height) }))(composer.getBoundingClientRect()) : null
  };
});

console.log("\n=== stage 1: closed baseline ===");
console.log(JSON.stringify(await layoutInfo()));

await page.locator("[data-dsh-mindmap-toggle]").first().click();
await page.waitForTimeout(1800);
await shots("1-open");

const panel = await page.evaluate(() => {
  const p = document.querySelector("[data-dsh-mindmap-dock-panel]");
  const c = document.querySelector("[data-dsh-mindmap-canvas]");
  const r = p?.getBoundingClientRect();
  return {
    panelOpen: !!p,
    panelRect: r ? { x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height) } : null,
    canvasCount: document.querySelectorAll("[data-dsh-mindmap-canvas]").length,
    topics: [...document.querySelectorAll("[data-dsh-mindmap-canvas] .me-tpc")].map((n) => n.textContent?.trim())
  };
});
console.log("\n=== stage 2: dock open ===");
console.log(JSON.stringify({ ...panel, ...await layoutInfo() }, null, 1));

// Composer must not sit under the panel.
const overlap = await page.evaluate(() => {
  const p = document.querySelector("[data-dsh-mindmap-dock-panel]");
  const comp = document.querySelector('[data-slot="conversation.composer.bar"]') || document.querySelector('[data-slot*="composer"]');
  if (!p || !comp) return "elements missing";
  const a = p.getBoundingClientRect(), b = comp.getBoundingClientRect();
  const ix = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const iy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return { intersectArea: Math.round(ix * iy) };
});
console.log("[check] composer/panel overlap:", JSON.stringify(overlap));
if (!(typeof overlap === "object" && overlap.intersectArea === 0)) throw new Error("composer is covered by dock");

// Fold inside the dock.
const tpc = page.locator("[data-dsh-mindmap-canvas] .me-tpc", { hasText: "可折叠分支" }).first();
await tpc.locator("xpath=following-sibling::*[contains(@class,'me-epd')]").first().click();
await page.waitForTimeout(500);
const folded = await page.evaluate(() =>
  [...document.querySelectorAll("[data-dsh-mindmap-canvas] .me-tpc")].map((n) => n.textContent?.trim()));
console.log("[check] topics after fold:", JSON.stringify(folded));
if (folded.some((t) => t === "叶子一")) throw new Error("fold did not collapse children");
await shots("2-folded");

// Fullscreen switch: single canvas guarantee.
await page.locator("[data-dsh-mindmap-dock-panel] button[title='全屏模式']").click();
await page.waitForTimeout(800);
const fullState = await page.evaluate(() => ({
  overlay: !!document.querySelector("[data-dsh-mindmap-overlay]"),
  dockGone: !document.querySelector("[data-dsh-mindmap-dock-panel]"),
  canvases: document.querySelectorAll("[data-dsh-mindmap-canvas]").length,
  bodyAttr: document.body.hasAttribute("data-dsh-mindmap-dock")
}));
console.log("\n=== stage 3: fullscreen ===");
console.log(JSON.stringify(fullState));
if (!fullState.overlay || !fullState.dockGone || fullState.canvases !== 1) throw new Error("fullscreen switch broken");
await shots("3-full");

// Back to dock.
await page.locator("[data-dsh-mindmap-overlay] button[title='回到侧栏模式']").click();
await page.waitForTimeout(800);
const backDock = await page.evaluate(() => ({
  overlayGone: !document.querySelector("[data-dsh-mindmap-overlay]"),
  dock: !!document.querySelector("[data-dsh-mindmap-dock-panel]"),
  canvases: document.querySelectorAll("[data-dsh-mindmap-canvas]").length
}));
console.log("\n=== stage 4: back to dock ===");
console.log(JSON.stringify(backDock));
if (!backDock.overlayGone || !backDock.dock || backDock.canvases !== 1) throw new Error("return-to-dock broken");

// Close via ✕.
await page.locator("[data-dsh-mindmap-dock-panel] button[title='关闭']").click();
await page.waitForTimeout(600);
const closed = await layoutInfo();
console.log("\n=== stage 5: closed again ===");
console.log(JSON.stringify(closed));
if (closed.bodyAttr || closed.centerPadding !== "0px") throw new Error("close did not restore layout");

console.log("\n--- console errors ---");
if (errors.length === 0) console.log("(none)");
else { errors.forEach((e) => console.log(e)); throw new Error(`${errors.length} console error(s)`); }

await browser.close();
import { rmSync } from "node:fs";
try { rmSync(`C:\\Users\\47235\\.dsh\\sessions\\--C-project--\\${sessionId}`, { recursive: true, force: true }); } catch {}
console.log("\nALL DOCK CHECKS PASSED");
process.exit(0);
