/** The inspector panel: full detail for one element, plus in-place editing. */
import { tpl, raw, toHTML, truncate, plural } from "../util.js";
import { state, can } from "../state.js";
import {
  healthBadge, lifecycleBadge, criticalityBadge, typeBadge, maturityMeter,
  TYPE_LABEL, EDGE_LABEL, HEALTH, LIFECYCLE, CRITICALITY,
} from "../format.js";
import { LEVEL_LABELS } from "../model.js";

export function renderInspector(model, node, { editing = false } = {}) {
  if (!node) return raw("");
  const trail = model.trail(node.id);
  const out = model.out(node.id);
  const inc = model.in(node.id);

  return tpl`
    <div class="insp-head">
      <p class="insp-type">${LEVEL_LABELS[node.level] || node.level} · ${TYPE_LABEL[node.type] || node.type}</p>
      <h2>${node.name}</h2>
      ${node.code ? tpl`<p class="mono">${node.code}</p>` : ""}
      <p class="chips">${typeBadge(node)}${healthBadge(node)}${criticalityBadge(node)}${lifecycleBadge(node)}</p>
    </div>

    <p style="font-size:.88rem;color:var(--text-muted)">${node.description}</p>

    <div class="insp-actions">
      <button type="button" class="primary" data-goto="${node.id}">Open</button>
      ${node.lens === "business"
        ? tpl`<button type="button" class="ghost" data-action="lens-it" data-id="${node.id}">IT view</button>
              <button type="button" class="ghost" data-action="impact" data-id="${node.id}">Technology chain</button>`
        : tpl`<button type="button" class="ghost" data-action="lens-business" data-id="${node.id}">Business served</button>
              <button type="button" class="ghost" data-action="impact" data-id="${node.id}">Impact</button>`}
      <button type="button" class="ghost" data-action="dual" data-id="${node.id}">Dual pane</button>
      <button type="button" class="ghost" data-action="close-inspector">Close</button>
    </div>

    ${trail.length > 1 ? tpl`<p style="font-size:.8rem;color:var(--text-muted)">
      ${trail.slice(0, -1).map((n) => tpl`<button type="button" data-goto="${n.id}"
        style="background:none;border:0;padding:0;cursor:pointer;font:inherit;color:inherit;text-decoration:underline">${n.name}</button> › `)}
      <strong>${node.name}</strong></p>` : ""}

    ${editing && can("edit") ? editForm(node) : factList(model, node)}

    ${can("edit") && !editing
      ? tpl`<p class="insp-actions"><button type="button" class="ghost" data-action="edit-node" data-id="${node.id}">Edit this element</button>
        ${can("admin") ? tpl`<button type="button" class="ghost" data-action="delete-node" data-id="${node.id}">Delete</button>` : ""}</p>`
      : ""}

    ${relationshipSection("Points to", out.map((e) => ({ edge: e, other: model.node(e.to) })).filter((x) => x.other), node)}
    ${relationshipSection("Pointed to by", inc.map((e) => ({ edge: e, other: model.node(e.from) })).filter((x) => x.other), node)}

    ${can("edit") ? addRelationshipForm(model, node) : ""}
  `;
}

function factList(model, node) {
  const props = Object.entries(node.props || {}).filter(([, v]) => v !== "" && v != null);
  const refs = Object.entries(node.externalRefs || {});
  const facts = [
    ["Owner", node.owner || "—"],
    ["Health", HEALTH[node.health]?.label || node.health],
    ["Lifecycle", LIFECYCLE[node.lifecycle]?.label || node.lifecycle],
    ["Criticality", CRITICALITY[node.criticality]?.label || node.criticality],
  ];
  if (node.maturity) facts.push(["Maturity", toHTML(maturityMeter(node.maturity)) + ` ${node.maturity}/5`]);
  if (node.tags.length) facts.push(["Tags", node.tags.join(", ")]);
  for (const [k, v] of props) facts.push([labelize(k), formatValue(v)]);
  for (const [k, v] of refs) facts.push([`Ref: ${k}`, String(v)]);

  return tpl`<div class="insp-section"><h3>Details</h3><dl>
    ${facts.map(([k, v]) => tpl`<dt>${k}</dt><dd>${k === "Maturity" ? raw(v) : v}</dd>`)}
    <dt>Identifier</dt><dd class="mono">${node.id}</dd>
  </dl></div>`;
}

