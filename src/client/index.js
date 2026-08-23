/**
 * dsh-mindmap-live client factory.
 *
 * Plain CommonJS body (no JSX/TSX — we write React.createElement directly so
 * the bundle needs no compile chain). The build script wraps this body plus
 * the inlined MindElixir core into `window.__ModuleLoader__.load({ id, factory })`.
 *
 * Entry surface:
 *  - `sidebar.footer.action` (root, list): a button toggling the map view.
 *  - `shell.overlay` (root, list): hosts BOTH views —
 *      · dock  : a persistent right-hand panel so the user can watch and edit
 *                the map WHILE chatting (the chat column shifts left);
 *      · full  : the fullscreen overlay for focused work.
 *    Exactly one view renders at a time, so there is always a single canvas.
 *    It also renders a headless session-scope watcher (`MindMapAutoOpen`)
 *    that stays mounted while the panel is hidden.
 *
 * The views own a session-scope child slot that reads the host-computed
 * `mindmap` projection (`useProjection("mindmap")`). User edits on the canvas
 * are pushed back over the `/mindmap` Connection RPC channel, which appends a
 * `mindmap/update` event to the session log — the projection then broadcasts
 * the new tree to every client, keeping user and agent in real-time sync.
 *
 * Auto-open: when the agent creates a mind map for the current session while
 * the panel is hidden, the docked panel pops open once. The trigger is the
 * projection's absent→present edge observed by the headless watcher AFTER the
 * session history window is open (the projection seeds during open, so a page
 * reload or session switch replays an existing map as the baseline and never
 * auto-opens; only a genuinely new `mindmap/update` — which only `mindmap_set`,
 * i.e. the agent, can produce for an empty map — fires it).
 */

const { defineStore } = require("@deepseek-ai/dsh-client-runtime/client");
const React = require("react");

const OVERLAY_ID = "dsh-mindmap-live";
const SESSION_SLOT = "dsh-mindmap-live.session";
const AUTO_OPEN_SLOT = "dsh-mindmap-live.autoopen";
const PROJECTION_KEY = "mindmap";
const RPC_CHANNEL = "/mindmap";
const RPC_ENDPOINT = "update";

/** Width presets for the docked panel. */
const WIDTH_PRESETS = [
  { label: "窄", px: 360 },
  { label: "中", px: 520 },
  { label: "宽", px: 720 }
];
const DEFAULT_WIDTH = 520;

function createUiStore() {
  return defineStore({
    // v2: replaced the legacy boolean with an explicit view mode.
    init: () => ({ view: "hidden", width: DEFAULT_WIDTH }),
    persist: "dsh.mindmap-live.ui.v2",
    actions: {
      showDock: (d) => { d.view = "dock"; },
      showFull: (d) => { d.view = "full"; },
      hide: (d) => { d.view = "hidden"; },
      toggleDock: (d) => { d.view = d.view === "hidden" ? "dock" : "hidden"; },
      setWidth: (d, w) => { if (typeof w === "number") d.width = w; }
    }
  });
}

// ---------------------------------------------------------------------------
// MindElixir data helpers
// ---------------------------------------------------------------------------

/** A minimal default tree so the canvas always has a root to render. */
function defaultTree() {
  return {
    nodeData: {
      id: "root",
      topic: "思维导图",
      expanded: true,
      children: []
    },
    arrows: [],
    summaries: [],
    direction: 2,
    theme: undefined,
    compact: false,
    meta: undefined
  };
}

/** Deep-copy a tree so MindElixir never mutates the projection value. */
function cloneTree(tree) {
  if (tree === void 0 || tree === null) return defaultTree();
  try {
    return JSON.parse(JSON.stringify(tree));
  } catch (e) {
    return defaultTree();
  }
}

/**
 * Coerce a projection value into a renderable MindElixirData object.
 * Older writes may have stored the tree as a JSON string (models stringify
 * payloads); parse and validate here so bad history self-heals on display.
 * @param {*} raw - projection value.
 * @returns {object|null} usable tree, or null when nothing valid exists.
 */
function normalizeIncomingTree(raw) {
  if (raw === void 0 || raw === null) return null;
  let value = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  if (value.nodeData === null || typeof value.nodeData !== "object" || Array.isArray(value.nodeData)) return null;
  if (typeof value.nodeData.topic !== "string" || value.nodeData.topic.length === 0) {
    value = { ...value, nodeData: { ...value.nodeData, topic: "（未命名）" } };
  }
  return value;
}

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

