/** Data quality: the model's own honesty panel. Orphans and gaps are findings,
 *  not errors - they are usually the most interesting thing on the map. */
import { tpl } from "../util.js";
import { rows, section, statTile, emptyState } from "./common.js";
import { LEVEL_LABELS } from "../model.js";

export function renderQuality(model) {
  const q = model.quality();
  const unsupportedCaps = q.unsupported.filter((n) => n.level === "B2");
  const unsupportedProcs = q.unsupported.filter((n) => n.level === "B3");

  return tpl`
    <div class="view-head">
      <div>
        <p class="eyebrow">Model hygiene</p>
        <h1>Data quality</h1>
        <p class="lede">
          What the model itself is telling you. Each finding is a question for a human, not a bug: an orphan
          application may be genuinely unowned, and a capability with no application may be deliberately manual.
        </p>
      </div>
    </div>

    <div class="impact-summary">
      ${statTile(q.orphanApplications.length, "Applications with no business link", q.orphanApplications.length ? "risk" : "")}
      ${statTile(unsupportedCaps.length, "Capabilities with no application", unsupportedCaps.length ? "risk" : "")}
      ${statTile(q.redundancy.length, "Processes with overlapping applications")}
      ${statTile(q.sharedStores.length, "Data stores shared by 3+ applications")}
      ${statTile(q.noOwner.length, "Elements with no named owner")}
      ${statTile(q.danglingEdges.length, "Relationships pointing nowhere", q.danglingEdges.length ? "risk" : "")}
    </div>

    ${section("Orphan applications", q.orphanApplications.length,
      q.orphanApplications.length
        ? tpl`<p class="lede">Nothing records what business work these support. Until that is fixed they cannot be
            costed, prioritised or safely retired.</p>${rows(model, q.orphanApplications)}`
        : emptyState("Every application is linked to at least one business element."))}

    ${section("Business elements with no supporting application", q.unsupported.length,
      q.unsupported.length
        ? tpl`
          ${unsupportedCaps.length ? tpl`<h3>${LEVEL_LABELS.B2}</h3>${rows(model, unsupportedCaps)}` : ""}
          ${unsupportedProcs.length ? tpl`<h3 style="margin-top:1rem">${LEVEL_LABELS.B3}</h3>${rows(model, unsupportedProcs)}` : ""}`
        : emptyState("Every capability and process has at least one application behind it."))}

    ${section("Rationalisation candidates", q.redundancy.length,
      q.redundancy.length
        ? tpl`<table class="table-simple">
            <thead><tr><th>Process</th><th>Applications covering it</th></tr></thead>
            <tbody>${q.redundancy.map(({ node, apps }) => tpl`<tr>
              <td><button type="button" class="link-cell" data-goto="${node.id}"
                    style="background:none;border:0;padding:0;cursor:pointer;font:inherit;color:inherit;text-decoration:underline">${node.name}</button></td>
              <td>${apps.map((a) => tpl`<button type="button" data-goto="${a.id}"
                    style="background:none;border:0;padding:0 .4rem 0 0;cursor:pointer;font:inherit;color:inherit;text-decoration:underline">${a.name}</button>`)}</td>
            </tr>`)}</tbody></table>`
        : emptyState("No process is covered by more than one application."))}

    ${section("Shared data stores", q.sharedStores.length,
      q.sharedStores.length
        ? tpl`<p class="lede">Read directly by three or more applications. Each one is a single point of failure and a
            coupling that will make any migration harder.</p>
          <table class="table-simple">
            <thead><tr><th>Data store</th><th>Read or written by</th></tr></thead>
            <tbody>${q.sharedStores.map(({ node, applications }) => tpl`<tr>
              <td><button type="button" data-goto="${node.id}"
                    style="background:none;border:0;padding:0;cursor:pointer;font:inherit;color:inherit;text-decoration:underline">${node.name}</button></td>
              <td>${applications.map((a) => a.name).join(", ")}</td>
            </tr>`)}</tbody></table>`
        : emptyState("No data store is shared across three or more applications."))}

    ${section("Elements with no named owner", q.noOwner.length,
      q.noOwner.length ? rows(model, q.noOwner.slice(0, 60)) : emptyState("Everything has an owner."))}

    ${q.danglingEdges.length ? section("Relationships pointing at missing elements", q.danglingEdges.length,
      tpl`<p class="notice risk">These came in with an import and were dropped when the model was built.</p>
        <ul class="link-list">${q.danglingEdges.slice(0, 40).map((e) => tpl`<li><span class="edge-type">${e.type}</span> ${e.from} → ${e.to}</li>`)}</ul>`) : ""}
  `;
}
