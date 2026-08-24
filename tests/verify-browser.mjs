/**
 * Browser-side verification for dsh-mindmap-live.
 *
 * Loads the web app, opens the mind map overlay for a seeded session, and
 * asserts both sync directions:
 *  1. RPC -> session log -> projection -> canvas renders the pushed tree.
 *  2. A later RPC push (simulating an agent edit) refreshes the live canvas.
 *
 * Run from the mind-elixir-core workspace root (resolves @playwright/test):
 *   node .dsh-plugins/dsh-mindmap-live/tests/verify-browser.mjs [port]
 */
import { chromium } from "@playwright/test";

const PORT = process.argv[2] ?? "3090";
const BASE = `http://127.0.0.1:${PORT}`;

async function api(method, payload) {
  const res = await fetch(`${BASE}/api/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: "verify", method, payload })
  });
  const json = await res.json();
  if (!json.result?.ok) throw new Error(`${method} failed: ${JSON.stringify(json).slice(0, 300)}`);
  return json.result.value;
}

async function rpcUpdate(sessionId, tree) {
  const res = await fetch(`${BASE}/mindmap/update`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: "verify", method: "update", payload: { sessionId, tree } })
  });
  const json = await res.json();
  if (!json.result?.ok) throw new Error(`rpc update failed: ${JSON.stringify(json).slice(0, 300)}`);
}

const makeTree = (rootTopic) => ({
  nodeData: {
    id: "root",
    topic: rootTopic,
    expanded: true,
    children: [
      { id: "n1", topic: "分支一", children: [] },
      { id: "n2", topic: "分支二", children: [] }
    ]
  },
  arrows: [],
  summaries: [],
  direction: 2
});

// --- Seed: one session with an initial tree --------------------------------
const { sessionId } = await api("session.create", {});
await rpcUpdate(sessionId, makeTree("E2E根节点"));
console.log("[seed] session:", sessionId);

// --- Browser ----------------------------------------------------------------
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));

// Pre-select the seeded session so the session-scoped slot mounts.
await page.addInitScript(([sid]) => {
  localStorage.setItem("dsh.sessions.current", JSON.stringify({ sessionId: sid }));
}, [sessionId]);

console.log("[browser] navigating to", BASE);
await page.goto(BASE, { waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(5000);

const boot = await page.evaluate(() => {
  const entries = globalThis.__DSH_BOOT__?.entries?.map((e) => e.id) ?? [];
  return {
    hasBoot: !!globalThis.__DSH_BOOT__,
    includesPlugin: entries.includes("dsh-mindmap-live"),
    mindElixir: typeof globalThis.__DSH_MINDE_MINDELIXIR__
  };
});
console.log("[check] __DSH_BOOT__:", boot.hasBoot);
console.log("[check] boot includes dsh-mindmap-live:", boot.includesPlugin);
console.log("[check] window.__DSH_MINDE_MINDELIXIR__ type:", boot.mindElixir);
if (!boot.includesPlugin) throw new Error("plugin missing from boot manifest");

// Open the docked panel (the sidebar toggle opens dock view since v2).
await page.locator("[data-dsh-mindmap-toggle]").first().click();
await page.waitForTimeout(2500);

const state1 = await page.evaluate(() => {
  const overlay = document.querySelector("[data-dsh-mindmap-dock-panel]");
  const canvas = document.querySelector("[data-dsh-mindmap-canvas]");
  return {
    hasOverlay: !!overlay,
    overlayText: overlay ? overlay.textContent.slice(0, 160) : null,
    hasCanvas: !!canvas,
    meNodes: document.querySelectorAll("[data-dsh-mindmap-canvas] .me-nodes").length,
    slotAnchors: [...document.querySelectorAll("[data-slot]")].map((n) => n.getAttribute("data-slot")),
    slotErrors: [...document.querySelectorAll("[data-slot-error]")].map((n) => n.getAttribute("data-slot-error")),
    topics: [...document.querySelectorAll("[data-dsh-mindmap-canvas] .me-tpc")].map((n) => n.textContent?.trim()).slice(0, 6)
  };
});
console.log("[check] dock open:", state1.hasOverlay);
console.log("[check] overlay text:", JSON.stringify(state1.overlayText));
console.log("[check] slot anchors:", JSON.stringify(state1.slotAnchors));
console.log("[check] slot errors:", JSON.stringify(state1.slotErrors));
console.log("[check] canvas mounted:", state1.hasCanvas, "me-nodes:", state1.meNodes);
console.log("[check] node topics:", JSON.stringify(state1.topics));
if (!state1.hasOverlay || !state1.hasCanvas || state1.meNodes === 0) {
  console.log("[fail-state] overlay text:", state1.overlayText);
  console.log("[fail-state] console errors so far:", JSON.stringify(errors, null, 2));
  await page.screenshot({ path: ".dsh-plugins/dsh-mindmap-live/verify-fail.png", fullPage: true }).catch(() => {});
  throw new Error("canvas did not render");
}
if (!state1.topics.some((t) => t?.includes("E2E根节点"))) {
  throw new Error("pushed root topic not rendered");
}
console.log("[pass] direction 1: RPC -> projection -> canvas renders");

// Direction 2: a later push (what an agent edit does) must refresh the canvas.
await rpcUpdate(sessionId, makeTree("AGENT已更新"));
await page.waitForTimeout(2000);
const state2 = await page.evaluate(() => ({
  topics: [...document.querySelectorAll("[data-dsh-mindmap-canvas] .me-tpc")].map((n) => n.textContent?.trim()).slice(0, 6)
}));
console.log("[check] topics after agent-style push:", JSON.stringify(state2.topics));
if (!state2.topics.some((t) => t?.includes("AGENT已更新"))) {
  throw new Error("canvas did not refresh after push");
}
console.log("[pass] direction 2: host push -> canvas refreshes live");

console.log("\n--- console errors ---");
if (errors.length === 0) console.log("(none)");
else { errors.forEach((e) => console.log(e)); throw new Error(`${errors.length} console error(s)`); }

await browser.close();
console.log("\nALL BROWSER CHECKS PASSED");
process.exit(0);
