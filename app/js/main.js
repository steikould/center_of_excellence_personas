/**
 * Application controller: routing, rendering, the lens switch and every user
 * action. Views are pure functions returning HTML; this module owns the DOM.
 */
import { loadSeed } from "./data.js";
import {
  state, initState, subscribe, setRole, applyChange, undoChange, clearChanges,
  replaceModel, can, ROLES,
} from "./state.js";
import { buildModel } from "./model.js";
import { startRouter, onRoute, navigate } from "./router.js";
import { tpl, render, qs, qsa, delegate, toast, download, toHTML } from "./util.js";
import { documentsFrom, serialize, readDocument, validateDocuments, canonicalNodesDocument, canonicalEdgesDocument } from "./io.js";
import { renderDomainMap, renderBusinessNode } from "./views/business.js";
import { renderITView } from "./views/it.js";
import { renderMatrix } from "./views/matrix.js";
import { renderImpact } from "./views/impact.js";
import { renderDual } from "./views/dual.js";
import { renderSearch } from "./views/search.js";
import { renderQuality } from "./views/quality.js";
import { renderModelAdmin } from "./views/modeladmin.js";
import { renderAgentEstate, renderAgent, renderRuntimePanel } from "./views/agents.js";
import { renderInspector } from "./views/inspector.js";
import { resetLists, nextBatch } from "./views/common.js";
import { buildNode } from "./create.js";
import { TYPE_LABEL } from "./format.js";

const view = qs("#view");
const inspector = qs("#inspector");
const breadcrumb = qs("#breadcrumb");
const FILTER_PARAMS = { health: "fh", lifecycle: "fl", criticality: "fc", environment: "fe" };

let editingId = null;
let creatingUnderId = null;
let lastAnchorId = null;
let currentRoute = { segments: [], params: new URLSearchParams() };

/* ---------------------------------------------------------------- bootstrap */
(async function start() {
  const seed = await loadSeed();
  initState(seed.nodes, seed.edges);
  qs("#role").value = state.role;
  wireChrome();
  subscribe((reason) => {
    if (reason === "model" || reason === "role") renderRoute(currentRoute);
  });
  onRoute(renderRoute);
  startRouter();
})();

/* ------------------------------------------------------------------ routing */
function renderRoute(route) {
  currentRoute = route;
  const { segments, params } = route;
  const model = state.model;
  syncStateFromParams(params);

  resetLists();

  const [head, id] = segments;
  const node = id && model.has(id) ? model.node(id) : null;
  let body;
  let lens = "business";

  switch (head) {
    case undefined:
      body = renderDomainMap(model);
      break;
    case "b":
      if (!node) { body = notFound(id); break; }
      body = renderBusinessNode(model, node);
      break;
    case "it": {
      if (!node) { body = notFound(id); break; }
      lens = "it";
      // An agent gets its manifest rather than a technology scope: the useful
      // question about an agent is what it does and what it can reach, not
      // which platform tier it sits on.
      if (node.type === "Agent") { body = renderAgent(model, node); break; }
      body = node.type === "AgentRuntime"
        ? tpl`${renderITView(model, node, params)}${renderRuntimePanel(model, node)}`
        : renderITView(model, node, params);
      break;
    }
    case "agents":
      body = renderAgentEstate(model);
      break;
    case "impact":
      if (!node) { body = notFound(id); break; }
      lens = node.lens === "it" ? "business" : "it";
      body = renderImpact(model, node);
      break;
    case "dual":
      if (!node) { body = notFound(id); break; }
      body = renderDual(model, node);
      break;
    case "matrix":
      body = renderMatrix(model, params);
      break;
    case "search":
      body = renderSearch(model, params);
      break;
    case "quality":
      body = renderQuality(model);
      break;
    case "model":
      body = renderModelAdmin(model);
      break;
    default:
      body = notFound(segments.join("/"));
  }

  // An open inspector follows what you are looking at, including on a deep link
  // or a browser Back, unless you deliberately selected something else.
  if (!inspector.hidden && node && node.id !== lastAnchorId) {
    state.selection = node.id;
    editingId = null;
    creatingUnderId = null;
  }
  lastAnchorId = node ? node.id : null;

  qs("#model-name").textContent = model.meta.name;
  document.body.dataset.lens = lens;
  render(view, body);
  renderBreadcrumb(head, node);
  updateChrome(head, node, lens);
  ensureNodeDatalist(model);
  view.scrollTop = 0;
  window.scrollTo({ top: 0 });
}

