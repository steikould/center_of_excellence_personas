/** Rendering blocks shared by the views: tiles, rows, headers and detail lists. */
import { tpl, raw, toHTML, truncate, plural } from "../util.js";
import {
  healthBadge, lifecycleBadge, criticalityBadge, typeBadge, maturityMeter,
  overlayTone, overlayMetric, TYPE_ICON, TYPE_LABEL,
} from "../format.js";
import { LEVEL_LABELS, matchesFilters } from "../model.js";
import { state } from "../state.js";

export function levelLabel(level) {
  return LEVEL_LABELS[level] || level;
}

/** Context an overlay needs to colour a tile - computed once per tile. */
export function tileContext(model, node) {
  if (node.lens === "business") {
    const { direct, inherited } = model.applicationsFor(node.id);
    const apps = [...direct.map((d) => d.app), ...inherited.map((d) => d.app)];
    const troubled = apps.filter((a) => a.health === "at-risk" || a.lifecycle === "phase-out");
    return {
      appCount: apps.length,
      risk: troubled.length === 0 ? 0 : troubled.length === 1 ? 1 : 2,
      riskLabel: troubled.length
        ? `${plural(troubled.length, "application")} at risk or phasing out`
        : "No application at risk",
      cost: "",
    };
  }
  return { appCount: 0, risk: node.health === "at-risk" ? 2 : node.health === "watch" ? 1 : 0,
    riskLabel: node.health === "at-risk" ? "At risk" : "", cost: node.props?.costBand || "" };
}

export function tile(model, node, { overlay = state.overlay, weight = "" } = {}) {
  const ctx = tileContext(model, node);
  const tone = overlayTone(node, overlay, ctx);
  const metric = overlayMetric(node, overlay, ctx);
  const childCount = model.children(node.id).length;
  return tpl`
    <button type="button" class="tile" data-goto="${node.id}" data-tone="${tone}" data-weight="${weight}">
      ${node.code ? tpl`<span class="tile-code">${node.code}</span>` : ""}
      <span class="tile-name">${node.name}</span>
      <p class="tile-desc">${truncate(node.description, 150)}</p>
      <span class="tile-foot">
        ${healthBadge(node)}
        ${node.lens === "business" && node.maturity ? maturityMeter(node.maturity) : ""}
        ${childCount ? tpl`<span class="tile-metric">${childCount} below</span>` : ""}
      </span>
      ${metric && overlay !== "health" ? tpl`<span class="tile-metric">${metric}</span>` : ""}
    </button>`;
}

export function tiles(model, nodes, options = {}) {
  if (!nodes.length) return emptyState(options.emptyMessage || "Nothing at this level.");
  const visible = nodes.filter((n) => matchesFilters(n, state.filters));
  if (!visible.length) return emptyState("Every item here is hidden by the current filters.");
  return tpl`<div class="tiles ${options.treemap ? "treemap" : ""}">
    ${visible.map((n) => tile(model, n, options))}
  </div>`;
}

export function row(model, node, { sub = null, meta = null, linkTo = null } = {}) {
  const subtitle = sub ?? (node.description ? truncate(node.description, 120) : TYPE_LABEL[node.type]);
  return tpl`
    <li>
      <button type="button" class="row" data-goto="${linkTo || node.id}" data-node="${node.id}">
        <span class="row-icon" aria-hidden="true">${TYPE_ICON[node.type] || "□"}</span>
        <span class="row-main">
          <span class="row-name">${node.name}</span>
          <span class="row-sub">${subtitle}</span>
        </span>
        <span class="row-meta">${meta || defaultMeta(node)}</span>
      </button>
      <button type="button" class="row-more" data-select="${node.id}"
              aria-label="Details for ${node.name}" title="Details, relationships and editing">ⓘ</button>
    </li>`;
}

function defaultMeta(node) {
  const parts = [healthBadge(node)];
  if (node.type === "Application") parts.push(lifecycleBadge(node), criticalityBadge(node));
  else if (node.lens === "it") parts.push(criticalityBadge(node));
  return raw(parts.map(toHTML).join(""));
}

export function rows(model, nodes, options = {}) {
  const visible = nodes.filter((n) => matchesFilters(n, state.filters));
  if (!visible.length) return emptyState(options.emptyMessage || "Nothing to show here.");
  return tpl`<ul class="rows">${visible.map((n) => row(model, n, options))}</ul>`;
}

export function emptyState(message) {
  return tpl`<p class="empty">${message}</p>`;
}

export function section(title, count, body, extra = null) {
  return tpl`<section class="section">
    <h2>${title}${count !== null && count !== undefined ? tpl` <span class="count">${count}</span>` : ""}${extra || ""}</h2>
    ${body}
  </section>`;
}

export function nodeHeader(node, { actions = null, eyebrow = null } = {}) {
  return tpl`
    <div class="view-head">
      <div>
        <p class="eyebrow">${eyebrow || levelLabel(node.level)}${node.code ? ` · ${node.code}` : ""}</p>
        <h1>${node.name}</h1>
        <p class="lede">${node.description}</p>
        <p class="chips">
          ${typeBadge(node)} ${healthBadge(node)} ${criticalityBadge(node)}
          ${node.lens === "it" ? lifecycleBadge(node) : ""}
          ${node.owner ? tpl`<span class="badge badge-neutral">Owner: ${node.owner}</span>` : ""}
        </p>
      </div>
      ${actions ? tpl`<div class="chips">${actions}</div>` : ""}
    </div>`;
}

export function statTile(num, label, tone = "") {
  return tpl`<div class="stat" data-tone="${tone}"><div class="num">${num}</div><div class="lab">${label}</div></div>`;
}
