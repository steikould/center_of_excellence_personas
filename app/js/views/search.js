/** Global search across both lenses, honouring the active filters. */
import { tpl, plural, truncate } from "../util.js";
import { section, statTile, emptyState } from "./common.js";
import { state, hasActiveFilters } from "../state.js";
import { TYPE_ICON, TYPE_LABEL, healthBadge, criticalityBadge, lifecycleBadge } from "../format.js";
import { LEVEL_LABELS } from "../model.js";

export function renderSearch(model, params) {
  const query = params.get("q") || "";
  const results = model.search(query, state.filters);
  const business = results.filter((r) => r.node.lens === "business");
  const it = results.filter((r) => r.node.lens === "it");
  const shown = results.slice(0, 300);

  return tpl`
    <div class="view-head">
      <div>
        <p class="eyebrow">Search</p>
        <h1>${query ? tpl`Results for “${query}”` : "Browse the whole model"}</h1>
        <p class="lede">
          ${plural(results.length, "match")} across both lenses${hasActiveFilters() ? ", with your filters applied" : ""}.
          ${results.length > shown.length ? `Showing the first ${shown.length}.` : ""}
        </p>
      </div>
    </div>

    <div class="impact-summary">
      ${statTile(business.length, "Business elements")}
      ${statTile(it.length, "IT elements")}
    </div>

    ${shown.length ? section("Matches", shown.length, tpl`<ul class="rows">
      ${shown.map(({ node }) => tpl`<li>
        <button type="button" class="row" data-goto="${node.id}" data-node="${node.id}">
          <span class="row-icon" aria-hidden="true">${TYPE_ICON[node.type] || "□"}</span>
          <span class="row-main">
            <span class="row-name">${node.name}</span>
            <span class="row-sub">${LEVEL_LABELS[node.level] || node.level} ·
              ${TYPE_LABEL[node.type] || node.type} · ${truncate(node.description, 90)}</span>
          </span>
          <span class="row-meta">
            <span class="badge badge-${node.lens === "business" ? "business" : "it"}">${node.lens === "business" ? "Business" : "IT"}</span>
            ${healthBadge(node)}${node.type === "Application" ? lifecycleBadge(node) : ""}${criticalityBadge(node)}
          </span>
        </button></li>`)}
    </ul>`) : emptyState(query
      ? "Nothing matched. Try fewer words, or clear the filters in the sidebar."
      : "Type something in the search box above.")}
  `;
}
