/**
 * Capability-to-application matrix: the view that makes redundancy and gaps
 * impossible to miss. Rows are business nodes, columns are applications.
 */
import { tpl, raw, plural } from "../util.js";
import { statTile } from "./common.js";
import { LEVEL_LABELS } from "../model.js";

/**
 * A matrix is inherently two-dimensional, so it is the one view that can blow
 * up: 540 processes against 420 applications is 226,800 cells, and building
 * that many table cells is what makes a large model feel broken. Beyond a cell
 * budget the rows page, and the columns narrow to the applications that appear
 * on the page. The redundancy and gap counts are still computed over every row,
 * so the headline findings never depend on which page you are looking at.
 */
const CELL_BUDGET = 12000;
const ROWS_PER_PAGE = 40;

export function renderMatrix(model, params) {
  const level = ["B2", "B3"].includes(params.get("level")) ? params.get("level") : "B2";
  const scopeId = params.get("scope") && model.has(params.get("scope")) ? params.get("scope") : null;
  const { rows: allRows, applications: allApplications, cells, redundant, gaps } = model.matrix(level, scopeId);
  const domains = model.ofLevel("B1")
    .sort((a, b) => (a.code || "").localeCompare(b.code || "", undefined, { numeric: true }));

  const paged = allRows.length * allApplications.length > CELL_BUDGET;
  // Columns can never exceed the full application set, so sizing the page
  // against that bound keeps every page inside the budget in the worst case.
  const rowsPerPage = Math.max(10, Math.min(ROWS_PER_PAGE,
    Math.floor(CELL_BUDGET / Math.max(1, allApplications.length))));
  const pageCount = paged ? Math.ceil(allRows.length / rowsPerPage) : 1;
  const page = Math.min(Math.max(1, Number(params.get("page")) || 1), pageCount);
  const matrixRows = paged
    ? allRows.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : allRows;
  const applications = paged
    ? (() => {
        const onPage = new Set();
        for (const r of matrixRows) for (const c of cells.get(r.id)) onPage.add(c.app.id);
        return allApplications.filter((a) => onPage.has(a.id));
      })()
    : allApplications;

  const head = applications.map((app) => tpl`
    <th scope="col" title="${app.name} · ${app.lifecycle}">
      <button type="button" class="rot" data-goto="${app.id}">${app.name}</button>
    </th>`);

  const body = matrixRows.map((rowNode) => {
    const list = cells.get(rowNode.id);
    const direct = list.filter((c) => !c.inherited).length;
    const rowClass = direct > 1 ? "redundant" : list.length === 0 ? "gap" : "";
    const byApp = new Map(list.map((c) => [c.app.id, c]));
    return tpl`
      <tr class="${rowClass}" data-row="${rowNode.id}">
        <th scope="row">
          <button type="button" class="link-cell" data-goto="${rowNode.id}"
                  style="background:none;border:0;padding:0;text-align:left;cursor:pointer;font:inherit;color:inherit">
            ${rowNode.code ? tpl`<span class="mono">${rowNode.code}</span> ` : ""}${rowNode.name}
          </button>
          ${direct > 1 ? tpl` <span class="badge badge-watch" title="More than one application covers this">▲ ${direct} apps</span>` : ""}
          ${list.length === 0 ? raw(' <span class="badge badge-risk" title="No application supports this">■ gap</span>') : ""}
        </th>
        ${applications.map((app) => {
          const cell = byApp.get(app.id);
          if (!cell) return raw('<td aria-label="not supported"></td>');
          const inherited = cell.inherited;
          return tpl`<td class="${inherited ? "hit-inherited" : "hit"}" data-goto="${app.id}"
                       title="${app.name} ${inherited ? "covers this through a parent capability" : "supports this directly"}">
            <span aria-label="${inherited ? "inherited" : "supports"}">${inherited ? "○" : "●"}</span></td>`;
        })}
      </tr>`;
  });

  return tpl`
    <div class="view-head">
      <div>
        <p class="eyebrow">Portfolio lens</p>
        <h1>Capability to application matrix</h1>
        <p class="lede">
          Rows with more than one application are rationalisation candidates. Rows with none are capability gaps -
          either genuinely manual work, or something nobody has mapped yet.
        </p>
      </div>
      <div class="chips">
        <label>Rows
          <select data-matrix="level">
            <option value="B2" ${level === "B2" ? raw("selected") : ""}>${LEVEL_LABELS.B2}</option>
            <option value="B3" ${level === "B3" ? raw("selected") : ""}>${LEVEL_LABELS.B3}</option>
          </select>
        </label>
        <label>Scope
          <select data-matrix="scope">
            <option value="">Whole organisation</option>
            ${domains.map((d) => tpl`<option value="${d.id}" ${scopeId === d.id ? raw("selected") : ""}>${d.name}</option>`)}
          </select>
        </label>
      </div>
    </div>

    <div class="impact-summary">
      ${statTile(allRows.length, LEVEL_LABELS[level] + " rows")}
      ${statTile(allApplications.length, "Applications")}
      ${statTile(redundant.length, "Rows with overlapping applications", redundant.length ? "risk" : "")}
      ${statTile(gaps.length, "Rows with no application", gaps.length ? "risk" : "")}
    </div>

    ${paged ? tpl`<div class="matrix-paging">
      <button type="button" class="ghost" data-matrix-page="${page - 1}" ${page <= 1 ? raw("disabled") : ""}>← Previous</button>
      <span class="count">Rows ${(page - 1) * rowsPerPage + 1}–${Math.min(page * rowsPerPage, allRows.length)}
        of ${allRows.length}, page ${page} of ${pageCount}</span>
      <button type="button" class="ghost" data-matrix-page="${page + 1}" ${page >= pageCount ? raw("disabled") : ""}>Next →</button>
      <span class="count">Columns show the ${applications.length} applications appearing on this page.
        Narrow the scope above to see the whole grid at once.</span>
    </div>` : ""}

    <p class="matrix-legend">
      <span><span class="badge badge-business">●</span> supported directly</span>
      <span><span class="badge badge-neutral">○</span> inherited from a parent capability</span>
      <span><span class="badge badge-watch">▲</span> overlap - more than one application</span>
      <span><span class="badge badge-risk">■</span> gap - nothing supports it</span>
    </p>

    ${redundant.length ? tpl`<p class="notice">
      ${plural(redundant.length, "row")} have overlapping applications. For example
      <strong>${redundant[0].name}</strong> is covered by
      ${cells.get(redundant[0].id).filter((c) => !c.inherited).map((c) => c.app.name).join(" and ")}.
    </p>` : ""}
    ${gaps.length ? tpl`<p class="notice risk">
      ${plural(gaps.length, "row")} have no supporting application at all, including <strong>${gaps[0].name}</strong>.
    </p>` : ""}

    <div class="matrix-wrap">
      <table class="matrix">
        <caption class="sr-only">Applications supporting each ${LEVEL_LABELS[level]}</caption>
        <thead><tr><th class="corner" scope="col">${LEVEL_LABELS[level]}</th>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}