/** Small icon button used across panel headers. */
function HeaderButton(props) {
  return React.createElement(
    "button",
    {
      type: "button",
      title: props.title,
      "aria-label": props.title,
      onClick: props.onClick,
      style: {
        cursor: "pointer",
        background: props.active ? "var(--dsw-alias-interactive-bg-hover, rgba(128,128,128,0.25))" : "transparent",
        border: "1px solid var(--dsw-alias-border-l2, transparent)",
        borderRadius: "6px",
        color: "inherit",
        fontSize: props.fontSize ?? "12px",
        lineHeight: 1,
        padding: "4px 7px"
      }
    },
    props.children
  );
}

/**
 * MindElixir canvas bound to a DOM ref. Renders the `mindmap` projection and
 * pushes user edits back to the host over the Connection RPC channel.
 */
function MindElixirCanvas(props) {
  const containerRef = React.useRef(null);
  const mindRef = React.useRef(null);
  const lastPushedRef = React.useRef(null);
  const suppressRef = React.useRef(false);

  // Create the MindElixir instance once the container mounts.
  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const MindElixirCtor = window.__DSH_MINDE_MINDELIXIR__;
    if (!MindElixirCtor) {
      el.textContent = "MindElixir 内核未加载";
      return undefined;
    }

    const mind = new MindElixirCtor({
      el,
      direction: MindElixirCtor.SIDE,
      editable: true,
      contextMenu: true,
      toolBar: true,
      keypress: true,
      allowUndo: true,
      // NOTE: do NOT pass overflowHidden — in mind-elixir v6 that option
      // skips initMouseEvent entirely, leaving the map dead to clicks
      // (fold/unfold, pan, drag all unbound). We clip via CSS instead.
      theme: MindElixirCtor.THEME
    });
    mindRef.current = mind;

    const data = cloneTree(props.tree);
    lastPushedRef.current = data;
    mind.init(data);
    if (mind.scaleFit) mind.scaleFit();

    // Listen for user operations and push the resulting tree back to the host.
    const onOperation = () => {
      if (suppressRef.current) return;
      try {
        const tree = mind.getData();
        lastPushedRef.current = tree;
        props.onUserEdit(tree);
      } catch (e) {
        console.error("[dsh-mindmap-live] push failed", e);
      }
    };
    mind.bus.addListener("operation", onOperation);
    // Fold/unfold fires `expandNode`, not `operation`; expandNodeAll fires
    // nothing at all, so wrap the method to keep the host in sync.
    mind.bus.addListener("expandNode", onOperation);
    if (typeof mind.expandNodeAll === "function") {
      const origExpandNodeAll = mind.expandNodeAll.bind(mind);
      mind.expandNodeAll = (...args) => {
        const result = origExpandNodeAll(...args);
        onOperation();
        return result;
      };
    }

    return () => {
      try { mind.bus.removeListener("operation", onOperation); } catch (e) { /* ignore */ }
      try { mind.bus.removeListener("expandNode", onOperation); } catch (e) { /* ignore */ }
      try { mind.destroy(); } catch (e) { /* ignore */ }
      mindRef.current = null;
    };
  }, []);

  // Refresh whenever the projection changes (agent or other-client edits).
  React.useLayoutEffect(() => {
    const mind = mindRef.current;
    if (!mind) return;
    const incoming = cloneTree(props.tree);
    const last = lastPushedRef.current;
    // Skip the refresh when the incoming tree is exactly what we last pushed
    // (a user edit echoed back through the projection).
    if (last !== null && JSON.stringify(incoming) === JSON.stringify(last)) return;
    suppressRef.current = true;
    try {
      mind.refresh(incoming);
      lastPushedRef.current = incoming;
      if (props.visible && mind.scaleFit) mind.scaleFit();
    } catch (e) {
      console.error("[dsh-mindmap-live] refresh failed", e);
    } finally {
      suppressRef.current = false;
    }
  }, [props.tree, props.visible]);

  return React.createElement(
    "div",
    {
      ref: containerRef,
      "data-dsh-mindmap-canvas": "",
      style: { width: "100%", height: "100%", overflow: "hidden", position: "relative" }
    }
  );
}

