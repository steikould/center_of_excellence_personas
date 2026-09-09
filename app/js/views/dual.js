/**
 * Dual pane: business hierarchy on the left, the technology mapped to it on the
 * right. Hovering or focusing either side highlights what it links to on the
 * other, which is the fastest way to answer "what runs this?" without
 * navigating away.
 */
import { tpl, truncate, plural } from "../util.js";
import { section, statTile, emptyState } from "./common.js";
import { healthBadge, criticalityBadge, lifecycleBadge, TYPE_ICON, TYPE_LABEL } from "../format.js";
import { LEVEL_LABELS } from "../model.js";

export function renderDual(model, anchor) {
  const businessAnchor = anchor.lens === "business" ? anchor : firstBusinessFor(model, anchor);
  if (!businessAnchor) {
    return tpl`<div class="view-head"><div><h1>Dual pane</h1>
      <p class="lede">This element is not linked to anything in the business lens yet.</p></div></div>
      ${emptyState("Add a supports relationship to see it side by side.")}`;
  }

  const children = model.children(businessAnchor.id)
    .sort((a, b) => (a.code || "").localeCompare(b.code || "", undefined, { numeric: true }));
  const businessNodes = children.length ? children : [businessAnchor];

  // For each business node, the applications that support it; and the inverse.
  const appLinks = new Map();
  for (const bn of businessNodes) {
    const { direct, inherited } = model.applicationsFor(bn.id);
    for (const { app } of [...direct, ...inherited]) {
      if (!appLinks.has(app.id)) appLinks.set(app.id, { app, business: new Set() });
      appLinks.get(app.id).business.add(bn.id);
    }
  }
  const applications = [...appLinks.values()].sort((a, b) => a.app.name.localeCompare(b.app.name));

  return tpl`
    <div class="view-head">
      <div>
        <p class="eyebrow">Dual pane · ${LEVEL_LABELS[businessAnchor.level]}</p>
        <h1>${businessAnchor.name}</h1>
        <p class="lede">
          ${plural(businessNodes.length, "business element")} and the ${plural(applications.length, "application")}
          mapped to them. Hover either side to highlight the link.
        </p>
      </div>
      <div class="chips">
        <button type="button" class="ghost" data-action="lens-business" data-id="${businessAnchor.id}">Business view</button>
        <button type="button" class="ghost" data-action="lens-it" data-id="${businessAnchor.id}">IT view</button>
      </div>
    </div>

    <div class="dual">
      <div class="pane" data-lens="business">
        <h2><span aria-hidden="true">◧</span> Business</h2>
        <ul class="rows">
          ${businessNodes.map((bn) => {
            const linked = [...appLinks.values()].filter((l) => l.business.has(bn.id)).map((l) => l.app.id);
            return tpl`<li>
              <button type="button" class="row" data-goto="${bn.id}" data-node="${bn.id}"
                      data-links="${linked.join(" ")}">
                <span class="row-icon" aria-hidden="true">${TYPE_ICON[bn.type] || "□"}</span>
                <span class="row-main">
                  <span class="row-name">${bn.code ? bn.code + " " : ""}${bn.name}</span>
                  <span class="row-sub">${truncate(bn.description, 90)}</span>
                </span>
                <span class="row-meta">${healthBadge(bn)}
                  <span class="badge badge-neutral">${plural(linked.length, "app")}</span></span>
              </button></li>`;
          })}
        </ul>
      </div>

      <div class="pane" data-lens="it">
        <h2><span aria-hidden="true">◨</span> Technology</h2>
        ${applications.length ? tpl`<ul class="rows">
          ${applications.map(({ app, business }) => tpl`<li>
            <button type="button" class="row" data-goto="${app.id}" data-node="${app.id}"
                    data-links="${[...business].join(" ")}">
              <span class="row-icon" aria-hidden="true">${TYPE_ICON[app.type] || "□"}</span>
              <span class="row-main">
                <span class="row-name">${app.name}</span>
                <span class="row-sub">${TYPE_LABEL[app.type]} · ${truncate(app.description, 80)}</span>
              </span>
              <span class="row-meta">${healthBadge(app)}${lifecycleBadge(app)}${criticalityBadge(app)}</span>
            </button></li>`)}
        </ul>` : emptyState("Nothing on the technology side is mapped here yet.")}
      </div>
    </div>

    ${section("At a glance", null, tpl`<div class="impact-summary">
      ${statTile(businessNodes.length, "Business elements")}
      ${statTile(applications.length, "Applications")}
      ${(() => {
        const missing = businessNodes.filter((bn) => ![...appLinks.values()].some((l) => l.business.has(bn.id))).length;
        return statTile(missing, "With no application", missing ? "risk" : "");
      })()}
      ${statTile(applications.filter(({ app }) => app.lifecycle === "phase-out").length, "Phasing out")}
    </div>`)}
  `;
}

function firstBusinessFor(model, itNode) {
  const { targets } = model.businessFor(itNode.id);
  return targets.length ? targets[0].node : null;
}