function notFound(id) {
  return tpl`<div class="view-head"><div>
    <h1>Not found</h1>
    <p class="lede">Nothing in the model has the identifier <code>${id || "(none)"}</code>.
    It may have been renamed, or removed by an import.</p>
    <p><a href="#/">Back to the domain map</a></p>
  </div></div>`;
}

/* -------------------------------------------------------------- breadcrumbs */
function renderBreadcrumb(head, node) {
  const model = state.model;
  const items = [{ label: "Domain map", href: "#/" }];

  if (node) {
    const fromId = currentRoute.params.get("from");
    const fromNode = fromId && model.has(fromId) ? model.node(fromId) : null;
    const context = node.lens === "it" && fromNode && fromNode.lens === "business" ? model.trail(fromNode.id) : [];
    const trail = context.concat(model.trail(node.id));
    const seen = new Set();
    for (const n of trail) {
      if (seen.has(n.id)) continue;
      seen.add(n.id);
      items.push({ label: n.name, href: hrefFor(n), node: n });
    }
  } else if (head === "agents") items.push({ label: "Agent estate" });
  else if (head === "matrix") items.push({ label: "Capability to application matrix" });
  else if (head === "quality") items.push({ label: "Data quality" });
  else if (head === "model") items.push({ label: "Model" });
  else if (head === "search") items.push({ label: "Search" });

  const tag = head === "it" ? "IT view" : head === "impact" ? (node?.lens === "it" ? "Impact" : "Technology chain")
    : head === "dual" ? "Dual pane" : "";

  breadcrumb.innerHTML = toHTML(tpl`
    ${items.map((item, i) => tpl`<li>
      ${i === items.length - 1 && !tag
        ? tpl`<span aria-current="page">${item.label}</span>`
        : tpl`<a href="${item.href || "#/"}">${item.label}</a>`}
    </li>`)}
    ${tag ? tpl`<li><span class="lens-tag" aria-current="page">▸ ${tag}</span></li>` : ""}`);
}

function hrefFor(node) {
  return node.lens === "business" ? `#/b/${encodeURIComponent(node.id)}` : `#/it/${encodeURIComponent(node.id)}`;
}

/* ------------------------------------------------------------------- chrome */
function updateChrome(head, node, lens) {
  qsa("[data-nav]").forEach((a) => {
    const match = (a.dataset.nav === "map" && !["agents", "matrix", "quality", "model"].includes(head))
      || a.dataset.nav === head;
    if (match) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });

  const bizBtn = qs("#lens-business");
  const itBtn = qs("#lens-it");
  const inLens = head === "it" ? "it" : "business";
  bizBtn.setAttribute("aria-pressed", String(inLens === "business"));
  itBtn.setAttribute("aria-pressed", String(inLens === "it"));
  const anchor = node || null;
  bizBtn.disabled = !anchor;
  itBtn.disabled = !anchor;
  bizBtn.dataset.id = anchor ? anchor.id : "";
  itBtn.dataset.id = anchor ? anchor.id : "";
  qs("#btn-dual").disabled = !anchor;
  qs("#btn-dual").dataset.id = anchor ? anchor.id : "";
  const details = qs("#btn-details");
  details.disabled = !anchor;
  details.dataset.id = anchor ? anchor.id : "";
  details.setAttribute("aria-expanded", String(!inspector.hidden && state.selection === (anchor ? anchor.id : null)));
  if (!inspector.hidden && state.selection && state.model.has(state.selection)) {
    openInspector(state.model.node(state.selection));
  }

  const search = qs("#search");
  if (document.activeElement !== search) search.value = currentRoute.params.get("q") || "";
  qs("#overlay").value = state.overlay;
  qs("#filter-owner").value = state.filters.owner || "";
  for (const [name, param] of Object.entries(FILTER_PARAMS)) {
    const set = state.filters[name];
    qsa(`[data-filter="${name}"] input`).forEach((box) => { box.checked = set.has(box.value); });
    void param;
  }
  void lens;
}

/* ---------------------------------------------------------- URL <-> filters */
function syncStateFromParams(params) {
  state.overlay = params.get("ov") || "health";
  state.filters.owner = params.get("fo") || "";
  for (const [name, param] of Object.entries(FILTER_PARAMS)) {
    const value = params.get(param);
    state.filters[name] = new Set(value ? value.split(",").filter(Boolean) : []);
  }
}

