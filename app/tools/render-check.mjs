/**
 * Renders every view against the real model and checks the output.
 *
 * verify.mjs proves the model is sound; this proves the views can actually
 * draw it. They are pure functions returning HTML strings, so they run in Node
 * with no DOM and no browser - which makes this cheap enough to run on every
 * push.
 *
 * The strongest check here is the last one: every `data-goto` in the rendered
 * HTML must resolve to a node that exists. In an application where every row,
 * tile and chip is a navigation target, a dead link is the most likely bug and
 * the least likely to be noticed.
 *
 * Run:  node app/tools/render-check.mjs
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { toHTML } from "../js/util.js";
import { state, initState } from "../js/state.js";
import { renderDomainMap, renderBusinessNode } from "../js/views/business.js";
import { renderITView } from "../js/views/it.js";
import { renderMatrix } from "../js/views/matrix.js";
import { renderImpact } from "../js/views/impact.js";
import { renderDual } from "../js/views/dual.js";
import { renderSearch } from "../js/views/search.js";
import { renderQuality } from "../js/views/quality.js";
import { renderModelAdmin } from "../js/views/modeladmin.js";
import { renderInspector } from "../js/views/inspector.js";
import { renderAgentEstate, renderAgent, renderRuntimePanel } from "../js/views/agents.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, "..", "data");

let failures = 0;
function check(name, condition, detail = "") {
  const ok = Boolean(condition);
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` - ${detail}` : ""}`);
  return ok;
}

const nodesDoc = JSON.parse(await readFile(join(DATA, "nodes.json"), "utf8"));
const edgesDoc = JSON.parse(await readFile(join(DATA, "edges.json"), "utf8"));
initState(nodesDoc, edgesDoc);
const model = state.model;

/**
 * Walk the tags with a stack. Counting angle brackets cannot distinguish a
 * paired <text>…</text> from a void <br>, and SVG uses element names that look
 * like both - so this does it properly and names the first tag that goes wrong.
 */
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr"]);

function firstTagMismatch(html) {
  const stack = [];
  for (const m of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g)) {
    const [, closing, rawName, attrs, selfClose] = m;
    const name = rawName.toLowerCase();
    if (VOID.has(name) || selfClose === "/") continue;
    if (attrs.includes("<")) return `malformed tag <${name}>`;
    if (!closing) { stack.push(name); continue; }
    if (!stack.length) return `</${name}> with nothing open`;
    const open = stack.pop();
    if (open !== name) return `</${name}> closes <${open}>`;
  }
  return stack.length ? `<${stack[stack.length - 1]}> never closed` : null;
}

const P = (q = "") => new URLSearchParams(q);
const first = (type) => model.ofType(type)[0];
const firstOfLevel = (lvl) => model.ofLevel(lvl)[0];

/** Every view, with a representative anchor for each shape it has to handle. */
const views = [
  ["domain map", () => renderDomainMap(model)],
  ...["B1", "B2", "B3", "B4"].map((lvl) =>
    [`business ${lvl}`, () => renderBusinessNode(model, firstOfLevel(lvl))]),
  ["IT view from a capability", () => renderITView(model, firstOfLevel("B2"), P())],
  ["IT view at T4", () => renderITView(model, firstOfLevel("B2"), P("t=T4"))],
  ...["Application", "DataStore", "Interface", "PlatformService", "Host", "Site", "AgentRuntime"].map((t) =>
    [`IT view of ${t}`, () => renderITView(model, first(t), P())]),
  ["agent estate", () => renderAgentEstate(model)],
  ...model.ofType("Agent").map((a) => [`agent ${a.props.shortName}`, () => renderAgent(model, a)]),
  ...model.ofType("AgentRuntime").map((r) => [`runtime panel ${r.id}`, () => renderRuntimePanel(model, r)]),
  ["impact of a platform", () => renderImpact(model, first("PlatformService"))],
  ["impact of a runtime", () => renderImpact(model, first("AgentRuntime"))],
  ["impact of an agent", () => renderImpact(model, first("Agent"))],
  ["technology chain of a process", () => renderImpact(model, firstOfLevel("B3"))],
  ["dual pane", () => renderDual(model, firstOfLevel("B2"))],
  ["matrix B2", () => renderMatrix(model, P("level=B2"))],
  ["matrix B3 scoped", () => renderMatrix(model, P(`level=B3&scope=${firstOfLevel("B1").id}`))],
  ["search", () => renderSearch(model, P("q=agent"))],
  ["search with no hits", () => renderSearch(model, P("q=zzzznothing"))],
  ["data quality", () => renderQuality(model)],
  ["model admin", () => renderModelAdmin(model)],
  ["inspector on an agent", () => renderInspector(model, first("Agent"), {})],
  ["inspector on an application", () => renderInspector(model, first("Application"), {})],
  ["inspector editing", () => renderInspector(model, first("Application"), { editing: true })],
];

