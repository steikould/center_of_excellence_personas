/**
 * Application state: the loaded model, the viewer's role, filters, overlay and
 * the change log.
 *
 * Edits are stored as a list of changes against the pristine documents rather
 * than mutated in place. Rebuilding is cheap, it keeps every derived index
 * consistent, and it means an unchanged model exports byte-identical to the
 * file it was loaded from.
 */
import { buildModel } from "./model.js";

const STORAGE_KEY = "enterprise-map/v1";
const listeners = new Set();

export const ROLES = {
  viewer: { label: "Viewer", canEdit: false, canAdmin: false },
  editor: { label: "Editor", canEdit: true, canAdmin: false },
  admin: { label: "Admin", canEdit: true, canAdmin: true },
};

export const state = {
  baseNodes: null,
  baseEdges: null,
  model: null,
  changes: [],
  role: "viewer",
  actor: "you",
  filters: { health: new Set(), lifecycle: new Set(), criticality: new Set(), environment: new Set(), owner: "" },
  overlay: "health",
  selection: null,
  ready: false,
};

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit(reason) { listeners.forEach((fn) => fn(reason)); }

export function initState(nodesDoc, edgesDoc) {
  state.baseNodes = nodesDoc;
  state.baseEdges = edgesDoc;
  restore();
  rebuild();
  state.ready = true;
}

export function rebuild() {
  const nodes = state.baseNodes.nodes.map((n) => ({ ...n, tags: [...(n.tags || [])], props: { ...(n.props || {}) }, externalRefs: { ...(n.externalRefs || {}) } }));
  const edges = state.baseEdges.edges.map((e) => ({ ...e, props: { ...(e.props || {}) } }));
  const nodeIndex = new Map(nodes.map((n) => [n.id, n]));
  const edgeIndex = new Map(edges.map((e) => [e.id, e]));

  for (const change of state.changes) {
    switch (change.op) {
      case "node.update": {
        const target = nodeIndex.get(change.target);
        if (target) Object.assign(target, change.after);
        break;
      }
      case "node.create":
        if (!nodeIndex.get(change.target)) {
          nodeIndex.set(change.target, { ...change.after });
          // The containment edge travels with the node, so undoing a create
          // cannot leave a dangling relationship behind.
          if (change.parent && nodeIndex.get(change.parent)) {
            const eid = `${change.parent}|contains|${change.target}`;
            if (!edgeIndex.get(eid)) {
              edgeIndex.set(eid, { id: eid, type: "contains", from: change.parent, to: change.target, props: {} });
            }
          }
        }
        break;
      case "node.delete":
        nodeIndex.delete(change.target);
        for (const [id, e] of edgeIndex) if (e.from === change.target || e.to === change.target) edgeIndex.delete(id);
        break;
      case "edge.create":
        if (!edgeIndex.get(change.target)) edgeIndex.set(change.target, { ...change.after });
        break;
      case "edge.delete":
        edgeIndex.delete(change.target);
        break;
      default: break;
    }
  }

  state.model = buildModel(
    { ...state.baseNodes, nodes: [...nodeIndex.values()] },
    { ...state.baseEdges, edges: [...edgeIndex.values()] },
  );
  return state.model;
}

/** Record a change, apply it and persist it. Returns the change record. */
export function applyChange(change) {
  if (!ROLES[state.role].canEdit) throw new Error("Your role is read-only. Switch to Editor to make changes.");
  const record = {
    id: `chg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
    actor: state.actor,
    role: state.role,
    ...change,
  };
  state.changes.push(record);
  rebuild();
  persist();
  emit("model");
  return record;
}

export function undoChange(changeId) {
  const index = state.changes.findIndex((c) => c.id === changeId);
  if (index === -1) return false;
  state.changes.splice(index, 1);
  rebuild();
  persist();
  emit("model");
  return true;
}

export function clearChanges() {
  state.changes = [];
  rebuild();
  persist();
  emit("model");
}

/** Replace the whole model, e.g. after an import. */
export function replaceModel(nodesDoc, edgesDoc, { keepChanges = false } = {}) {
  state.baseNodes = nodesDoc;
  state.baseEdges = edgesDoc;
  if (!keepChanges) state.changes = [];
  rebuild();
  persist();
  emit("model");
}

export function setRole(role) {
  if (!ROLES[role]) return;
  state.role = role;
  persist();
  emit("role");
}

export function setOverlay(overlay) { state.overlay = overlay; emit("overlay"); }

export function setFilter(name, values) {
  if (name === "owner") state.filters.owner = values;
  else state.filters[name] = new Set(values);
  emit("filters");
}

export function clearFilters() {
  state.filters = { health: new Set(), lifecycle: new Set(), criticality: new Set(), environment: new Set(), owner: "" };
  emit("filters");
}

export function hasActiveFilters() {
  const f = state.filters;
  return Boolean(f.owner) || ["health", "lifecycle", "criticality", "environment"].some((k) => f[k].size);
}

export function can(action) {
  const role = ROLES[state.role] || ROLES.viewer;
  if (action === "edit") return role.canEdit;
  if (action === "admin") return role.canAdmin;
  return true;
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ role: state.role, changes: state.changes }));
  } catch { /* storage unavailable - the session simply is not remembered */ }
}

function restore() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (stored.role && ROLES[stored.role]) state.role = stored.role;
    if (Array.isArray(stored.changes)) state.changes = stored.changes;
  } catch { /* ignore corrupt storage */ }
}
