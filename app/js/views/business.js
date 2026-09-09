/** The business lens: domain map and drill-down through capability levels. */
import { tpl, raw } from "../util.js";
import { tile, tiles, rows, section, nodeHeader, statTile, emptyState } from "./common.js";

const CHILD_HEADING = {
  B1: "Capabilities",
  B2: "Processes and sub-capabilities",
  B3: "Activities",
};

export function renderDomainMap(model) {
  const domains = model.ofLevel("B1")
    .sort((a, b) => (a.code || "").localeCompare(b.code || "", undefined, { numeric: true }));
  const stats = model.stats();
  const apps = model.ofType("Application");
  const atRisk = apps.filter((a) => a.health === "at-risk" || a.lifecycle === "phase-out");

  // Tile size carries information: the domains with the most processes beneath
  // them take two columns, so the map reads like a treemap rather than a grid.
  const sizeOf = (d) => model.subtree(d.id).filter((n) => n.level === "B3").length;
  const threshold = [...domains].map(sizeOf).sort((a, b) => b - a)[Math.floor(domains.length / 3)] ?? 0;

  return tpl`
    <div class="view-head">
      <div>
        <p class="eyebrow">Business lens · Level 1</p>
        <h1>${model.meta.name}</h1>
        <p class="lede">
          Every top-level problem area the organisation owns. Open one to drill into its capabilities and
          processes, or switch to the IT lens at any point to see the technology that makes it run.
        </p>
      </div>
    </div>

    <div class="impact-summary">
      ${statTile(domains.length, "Business domains")}
      ${statTile(model.ofLevel("B2").length, "Capabilities")}
      ${statTile(model.ofLevel("B3").length, "Processes")}
      ${statTile(apps.length, "Applications")}
      ${statTile(atRisk.length, "Applications at risk or phasing out", atRisk.length ? "risk" : "")}
      ${statTile(stats.nodes.toLocaleString(), "Model elements")}
    </div>

    ${section("Business domains", domains.length, tpl`<div class="tiles treemap">
      ${domains.map((d) => tile(model, d, { weight: sizeOf(d) > threshold ? "lg" : "" }))}
    </div>`)}
  `;
}

export function renderBusinessNode(model, node) {
  const children = model.children(node.id)
    .sort((a, b) => (a.code || "").localeCompare(b.code || "", undefined, { numeric: true }));
  const { direct, inherited } = model.applicationsFor(node.id);
  const subtree = model.subtree(node.id).filter((n) => n.id !== node.id);
  const capabilities = subtree.filter((n) => n.level === "B2").length;
  const processes = subtree.filter((n) => n.level === "B3").length;
  const activities = subtree.filter((n) => n.level === "B4").length;
  const apps = [...direct.map((d) => d.app), ...inherited.map((d) => d.app)];
  const troubled = apps.filter((a) => a.health === "at-risk" || a.lifecycle === "phase-out");

  const actions = tpl`
    <button type="button" class="primary" data-action="lens-it" data-id="${node.id}">Switch to IT view →</button>
    <button type="button" class="ghost" data-action="dual" data-id="${node.id}">Dual pane</button>
    <button type="button" class="ghost" data-action="impact" data-id="${node.id}">Show full technology chain</button>`;

  return tpl`
    ${nodeHeader(node, { actions })}

    <div class="impact-summary">
      ${capabilities ? statTile(capabilities, "Capabilities") : ""}
      ${processes ? statTile(processes, "Processes") : ""}
      ${!processes && activities ? statTile(activities, "Activities") : ""}
      ${statTile(apps.length, "Supporting applications", apps.length ? "" : "risk")}
      ${statTile(troubled.length, "Of those, at risk or phasing out", troubled.length ? "risk" : "")}
      ${node.maturity ? statTile(`${node.maturity}/5`, "Maturity rating") : ""}
    </div>

    ${apps.length === 0 ? tpl`<p class="notice risk">
      No application is recorded against this part of the business. Either the work is done manually, or the
      model has a gap - both are worth knowing about.</p>` : ""}

    ${children.length
      ? section(CHILD_HEADING[node.level] || "Below this", children.length, tiles(model, children))
      : section("Below this", null, emptyState("This is the most detailed level recorded for this branch."))}

    ${section(
      "Supporting applications",
      apps.length,
      direct.length || inherited.length
        ? tpl`
          ${direct.length ? rows(model, direct.map((d) => d.app), {
            meta: null,
            emptyMessage: "No directly attached application.",
          }) : ""}
          ${inherited.length ? tpl`
            <p class="lede" style="margin-top:.75rem;font-size:.85rem">
              Also inherited from a higher level: these are attached to a parent capability and therefore cover this node too.
            </p>
            ${rows(model, inherited.map((d) => d.app))}` : ""}`
        : emptyState("Nothing supports this yet - it appears in the data quality panel as a gap."),
      raw(""),
    )}
  `;
}