/** Session-scope child: receives useSession, useProjection, sessionId, connection. */
function MindMapSession(props) {
  const rawTree = props.useProjection(PROJECTION_KEY);
  const tree = React.useMemo(() => normalizeIncomingTree(rawTree), [rawTree]);
  const sessionId = props.sessionId;

  const pushEdit = React.useCallback((tree) => {
    if (!sessionId) return;
    const conn = props.connection;
    if (!conn || !conn.rpc) return;
    conn.rpc.call(RPC_CHANNEL, RPC_ENDPOINT, { sessionId, tree }).catch((e) => {
      console.error("[dsh-mindmap-live] rpc push failed", e);
    });
  }, [sessionId]);

  // No mind map has been created in this session yet — invite the user to
  // build one through conversation instead of showing a placeholder node.
  if (tree === undefined || tree === null) {
    return React.createElement(
      "div",
      {
        "data-dsh-mindmap-empty": "",
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          textAlign: "center",
          padding: "24px",
          color: "var(--dsw-alias-label-secondary, inherit)",
          userSelect: "none"
        }
      },
      React.createElement(
        "svg",
        { width: 44, height: 44, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4, opacity: 0.55, "aria-hidden": true },
        React.createElement("circle", { cx: "12", cy: "12", r: "2.6" }),
        React.createElement("circle", { cx: "4.5", cy: "6", r: "1.8" }),
        React.createElement("circle", { cx: "19.5", cy: "6", r: "1.8" }),
        React.createElement("circle", { cx: "4.5", cy: "18", r: "1.8" }),
        React.createElement("circle", { cx: "19.5", cy: "18", r: "1.8" }),
        React.createElement("path", { d: "M9.8 10.7L6 7.4M14.2 10.7L18 7.4M9.8 13.3L6 16.6M14.2 13.3L18 16.6" })
      ),
      React.createElement("div", { style: { fontSize: "14px", fontWeight: 600, color: "var(--dsw-alias-label-primary, inherit)" } }, "这个会话还没有思维导图"),
      React.createElement(
        "div",
        { style: { fontSize: "12.5px", lineHeight: 1.7, opacity: 0.85 } },
        "直接在对话里让我来画，例如：",
        React.createElement("br"),
        React.createElement(
          "span",
          { style: { opacity: 0.95 } },
          "“帮我画一张关于××的思维导图”"
        )
      ),
      React.createElement(
        "div",
        { style: { fontSize: "11.5px", opacity: 0.6 } },
        "创建后它会实时出现在这里，你的手动修改也会同步给 AI"
      )
    );
  }

  return React.createElement(MindElixirCanvas, { tree, visible: true, onUserEdit: pushEdit });
}

/**
 * Headless session-scope watcher: renders nothing, but stays mounted whenever
 * a session is staged — independent of panel visibility (both views return
 * null while hidden, so the canvas child cannot host this logic).
 *
 * Auto-open: when the agent creates a mind map for the current session while
 * the panel is hidden, pop the docked panel open once. Only the CREATION edge
 * triggers (projection absent → present); later agent edits never reopen a
 * panel the user closed.
 *
 * The trigger is gated on `openState === "open"`: the projection baseline is
 * seeded synchronously during history-window install, BEFORE the state flips
 * to "open", so the first post-open observation already reflects everything
 * persisted in the log. A page reload or a switch to a session that already
 * has a map therefore records it as the baseline and never auto-opens; only a
 * genuinely new `mindmap/update` event does. And because an empty map can
 * only be written by the agent's `mindmap_set` tool (user edits go through
 * the canvas RPC, which requires an existing tree), absent→present is exactly
 * "the agent created a mind map".
 */
function MindMapAutoOpen(props) {
  const rawTree = props.useProjection(PROJECTION_KEY);
  const tree = React.useMemo(() => normalizeIncomingTree(rawTree), [rawTree]);
  const openState = props.useSession((s) => s.openState);

  const watcherRef = React.useRef({ baselined: false, hadTree: false });
  React.useEffect(() => {
    const ui = props.ui;
    if (!ui || !ui.actions) return;
    const state = watcherRef.current;
    if (openState !== "open") return;
    if (!state.baselined) {
      // Baseline: whatever the seed had at open counts as pre-existing.
      state.baselined = true;
      state.hadTree = tree !== null;
      return;
    }
    if (!state.hadTree && tree !== null && ui.getSnapshot().view === "hidden") {
      ui.actions.showDock();
    }
    state.hadTree = tree !== null;
  }, [props.ui, openState, tree]);

  return null;
}

/**
 * Shared panel body: hint when no session is active, otherwise the
 * session-scoped slot (the live canvas).
 */
function panelBody(props) {
  if (props.currentId === undefined) {
    return React.createElement(
      "div",
      { style: { color: "inherit", opacity: 0.7, fontSize: "13px" } },
      "请先打开一个会话以查看思维导图。"
    );
  }
  return props.renderSlot(SESSION_SLOT, {});
}

// ---------------------------------------------------------------------------
// View 1: docked side panel (chat + map side by side)
// ---------------------------------------------------------------------------