/**
 * Render whatever a node carries in `props`.
 *
 * The inspector is the generic viewer: it sees every node type, including ones
 * whose props hold structure rather than scalars (an agent's tools, controls
 * and telemetry coverage). It should summarise those readably rather than
 * stringify them, and leave the full rendering to the view that knows what
 * they mean.
 */
function formatValue(value) {
  if (value == null) return "—";
  if (Array.isArray(value)) {
    if (!value.length) return "—";
    if (value.every((v) => typeof v !== "object" || v === null)) return truncate(value.join(", "), 200);
    const named = value.map((v) => v?.name ?? v?.label ?? v?.id).filter(Boolean);
    return named.length === value.length ? truncate(named.join(", "), 200) : plural(value.length, "entry", "entries");
  }
  if (typeof value === "object") {
    const pairs = Object.entries(value).filter(([, v]) => typeof v !== "object" || v === null);
    if (!pairs.length) return plural(Object.keys(value).length, "field");
    return truncate(pairs.map(([k, v]) => `${labelize(k).toLowerCase()} ${v}`).join(" · "), 200);
  }
  return String(value);
}

function labelize(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}

function relationshipSection(title, entries, node) {
  if (!entries.length) return raw("");
  return tpl`<div class="insp-section">
    <h3>${title} <span class="count">${entries.length}</span></h3>
    <ul class="link-list">
      ${entries.map(({ edge, other }) => tpl`<li>
        <span class="edge-type">${EDGE_LABEL[edge.type] || edge.type}</span>
        <button type="button" data-select="${other.id}">${other.name}</button>
        ${can("edit") ? tpl`<button type="button" class="ghost" style="padding:0 .3rem;font-size:.7rem"
          data-action="delete-edge" data-edge="${edge.id}" title="Remove this relationship">✕</button>` : ""}
      </li>`)}
    </ul>
  </div>`;
}

function addRelationshipForm(model, node) {
  return tpl`<div class="insp-section">
    <h3>Add a relationship</h3>
    <form class="edit-form" data-form="add-edge" data-id="${node.id}">
      <label>Type
        <select name="type">
          ${Object.entries(EDGE_LABEL).map(([value, label]) => tpl`<option value="${value}">${label}</option>`)}
        </select>
      </label>
      <label>Target element
        <input type="text" name="target" list="node-ids" placeholder="Start typing a name or id" required>
      </label>
      <label style="flex-direction:row;align-items:center;gap:.4rem">
        <input type="checkbox" name="reverse"> Point from the target to this element instead
      </label>
      <button type="submit" class="primary">Add relationship</button>
    </form>
  </div>`;
}

function editForm(node) {
  return tpl`<div class="insp-section">
    <h3>Edit</h3>
    <form class="edit-form" data-form="edit-node" data-id="${node.id}">
      <label>Name<input type="text" name="name" value="${node.name}" required></label>
      <label>Description<textarea name="description">${node.description}</textarea></label>
      <label>Owner<input type="text" name="owner" value="${node.owner}"></label>
      <label>Health
        <select name="health">${Object.entries(HEALTH).map(([v, h]) =>
          tpl`<option value="${v}" ${v === node.health ? raw("selected") : ""}>${h.label}</option>`)}</select>
      </label>
      <label>Lifecycle
        <select name="lifecycle">${Object.entries(LIFECYCLE).map(([v, l]) =>
          tpl`<option value="${v}" ${v === node.lifecycle ? raw("selected") : ""}>${l.label}</option>`)}</select>
      </label>
      <label>Criticality
        <select name="criticality">${Object.entries(CRITICALITY).map(([v, c]) =>
          tpl`<option value="${v}" ${v === node.criticality ? raw("selected") : ""}>${c.short}</option>`)}</select>
      </label>
      <label>Maturity (0 = not rated)
        <input type="number" name="maturity" min="0" max="5" value="${node.maturity || 0}">
      </label>
      <label>Tags (comma separated)<input type="text" name="tags" value="${node.tags.join(", ")}"></label>
      <div class="chips">
        <button type="submit" class="primary">Save change</button>
        <button type="button" class="ghost" data-action="cancel-edit" data-id="${node.id}">Cancel</button>
      </div>
      <p style="font-size:.75rem;color:var(--text-muted)">Saved as ${state.actor} (${state.role}) and recorded in the change log.</p>
    </form>
  </div>`;
}