function paramsWithFilters(extra = {}) {
  const params = new URLSearchParams(currentRoute.params);
  params.set("ov", state.overlay);
  if (state.filters.owner) params.set("fo", state.filters.owner); else params.delete("fo");
  for (const [name, param] of Object.entries(FILTER_PARAMS)) {
    const values = [...state.filters[name]];
    if (values.length) params.set(param, values.join(",")); else params.delete(param);
  }
  for (const [k, v] of Object.entries(extra)) {
    if (v === null || v === undefined || v === "") params.delete(k); else params.set(k, v);
  }
  return params;
}

function reroute(extra = {}) {
  navigate(currentRoute.segments, paramsWithFilters(extra), { replace: true });
}

/* ------------------------------------------------------------- interactions */
function wireChrome() {
  qs("#searchform").addEventListener("submit", (event) => {
    event.preventDefault();
    navigate(["search"], paramsWithFilters({ q: qs("#search").value }));
  });

  qs("#role").addEventListener("change", (event) => {
    setRole(event.target.value);
    toast(`Role switched to ${ROLES[event.target.value].label}.`);
  });

  qs("#overlay").addEventListener("change", (event) => {
    state.overlay = event.target.value;
    reroute();
  });

  qs("#filter-owner").addEventListener("input", (event) => {
    state.filters.owner = event.target.value.trim();
    clearTimeout(qs("#filter-owner").dataset.timer);
    setTimeout(() => reroute(), 220);
  });

  qsa("[data-filter]").forEach((group) => {
    group.addEventListener("change", () => {
      const name = group.dataset.filter;
      state.filters[name] = new Set(qsa("input:checked", group).map((i) => i.value));
      reroute();
    });
  });

  qs("#clear-filters").addEventListener("click", () => {
    state.filters = { health: new Set(), lifecycle: new Set(), criticality: new Set(), environment: new Set(), owner: "" };
    reroute();
  });

  qs("#btn-filters").addEventListener("click", () => {
    const panel = qs("#filters");
    panel.hidden = !panel.hidden;
    qs("#btn-filters").setAttribute("aria-expanded", String(!panel.hidden));
  });

  qs("#lens-business").addEventListener("click", (e) => switchLens("business", e.currentTarget.dataset.id));
  qs("#lens-it").addEventListener("click", (e) => switchLens("it", e.currentTarget.dataset.id));
  qs("#btn-dual").addEventListener("click", (e) => {
    const id = e.currentTarget.dataset.id;
    if (id) navigate(["dual", id], paramsWithFilters({ t: null }));
  });

  qs("#btn-details").addEventListener("click", (e) => {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    if (!inspector.hidden && state.selection === id) closeInspector();
    else { state.selection = id; openInspector(state.model.node(id)); }
  });

  delegate(document.body, "click", "[data-goto]", (event, el) => {
    if (event.target.closest("[data-action]") || event.target.closest("[data-select]")) return;
    gotoNode(el.dataset.goto);
  });
  delegate(document.body, "click", "[data-select]", (event, el) => {
    event.stopPropagation();
    selectNode(el.dataset.select);
  });
  delegate(document.body, "click", "[data-action]", (event, el) => handleAction(el.dataset.action, el, event));
  delegate(document.body, "click", "[data-level]", (event, el) => {
    if (el.disabled) return;
    navigate(currentRoute.segments, paramsWithFilters({ t: el.dataset.level }), { replace: true });
  });
  delegate(document.body, "change", "[data-matrix]", (event, el) => {
    navigate(["matrix"], paramsWithFilters({ [el.dataset.matrix]: el.value, page: null }), { replace: true });
  });
  delegate(document.body, "click", "[data-matrix-page]", (event, el) => {
    if (el.disabled) return;
    navigate(["matrix"], paramsWithFilters({ page: el.dataset.matrixPage }), { replace: true });
  });
  delegate(document.body, "submit", "[data-form]", (event, el) => {
    event.preventDefault();
    handleForm(el.dataset.form, el);
  });

  // Hover / focus linking between the dual panes.
  delegate(document.body, "mouseover", "[data-links]", (event, el) => highlightLinks(el));
  delegate(document.body, "focusin", "[data-links]", (event, el) => highlightLinks(el));
  document.body.addEventListener("mouseout", (event) => {
    if (event.target.closest("[data-links]")) qsa(".row.is-linked").forEach((r) => r.classList.remove("is-linked"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !inspector.hidden) { closeInspector(); return; }
    if (event.key === "/" && !isTyping(event.target)) { event.preventDefault(); qs("#search").focus(); return; }
    if (event.key.startsWith("Arrow") && event.target.classList?.contains("tile")) moveTileFocus(event);
  });
}

function isTyping(el) {
  return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
}

function moveTileFocus(event) {
  const tilesList = qsa(".tile");
  const index = tilesList.indexOf(event.target);
  if (index === -1) return;
  const perRow = Math.max(1, Math.round(event.target.parentElement.offsetWidth / event.target.offsetWidth));
  const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: perRow, ArrowUp: -perRow }[event.key];
  if (!delta) return;
  const next = tilesList[index + delta];
  if (next) { event.preventDefault(); next.focus(); }
}