function MindMapDock(props) {
  const view = props.useStore((s) => s.view);
  const width = props.useStore((s) => s.width);
  const currentId = props.useSessions((s) => s.current);

  // Tell the page we are docked: shifts the chat column left via injected CSS
  // and exposes the current width as a CSS variable.
  React.useEffect(() => {
    if (view === "dock") {
      document.body.setAttribute("data-dsh-mindmap-dock", "");
      document.body.style.setProperty("--dsh-mindmap-dock-w", `${width}px`);
    }
    return () => {
      document.body.removeAttribute("data-dsh-mindmap-dock");
    };
  }, [view, width]);

  if (view !== "dock") return null;

  const panelStyle = {
    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    width: `${width}px`,
    zIndex: 25,
    display: "flex",
    flexDirection: "column",
    background: "var(--dsw-alias-bg-base, #16161a)",
    color: "var(--dsw-alias-label-primary, inherit)",
    borderLeft: "1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.35))",
    boxShadow: "-8px 0 24px rgba(0,0,0,0.18)"
  };
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    borderBottom: "1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.3))",
    flex: "none"
  };
  const bodyStyle = { flex: "1", minHeight: "0", padding: "10px" };

  return React.createElement(
    "div",
    { "data-dsh-mindmap-dock-panel": "", style: panelStyle },
    React.createElement(
      "div",
      { style: headerStyle },
      React.createElement("strong", { style: { marginRight: "4px" } }, "思维导图"),
      WIDTH_PRESETS.map((p) =>
        React.createElement(
          HeaderButton,
          {
            key: p.label,
            title: `宽度 ${p.px}px`,
            active: width === p.px,
            onClick: () => props.actions.setWidth(p.px)
          },
          p.label
        )
      ),
      React.createElement(HeaderButton, { title: "全屏模式", onClick: () => props.actions.showFull() }, "⤢"),
      currentId === undefined && React.createElement(
        "span",
        { style: { fontSize: "12px", opacity: 0.7 } }, "（无活动会话）"
      ),
      React.createElement(
        HeaderButton,
        { title: "关闭", onClick: () => props.actions.hide(), style: { marginLeft: "auto" } },
        "✕"
      )
    ),
    React.createElement(
      "div",
      { style: bodyStyle },
      panelBody({ currentId, renderSlot: props.renderSlot })
    )
  );
}

// ---------------------------------------------------------------------------
// View 2: fullscreen overlay (focused mode)
// ---------------------------------------------------------------------------

function MindMapOverlay(props) {
  const view = props.useStore((s) => s.view);
  const currentId = props.useSessions((s) => s.current);

  if (view !== "full") return null;

  const overlayStyle = {
    position: "absolute",
    inset: "0",
    zIndex: 30,
    display: "flex",
    flexDirection: "column",
    background: "var(--dsw-alias-bg-base, rgba(20,20,20,0.97))",
    color: "var(--dsw-alias-label-primary, #fff)"
  };
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderBottom: "1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.3))",
    flex: "none"
  };
  const bodyStyle = { flex: "1", minHeight: 0, padding: "12px" };

  return React.createElement(
    "div",
    { "data-dsh-mindmap-overlay": "", style: overlayStyle },
    React.createElement(
      "div",
      { style: headerStyle },
      React.createElement("strong", null, "实时思维导图"),
      currentId === undefined &&
        React.createElement("span", { style: { fontSize: "12px", opacity: 0.7 } }, "（无活动会话）"),
      React.createElement(HeaderButton, { title: "回到侧栏模式", onClick: () => props.actions.showDock(), style: { marginLeft: "auto" } }, "⤡ 侧栏"),
      React.createElement(HeaderButton, { title: "关闭", onClick: () => props.actions.hide() }, "✕")
    ),
    React.createElement(
      "div",
      { style: bodyStyle },
      panelBody({ currentId, renderSlot: props.renderSlot })
    )
  );
}

// ---------------------------------------------------------------------------
// Sidebar toggle button
// ---------------------------------------------------------------------------

