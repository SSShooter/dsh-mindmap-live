import { chromium } from "@playwright/test";
import fs from "node:fs";
const SID = fs.readFileSync(process.env.TEMP + "/sh-sid.txt", "utf8").trim();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
await page.addInitScript(([sid]) => {
  localStorage.setItem("dsh.sessions.current", JSON.stringify({ sessionId: sid }));
}, [SID]);
await page.goto("http://127.0.0.1:3080/", { waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(4500);
await page.locator("[data-dsh-mindmap-toggle]").first().click();
await page.waitForTimeout(2000);
const state = await page.evaluate(() => ({
  hintShown: !!document.querySelector("[data-dsh-mindmap-empty]"),
  topics: [...document.querySelectorAll("[data-dsh-mindmap-canvas] .me-tpc")].map((n) => n.textContent?.trim())
}));
console.log("[check] hint shown (want false):", state.hintShown);
console.log("[check] topics (string tree rendered):", JSON.stringify(state.topics));
if (state.hintShown || !state.topics.includes("???????")) { 
  console.log("FAIL"); process.exitCode = 1; 
} else { console.log("STRING SELF-HEAL OK"); }
await browser.close();
try { fs.rmSync("C:\\Users\\47235\\.dsh\\sessions\\--C-project--\\" + SID, { recursive: true, force: true }); } catch {}
