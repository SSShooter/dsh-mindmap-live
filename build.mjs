/**
 * Build script for dsh-mindmap-live.
 *
 * Produces `lib/client.js` — a `window.__ModuleLoader__.load({ id, factory })`
 * bundle. The factory body is the plain-CJS source in `src/client/index.js`,
 * with the MindElixir core (ESM dist) inlined as a CJS module and its CSS
 * injected as a `<style>` tag.
 *
 * MindElixir comes from the npm `mind-elixir` devDependency (see
 * package.json) — bump that version, re-run this script, and republish to
 * pick up upstream updates. DSH client bundles are pre-built lazy-CJS
 * factories served from a hashed boot graph, so runtime-shared npm imports
 * are not servable today; inlining at build time is the supported shape.
 *
 * The plugin logo (`assets/icon.png`) is inlined as a base64 data URI and
 * exposed to the client body as `MINDMAP_ICON_URI` — the served-bundle model
 * has no asset route, so binary branding must ride inside the factory body.
 *
 * MindElixir dist is self-contained ESM (no imports); we rewrite its single
 * `export { ... }` line into `module.exports = { ... }` and expose it on
 * `window.__DSH_MINDE_MINDELIXIR__` so the React canvas can reach it.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const srcClient = join(root, "src", "client", "index.js");
const mindElixirDist = join(root, "node_modules", "mind-elixir", "dist", "MindElixir.js");
const mindElixirCss = join(root, "node_modules", "mind-elixir", "dist", "MindElixir.css");
const iconPng = join(root, "assets", "icon.png");
const outFile = join(root, "lib", "client.js");

const PLUGIN_ID = "dsh-mindmap-live";

// --- Read inputs -----------------------------------------------------------
for (const input of [srcClient, mindElixirDist, mindElixirCss, iconPng]) {
  if (!existsSync(input)) {
    throw new Error(`missing input: ${input}\ninstall dependencies first: npm install  (or: pnpm install --ignore-workspace)`);
  }
}
const clientBody = readFileSync(srcClient, "utf8");
const meJs = readFileSync(mindElixirDist, "utf8");
const meCss = readFileSync(mindElixirCss, "utf8");
const iconUri = `data:image/png;base64,${readFileSync(iconPng).toString("base64")}`;

// --- Rewrite MindElixir ESM -> CJS ----------------------------------------
// Single export line: `export { s as DARK_THEME, ... cr as default, m as generateUUID };`
const exportRe = /export\s*\{([\s\S]*?)\};/;
const exportMatch = meJs.match(exportRe);
if (!exportMatch) {
  throw new Error("MindElixir dist: no export statement found");
}
const specList = exportMatch[1]
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((spec) => {
    const m = spec.match(/^(\w+)\s+as\s+(\w+)$/);
    if (!m) throw new Error(`unexpected export spec: ${spec}`);
    return `${JSON.stringify(m[2])}: ${m[1]}`;
  })
  .join(", ");
const meCjs = meJs.replace(exportRe, `module.exports = { ${specList} };`);

// --- Assemble the factory body --------------------------------------------
const factoryBody = `
var MindElixir = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  ${meCjs}
  return module.exports;
})();
// Expose the MindElixir class (ESM default) plus its statics directly, so the
// canvas can construct it with new and read statics like SIDE/THEME off the class.
window.__DSH_MINDE_MINDELIXIR__ = MindElixir.default ?? MindElixir;
Object.assign(window.__DSH_MINDE_MINDELIXIR__, MindElixir);

// Inject MindElixir stylesheet once.
(function () {
  if (typeof document === "undefined") return;
  var tagId = ${JSON.stringify(PLUGIN_ID + "/MindElixir.css")};
  if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]")) return;
  var tag = document.createElement("style");
  tag.dataset.plugin = ${JSON.stringify(PLUGIN_ID)};
  tag.dataset.pluginCss = tagId;
  tag.textContent = ${JSON.stringify(meCss)};
  document.head.appendChild(tag);
})();

// Plugin logo as a data URI (see header comment).
var MINDMAP_ICON_URI = ${JSON.stringify(iconUri)};

${clientBody}
`;

// --- Emit the ModuleLoader bundle ------------------------------------------
const bundle = `window.__ModuleLoader__.load({
  id: ${JSON.stringify(PLUGIN_ID)},
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    ${factoryBody}
    return module.exports;
  }
});
`;

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, bundle, "utf8");
console.log(`built ${outFile} (${bundle.length} bytes)`);