function highlightLinks(el) {
  qsa(".row.is-linked").forEach((r) => r.classList.remove("is-linked"));
  const ids = (el.dataset.links || "").split(" ").filter(Boolean);
  for (const id of ids) {
    qsa(`.row[data-node="${CSS.escape(id)}"]`).forEach((r) => { if (r !== el) r.classList.add("is-linked"); });
  }
}

function gotoNode(id) {
  const node = state.model.node(id);
  if (!node) return;
  editingId = null;
  const params = paramsWithFilters({ t: null });
  if (node.lens === "business") {
    params.delete("from");
  } else if (!params.get("from")) {
    // Entering the IT lens from a business node: remember where we came from so
    // the breadcrumb keeps its business context as the user drills deeper.
    const anchorId = currentRoute.segments[0] === "it" ? currentRoute.segments[1] : null;
    const anchor = anchorId ? state.model.node(anchorId) : null;
    if (anchor && anchor.lens === "business") params.set("from", anchor.id);
  }
  const segments = node.lens === "business" ? ["b", node.id] : ["it", node.id];
  navigate(segments, params);
  selectNode(node.id, { silent: true });
}

function switchLens(target, id) {
  if (!id) return;
  const node = state.model.node(id);
  if (!node) return;
  if (target === "it") {
    navigate(["it", node.id], paramsWithFilters({ t: null }));
  } else if (node.lens === "it") {
    // From an IT element the business lens means: what capabilities does this serve?
    navigate(["impact", node.id], paramsWithFilters({ t: null }));
  } else {
    navigate(["b", node.id], paramsWithFilters({ t: null }));
  }
}

function selectNode(id, { silent = false } = {}) {
  const node = state.model.node(id);
  if (!node) return;
  state.selection = id;
  if (!silent || !inspector.hidden) openInspector(node);
}

function openInspector(node) {
  render(inspector, renderInspector(state.model, node, {
    editing: editingId === node.id,
    creating: creatingUnderId === node.id,
  }));
  inspector.hidden = false;
}

function closeInspector() {
  inspector.hidden = true;
  editingId = null;
  creatingUnderId = null;
  state.selection = null;
}

function refreshInspector() {
  if (state.selection && !inspector.hidden) {
    const node = state.model.node(state.selection);
    if (node) openInspector(node);
    else closeInspector();
  }
}

