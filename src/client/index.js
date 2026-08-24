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
 *  - Both view headers carry `MapActions`: download the live map as a PNG
 *    (@mind-elixir/export-mindmap) and open it in the Mind Elixir Desktop app
 *    (@mind-elixir/open-desktop).
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

/* global MINDMAP_ICON_URI, MINDMAP_EXPORT_PLUGIN, MINDMAP_OPEN_DESKTOP_PLUGIN */
/**
 * Plugin logo, injected by build.mjs (inlined base64 data URI of
 * assets/icon.png) ahead of this body inside the same factory scope.
 *
 * Official @mind-elixir plugins, also inlined by build.mjs:
 *  - MINDMAP_EXPORT_PLUGIN      (@mind-elixir/export-mindmap) — downloadImage
 *    renders the live map via its built-in SCST engine (SVG foreignObject +
 *    canvas) and triggers a browser download.
 *  - MINDMAP_OPEN_DESKTOP_PLUGIN (@mind-elixir/open-desktop)  — launchMindElixir
 *    wakes the Mind Elixir Desktop app (mind-elixir:// protocol), waits for
 *    its local service and POSTs the tree; opens the download page when the
 *    app is not installed.
 */

/** Docked panel width: free-drag via the edge divider, clamped to these bounds. */
const DEFAULT_WIDTH = 520;
const MIN_DOCK_WIDTH = 300;

/** Hard cap so the map panel can never swallow the whole viewport. */
function maxDockWidth() {
  const vw = typeof window !== "undefined" && window.innerWidth ? window.innerWidth : 1920;
  return Math.max(MIN_DOCK_WIDTH, Math.round(vw * 0.8));
}

function clampWidth(w) {
  if (typeof w !== "number" || !Number.isFinite(w)) return DEFAULT_WIDTH;
  return Math.min(maxDockWidth(), Math.max(MIN_DOCK_WIDTH, Math.round(w)));
}

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
  const parsed = normalizeIncomingTree(tree);
  if (parsed === null) return defaultTree();
  try {
    return sanitizeTree(JSON.parse(JSON.stringify(parsed)));
  } catch (e) {
    return defaultTree();
  }
}

/**
 * A theme object is only usable when it carries a non-empty palette of color
 * strings. The kernel applies `data.theme` verbatim (changeTheme does no
 * validation), and linkDiv then reads `theme.palette.length` — a partial
 * theme (e.g. `{ name, type }` without palette, or a bare string) crashes
 * rendering. Anything not provably complete is dropped in favor of the
 * built-in default theme.
 */
function usableTheme(theme) {
  return (
    theme !== null &&
    typeof theme === "object" &&
    !Array.isArray(theme) &&
    Array.isArray(theme.palette) &&
    theme.palette.length > 0 &&
    theme.palette.every((c) => typeof c === "string")
  );
}

let sanitizeIdSeq = 0;

/** Recursively repair one node; collects ids so arrows/summaries can be checked. */
function sanitizeNode(node, usedIds) {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    const fallbackId = "n" + ++sanitizeIdSeq;
    usedIds.push(fallbackId);
    return { id: fallbackId, topic: "（未命名）", expanded: true, children: [] };
  }
  const out = Object.assign({}, node);
  if (typeof out.topic !== "string") out.topic = out.topic === void 0 || out.topic === null ? "" : String(out.topic);
  if (out.topic.length === 0) out.topic = "（未命名）";
  if (typeof out.id !== "string" || out.id.length === 0 || usedIds.indexOf(out.id) !== -1) {
    let candidate;
    do { candidate = "n" + ++sanitizeIdSeq; } while (usedIds.indexOf(candidate) !== -1);
    out.id = candidate;
  }
  usedIds.push(out.id);
  const rawChildren = Array.isArray(out.children) ? out.children : [];
  out.children = [];
  for (let i = 0; i < rawChildren.length; i++) {
    const child = rawChildren[i];
    if (child && typeof child === "object" && !Array.isArray(child)) {
      out.children.push(sanitizeNode(child, usedIds));
    }
  }
  return out;
}

/**
 * Repair arbitrary model/user JSON into the exact shape MindElixir v6 assumes.
 * The kernel has no friendly validation for these — malformed values crash
 * deep inside layout/linkDiv (e.g. `theme.palette` without a palette array,
 * non-array children/arrows/summaries) — so EVERY value that reaches
 * init()/refresh() goes through here and comes out renderable:
 *   - each node: string topic, unique string id, children always an array
 *   - arrows/summaries: arrays of objects with the fields renderers read,
 *     dropped when they reference nodes that no longer exist
 *   - theme: kept only when complete (see usableTheme), else omitted
 *   - direction: dropped unless it is 0..3
 */
