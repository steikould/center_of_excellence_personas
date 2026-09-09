/** Model administration: import, export, round-trip check and the change log. */
import { tpl, plural } from "../util.js";
import { section, statTile, emptyState } from "./common.js";
import { state, ROLES, can } from "../state.js";
import { documentsFrom, serialize } from "../io.js";

export function renderModelAdmin(model) {
  const stats = model.stats();
  const docs = documentsFrom(model);
  const nodeBytes = serialize(docs.nodes).length;
  const edgeBytes = serialize(docs.edges).length;
  const log = [...state.changes].reverse();

  return tpl`
    <div class="view-head">
      <div>
        <p class="eyebrow">Model</p>
        <h1>Import, export and change history</h1>
        <p class="lede">
          The model round-trips through two plain JSON documents - one for nodes, one for edges - so it can be
          populated from a spreadsheet, an EA repository or a CMDB extract, and handed back out the same way.
        </p>
      </div>
    </div>

    <div class="impact-summary">
      ${statTile(stats.nodes.toLocaleString(), "Nodes")}
      ${statTile(stats.edges.toLocaleString(), "Relationships")}
      ${statTile(stats.byLens.business.toLocaleString(), "Business elements")}
      ${statTile(stats.byLens.it.toLocaleString(), "IT elements")}
      ${statTile(state.changes.length, "Unsaved local changes", state.changes.length ? "risk" : "")}
      ${statTile(ROLES[state.role].label, "Your role")}
    </div>

    ${section("Export", null, tpl`
      <div class="panel">
        <p>Both files are written in canonical form - fixed key order, elements sorted by id - so two exports of the
        same model are byte-identical and diff cleanly in version control.</p>
        <p class="chips">
          <button type="button" class="primary" data-action="export-nodes">Download nodes.json (${Math.round(nodeBytes / 1024)} KB)</button>
          <button type="button" class="primary" data-action="export-edges">Download edges.json (${Math.round(edgeBytes / 1024)} KB)</button>
          <button type="button" class="ghost" data-action="export-bundle">Download both as one bundle</button>
          <button type="button" class="ghost" data-action="roundtrip">Run round-trip self-check</button>
        </p>
        <p id="roundtrip-result" class="lede" role="status"></p>
      </div>`)}

    ${section("Import", null, tpl`
      <div class="panel">
        ${can("admin")
          ? tpl`<p>Select a nodes file and an edges file - or a single bundle holding both. The model is validated
              before anything is replaced, and problems are listed rather than silently swallowed.</p>
            <p class="chips">
              <label class="ghost" style="padding:.4rem .7rem;cursor:pointer">
                Choose file(s)<input type="file" id="import-file" accept=".json,application/json" multiple hidden>
              </label>
              <button type="button" class="ghost" data-action="reset-model">Reset to the shipped demo model</button>
            </p>
            <div id="import-report"></div>`
          : tpl`<p class="notice">Importing replaces the whole model, so it is limited to the Admin role.
              Switch role in the header to try it.</p>`}
      </div>`)}

    ${section("Change log", state.changes.length, log.length
      ? tpl`<table class="table-simple">
          <thead><tr><th>When</th><th>Who</th><th>Change</th><th></th></tr></thead>
          <tbody>${log.map((c) => tpl`<tr>
            <td class="mono">${new Date(c.at).toLocaleString()}</td>
            <td>${c.actor} <span class="badge badge-neutral">${c.role}</span></td>
            <td>${c.summary || c.op} <span class="mono">${c.target}</span></td>
            <td>${can("edit") ? tpl`<button type="button" class="ghost" data-action="undo-change" data-id="${c.id}">Undo</button>` : ""}</td>
          </tr>`)}</tbody>
        </table>
        ${can("admin") ? tpl`<p style="margin-top:.75rem"><button type="button" class="ghost" data-action="clear-changes">
          Discard all ${plural(state.changes.length, "local change")}</button></p>` : ""}`
      : emptyState("No local edits yet. Changes made in the inspector are recorded here with who made them and when."))}

    ${section("Roles", null, tpl`
      <table class="table-simple">
        <thead><tr><th>Role</th><th>Can do</th></tr></thead>
        <tbody>
          <tr><td>Viewer</td><td>Browse, search, run impact analysis, export.</td></tr>
          <tr><td>Editor</td><td>Everything a viewer can do, plus edit elements and relationships. Every edit is logged.</td></tr>
          <tr><td>Admin</td><td>Everything an editor can do, plus import a model, delete elements and clear the change log.</td></tr>
        </tbody>
      </table>
      <p class="lede" style="margin-top:.5rem">
        Roles are held in this browser for the demo. In a deployed instance they would come from the identity provider.
      </p>`)}

    ${section("File format", null, tpl`
      <div class="panel">
        <p>Nodes carry the properties every element shares; anything type-specific lives in <code>props</code>.
        Edges are directed and typed.</p>
        <pre class="pre">${JSON.stringify({
          format: "business-it-map", kind: "nodes", version: model.meta.version, model: model.meta.name,
          nodes: [docs.nodes.nodes.find((n) => n.type === "Application") || docs.nodes.nodes[0]],
        }, null, 2)}</pre>
        <pre class="pre">${JSON.stringify({
          format: "business-it-map", kind: "edges", version: model.meta.version, model: model.meta.name,
          edges: [docs.edges.edges.find((e) => e.type === "supports") || docs.edges.edges[0]],
        }, null, 2)}</pre>
      </div>`)}
  `;
}