/* -------------------------------------------------------------- actions */
function handleAction(action, el, event) {
  event.preventDefault();
  event.stopPropagation();
  const id = el.dataset.id;
  const model = state.model;

  switch (action) {
    case "lens-it": navigate(["it", id], paramsWithFilters({ t: null })); break;
    case "lens-business": switchLens("business", id); break;
    case "impact": navigate(["impact", id], paramsWithFilters({ t: null })); break;
    case "dual": navigate(["dual", id], paramsWithFilters({ t: null })); break;
    case "close-inspector": closeInspector(); break;

    case "show-more": {
      const batch = nextBatch(el.dataset.key);
      if (!batch) return undefined;
      const list = qs(`[data-list="${CSS.escape(el.dataset.key)}"]`);
      const footer = el.closest(".more-row");
      if (list) list.insertAdjacentHTML("beforeend", toHTML(batch.rows));
      if (footer) {
        if (batch.footer) footer.outerHTML = toHTML(batch.footer);
        else footer.remove();
      }
      break;
    }

    case "edit-node":
      if (!can("edit")) return toast("Switch to the Editor role to make changes.");
      editingId = id;
      creatingUnderId = null;
      openInspector(model.node(id));
      break;
    case "add-child":
      if (!can("edit")) return toast("Switch to the Editor role to make changes.");
      creatingUnderId = id;
      editingId = null;
      openInspector(model.node(id));
      break;
    case "cancel-create":
      creatingUnderId = null;
      openInspector(model.node(id));
      break;
    case "cancel-edit":
      editingId = null;
      openInspector(model.node(id));
      break;
    case "delete-node": {
      if (!can("admin")) return toast("Only an Admin can delete elements.");
      const node = model.node(id);
      if (!node || !confirm(`Delete "${node.name}" and every relationship touching it?`)) return;
      applyChange({ op: "node.delete", target: id, before: node, summary: `Deleted ${node.name}` });
      closeInspector();
      toast("Element deleted. Undo it from the Model page.");
      break;
    }
    case "delete-edge": {
      if (!can("edit")) return toast("Switch to the Editor role to make changes.");
      const edge = model.edges.get(el.dataset.edge);
      if (!edge) return;
      applyChange({ op: "edge.delete", target: edge.id, before: edge, summary: `Removed "${edge.type}" relationship` });
      refreshInspector();
      break;
    }
    case "undo-change":
      undoChange(el.dataset.id);
      toast("Change undone.");
      break;
    case "clear-changes":
      if (confirm("Discard every local change and return to the loaded model?")) {
        clearChanges();
        toast("Local changes discarded.");
      }
      break;

    case "export-nodes": {
      const docs = documentsFrom(model);
      download("nodes.json", serialize(docs.nodes));
      break;
    }
    case "export-edges": {
      const docs = documentsFrom(model);
      download("edges.json", serialize(docs.edges));
      break;
    }
    case "export-bundle": {
      const docs = documentsFrom(model);
      download("enterprise-model.json", serialize({
        format: "business-it-map", kind: "bundle", version: model.meta.version, model: model.meta.name,
        nodes: docs.nodes.nodes, edges: docs.edges.edges,
      }));
      break;
    }
    case "roundtrip": roundTrip(model); break;
    case "reset-model":
      if (!can("admin")) return toast("Only an Admin can reset the model.");
      if (confirm("Reload the shipped demo model and discard local changes?")) {
        loadSeed().then((seed) => {
          replaceModel(seed.nodes, seed.edges);
          toast("Demo model restored.");
        });
      }
      break;
    default: break;
  }
  return undefined;
}

/** Prove the claim in the acceptance criteria: export then re-import is lossless. */
function roundTrip(model) {
  const out = qs("#roundtrip-result");
  try {
    const docs = documentsFrom(model);
    const nodesText = serialize(docs.nodes);
    const edgesText = serialize(docs.edges);
    const reNodes = readDocument(nodesText);
    const reEdges = readDocument(edgesText);
    const { nodes, edges, errors } = validateDocuments(reNodes.nodes, reEdges.edges);
    if (errors.length) throw new Error(errors.join(" "));
    const rebuilt = buildModel(canonicalNodesDocument(nodes, model.meta), canonicalEdgesDocument(edges, model.meta));
    const again = documentsFrom(rebuilt);
    const identical = serialize(again.nodes) === nodesText && serialize(again.edges) === edgesText;
    out.textContent = identical
      ? `Round-trip verified: ${nodes.length} nodes and ${edges.length} relationships exported, re-imported and re-exported byte-for-byte identical.`
      : "Round-trip mismatch - the re-exported model differs from the export.";
    out.className = identical ? "lede" : "notice risk";
  } catch (err) {
    out.textContent = `Round-trip failed: ${err.message}`;
    out.className = "notice risk";
  }
}

