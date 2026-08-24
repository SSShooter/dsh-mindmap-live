/**
 * Verify the MapActions busy behavior requested by the user:
 *   1. While a plugin call is in flight BOTH header buttons are DISABLED
 *      (`disabled` attribute set, dimmed) — no ellipsis relabeling.
 *   2. Their visible text stays exactly "⬇ 图片" / "🖥 桌面" before, during,
 *      and after the operation ("…" must never appear).
 *   3. After completion the buttons re-enable and the success note appears.
 * The desktop local service (127.0.0.1:6595/ping) is stalled ~3s so the
 * in-flight window is observable. Run from the mind-elixir-core workspace root,
 * against a live `dsh web`: node .dsh-plugins/dsh-mindmap-live/tests/verify-busy-disabled.mjs [port]
 */
import { chromium } from "@playwright/test";

const PORT = process.argv[2] ?? "3080";
const BASE = `http://127.0.0.1:${PORT}`;
const ROOT_TOPIC = "busy-check-root";

async function api(method, payload) {
  const res = await fetch(`${BASE}/api/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: "busycheck", method, payload })
  });
  const json = await res.json();
  if (!json.result?.ok) throw new Error(`${method} failed`);
  return json.result.value;
}
async function rpcUpdate(sessionId, tree) {
  await fetch(`${BASE}/mindmap/update`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: "busycheck", method: "update", payload: { sessionId, tree } })
  });
}

const tree = {
  nodeData: { id: "root", topic: ROOT_TOPIC, expanded: true, children: [] },
  arrows: [], summaries: [], direction: 2
};
const { sessionId } = await api("session.create", {});
await rpcUpdate(sessionId, tree);
console.log("[seed]", sessionId);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));

// Stall the desktop service ping so the busy window lasts ~3s.
let createMindmapPayload = null;
await page.route("**/127.0.0.1:6595/ping", async (route) => {
  await new Promise((r) => setTimeout(r, 3000));
  return route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
});
await page.route("**/127.0.0.1:6595/create-mindmap", (route) => {
  createMindmapPayload = route.request().postData();
  return route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
});

await page.addInitScript(([sid]) => {
  localStorage.setItem("dsh.sessions.current", JSON.stringify({ sessionId: sid }));
}, [sessionId]);
await page.goto(BASE, { waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(4500);

const readButtons = () => page.evaluate(() => {
  const grab = (sel) => {
    const b = document.querySelector(sel);
    return b ? { text: b.textContent, disabled: b.disabled, opacity: getComputedStyle(b).opacity } : null;
  };
  return {
    dl: grab("[data-dsh-mindmap-dock-panel] button[title='下载图片（PNG）']"),
    dk: grab("[data-dsh-mindmap-dock-panel] button[title='在桌面应用打开']")
  };
});

console.log("\n=== stage 1: dock open, idle state ===");
await page.locator("[data-dsh-mindmap-toggle]").first().click();
await page.waitForTimeout(1800);
const idle = await readButtons();
console.log(JSON.stringify(idle));
if (!idle.dl || !idle.dk) throw new Error("header buttons missing");
if (idle.dl.text !== "⬇ 图片" || idle.dk.text !== "🖥 桌面") throw new Error(`idle labels changed: ${JSON.stringify(idle)}`);
if (idle.dl.disabled || idle.dk.disabled) throw new Error("buttons should be enabled while idle");

console.log("\n=== stage 2: click 桌面 -> busy window ===");
await page.locator("[data-dsh-mindmap-dock-panel] button[title='在桌面应用打开']").click();
// Sample repeatedly across the stalled window.
let seenBusy = null;
for (let i = 0; i < 25 && !seenBusy; i++) {
  const st = await readButtons();
  if (st.dl.disabled && st.dk.disabled) seenBusy = st;
  else await page.waitForTimeout(100);
}
console.log("[busy]", JSON.stringify(seenBusy));
if (!seenBusy) throw new Error("no busy window observed — new bundle not served or disabled logic broken");
if (seenBusy.dl.text !== "⬇ 图片" || seenBusy.dk.text !== "🖥 桌面") {
  throw new Error(`labels must NOT change while busy: ${JSON.stringify(seenBusy)}`);
}
if (JSON.stringify(await page.evaluate(() => document.querySelector("[data-dsh-mindmap-dock-panel]").textContent)).includes("…")) {
  throw new Error("ellipsis appeared somewhere in the panel");
}

console.log("\n=== stage 3: completion -> re-enabled + success note ===");
for (let i = 0; i < 75 && !createMindmapPayload; i++) await page.waitForTimeout(200);
if (!createMindmapPayload) throw new Error("create-mindmap POST never arrived");
const postedInner = JSON.parse(JSON.parse(createMindmapPayload).mindmap);
if (postedInner.nodeData?.topic !== ROOT_TOPIC) throw new Error("posted tree mismatch");
let done = null;
for (let i = 0; i < 30; i++) {
  const st = await readButtons();
  if (!st.dl.disabled && !st.dk.disabled) { done = st; break; }
  await page.waitForTimeout(100);
}
const noteText = await page.evaluate(() =>
  [...document.querySelectorAll("[data-dsh-mindmap-dock-panel] [role='status']")].map((n) => n.textContent).join("|")
);
console.log("[done]", JSON.stringify(done), "[note]", JSON.stringify(noteText));
if (!done) throw new Error("buttons did not re-enable after completion");
if (!(noteText ?? "").includes("已发送到桌面应用")) throw new Error("success note missing");

if (errors.length) { errors.forEach((e) => console.log(e)); throw new Error("page errors observed"); }
await browser.close();
const { rmSync } = await import("node:fs");
try { rmSync(`${process.env.USERPROFILE}\\.dsh\\sessions\\--C-project--\\${sessionId}`, { recursive: true, force: true }); } catch {}
console.log("\nALL BUSY-DISABLED CHECKS PASSED");
process.exit(0);
