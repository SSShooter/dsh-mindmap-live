// Throwaway validation for the i18n dictionaries in src/client/index.js:
// key-set balance, template-param parity, and a simulation of the locale
// lookup chain (active -> en -> key) over both dictionaries.
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/client/index.js", import.meta.url), "utf8");
const grab = (name) => {
  const m = src.match(new RegExp("const " + name + " = (\\{[\\s\\S]*?\\n\\});"));
  if (!m) throw new Error(name + " block not found");
  // eslint-disable-next-line no-eval -- throwaway check
  return eval("(" + m[1] + ")");
};
const zh = grab("ZH_DICT");
const en = grab("EN_DICT");
const zk = Object.keys(zh).sort();
const ek = Object.keys(en).sort();
if (JSON.stringify(zk) !== JSON.stringify(ek)) {
  console.log("missing in en:", zk.filter((k) => !en[k]));
  console.log("missing in zh:", ek.filter((k) => !zh[k]));
  throw new Error("dictionary key sets differ");
}
for (const k of zk) {
  if (typeof zh[k] !== "string" || typeof en[k] !== "string") throw new Error("non-string value: " + k);
  const pz = (zh[k].match(/\{(\w+)\}/g) ?? []).sort();
  const pe = (en[k].match(/\{(\w+)\}/g) ?? []).sort();
  if (pz.join() !== pe.join()) throw new Error(`template params differ for ${k}: ${pz} vs ${pe}`);
}
console.log("dictionaries balanced:", zk.length, "keys; templates match");

function makeT(active, dicts) {
  return (key, params) => {
    const tpl = dicts[active]?.[key] ?? dicts.en[key] ?? key;
    return tpl.replace(/\{(\w+)\}/g, (m, n) => (n in (params ?? {}) ? String(params[n]) : m));
  };
}
const tZh = makeT("zh", { zh, en });
const tEn = makeT("en", { zh, en });
console.log("zh exportFailed :", tZh("note.exportFailed", { message: "boom" }));
console.log("en exportFailed :", tEn("note.exportFailed", { message: "boom" }));
console.log("en download     :", tEn("action.download.title"), "|", tEn("action.download.label"));
console.log("en empty heading:", tEn("empty.heading"));
console.log("zh empty example:", tZh("empty.example"));
console.log("en data labels  :", tEn("data.rootTopic"), "/", tEn("data.unnamed"));

// Every key referenced via t("...") / dt("...") in the source must exist.
const used = new Set();
for (const m of src.matchAll(/\b(?:t|dt)\("([a-zA-Z.]+)"/g)) used.add(m[1]);
const missing = [...used].filter((k) => !(k in zh));
if (missing.length) throw new Error("keys used but not defined: " + missing.join(", "));
console.log("all", used.size, "referenced keys defined");

// --- apply() wiring smoke test against a mocked client context -------------
// The real dependencies are browser bundles, so execute the plugin body as
// CommonJS inside vm with stubbed requires and a cordis-shaped fake ctx.
import vm from "node:vm";
const sandbox = {
  React: { createElement: () => null, Fragment: "#fragment", useState: () => [null, () => {}], useRef: () => ({ current: null }), useCallback: (f) => f, useMemo: (f) => f(), useEffect: () => {}, useLayoutEffect: () => {} },
  console,
  window: undefined,
  document: undefined,
  setTimeout,
  clearTimeout,
  JSON,
  Math,
  Number,
  Object,
  Array,
  Promise,
  navigator: undefined
};
sandbox.globalThis = sandbox;
const fakeRequire = (id) => {
  if (id === "@deepseek-ai/dsh-client-runtime/client") return { defineStore: () => ({}) };
  if (id === "react") return sandbox.React;
  throw new Error("unexpected require in harness: " + id);
};
// The source ends with `module.exports = { apply, inject }`; the completion
// value of that assignment is the plugin's export face.
const plugin = vm.runInNewContext(
  src + "\nmodule.exports;",
  { ...sandbox, module: { exports: {} }, exports: {}, require: fakeRequire }
);

let activeLocale = "zh";
let registeredDicts = null;
const registrations = [];
const injectedKeys = [];
const ctx = {
  effect: (fn) => fn(),
  get: () => ({}),
  locale: {
    register: (ns, dicts) => { registeredDicts = { ns, dicts }; return () => {}; },
    bind: () => (key, params) => {
      const tpl = registeredDicts.dicts[activeLocale]?.[key] ?? key;
      return tpl.replace(/\{(\w+)\}/g, (m, n) => (n in (params ?? {}) ? String(params[n]) : m));
    }
  },
  slots: {
    // Real semantics: the callback runs once its target declaration exists;
    // every target here is declared by the shell, so run it immediately.
    inject: (key, cb) => { injectedKeys.push(key); cb(); },
    register: (opts) => { registrations.push(opts); return () => {}; }
  }
};
plugin.apply(ctx);

if (!registeredDicts || registeredDicts.ns !== "mindmap.live") throw new Error("dictionaries not registered under mindmap.live");
for (const ns of ["sidebar.footer.action", "shell.overlay", "dsh-mindmap-live.session"]) {
  const entry = registrations.find((r) => r.name === ns);
  if (!entry) throw new Error(`registration missing: ${ns}`);
  if (entry.locale !== "mindmap.live") throw new Error(`${ns} does not declare the locale namespace`);
}
if (!registrations.find((r) => r.name === "sidebar.footer.action").label()) throw new Error("label thunk missing");
console.log("apply() wiring OK:", registrations.length, "registrations;", injectedKeys.length, "slot injections");
