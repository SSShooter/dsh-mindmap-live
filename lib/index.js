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
 * Normalize whatever the caller sent into a renderable MindElixirData object.
 * Models frequently stringify the tree before sending it; accept that, then
 * enforce the one structural invariant the kernel needs (`nodeData` object).
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
  if (typeof value.nodeData.topic !== "string" || value.nodeData.topic.length === 0) {
    value = { ...value, nodeData: { ...value.nodeData, topic: value.nodeData.topic === "" ? "（未命名）" : "思维导图" } };
  }
  return value;
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
        text: value.tree ? "已读取当前思维导图。" : "当前思维导图为空。"
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
    description: "Replace the ENTIRE mind map tree for the owning session with the given MindElixirData. Send the complete tree every call — it REPLACES the previous tree (no partial updates). The tree shape is { nodeData: { id, topic, expanded, children: [...] }, arrows: [], summaries: [], direction, theme, compact, meta }. Each node: { id, topic, expanded, children, branchColor? }. Use mindmap_get first to see the current tree.",
    parameters: {
      tree: {
        type: "json",
        required: true,
        description: "The complete MindElixirData tree to set."
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
