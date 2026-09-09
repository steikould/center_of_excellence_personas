/**
 * Checks the acceptance criteria against the real model and the real modules.
 * Run:  node app/tools/verify.mjs
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { buildModel } from "../js/model.js";
import { documentsFrom, serialize, readDocument, validateDocuments, canonicalNodesDocument, canonicalEdgesDocument } from "../js/io.js";
import { parseHash, buildHash } from "../js/router.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, "..", "data");

let failures = 0;
function check(name, condition, detail = "") {
  const ok = Boolean(condition);
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` - ${detail}` : ""}`);
  return ok;
}

const nodesText = await readFile(join(DATA, "nodes.json"), "utf8");
const edgesText = await readFile(join(DATA, "edges.json"), "utf8");
const nodesDoc = JSON.parse(nodesText);
const edgesDoc = JSON.parse(edgesText);
const model = buildModel(nodesDoc, edgesDoc);

console.log(`\nModel: ${model.meta.name}`);
console.log(`${model.nodes.size} nodes, ${model.edges.size} relationships\n`);

/* --- 1. Three clicks from the landing page to a level B3 process ----------- */
{
  const domains = model.ofLevel("B1");
  const domain = domains.find((d) => d.name === "Acquire & Serve Customers");
  const capability = model.children(domain.id).find((c) => c.name === "Billing & Revenue");
  const process = model.children(capability.id).find((p) => p.name === "Payment Processing");
  const trail = model.trail(process.id);
  check("1. A level B3 process is three clicks from the landing page",
    domains.length && capability && process && trail.length === 3,
    trail.map((n) => n.name).join(" > "));
  check("1b. Every B3 process has a complete breadcrumb trail",
    model.ofLevel("B3").every((p) => model.trail(p.id).length === 3));
}

/* --- 2. One action pivots to an IT landscape scoped to that node ----------- */
{
  const process = model.all().find((n) => n.name === "Payment Processing");
  const scope = model.itScope(process.id);
  const apps = scope.T1.filter((n) => n.type === "Application");
  const everyAppSupports = apps.every((app) => {
    const reach = new Set(model.closure([app.id], "up", { includeStart: true }).map((r) => r.node.id));
    return reach.has(process.id) || model.trail(process.id).some((t) => reach.has(t.id));
  });
  check("2. Pivoting from a B3 process yields an IT landscape scoped to it",
    apps.length > 0 && everyAppSupports,
    `${apps.length} application(s): ${apps.map((a) => a.name).join(", ")}`);
  check("2b. The scope reaches every technology level",
    ["T1", "T2", "T4", "T5"].every((lvl) => scope[lvl].length > 0),
    Object.entries(scope).map(([k, v]) => `${k}=${v.length}`).join(" "));
}

/* --- 3. From a T4 platform node, every business capability affected -------- */
{
  const platform = model.all().find((n) => n.level === "T4" && n.name === "Oracle Database Service");
  const impact = model.impactOf(platform.id);
  check("3. A T4 platform node reports the business capabilities it would take down",
    impact.counts.capabilities > 0 && impact.counts.domains > 0,
    `${impact.counts.domains} domains, ${impact.counts.capabilities} capabilities, ${impact.counts.processes} processes`);

  // The chain must be symmetric: if the platform is in a capability's technology
  // chain, that capability must appear in the platform's impact set.
  const affected = new Set(impact.business.B2.map((n) => n.id));
  const inconsistent = model.ofLevel("B2").filter((cap) => {
    const chain = new Set(model.technologyChain(cap.id).map((c) => c.node.id));
    return chain.has(platform.id) !== affected.has(cap.id);
  });
  check("3b. Impact analysis and the technology chain agree in both directions",
    inconsistent.length === 0,
    inconsistent.length ? `disagree on ${inconsistent.map((n) => n.name).join(", ")}` : "symmetric");
}

/* --- 4. The matrix flags redundancy and a gap ------------------------------ */
{
  const matrix = model.matrix("B3");
  const crmRow = matrix.rows.find((r) => r.name === "Lead Qualification");
  const crmApps = matrix.cells.get(crmRow.id).map((c) => c.app.name);
  check("4. The matrix flags at least one redundant application",
    matrix.redundant.length > 0 && crmApps.length > 1,
    `${matrix.redundant.length} overlapping rows, e.g. Lead Qualification: ${crmApps.join(" + ")}`);
  const capMatrix = model.matrix("B2");
  check("4b. The matrix flags at least one unsupported capability",
    capMatrix.gaps.length > 0,
    capMatrix.gaps.map((g) => g.name).join(", "));
  check("4c. Exactly one application has no business link at all",
    model.quality().orphanApplications.length === 1,
    model.quality().orphanApplications.map((a) => a.name).join(", "));
  const shared = model.quality().sharedStores;
  check("4d. A shared data store with several dependent applications is detectable",
    shared.length > 0 && shared.some((s) => s.applications.length >= 4),
    shared.map((s) => `${s.node.name} (${s.applications.length} apps)`).join("; "));
}

