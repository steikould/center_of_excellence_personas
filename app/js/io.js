/**
 * Import / export of the model.
 *
 * The canonical form is deliberately strict - fixed key order, ids sorted -
 * so an export from the browser is byte-identical to app/data/*.json and an
 * export followed by a re-import reproduces the identical model.
 */
import { normalizeNode, normalizeEdge } from "./model.js";

export const NODE_KEYS = ["id", "type", "lens", "level", "name", "description", "code", "owner",
  "lifecycle", "criticality", "health", "maturity", "tags", "props", "externalRefs"];
export const EDGE_KEYS = ["id", "type", "from", "to", "props"];
export const FORMAT = "business-it-map";

function orderKeys(obj, keys) {
  const out = {};
  for (const k of keys) out[k] = obj[k];
  return out;
}

export function canonicalNodesDocument(nodes, meta = {}) {
  return {
    format: FORMAT, kind: "nodes",
    version: meta.version || "1.0",
    model: meta.name || "Enterprise model",
    nodes: [...nodes].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).map((n) => orderKeys(n, NODE_KEYS)),
  };
}

export function canonicalEdgesDocument(edges, meta = {}) {
  return {
    format: FORMAT, kind: "edges",
    version: meta.version || "1.0",
    model: meta.name || "Enterprise model",
    edges: [...edges].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).map((e) => orderKeys(e, EDGE_KEYS)),
  };
}

/** Exactly what json.dump(..., indent=2) writes, newline included. */
export function serialize(doc) {
  return JSON.stringify(doc, null, 2) + "\n";
}

export function documentsFrom(model) {
  return {
    nodes: canonicalNodesDocument([...model.nodes.values()], model.meta),
    edges: canonicalEdgesDocument([...model.edges.values()], model.meta),
  };
}

/** Accepts a nodes document, an edges document, or a bundle holding both. */
export function readDocument(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(`Not valid JSON: ${err.message}`);
  }
  if (Array.isArray(parsed)) {
    const looksLikeEdge = parsed.length && parsed[0] && parsed[0].from && parsed[0].to;
    return looksLikeEdge ? { edges: parsed } : { nodes: parsed };
  }
  const out = {};
  if (Array.isArray(parsed.nodes)) out.nodes = parsed.nodes;
  if (Array.isArray(parsed.edges)) out.edges = parsed.edges;
  if (!out.nodes && !out.edges) throw new Error('Expected a "nodes" or "edges" array in the file.');
  out.meta = { version: parsed.version, name: parsed.model };
  return out;
}

/**
 * Validate an incoming model. Returns { nodes, edges, errors, warnings }.
 * Errors block the import; warnings are surfaced in the data quality panel.
 */
export function validateDocuments(nodesArray, edgesArray) {
  const errors = [];
  const warnings = [];
  const nodes = [];
  const seen = new Set();

  for (const [i, raw] of (nodesArray || []).entries()) {
    if (!raw || !raw.id) { errors.push(`Node ${i}: missing "id".`); continue; }
    if (!raw.type) { errors.push(`Node ${raw.id}: missing "type".`); continue; }
    if (seen.has(raw.id)) { errors.push(`Duplicate node id "${raw.id}".`); continue; }
    seen.add(raw.id);
    nodes.push(normalizeNode(raw));
  }

  const edges = [];
  const seenEdges = new Set();
  for (const [i, raw] of (edgesArray || []).entries()) {
    if (!raw || !raw.from || !raw.to || !raw.type) { errors.push(`Edge ${i}: needs "from", "to" and "type".`); continue; }
    const e = normalizeEdge(raw);
    if (seenEdges.has(e.id)) continue;
    seenEdges.add(e.id);
    if (!seen.has(e.from) || !seen.has(e.to)) {
      warnings.push(`Edge ${e.id} refers to a node that is not in the file; it will be dropped.`);
      continue;
    }
    edges.push(e);
  }

  const parents = new Map();
  for (const e of edges) {
    if (e.type !== "contains") continue;
    if (parents.has(e.to)) warnings.push(`"${e.to}" is contained by both "${parents.get(e.to)}" and "${e.from}".`);
    else parents.set(e.to, e.from);
  }

  return { nodes, edges, errors, warnings };
}