const rendered = new Map();
for (const [name, fn] of views) {
  let html = null;
  let error = null;
  try {
    html = toHTML(fn());
  } catch (err) {
    error = err;
  }
  if (!check(`renders: ${name}`, error === null && typeof html === "string" && html.length > 40,
    error ? error.message : html === null ? "" : `${html.length} chars`)) continue;
  rendered.set(name, html);
}

/* --- output hygiene -------------------------------------------------------
   Symptoms of a template bug that a screenshot would show but a human might
   not read: a stringified object, a stray `undefined`, or an unclosed tag. */
{
  const leaks = [...rendered].filter(([, html]) => html.includes("[object Object]"));
  check("no view leaks a stringified object", leaks.length === 0,
    leaks.map(([n]) => n).join(", "));

  const undef = [...rendered].filter(([, html]) => />\s*undefined\s*</.test(html)
    || /="undefined"/.test(html) || html.includes(">NaN<"));
  check("no view renders undefined or NaN into the page", undef.length === 0,
    undef.map(([n]) => n).join(", "));

  const unbalanced = [...rendered]
    .map(([name, html]) => [name, firstTagMismatch(html)])
    .filter(([, problem]) => problem !== null);
  check("every view's tags nest and close correctly", unbalanced.length === 0,
    unbalanced.map(([n, p]) => `${n}: ${p}`).slice(0, 4).join(" | "));
}

/* --- navigation integrity -------------------------------------------------- */
{
  const dead = [];
  for (const [name, html] of rendered) {
    for (const m of html.matchAll(/data-(?:goto|select|id)="([^"]+)"/g)) {
      const id = m[1];
      // data-id is also used for non-node payloads (change ids on the model page)
      if (!id || id.startsWith("chg-") || model.has(id)) continue;
      dead.push(`${name}: ${id}`);
    }
  }
  check("every navigation target in every view resolves to a real node",
    dead.length === 0, dead.slice(0, 6).join(" | "));

  const hrefs = [];
  for (const [name, html] of rendered) {
    for (const m of html.matchAll(/href="#\/(?:b|it)\/([^"?]+)"/g)) {
      if (!model.has(decodeURIComponent(m[1]))) hrefs.push(`${name}: ${m[1]}`);
    }
  }
  check("every deep link in every view resolves to a real node",
    hrefs.length === 0, hrefs.slice(0, 6).join(" | "));
}

/* --- the agent views say what the model says ------------------------------- */
{
  const estate = toHTML(renderAgentEstate(model));
  const e = model.agentEstate();
  check("the estate view names every agent", e.agents.every((a) => estate.includes(a.name)));
  check("the estate view surfaces every critical finding",
    e.criticalFindings.every((f) => estate.includes(f.label)));

  const unowned = e.agents.find((a) => a.props.technicalOwner === "UNASSIGNED");
  check("an unowned agent's page says so",
    !unowned || toHTML(renderAgent(model, unowned)).includes("Unassigned"),
    unowned ? unowned.name : "no unowned agent in the model");

  const seeded = e.agents.filter((a) => (a.props.confidence || "seed") !== "evidenced");
  check("every unverified agent page carries its confidence marker",
    seeded.every((a) => toHTML(renderAgent(model, a)).includes("not yet verified")),
    `${seeded.length} unverified`);
}

console.log(`\n${failures === 0 ? "All render checks passed." : `${failures} render check(s) failed.`}\n`);
process.exit(failures === 0 ? 0 : 1);
