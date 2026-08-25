/**
 * dsh-mindmap-live — host (node) half.
 *
 * A live, bidirectional mind map plugin built on the mind-elixir-core kernel.
 *
 * Host responsibilities:
 *  - Register a `mindmap` session projection (whole-value event rule): the
 *    complete MindElixirData tree is carried by each `mindmap/update` event,
 *    so the projection is a trivial last-write-wins fold and every served
 *    value is self-describing.
 *  - Register model-facing tools (`mindmap_get`, `mindmap_set`) so the agent
 *    can read and rewrite the mind map in response to the conversation.
 *  - Register a `/mindmap` Connection RPC channel so the browser canvas can
 *    push user edits back into the session log (which drives the projection
 *    forward and broadcasts `session/projection` frames to every client).
 *
 * The browser half ships via exports["./client"], discovered through the
 * package.json `dsh.client` declaration.
 */
import { defineTool } from "@deepseek-ai/dsh-tools";
import { z } from "zod";

const name = "dsh-mindmap-live";
const inject = ["tools"];

/** Projection key the client reads with `useProjection("mindmap")`. */
const PROJECTION_KEY = "mindmap";
/** Connection RPC channel the browser canvas pushes edits through. */
const RPC_CHANNEL = "/mindmap";
const RPC_ENDPOINT = "update";

/** Permissive schema: the tree is arbitrary MindElixir JSON (or null before first write). */
const mindmapProjectionSchema = z.any();

/**
 * A theme is only usable when it carries a non-empty palette of color strings.
 * The kernel applies data.theme verbatim and linkDiv then reads
 * `theme.palette.length` — a partial theme crashes rendering.
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

let repairIdSeq = 0;

/** Recursively repair one node; collects ids so arrows/summaries can be checked. */
function repairNode(node, usedIds) {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    const fallbackId = "n" + ++repairIdSeq;
    usedIds.push(fallbackId);
    return { id: fallbackId, topic: "（未命名）", expanded: true, children: [] };
  }
  const out = { ...node };
  if (typeof out.topic !== "string") out.topic = out.topic === undefined || out.topic === null ? "" : String(out.topic);
  if (out.topic.length === 0) out.topic = "（未命名）";
  if (typeof out.id !== "string" || out.id.length === 0 || usedIds.includes(out.id)) {
    let candidate;
    do { candidate = "n" + ++repairIdSeq; } while (usedIds.includes(candidate));
    out.id = candidate;
  }
  usedIds.push(out.id);
  const rawChildren = Array.isArray(out.children) ? out.children : [];
  out.children = [];
  for (const child of rawChildren) {
    if (child && typeof child === "object" && !Array.isArray(child)) {
      out.children.push(repairNode(child, usedIds));
    }
  }
  return out;
}

/**
 * Deep-repair a structurally-valid MindElixirData into the exact shape the
 * kernel assumes. Models omit `children` on leaves, invent partial themes,
 * or leave arrows pointing at removed nodes — all of which crash rendering
 * instead of failing softly. Repaired values are PERSISTED, so bad writes
 * self-heal at the source; the client sanitizer only exists for older history.
 * @param {object} value - tree past the basic structural checks.
 * @returns {object} repaired MindElixirData.
 */
function repairTree(value) {
  const usedIds = [];
  const out = { ...value, nodeData: repairNode(value.nodeData, usedIds) };
  const exists = (id) => usedIds.includes(id);
  const arrows = Array.isArray(value.arrows) ? value.arrows : [];
  out.arrows = arrows.filter(
    (a) => a && typeof a === "object" && !Array.isArray(a) &&
      typeof a.from === "string" && exists(a.from) &&
      typeof a.to === "string" && exists(a.to)
  );
  const summaries = Array.isArray(value.summaries) ? value.summaries : [];
  out.summaries = summaries.filter(
    (s) => s && typeof s === "object" && !Array.isArray(s) &&
      typeof s.parent === "string" && exists(s.parent) &&
      typeof s.start === "number" && typeof s.end === "number"
  );
  if (out.theme !== undefined) {
    if (usableTheme(out.theme)) {
      // Renderer hooks are functions in-process but can never survive JSON;
      // a string here would be invoked as a function by changeTheme. Strip them.
      const { generateMainBranch, generateSubBranch, ...rest } = out.theme;
      void generateMainBranch; void generateSubBranch;
      out.theme = rest;
    } else {
      delete out.theme;
    }
  }
  if (out.direction !== undefined && ![0, 1, 2, 3].includes(out.direction)) delete out.direction;
  return out;
}

/**
 * Normalize whatever the caller sent into a renderable MindElixirData object.
 * Models frequently stringify the tree before sending it; accept that, then
 * enforce the one structural invariant the kernel needs (`nodeData` object)
 * and deep-repair everything else (see repairTree).
 * @param {*} tree - raw tree argument from RPC payload or tool call.
 * @returns {object} normalized MindElixirData.
 * @throws {Error} with an actionable message when the value cannot be used.
 */
function normalizeTree(tree) {
  let value = tree;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch (e) {
      throw new Error("tree was a string but not valid JSON — send the tree as a JSON object (MindElixirData), not a quoted/escaped string");
    }
  }
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("tree must be a MindElixirData object like { nodeData: { id, topic, children }, arrows: [], summaries: [], direction }");
  }
  if (value.nodeData === null || typeof value.nodeData !== "object" || Array.isArray(value.nodeData)) {
    throw new Error("tree.nodeData is missing — the root node object is required ({ nodeData: { id, topic, children } })");
  }
  return repairTree(value);
}

