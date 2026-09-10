/**
 * The IT lens. One consistent zoom model for both entry points: whatever the
 * anchor is - a business capability or a piece of infrastructure - the view
 * scopes the technology to that anchor and lets the user step down the levels
 * T1 (landscape) to T5 (infrastructure and network).
 */
import { tpl, raw, plural } from "../util.js";
import { rows, section, nodeHeader, statTile, emptyState } from "./common.js";
import { IT_LEVELS, LEVEL_LABELS } from "../model.js";
import { TYPE_LABEL, TYPE_LABEL_PLURAL } from "../format.js";

const LEVEL_BLURB = {
  T1: "The applications and external services in scope, and how they integrate.",
  T2: "What each application is actually made of: deployable parts and data stores.",
  T3: "The interfaces, event streams and file transfers that move data between them.",
  T4: "The platforms and runtimes those parts execute on.",
  T5: "The clusters, hosts, network zones and sites underneath it all.",
};

export function renderITView(model, anchor, params) {
  const scope = model.itScope(anchor.id);
  const anchorInScope = anchor.lens === "it";
  if (anchorInScope && scope[anchor.level]) {
    if (!scope[anchor.level].some((n) => n.id === anchor.id)) scope[anchor.level] = [anchor, ...scope[anchor.level]];
  }
  const available = IT_LEVELS.filter((lvl) => scope[lvl].length);
  const requested = params.get("t");
  const level = available.includes(requested) ? requested : (available[0] || "T1");
  const nodes = scope[level] || [];

  const actions = anchor.lens === "business"
    ? tpl`<button type="button" class="primary" data-action="lens-business" data-id="${anchor.id}">← Back to business view</button>
          <button type="button" class="ghost" data-action="dual" data-id="${anchor.id}">Dual pane</button>`
    : tpl`<button type="button" class="primary" data-action="lens-business" data-id="${anchor.id}">Show business capabilities served →</button>
          <button type="button" class="ghost" data-action="impact" data-id="${anchor.id}">Impact analysis</button>
          <button type="button" class="ghost" data-action="dual" data-id="${anchor.id}">Dual pane</button>`;

  const total = IT_LEVELS.reduce((sum, lvl) => sum + scope[lvl].length, 0);

  return tpl`
    ${nodeHeader(anchor, {
      actions,
      eyebrow: anchor.lens === "business"
        ? `IT view of ${LEVEL_LABELS[anchor.level] || anchor.level}`
        : `${LEVEL_LABELS[anchor.level] || anchor.level} · ${TYPE_LABEL[anchor.type] || anchor.type}`,
    })}

    ${anchor.lens === "business" ? tpl`<p class="lede">
      ${plural(total, "IT element")} support this part of the business, across ${plural(available.length, "zoom level")}.
    </p>` : ""}

    <div class="level-rail" role="group" aria-label="Technology zoom level">
      ${IT_LEVELS.map((lvl) => tpl`
        <button type="button" data-level="${lvl}" aria-pressed="${String(lvl === level)}"
                ${scope[lvl].length ? raw("") : raw("disabled")}
                title="${LEVEL_BLURB[lvl]}">
          <strong>${lvl} · ${LEVEL_LABELS[lvl]}</strong>
          <span>${scope[lvl].length ? plural(scope[lvl].length, "element") : "none in scope"}</span>
        </button>`)}
    </div>

    <p class="lede">${LEVEL_BLURB[level]}</p>

    ${level === "T1" ? renderLandscape(model, nodes, scope.T3 || []) : renderLevel(model, nodes, level)}
  `;
}

function renderLandscape(model, nodes, integrationLevel) {
  const apps = nodes.filter((n) => n.type === "Application");
  const external = nodes.filter((n) => n.type === "ExternalService" && n.level === "T1");
  const byLifecycle = (a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name);
  const critical = apps.filter((a) => a.criticality === "critical").length;
  const risky = apps.filter((a) => a.health === "at-risk" || a.lifecycle === "phase-out");

  // The landscape is applications, external services AND the integrations
  // between them - a system list without its wiring is only half the picture.
  const inScope = new Set([...apps, ...external].map((n) => n.id));
  const flows = integrationLevel
    .filter((n) => n.type === "IntegrationFlow")
    .map((flow) => ({ flow, ...endpointsOf(model, flow) }))
    .filter(({ source, target }) => (source && inScope.has(source.id)) || (target && inScope.has(target.id)))
    .sort((a, b) => a.flow.name.localeCompare(b.flow.name));
  const flowLabel = new Map(flows.map(({ flow, source, target }) => [flow.id,
    `${source ? source.name : "?"} → ${target ? target.name : "?"}`
    + (flow.props?.protocol ? ` · ${flow.props.protocol}` : "")
    + (flow.props?.frequency ? ` · ${flow.props.frequency}` : "")]));

  return tpl`
    <div class="impact-summary">
      ${statTile(apps.length, "Applications in scope")}
      ${statTile(critical, "Business critical")}
      ${statTile(risky.length, "At risk or phasing out", risky.length ? "risk" : "")}
      ${statTile(external.length, "External services")}
      ${statTile(flows.length, "Integrations between them")}
    </div>
    ${risky.length ? tpl`<p class="notice">
      ${risky.map((a) => a.name).join(", ")} ${risky.length === 1 ? "is" : "are"} at risk or being phased out.
    </p>` : ""}
    ${section("Applications", apps.length, rows(model, [...apps].sort(byLifecycle), {
      emptyMessage: "No application supports this scope yet.",
    }))}
    ${external.length ? section("External services", external.length, rows(model, external)) : ""}
    ${flows.length
      ? section("Integrations", flows.length, rows(model, flows.map((f) => f.flow), {
          sub: (flow) => flowLabel.get(flow.id) || flow.description,
        }))
      : ""}
  `;
}

/** The applications either side of an integration flow. */
function endpointsOf(model, flow) {
  const source = model.in(flow.id).find((e) => e.type === "connects_to");
  const target = model.out(flow.id).find((e) => e.type === "connects_to");
  return { source: source ? model.node(source.from) : null, target: target ? model.node(target.to) : null };
}

function rank(app) {
  return { critical: 0, high: 1, medium: 2, low: 3 }[app.criticality] ?? 4;
}

function renderLevel(model, nodes, level) {
  if (!nodes.length) return emptyState("Nothing in scope at this level.");
  const groups = new Map();
  for (const n of nodes) {
    if (!groups.has(n.type)) groups.set(n.type, []);
    groups.get(n.type).push(n);
  }
  const ordered = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  return tpl`${ordered.map(([type, list]) => section(
    (list.length === 1 ? TYPE_LABEL[type] : TYPE_LABEL_PLURAL[type]) || type,
    list.length,
    rows(model, list, { meta: null, sub: null }),
  ))}`;
}

/** Detail body used when an IT node is opened directly rather than as a scope. */
export function relationshipSummary(model, node) {
  const out = model.out(node.id);
  const inc = model.in(node.id);
  if (!out.length && !inc.length) return emptyState("No relationships recorded.");
  const line = (edge, other, direction) => tpl`
    <li>
      <span class="edge-type">${direction === "out" ? "→" : "←"} ${edge.type.replace(/_/g, " ")}</span>
      <button type="button" data-goto="${other.id}">${other.name}</button>
    </li>`;
  return tpl`<ul class="link-list">
    ${out.map((e) => { const other = model.node(e.to); return other ? line(e, other, "out") : ""; })}
    ${inc.map((e) => { const other = model.node(e.from); return other ? line(e, other, "in") : ""; })}
  </ul>`;
}
