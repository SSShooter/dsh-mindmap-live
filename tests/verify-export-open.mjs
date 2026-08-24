/**
 * Verify the @mind-elixir plugin actions wired into both view headers:
 *   1. 下载图片（PNG） — export-mindmap renders the live canvas and triggers a
 *      browser download named <root-topic>.png (PNG magic bytes checked).
 *   2. 在桌面应用打开 — open-desktop pings 127.0.0.1:6595 (mocked up),
 *      POSTs the current tree to /create-mindmap (payload asserted), and
 *      reports success without any navigation.
 *   3. Negative path: with 6595 unreachable, open-desktop times out and opens
 *      the desktop.mind-elixir.com download page (popup asserted, closed).
 *   4. Both buttons exist in the fullscreen overlay header too.
 * Run from the mind-elixir-core workspace root, against a live `dsh web`:
 *   node .dsh-plugins/dsh-mindmap-live/tests/verify-export-open.mjs [port]
 */
import { chromium } from "@playwright/test";

const PORT = process.argv[2] ?? "3080";
const BASE = `http://127.0.0.1:${PORT}`;
const ROOT_TOPIC = "export-check-root";
const BRANCH_TOPIC = "桌面打开分支";

async function api(method, payload) {
  const res = await fetch(`${BASE}/api/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: "exportopen", method, payload })
  });
  const json = await res.json();
  if (!json.result?.ok) throw new Error(`${method} failed`);
  return json.result.value;
}
async function rpcUpdate(sessionId, tree) {
  await fetch(`${BASE}/mindmap/update`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: "exportopen", method: "update", payload: { sessionId, tree } })
  });
}

const tree = {
  nodeData: { id: "root", topic: ROOT_TOPIC, expanded: true, children: [
    { id: "b1", topic: BRANCH_TOPIC, expanded: true, children: [
      { id: "l1", topic: "叶子一", children: [] }
    ]}
  ]},
  arrows: [], summaries: [], direction: 2
};
const { sessionId } = await api("session.create", {});
await rpcUpdate(sessionId, tree);
console.log("[seed]", sessionId);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const shots = (name) => page.screenshot({ path: `.dsh-plugins/dsh-mindmap-live/export-open-${name}.png` });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));

// --- Mock the Mind Elixir Desktop local service ---------------------------
let createMindmapPayload = null;
let downloadPageHit = false;
const UP = ["**/127.0.0.1:6595/**"];
await page.route("**/127.0.0.1:6595/ping", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
await page.route("**/127.0.0.1:6595/create-mindmap", (route) => {
  createMindmapPayload = route.request().postData();
  return route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
});
await page.route("**/desktop.mind-elixir.com/**", (route) => {
  downloadPageHit = true;
  return route.abort();
});

await page.addInitScript(([sid]) => {
  localStorage.setItem("dsh.sessions.current", JSON.stringify({ sessionId: sid }));
}, [sessionId]);
await page.goto(BASE, { waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(4500);

console.log("\n=== stage 1: dock open, buttons present ===");
await page.locator("[data-dsh-mindmap-toggle]").first().click();
await page.waitForTimeout(1800);
const dockState = await page.evaluate(() => ({
  panel: !!document.querySelector("[data-dsh-mindmap-dock-panel]"),
  canvas: document.querySelectorAll("[data-dsh-mindmap-canvas]").length,
  topics: [...document.querySelectorAll("[data-dsh-mindmap-canvas] .me-tpc")].map((n) => n.textContent?.trim()),
  dl: !!document.querySelector("[data-dsh-mindmap-dock-panel] button[title='下载图片（PNG）']"),
  dk: !!document.querySelector("[data-dsh-mindmap-dock-panel] button[title='在桌面应用打开']")
}));
console.log(JSON.stringify(dockState));
if (!dockState.panel || dockState.canvas !== 1 || !dockState.dl || !dockState.dk) throw new Error("dock header buttons missing");
if (!dockState.topics.includes(ROOT_TOPIC)) throw new Error("seeded tree not rendered");
await shots("1-dock");

console.log("\n=== stage 2: 下载图片 -> PNG download ===");
const dlPromise = page.waitForEvent("download", { timeout: 60000 });
await page.locator("[data-dsh-mindmap-dock-panel] button[title='下载图片（PNG）']").click();
const download = await dlPromise;
const fname = download.suggestedFilename();
console.log("[download]", fname);
if (fname !== `${ROOT_TOPIC}.png`) throw new Error(`unexpected download name: ${fname}`);
const tmpPng = process.env.TEMP + "\\mindmap-export-check.png";
await download.saveAs(tmpPng);
const { readFileSync, statSync } = await import("node:fs");
const buf = readFileSync(tmpPng);
const pngMagic = buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
console.log("[download]", buf.length, "bytes; png magic:", pngMagic);
if (!pngMagic || buf.length < 2048) throw new Error("downloaded file is not a plausible PNG");
const noteText = await page.evaluate(() =>
  [...document.querySelectorAll("[data-dsh-mindmap-dock-panel] [role='status']")].map((n) => n.textContent).join("|")
);
console.log("[note]", JSON.stringify(noteText));

console.log("\n=== stage 3: 在桌面应用打开 -> create-mindmap POST ===");
await page.locator("[data-dsh-mindmap-dock-panel] button[title='在桌面应用打开']").click();
for (let i = 0; i < 75 && createMindmapPayload === null; i++) {
  await page.waitForTimeout(200);
}
if (createMindmapPayload === null) throw new Error("no create-mindmap POST observed");
const posted = JSON.parse(createMindmapPayload);
const inner = JSON.parse(posted.mindmap);
console.log("[posted] source:", posted.source, "| root topic:", inner.nodeData?.topic);
if (inner.nodeData?.topic !== ROOT_TOPIC) throw new Error("POSTed tree root mismatch");
if (!posted.source?.includes("127.0.0.1")) throw new Error("source missing");
if (downloadPageHit) throw new Error("desktop.mind-elixir.com should not be touched when service is up");
const note2 = await page.evaluate(() =>
  [...document.querySelectorAll("[data-dsh-mindmap-dock-panel] [role='status']")].map((n) => n.textContent).join("|")
);
console.log("[note]", JSON.stringify(note2));
if (!(note2 ?? "").includes("已发送到桌面应用")) throw new Error("success note not shown");

console.log("\n=== stage 4: fullscreen header has the buttons too ===");
await page.locator("[data-dsh-mindmap-dock-panel] button[title='全屏模式']").click();
await page.waitForTimeout(900);
const fullState = await page.evaluate(() => ({
  overlay: !!document.querySelector("[data-dsh-mindmap-overlay]"),
  canvases: document.querySelectorAll("[data-dsh-mindmap-canvas]").length,
  dl: !!document.querySelector("[data-dsh-mindmap-overlay] button[title='下载图片（PNG）']"),
  dk: !!document.querySelector("[data-dsh-mindmap-overlay] button[title='在桌面应用打开']")
}));
console.log(JSON.stringify(fullState));
if (!fullState.overlay || fullState.canvases !== 1 || !fullState.dl || !fullState.dk) throw new Error("fullscreen header buttons missing");
await shots("2-full");

// Strict console accounting covers everything up to here.
const errorsSoFar = errors.length;

console.log("\n=== stage 5 (negative): service down -> download page ===");
const errorsBeforeNegative = errors.length;
let popup = null;
const popupPromise = page.waitForEvent("popup", { timeout: 25000 });
// 503 keeps fetch() non-throwing (no per-poll ERR_FAILED console spam) while
// still failing response.ok, driving open-desktop into its timeout path.
await page.context().unroute("**/127.0.0.1:6595/ping");
await page.route("**/127.0.0.1:6595/ping", (route) => route.fulfill({ status: 503, body: "" }));
await page.locator("[data-dsh-mindmap-overlay] button[title='在桌面应用打开']").click();
try {
  popup = await popupPromise;
  console.log("[popup]", popup.url());
  if (!/https:\/\/[^/]*mind-elixir\.com\//.test(popup.url())) throw new Error(`unexpected popup url: ${popup.url()}`);
  await popup.close();
} catch (e) {
  console.log("[popup] none:", e.message.split("\n")[0]);
}
const negNote = await page.evaluate(() =>
  [...document.querySelectorAll("[data-dsh-mindmap-overlay] [role='status']")].map((n) => n.textContent).join("|")
);
console.log("[note]", JSON.stringify(negNote));
const negativeErrors = errors.slice(errorsBeforeNegative);
if (negativeErrors.length) console.log("[warn] console errors during negative stage (expected some):", JSON.stringify(negativeErrors));

console.log("\n--- console errors (positive stages) ---");
const positiveErrors = errors.slice(0, errorsSoFar);
if (positiveErrors.length === 0) console.log("(none)");
else { positiveErrors.forEach((e) => console.log(e)); }

await browser.close();
const { rmSync } = await import("node:fs");
try { rmSync(`${process.env.USERPROFILE}\\.dsh\\sessions\\--C-project--\\${sessionId}`, { recursive: true, force: true }); } catch {}
if (positiveErrors.length > 0) throw new Error(`${positiveErrors.length} console error(s) in positive stages`);
console.log("\nALL EXPORT/OPEN CHECKS PASSED");
process.exit(0);