function sanitizeTree(tree) {
  if (!tree || typeof tree !== "object" || Array.isArray(tree)) return defaultTree();
  const usedIds = [];
  const out = Object.assign({}, tree, { nodeData: sanitizeNode(tree.nodeData || {}, usedIds) });
  const exists = (id) => usedIds.indexOf(id) !== -1;
  const arrows = Array.isArray(tree.arrows) ? tree.arrows : [];
  out.arrows = arrows.filter(
    (a) => a && typeof a === "object" && !Array.isArray(a) &&
      typeof a.from === "string" && exists(a.from) &&
      typeof a.to === "string" && exists(a.to)
  );
  const summaries = Array.isArray(tree.summaries) ? tree.summaries : [];
  out.summaries = summaries.filter(
    (s) => s && typeof s === "object" && !Array.isArray(s) &&
      typeof s.parent === "string" && exists(s.parent) &&
      typeof s.start === "number" && typeof s.end === "number"
  );
  if (!usableTheme(out.theme)) delete out.theme;
  if (out.direction !== void 0 && [0, 1, 2, 3].indexOf(out.direction) === -1) delete out.direction;
  return out;
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

/**
 * Registry of the live MindElixir instance. Exactly one canvas exists at any
 * time (dock and fullscreen never render together), so a single slot is
 * enough: MindElixirCanvas publishes on mount, clears on unmount, and the
 * header action buttons read the instance at click time.
 */
const activeCanvas = { mind: null };

/** Small icon button used across panel headers. */
function HeaderButton(props) {
  return React.createElement(
    "button",
    {
      type: "button",
      title: props.title,
      "aria-label": props.title,
      onClick: props.onClick,
      // Busy actions disable instead of relabeling, so the glyph never jumps.
      disabled: props.disabled ? true : undefined,
      style: {
        cursor: props.disabled ? "default" : "pointer",
        opacity: props.disabled ? 0.45 : undefined,
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

  // Create the MindElixir instance once the container mounts. init() is
  // async and can still throw AFTER an internal await (e.g. fonts.ready), so
  // a bare call would surface as "Uncaught (in promise)"; boot() attaches a
  // rejection handler that falls back to the default tree on a fresh
  // instance, keeping the canvas alive even for hostile data.
  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const MindElixirCtor = window.__DSH_MINDE_MINDELIXIR__;
    if (!MindElixirCtor) {
      el.textContent = "MindElixir 内核未加载";
      return undefined;
    }

    let disposed = false;
    let teardownInstance = null;

    const makeInstance = () => new MindElixirCtor({
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

    // Listen for user operations and push the resulting tree back to the host.
    // Returns the unbind function for this instance.
    const bind = (mind) => {
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
      let restoreExpandNodeAll;
      if (typeof mind.expandNodeAll === "function") {
        const origExpandNodeAll = mind.expandNodeAll.bind(mind);
        mind.expandNodeAll = (...args) => {
          const result = origExpandNodeAll(...args);
          onOperation();
          return result;
        };
        restoreExpandNodeAll = () => { delete mind.expandNodeAll; };
      }
      return () => {
        try { mind.bus.removeListener("operation", onOperation); } catch (e) { /* ignore */ }
        try { mind.bus.removeListener("expandNode", onOperation); } catch (e) { /* ignore */ }
        if (restoreExpandNodeAll) restoreExpandNodeAll();
      };
    };

    const adopt = (mind) => {
      mindRef.current = mind;
      activeCanvas.mind = mind;
      teardownInstance = bind(mind);
    };

    const boot = (data) => {
      const mind = makeInstance();
      adopt(mind);
      lastPushedRef.current = data;
      Promise.resolve(mind.init(data))
        .then(() => {
          // init awaits document.fonts.ready internally, so fitting only
          // makes sense once it has resolved.
          if (!disposed && mind.scaleFit) {
            try { mind.scaleFit(); } catch (e) { /* ignore */ }
          }
        })
        .catch((e) => {
        console.error("[dsh-mindmap-live] init failed, falling back to empty map", e);
        if (disposed) return;
        // The failed instance may be half-initialized (layout ran, linkDiv
        // threw mid-way) and is not safely reusable: destroy it and start a
        // fresh one on the same element with known-good data.
        try { teardownInstance && teardownInstance(); } catch (e2) { /* ignore */ }
        try { mind.destroy(); } catch (e2) { /* ignore */ }
        if (mindRef.current === mind) mindRef.current = null;
        if (activeCanvas.mind === mind) activeCanvas.mind = null;
        const fallback = JSON.stringify(defaultTree());
        if (JSON.stringify(data) !== fallback) {
          boot(defaultTree());
        } else {
          el.textContent = "思维导图初始化失败，请刷新页面重试";
        }
      });
    };

    boot(cloneTree(props.tree));

    return () => {
      disposed = true;
      const mind = mindRef.current;
      try { teardownInstance && teardownInstance(); } catch (e) { /* ignore */ }
      try { mind && mind.destroy(); } catch (e) { /* ignore */ }
      if (activeCanvas.mind === mind) activeCanvas.mind = null;
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

/**
 * Header action pair backed by the official @mind-elixir plugins:
 *  - 下载图片: render the live canvas to PNG via export-mindmap's SCST engine
 *    and trigger a browser download (named after the root topic).
 *  - 在桌面应用打开: hand the current tree to Mind Elixir Desktop through
 *    open-desktop (protocol wake-up + local service POST).
 *
 * Both act on the single live canvas via `activeCanvas`; while a plugin call
 * is in flight both buttons are disabled (dimmed, label unchanged) so no
 * second export/launch can start. A short-lived inline note reports
 * success/failure without blocking UI.
 */
function MapActions() {
  const [busy, setBusy] = React.useState(null);
  const [note, setNote] = React.useState(null);
  const noteTimerRef = React.useRef(null);

  React.useEffect(() => () => {
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
  }, []);

  const flash = React.useCallback((kind, text) => {
    setNote({ kind, text });
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    noteTimerRef.current = setTimeout(() => setNote(null), 4000);
  }, []);

  const onDownloadImage = async () => {
    if (busy) return;
    const mind = activeCanvas.mind;
    if (!mind || typeof MINDMAP_EXPORT_PLUGIN === "undefined") {
      flash("err", "画布尚未就绪");
      return;
    }
    setBusy("png");
    try {
      await MINDMAP_EXPORT_PLUGIN.downloadImage(mind, "png");
      flash("ok", "PNG 已开始下载");
    } catch (e) {
      console.error("[dsh-mindmap-live] image export failed", e);
      flash("err", "导出失败" + (e && e.message ? "：" + e.message : ""));
    } finally {
      setBusy(null);
    }
  };

  const onOpenDesktop = async () => {
    if (busy) return;
    const mind = activeCanvas.mind;
    if (!mind || typeof MINDMAP_OPEN_DESKTOP_PLUGIN === "undefined") {
      flash("err", "画布尚未就绪");
      return;
    }
    let tree;
    try {
      tree = mind.getData();
    } catch (e) {
      flash("err", "读取导图失败");
      return;
    }
    setBusy("desktop");
    try {
      await MINDMAP_OPEN_DESKTOP_PLUGIN.launchMindElixir(tree, window.location.href);
      flash("ok", "已发送到桌面应用");
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      console.error("[dsh-mindmap-live] open-desktop failed", e);
      flash("err", msg.indexOf("未安装") !== -1 ? "未安装桌面应用，已打开下载页" : "打开失败：" + msg);
    } finally {
      setBusy(null);
    }
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(HeaderButton, {
      title: "下载图片（PNG）",
      disabled: busy !== null,
      onClick: onDownloadImage
    }, "⬇ 图片"),
    React.createElement(HeaderButton, {
      title: "在桌面应用打开",
      disabled: busy !== null,
      onClick: onOpenDesktop
    }, "🖥 桌面"),
    note && React.createElement(
      "span",
      {
        role: "status",
        style: {
          fontSize: "11.5px",
          lineHeight: 1.4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "180px",
          color: note.kind === "err"
            ? "var(--dsw-specific-danger, #e5484d)"
            : "var(--dsw-alias-label-secondary, inherit)"
        }
      },
      note.text
    )
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
        "img",
        {
          src: MINDMAP_ICON_URI,
          alt: "",
          draggable: false,
          width: 56,
          height: 56,
          style: { borderRadius: "14px", opacity: 0.9 }
        }
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

/**
 * Draggable divider on the dock panel's left edge.
 *
 * Pointer drag resizes the panel live: each pointermove patches the width
 * straight onto the panel element and the layout-bridge CSS variable, so no
 * React re-render or store persist happens per frame; the final value is
 * committed to the ui store once on release. Double-click resets to
 * DEFAULT_WIDTH.
 */
function DockResizer(props) {
  const [dragging, setDragging] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const dragRef = React.useRef(null);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startW: props.getWidth() };
    setDragging(true);
  };

  React.useEffect(() => {
    if (!dragging) return undefined;
    document.body.setAttribute("data-dsh-mindmap-resizing", "");
    const onMove = (ev) => {
      const st = dragRef.current;
      if (!st) return;
      props.onPreview(clampWidth(st.startW + (st.startX - ev.clientX)));
    };
    const finish = (ev) => {
      const st = dragRef.current;
      dragRef.current = null;
      setDragging(false);
      if (!st || !ev) return;
      props.onCommit(clampWidth(st.startW + (st.startX - ev.clientX)));
    };
    // Pointercancel carries no coordinates — abort without committing.
    const onCancel = () => finish(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      document.body.removeAttribute("data-dsh-mindmap-resizing");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", onCancel);
    };
  }, [dragging]);

  // The bar sits centered on the panel border: handle spans -6px..+6px around
  // it, so a 3px bar goes at left 4.5px inside the handle.
  const barColor = dragging
    ? "var(--dsw-specific-sidebar-nav-item-active, rgba(128,128,128,0.55))"
    : hover
      ? "var(--dsw-alias-border-l2, rgba(128,128,128,0.4))"
      : "transparent";

  return React.createElement(
    "div",
    {
      "data-dsh-mindmap-resizer": "",
      title: "拖拽调整宽度，双击恢复默认",
      "aria-orientation": "vertical",
      onPointerDown,
      onDoubleClick: () => props.onCommit(DEFAULT_WIDTH),
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "-6px",
        width: "12px",
        cursor: "col-resize",
        zIndex: 6,
        touchAction: "none",
        userSelect: "none"
      }
    },
    React.createElement("div", {
      "data-dsh-mindmap-resizer-bar": "",
      style: {
        position: "absolute",
        left: "4.5px",
        top: "0",
        bottom: "0",
        width: "3px",
        borderRadius: "999px",
        background: barColor,
        transition: dragging ? "none" : "background-color 0.15s ease"
      }
    })
  );
}

function MindMapDock(props) {
  const view = props.useStore((s) => s.view);
  const width = props.useStore((s) => s.width);
  const currentId = props.useSessions((s) => s.current);
  const panelRef = React.useRef(null);

  // Live preview during a divider drag: patch the panel width and the layout
  // CSS variable directly so no re-render/persist happens per pointermove;
  // DockResizer commits the final value to the store on release.
  const previewDragWidth = React.useCallback((w) => {
    const px = `${clampWidth(w)}px`;
    if (panelRef.current) panelRef.current.style.width = px;
    document.body.style.setProperty("--dsh-mindmap-dock-w", px);
  }, []);

  // Tell the page we are docked: shifts the chat column left via injected CSS
  // and exposes the current width as a CSS variable. The stored width is
  // clamped at render time so a shrunken viewport can't leave a stale
  // over-wide value on screen (the store itself only updates on drag commit).
  React.useEffect(() => {
    if (view === "dock") {
      document.body.setAttribute("data-dsh-mindmap-dock", "");
      document.body.style.setProperty("--dsh-mindmap-dock-w", `${clampWidth(width)}px`);
    }
    return () => {
      document.body.removeAttribute("data-dsh-mindmap-dock");
    };
  }, [view, width]);

  if (view !== "dock") return null;

  const effWidth = clampWidth(width);

  const panelStyle = {
    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    width: `${effWidth}px`,
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
    { ref: panelRef, "data-dsh-mindmap-dock-panel": "", style: panelStyle },
    React.createElement(DockResizer, {
      getWidth: () => effWidth,
      onPreview: previewDragWidth,
      onCommit: (w) => props.actions.setWidth(w)
    }),
    React.createElement(
      "div",
      { style: headerStyle },
      React.createElement("img", {
        src: MINDMAP_ICON_URI,
        alt: "",
        draggable: false,
        width: 18,
        height: 18,
        style: { borderRadius: "5px", flex: "none" }
      }),
      React.createElement("strong", { style: { marginRight: "4px" } }, "思维导图"),
      React.createElement(HeaderButton, { title: "全屏模式", onClick: () => props.actions.showFull() }, "⤢"),
      React.createElement(MapActions, null),
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
      React.createElement("img", {
        src: MINDMAP_ICON_URI,
        alt: "",
        draggable: false,
        width: 18,
        height: 18,
        style: { borderRadius: "5px", flex: "none" }
      }),
      React.createElement("strong", null, "实时思维导图"),
      currentId === undefined &&
        React.createElement("span", { style: { fontSize: "12px", opacity: 0.7 } }, "（无活动会话）"),
      React.createElement(MapActions, null),
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

/**
 * Sidebar footer action button toggling the docked panel.
 *
 * Geometry mirrors the shell's settings trigger row (ui-settings-general
 * `.VOzbGW_trigger` / `.VOzbGW_rail`): a full-width 42px rounded row with a
 * 16px mark plus a label while the sidebar column is expanded (`wide`), and a
 * centered 36x36 round rail button with an 18px mark when it is collapsed.
 * State styling (hover, open-highlight) lives in the stylesheet injected by
 * apply() under `[data-dsh-mindmap-toggle]`, so inline styles stay
 * geometry-only: closed looks exactly like the settings control, open tints
 * with the sidebar nav's active token.
 */
function MindMapButton(props) {
  const view = props.useStore((s) => s.view);
  const active = view !== "hidden";
  // Slot props carry the sidebar shell's `wide` flag (expanded column vs
  // collapsed 56px rail) — the same flag the settings trigger receives.
  const wide = props.wide !== false;
  const onClick = () => props.actions.toggleDock();

  const buttonStyle = {
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    flex: "none",
    overflow: "hidden",
    border: "none",
    color: "var(--dsw-alias-label-primary, inherit)",
    fontFamily: "inherit",
    fontSize: "14px",
    lineHeight: "22px",
    transition: "background-color 0.15s var(--ds-ease-in-out, ease)"
  };
  if (wide) {
    Object.assign(buttonStyle, {
      width: "calc(100% + 4px)",
      height: "42px",
      margin: "4px -2px",
      padding: "0 10px 0 8px",
      gap: "8px",
      borderRadius: "12px"
    });
  } else {
    Object.assign(buttonStyle, {
      width: "36px",
      height: "36px",
      margin: "8px 0 10px",
      padding: "0",
      justifyContent: "center",
      borderRadius: "50%"
    });
  }

  return React.createElement(
    "button",
    {
      type: "button",
      title: active ? "关闭思维导图" : "打开思维导图（侧栏，可边聊边看）",
      "aria-label": active ? "关闭思维导图" : "打开思维导图",
      "aria-pressed": active ? "true" : "false",
      "data-dsh-mindmap-toggle": "",
      "data-dsh-mindmap-active": active ? "true" : "false",
      style: buttonStyle,
      onClick
    },
    React.createElement("img", {
      src: MINDMAP_ICON_URI,
      alt: "",
      draggable: false,
      width: wide ? 16 : 18,
      height: wide ? 16 : 18,
      style: { display: "block", flex: "none", borderRadius: wide ? "4px" : "5px" }
    }),
    wide && React.createElement(
      "span",
      { style: { whiteSpace: "nowrap", overflow: "hidden" } },
      "思维导图"
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
  //
  // The same tag also carries the sidebar toggle's state styling (see
  // MindMapButton): closed it behaves exactly like the settings trigger
  // (transparent, hover fill), open it tints with the sidebar nav's active
  // token — the same highlight language settings uses for its active section.
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
      "}",
      // While a divider drag is live: keep text selection off and force the
      // resize cursor everywhere so sweeping across the canvas stays clean.
      "body[data-dsh-mindmap-resizing] { user-select: none !important; }",
      "body[data-dsh-mindmap-resizing] * { cursor: col-resize !important; }",
      "button[data-dsh-mindmap-toggle] { background: transparent; }",
      "button[data-dsh-mindmap-toggle]:hover {",
      "  background: var(--dsw-alias-interactive-bg-hover);",
      "}",
      "button[data-dsh-mindmap-toggle][data-dsh-mindmap-active=\"true\"] {",
      "  background: var(--dsw-specific-sidebar-nav-item-active, rgba(128,128,128,0.22));",
      "}",
      "button[data-dsh-mindmap-toggle][data-dsh-mindmap-active=\"true\"]:hover {",
      "  background: var(--dsw-specific-sidebar-nav-item-hover, rgba(128,128,128,0.3));",
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
