/**
 * Verify auto-open: when the agent creates a mind map for the current session
 * while the panel is hidden, the docked panel pops open once.
 *
 * Stages:
 *  1. closed baseline            — fresh session, panel hidden
 *  2. agent creates a map        — RPC push -> dock AUTO-OPENS with the tree
 *  3. close, then agent edit     — second push must NOT reopen (creation-only)
 *  4. reload with existing map   — seeded map is the baseline: stays hidden
 *  5. manual toggle still works
 *
 * Run from the mind-elixir-core workspace root:
 *   node .dsh-plugins/dsh-mindmap-live/tests/verify-auto-open.mjs [port]
 */
import { chromium } from "@playwright/test";
import { rmSync } from "node:fs";

const PORT = process.argv[2] ?? "3080";
const BASE = `http://127.0.0.1:${PORT}`;

async function api(method, payload) {
  const res = await fetch(`${BASE}/api/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: "autoopenverify", method, payload })
  });
  const json = await res.json();
  if (!json.result?.ok) throw new Error(`${method} failed: ${JSON.stringify(json).slice(0, 300)}`);
  return json.result.value;
}
async function rpcUpdate(sessionId, tree) {
  const res = await fetch(`${BASE}/mindmap/update`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: "autoopenverify", method: "update", payload: { sessionId, tree } })
  });
  const json = await res.json();
  if (!json.result?.ok) throw new Error(`rpc update failed: ${JSON.stringify(json).slice(0, 300)}`);
}

const makeTree = (rootTopic) => ({
  nodeData: {
    id: "root",
    topic: rootTopic,
    expanded: true,
    children: [{ id: "n1", topic: "分支一", children: [] }]
  },
  arrows: [],
  summaries: [],
  direction: 2
});

const panelState = (page) => page.evaluate(() => ({
  dockOpen: !!document.querySelector("[data-dsh-mindmap-dock-panel]"),
  fullOpen: !!document.querySelector("[data-dsh-mindmap-overlay]"),
  bodyAttr: document.body.hasAttribute("data-dsh-mindmap-dock"),
  topics: [...document.querySelectorAll("[data-dsh-mindmap-canvas] .me-tpc")].map((n) => n.textContent?.trim())
}));

// --- Seed: a fresh session with NO mind map ---------------------------------
const { sessionId } = await api("session.create", {});
console.log("[seed] session:", sessionId);

const browser = await chromium.launch();
// locale pinned: this spec clicks a button by its zh title; without it
// headless Chromium reports en-US and the plugin renders its English dictionary.
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, locale: "zh-CN" });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));

await page.addInitScript(([sid]) => {
  localStorage.setItem("dsh.sessions.current", JSON.stringify({ sessionId: sid }));
}, [sessionId]);

try {
  await page.goto(BASE, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(5000);

  console.log("\n=== stage 1: closed baseline ===");
  const s1 = await panelState(page);
  console.log(JSON.stringify(s1));
  if (s1.dockOpen || s1.fullOpen || s1.bodyAttr) throw new Error("panel should start hidden");

  console.log("\n=== stage 2: agent creates -> auto-open ===");
  await rpcUpdate(sessionId, makeTree("自动打开根节点"));
  await page.waitForSelector("[data-dsh-mindmap-dock-panel]", { timeout: 8000 });
  await page.waitForTimeout(1500);
  const s2 = await panelState(page);
  console.log(JSON.stringify(s2));
  if (!s2.dockOpen) throw new Error("dock did not auto-open on creation");
  if (!s2.topics.some((t) => t?.includes("自动打开根节点"))) throw new Error("auto-opened canvas misses created tree");
  console.log("[pass] creation auto-opened the dock with the new tree");

  console.log("\n=== stage 3: close; later agent edit must NOT reopen ===");
  await page.locator("[data-dsh-mindmap-dock-panel] button[title='关闭']").click();
  await page.waitForTimeout(600);
  const s3a = await panelState(page);
  if (s3a.dockOpen || s3a.bodyAttr) throw new Error("close failed");
  await rpcUpdate(sessionId, makeTree("AGENT第二次修改"));
  await page.waitForTimeout(2500);
  const s3b = await panelState(page);
  console.log(JSON.stringify(s3b));
  if (s3b.dockOpen || s3b.fullOpen) throw new Error("agent EDIT reopened the panel (should be creation-only)");
  console.log("[pass] edit did not reopen");

  console.log("\n=== stage 4: reload with existing map stays hidden ===");
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(5000);
  const s4 = await panelState(page);
  console.log(JSON.stringify(s4));
  if (s4.dockOpen || s4.fullOpen || s4.bodyAttr) throw new Error("reload auto-opened for an already-existing map");
  console.log("[pass] seeded map treated as baseline; no auto-open on reload");

  console.log("\n=== stage 5: manual toggle still works ===");
  await page.locator("[data-dsh-mindmap-toggle]").first().click();
  await page.waitForTimeout(1800);
  const s5 = await panelState(page);
  console.log(JSON.stringify(s5));
  if (!s5.dockOpen) throw new Error("manual toggle broken");
  if (!s5.topics.some((t) => t?.includes("AGENT第二次修改"))) throw new Error("manual open shows stale tree");

  console.log("\n--- console errors ---");
  if (errors.length === 0) console.log("(none)");
  else { errors.forEach((e) => console.log(e)); throw new Error(`${errors.length} console error(s)`); }

  console.log("\nALL AUTO-OPEN CHECKS PASSED");
} finally {
  await browser.close().catch(() => {});
  try { rmSync(`C:\\Users\\47235\\.dsh\\sessions\\--C-project--\\${sessionId}`, { recursive: true, force: true }); } catch {}
}
