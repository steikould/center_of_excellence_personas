/** Measures the model layer against a model file pair. Usage: node bench.mjs NODES EDGES */
import { readFile } from "node:fs/promises";
import { buildModel } from "../js/model.js";

const [nodesPath, edgesPath] = process.argv.slice(2);
const nodesDoc = JSON.parse(await readFile(nodesPath, "utf8"));
const edgesDoc = JSON.parse(await readFile(edgesPath, "utf8"));

function time(label, fn, iterations = 1) {
  const t0 = performance.now();
  let out;
  for (let i = 0; i < iterations; i += 1) out = fn(i);
  const ms = (performance.now() - t0) / iterations;
  console.log(`${String(Math.round(ms * 100) / 100).padStart(9)} ms   ${label}`);
  return out;
}

const model = time("buildModel", () => buildModel(nodesDoc, edgesDoc));
console.log(`             ${model.nodes.size} nodes, ${model.edges.size} edges\n`);

const apps = model.ofType("Application");
const domains = model.ofLevel("B1");
const procs = model.ofLevel("B3");
const platforms = model.ofLevel("T4");

time("impactOf (one platform service)", () => model.impactOf(platforms[0].id), 20);
time("impactOf (worst of 20 platforms)", () => {
  let worst = 0;
  for (const p of platforms.slice(0, 20)) worst = Math.max(worst, model.impactOf(p.id).counts.processes);
  return worst;
});
time("technologyChain (one process)", () => model.technologyChain(procs[0].id), 20);
time("technologyChain (one domain)", () => model.technologyChain(domains[0].id), 5);
time("itScope (one domain)", () => model.itScope(domains[0].id), 5);
time("applicationsFor (one capability)", () => model.applicationsFor(model.ofLevel("B2")[0].id), 50);
time("matrix B2 (all capabilities)", () => model.matrix("B2"));
time("matrix B3 (all processes)", () => model.matrix("B3"));
time("search 'process'", () => model.search("process", {}), 5);
time("quality()", () => model.quality());
time("stats()", () => model.stats(), 5);

const mx = model.matrix("B3");
console.log(`\nmatrix B3: ${mx.rows.length} rows x ${mx.applications.length} columns = ${(mx.rows.length * mx.applications.length).toLocaleString()} cells`);
console.log(`impact reach: ${model.impactOf(platforms[0].id).counts.processes} processes from one platform service`);
console.log(`applications: ${apps.length}`);