/* ---------------------------------------------------------------- forms */
function handleForm(kind, form) {
  const data = Object.fromEntries(new FormData(form));
  const model = state.model;

  if (kind === "edit-node") {
    const node = model.node(form.dataset.id);
    if (!node) return;
    const after = {
      name: String(data.name || node.name).trim(),
      description: String(data.description || "").trim(),
      owner: String(data.owner || "").trim(),
      health: data.health, lifecycle: data.lifecycle, criticality: data.criticality,
      maturity: Math.max(0, Math.min(5, Number(data.maturity) || 0)),
      tags: String(data.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    };
    const changed = Object.keys(after).filter((k) => JSON.stringify(after[k]) !== JSON.stringify(node[k]));
    if (!changed.length) { toast("Nothing changed."); editingId = null; refreshInspector(); return; }
    const before = Object.fromEntries(changed.map((k) => [k, node[k]]));
    applyChange({
      op: "node.update", target: node.id, before, after,
      summary: `Updated ${changed.join(", ")} on ${after.name}`,
    });
    editingId = null;
    refreshInspector();
    toast("Change saved and logged.");
    return;
  }

  if (kind === "create-node") {
    const parent = form.dataset.id ? model.node(form.dataset.id) : null;
    const name = String(data.name || "").trim();
    if (!name) { toast("Give the new element a name."); return; }
    let node;
    try {
      node = buildNode(model, { ...data, name, parent });
    } catch (err) { toast(err.message); return; }
    applyChange({
      op: "node.create", target: node.id, after: node, parent: parent ? parent.id : null,
      summary: `Created ${TYPE_LABEL[node.type] || node.type} "${node.name}"${parent ? ` inside ${parent.name}` : ""}`,
    });
    creatingUnderId = null;
    state.selection = node.id;
    refreshInspector();
    toast(`Created "${node.name}". It is in the change log.`);
    return;
  }

  if (kind === "add-edge") {
    const sourceId = form.dataset.id;
    const targetId = resolveNodeRef(model, String(data.target || ""));
    if (!targetId) { toast("No element matches that name or id."); return; }
    if (targetId === sourceId) { toast("An element cannot relate to itself."); return; }
    const from = data.reverse ? targetId : sourceId;
    const to = data.reverse ? sourceId : targetId;
    const edge = { id: `${from}|${data.type}|${to}`, type: data.type, from, to, props: {} };
    if (model.edges.has(edge.id)) { toast("That relationship already exists."); return; }
    applyChange({
      op: "edge.create", target: edge.id, after: edge,
      summary: `${model.node(from).name} ${String(data.type).replace(/_/g, " ")} ${model.node(to).name}`,
    });
    form.reset();
    refreshInspector();
    toast("Relationship added and logged.");
  }
}

function resolveNodeRef(model, text) {
  const value = text.trim();
  if (!value) return null;
  if (model.has(value)) return value;
  const byName = model.all().find((n) => n.name.toLowerCase() === value.toLowerCase());
  if (byName) return byName.id;
  const match = value.match(/\(([^)]+)\)\s*$/);
  return match && model.has(match[1]) ? match[1] : null;
}

let datalistSignature = "";
function ensureNodeDatalist(model) {
  const signature = `${model.nodes.size}:${state.changes.length}`;
  if (signature === datalistSignature) return;
  datalistSignature = signature;
  let list = qs("#node-ids");
  if (!list) {
    list = document.createElement("datalist");
    list.id = "node-ids";
    document.body.appendChild(list);
  }
  list.innerHTML = model.all()
    .map((n) => `<option value="${n.name.replace(/"/g, "&quot;")} (${n.id})"></option>`)
    .join("");
}

/* --------------------------------------------------------------- import */
document.addEventListener("change", async (event) => {
  if (event.target.id !== "import-file") return;
  const input = event.target;
  const files = [...input.files];
  input.value = ""; // so re-selecting the same file fires again
  if (!files.length) return;
  const report = () => qs("#import-report");
  let nodesArray = null;
  let edgesArray = null;
  let meta = {};
  try {
    for (const file of files) {
      const doc = readDocument(await file.text());
      if (doc.nodes) nodesArray = doc.nodes;
      if (doc.edges) edgesArray = doc.edges;
      if (doc.meta) meta = { ...meta, ...doc.meta };
    }
  } catch (err) {
    render(report(), tpl`<p class="notice risk">${err.message}</p>`);
    return;
  }
  if (!nodesArray) {
    render(report(), tpl`<p class="notice risk">No nodes found. Include a nodes file, or a bundle holding both.</p>`);
    return;
  }
  const { nodes, edges, errors, warnings } = validateDocuments(nodesArray, edgesArray || []);
  if (errors.length) {
    render(report(), tpl`<p class="notice risk">Import rejected - ${errors.length} problem(s):</p>
      <ul class="link-list">${errors.slice(0, 20).map((e) => tpl`<li>${e}</li>`)}</ul>`);
    return;
  }
  // Replacing the model re-renders this page, so the report element has to be
  // looked up again afterwards - and we stay here so the admin can read it.
  replaceModel(canonicalNodesDocument(nodes, meta), canonicalEdgesDocument(edges, meta));
  render(report(), tpl`<p class="notice">Imported ${nodes.length} nodes and ${edges.length} relationships.
    ${warnings.length ? tpl`${warnings.length} warning(s): ${warnings.slice(0, 3).join(" ")}` : ""}
    <a href="#/">Open the domain map →</a></p>`);
  toast(`Model imported: ${nodes.length} nodes.`);
});