/** Sidebar footer action button toggling the docked panel. */
function MindMapButton(props) {
  const view = props.useStore((s) => s.view);
  const active = view !== "hidden";
  const onClick = () => props.actions.toggleDock();

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: props.wide ? 28 : 36,
    height: props.wide ? 28 : 36,
    margin: props.wide ? "0 2px" : "2px",
    cursor: "pointer",
    background: active ? "var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.06))" : "transparent",
    border: "none",
    borderRadius: "50%",
    color: active ? "var(--dsw-alias-label-primary, inherit)" : "var(--dsw-alias-label-secondary, inherit)"
  };

  return React.createElement(
    "button",
    {
      type: "button",
      title: active ? "关闭思维导图" : "打开思维导图（侧栏，可边聊边看）",
      "aria-label": active ? "关闭思维导图" : "打开思维导图",
      "data-dsh-mindmap-toggle": "",
      style: buttonStyle,
      onClick
    },
    React.createElement(
      "svg",
      { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true },
      React.createElement("circle", { cx: "12", cy: "12", r: "3" }),
      React.createElement("line", { x1: "12", y1: "9", x2: "12", y2: "3" }),
      React.createElement("line", { x1: "12", y1: "15", x2: "12", y2: "21" }),
      React.createElement("line", { x1: "9", y1: "12", x2: "3", y2: "12" }),
      React.createElement("line", { x1: "15", y1: "12", x2: "21", y2: "12" })
    )
  );
}

// ---------------------------------------------------------------------------
// apply
// ---------------------------------------------------------------------------

function apply(ctx) {
  const uiStore = createUiStore();

  // The view-mode store is registered once under the ROOT scope (by the
  // sidebar button and the overlay entries); slots enforce "one handle, one
  // scope", so the session-scoped watcher cannot declare it again. Resolve
  // the same shared root instance here and hand it to MindMapAutoOpen through
  // its slot's inject face instead.
  let sharedUi = void 0;
  let sharedUiFailed = false;
  const sharedUiStore = () => {
    if (sharedUi === void 0 && !sharedUiFailed) {
      try {
        sharedUi = ctx.slots.resolveStore(uiStore);
      } catch (e) {
        // No registered instance yet — degrade to no-auto-open rather than
        // crash the watcher entry.
        sharedUiFailed = true;
        console.warn("[dsh-mindmap-live] ui store unavailable, auto-open disabled", e);
      }
    }
    return sharedUi;
  };

  // Layout bridge CSS: when the dock is open, reserve its width so the chat
  // column never hides behind the panel. Hashed class names differ per build,
  // but the semantic suffix ("_centerCol") is stable — match on substring.
  // Narrow screens skip the shift; the panel simply floats above.
  if (typeof document !== "undefined" && !document.getElementById("dsh-mindmap-live-layout")) {
    const styleEl = document.createElement("style");
    styleEl.id = "dsh-mindmap-live-layout";
    styleEl.textContent = [
      "body[data-dsh-mindmap-dock] [class*=\"_centerCol\"] {",
      "  padding-right: var(--dsh-mindmap-dock-w, 520px);",
      "  transition: padding-right 0.16s ease;",
      "}",
      "@media (max-width: 1023px) {",
      "  body[data-dsh-mindmap-dock] [class*=\"_centerCol\"] { padding-right: 0; }",
      "}"
    ].join("\n");
    document.head.appendChild(styleEl);
  }

  ctx.slots.inject("sidebar.footer.action", () =>
    ctx.slots.register(
      {
        name: "sidebar.footer.action",
        id: OVERLAY_ID,
        order: 10,
        label: () => "思维导图",
        store: uiStore
      },
      MindMapButton
    )
  );

  ctx.slots.inject("shell.overlay", () =>
    ctx.slots.register(
      {
        name: "shell.overlay",
        id: OVERLAY_ID,
        order: 10,
        store: uiStore,
        children: {
          [SESSION_SLOT]: { kind: "single", scope: "session" },
          [AUTO_OPEN_SLOT]: { kind: "single", scope: "session" }
        }
      },
      // One parent renders both views; each returns null unless active, so
      // exactly one canvas instance exists at any time. The auto-open watcher
      // is headless and renders unconditionally — it must observe the
      // projection precisely while the panel is hidden.
      (props) => React.createElement(
        React.Fragment,
        null,
        React.createElement(MindMapDock, props),
        React.createElement(MindMapOverlay, props),
        props.renderSlot(AUTO_OPEN_SLOT, {})
      )
    )
  );

  ctx.slots.inject(SESSION_SLOT, () =>
    ctx.slots.register(
      {
        name: SESSION_SLOT,
        priority: 0,
        inject: () => ({ connection: ctx.get("connection") })
      },
      MindMapSession
    )
  );

  ctx.slots.inject(AUTO_OPEN_SLOT, () =>
    ctx.slots.register(
      {
        name: AUTO_OPEN_SLOT,
        priority: 0,
        inject: () => ({ ui: sharedUiStore() })
      },
      MindMapAutoOpen
    )
  );
}

module.exports = { apply, inject: ["slots", "sessions", "connection"] };