/**
 * Register the `mindmap` projection, the model tools, and the client RPC
 * channel.
 * @param ctx - registrant context carrying the tool registry.
 */
function apply(ctx) {
  // Session projection: whole-value last-write-wins over `mindmap/update`.
  // The `wire` block makes the unit client-visible: without it the registry
  // drives the unit but never serves its value in snapshots.
  ctx.inject(["sessionProjections"], (projectionCtx) => {
    projectionCtx.sessionProjections.register({
      key: PROJECTION_KEY,
      stateSchema: mindmapProjectionSchema,
      init: () => null,
      apply: (state, event) => {
        if (event.type === "mindmap/update") return event.data.tree;
        return state;
      },
      wire: {
        viewSchema: mindmapProjectionSchema,
        view: (state) => state
      },
      stateVersion: 1
    });
  });

  // Client -> host RPC: the browser canvas pushes user edits here, which
  // appends a `mindmap/update` event to the owning session log.
  // `authority: "loopback"` pins the channel to loopback browser clients.
  ctx.inject(["connection", "sessions"], (connCtx) => {
    connCtx.connection.rpc.handle(RPC_CHANNEL, (endpoint, payload) => {
      if (endpoint !== RPC_ENDPOINT) {
        return { ok: false, error: { code: "bad-request", message: `unknown endpoint ${endpoint}` } };
      }
      const sessionId = payload?.sessionId;
      const tree = payload?.tree;
      if (typeof sessionId !== "string" || tree === void 0 || tree === null) {
        return { ok: false, error: { code: "bad-request", message: "payload requires sessionId and tree" } };
      }
      let normalized;
      try {
        normalized = normalizeTree(tree);
      } catch (e) {
        return { ok: false, error: { code: "bad-request", message: e.message } };
      }
      const session = connCtx.sessions.get(sessionId);
      if (session === void 0) {
        return { ok: false, error: { code: "not-found", message: `session ${sessionId} is not live` } };
      }
      session.append("mindmap/update", { tree: normalized });
      return { ok: true, value: { accepted: true } };
    }, { authority: "loopback" });
  });

  // Model-facing tools: read and rewrite the whole mind map.
  ctx.tools.register(defineTool({
    name: "mindmap_get",
    description: "Read the current mind map tree (MindElixirData) for the owning session. Returns null when no mind map has been created yet. Use this before mindmap_set so you know what is already on the canvas.",
    parameters: {},
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tree: { type: "json", description: "The current MindElixirData tree, or null." }
        }
      },
      render: (_args, value) => [{
        type: "text",
        text: value.tree
          ? "已读取当前思维导图。要修改时用 mindmap_set 发送完整树：每个节点必须带 children 数组（叶节点为 []）。"
          : "当前思维导图为空。"
      }]
    },
    execute(_args, exec) {
      const session = exec.agent?.session;
      if (!session) throw new Error("mindmap_get requires an owning agent session");
      let tree = null;
      for (const event of session.events) {
        if (event.type === "mindmap/update") tree = event.data.tree;
      }
      return Promise.resolve({ tree });
    }
  }));

  ctx.tools.register(defineTool({
    name: "mindmap_set",
    description: [
      "Replace the ENTIRE mind map tree for the owning session. Send the COMPLETE tree every call — it REPLACES the previous map (no partial updates). Call mindmap_get first to see the current tree.",
      "Exact shape (plain JSON object, NOT a string, no markdown fences):",
      '{"nodeData":{"id":"n0","topic":"中心主题","expanded":true,"children":[{"id":"n1","topic":"分支一","children":[]},{"id":"n2","topic":"分支二","children":[]}]},"arrows":[],"summaries":[],"direction":2}',
      "Hard rules:",
      "1. EVERY node is an object with: string topic (non-empty), array children (MUST be present, [] for leaves), unique string id. Omitting children is the #1 rendering failure.",
      "2. arrows and summaries: keep [] unless the user asks for cross-links/summaries; entries must reference existing node ids.",
      "3. direction: 2 = both sides of the root (default, recommended), 1 = all left, 0 = all right.",
      "4. Valid JSON only: no comments, no trailing commas, no functions."
    ].join("\n"),
    parameters: {
      tree: {
        type: "json",
        required: true,
        description: "The complete MindElixirData object per the shape in the tool description: { nodeData: { id, topic, expanded, children: [] }, arrows: [], summaries: [], direction }."
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ok: { type: "boolean", required: true },
          error: { type: "string", description: "Failure reason; present only when ok is false." }
        }
      },
      render: (_args, value) => [{
        type: "text",
        text: value.ok ? "思维导图已更新。" : `思维导图更新失败：${value.error ?? "未知原因"}`
      }]
    },
    execute(args, exec) {
      const session = exec.agent?.session;
      if (!session) throw new Error("mindmap_set requires an owning agent session");
      let tree;
      try {
        tree = normalizeTree(args.tree);
      } catch (e) {
        return Promise.resolve({ ok: false, error: e.message });
      }
      session.append("mindmap/update", { tree });
      return Promise.resolve({ ok: true });
    }
  }));
}

export { apply, inject, name };