/* --- 5. Every view state is addressable by URL ----------------------------- */
{
  const cases = [
    { segments: [], params: {} },
    { segments: ["b", "proc-payment-processing"], params: { ov: "maturity" } },
    { segments: ["it", "proc-payment-processing"], params: { t: "T4", fh: "ok,watch" } },
    { segments: ["impact", "plat-oracle"], params: {} },
    { segments: ["dual", "cap-billing-revenue"], params: {} },
    { segments: ["matrix"], params: { level: "B3", scope: "bd-acquire-serve-customers" } },
    { segments: ["search"], params: { q: "cold chain" } },
    { segments: ["quality"], params: {} },
    { segments: ["model"], params: {} },
  ];
  const roundTripped = cases.every((c) => {
    const hash = buildHash(c.segments, c.params);
    const parsed = parseHash(hash);
    return JSON.stringify(parsed.segments) === JSON.stringify(c.segments)
      && Object.entries(c.params).every(([k, v]) => parsed.params.get(k) === String(v));
  });
  check("5. Every view state round-trips through its URL", roundTripped,
    cases.map((c) => buildHash(c.segments, c.params)).join("  "));
}

/* --- 6. Export then re-import reproduces the identical model --------------- */
{
  const docs = documentsFrom(model);
  const exportedNodes = serialize(docs.nodes);
  const exportedEdges = serialize(docs.edges);
  check("6. An export is byte-identical to the files on disk",
    exportedNodes === nodesText && exportedEdges === edgesText,
    exportedNodes === nodesText ? "nodes.json and edges.json match" : "serialisation drift");

  const reNodes = readDocument(exportedNodes);
  const reEdges = readDocument(exportedEdges);
  const { nodes, edges, errors } = validateDocuments(reNodes.nodes, reEdges.edges);
  const rebuilt = buildModel(canonicalNodesDocument(nodes, model.meta), canonicalEdgesDocument(edges, model.meta));
  const again = documentsFrom(rebuilt);
  check("6b. Export, re-import and re-export reproduces the identical model",
    errors.length === 0 && serialize(again.nodes) === exportedNodes && serialize(again.edges) === exportedEdges,
    `${rebuilt.nodes.size} nodes, ${rebuilt.edges.size} relationships preserved`);

  const bundle = serialize({
    format: "business-it-map", kind: "bundle", version: model.meta.version, model: model.meta.name,
    nodes: docs.nodes.nodes, edges: docs.edges.edges,
  });
  const parsedBundle = readDocument(bundle);
  check("6c. A single-file bundle imports as one model",
    parsedBundle.nodes.length === model.nodes.size && parsedBundle.edges.length === model.edges.size);
}

/* --- Model integrity ------------------------------------------------------ */
{
  const parents = new Map();
  let doubleParented = 0;
  for (const e of model.edges.values()) {
    if (e.type !== "contains") continue;
    if (parents.has(e.to)) doubleParented += 1;
    else parents.set(e.to, e.from);
  }
  check("7. Hierarchy edges form a tree - no element has two parents", doubleParented === 0);
  check("7b. Every relationship points at an element that exists",
    [...model.edges.values()].every((e) => model.has(e.from) && model.has(e.to)));
  check("7c. Every element carries a name and a description",
    model.all().every((n) => n.name && n.description));

  const t0 = performance.now();
  for (const app of model.ofType("Application")) model.impactOf(app.id);
  const perApp = (performance.now() - t0) / model.ofType("Application").length;
  check("8. Impact analysis stays interactive", perApp < 25, `${perApp.toFixed(1)} ms per application`);

  const t1 = performance.now();
  model.matrix("B3");
  check("8b. The full matrix builds quickly", performance.now() - t1 < 600,
    `${(performance.now() - t1).toFixed(0)} ms for 130 rows x 67 columns`);
}

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}\n`);
process.exit(failures === 0 ? 0 : 1);
