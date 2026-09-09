/**
 * Impact analysis, in both directions:
 *  - from an IT node: every business capability affected if it fails;
 *  - from a business node: every IT element the capability depends on.
 */
import { tpl, raw, plural } from "../util.js";
import { rows, section, statTile, emptyState, nodeHeader } from "./common.js";
import { BUSINESS_LEVELS, IT_LEVELS, LEVEL_LABELS } from "../model.js";

export function renderImpact(model, node) {
  return node.lens === "it" ? renderUpstream(model, node) : renderDownstream(model, node);
}

function renderUpstream(model, node) {
  const impact = model.impactOf(node.id);
  const { counts } = impact;
  const worst = impact.applications.filter((a) => a.criticality === "critical");

  return tpl`
    ${nodeHeader(node, {
      eyebrow: "Impact analysis · what fails with it",
      actions: tpl`<button type="button" class="primary" data-action="lens-it" data-id="${node.id}">Back to IT view</button>
                   <button type="button" class="ghost" data-action="dual" data-id="${node.id}">Dual pane</button>`,
    })}

    <p class="lede">
      If <strong>${node.name}</strong> becomes unavailable, everything below is downstream of it. This is the list to
      publish on a status page, and the list to read before proposing that it be retired.
    </p>

    <div class="impact-summary">
      ${statTile(counts.domains, "Business domains affected", counts.domains ? "risk" : "")}
      ${statTile(counts.capabilities, "Capabilities affected", counts.capabilities ? "risk" : "")}
      ${statTile(counts.processes, "Processes affected")}
      ${statTile(impact.applications.length, "Applications affected")}
      ${statTile(worst.length, "Of those, business critical", worst.length ? "risk" : "")}
    </div>

    ${counts.capabilities === 0 ? tpl`<p class="notice">
      Nothing in the business lens depends on this element. Either it is genuinely internal to IT, or the chain that
      links it to the business is missing from the model.</p>` : ""}

    <div class="columns">
      ${BUSINESS_LEVELS.map((lvl) => (impact.business[lvl].length
        ? section(LEVEL_LABELS[lvl], impact.business[lvl].length, rows(model, impact.business[lvl]))
        : raw("")))}
    </div>

    ${section("Applications in the failure path", impact.applications.length,
      impact.applications.length ? rows(model, impact.applications) : emptyState("No application depends on this."))}
  `;
}

function renderDownstream(model, node) {
  const chain = model.technologyChain(node.id);
  const byLevel = {};
  for (const lvl of IT_LEVELS) byLevel[lvl] = [];
  for (const { node: n } of chain) if (byLevel[n.level]) byLevel[n.level].push(n);
  for (const lvl of IT_LEVELS) byLevel[lvl].sort((a, b) => a.name.localeCompare(b.name));
  const total = chain.length;
  const risky = chain.map((c) => c.node).filter((n) => n.health === "at-risk");
  const singlePoints = byLevel.T2.filter((n) => n.type === "DataStore"
    && model.in(n.id).filter((e) => e.type === "reads").length >= 2);

  return tpl`
    ${nodeHeader(node, {
      eyebrow: "Technology chain · everything it rests on",
      actions: tpl`<button type="button" class="primary" data-action="lens-business" data-id="${node.id}">Back to business view</button>
                   <button type="button" class="ghost" data-action="lens-it" data-id="${node.id}">IT landscape</button>`,
    })}

    <p class="lede">
      Every IT element <strong>${node.name}</strong> transitively depends on, at every level - applications, their
      internals, the integrations that feed them, the platforms they run on and the infrastructure underneath.
    </p>

    <div class="impact-summary">
      ${statTile(total, "IT elements in the chain")}
      ${statTile(byLevel.T1.length, "Applications & services")}
      ${statTile(byLevel.T4.length, "Platform services")}
      ${statTile(byLevel.T5.length, "Infrastructure elements")}
      ${statTile(risky.length, "Elements flagged at risk", risky.length ? "risk" : "")}
    </div>

    ${singlePoints.length ? tpl`<p class="notice">
      ${plural(singlePoints.length, "shared data store")} in this chain is read by more than one application:
      ${singlePoints.map((n) => n.name).join(", ")}.
    </p>` : ""}

    ${IT_LEVELS.map((lvl) => (byLevel[lvl].length
      ? section(`${lvl} · ${LEVEL_LABELS[lvl]}`, byLevel[lvl].length, rows(model, byLevel[lvl]))
      : raw("")))}

    ${total === 0 ? emptyState("Nothing in the IT lens is mapped to this part of the business yet.") : ""}
  `;
}
