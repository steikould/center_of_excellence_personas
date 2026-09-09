#!/usr/bin/env node
/**
 * Compiles model/*.yaml into webapp/public/model.json.
 *
 * The compile step is also the validation step: referential integrity across
 * domains, capabilities, processes, agents, systems, runtimes and controls is
 * checked here, so a broken link fails the build instead of rendering an empty
 * panel. Derived rollups (coverage, economics, risk) are computed once here
 * rather than recomputed in every view.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parse } from 'yaml';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const modelDir = join(root, 'model');
const outDir = join(root, 'webapp', 'public');

const errors = [];
const warnings = [];

const load = (name) => parse(readFileSync(join(modelDir, name), 'utf8'));

const meta = load('meta.yaml');
const { domains } = load('domains.yaml');
const { capabilities } = load('capabilities.yaml');
const { systems } = load('systems.yaml');
const { runtimes, controlPlane } = load('infrastructure.yaml');
const { controls } = load('controls.yaml');
const { flows } = load('flows.yaml');

const agents = readdirSync(join(modelDir, 'agents'))
  .filter((f) => f.endsWith('.yaml'))
  .sort()
  .map((f) => parse(readFileSync(join(modelDir, 'agents', f), 'utf8')));

/* ------------------------------------------------------------------ index */
const processes = capabilities.flatMap((c) =>
  (c.processes ?? []).map((p) => ({ ...p, capability: c.id, domain: c.domain })),
);

const byId = (arr) => new Map(arr.map((x) => [x.id, x]));
const idx = {
  domain: byId(domains),
  capability: byId(capabilities),
  process: byId(processes),
  system: byId(systems),
  agent: byId(agents),
  runtime: byId(runtimes),
  control: byId(controls),
  controlPlane: byId(controlPlane),
};

const ref = (kind, id, where) => {
  if (id == null) return;
  if (!idx[kind].has(id)) errors.push(`${where}: unknown ${kind} "${id}"`);
};

/* --------------------------------------------------------------- validate */
for (const c of capabilities) ref('domain', c.domain, `capability ${c.id}`);

for (const p of processes) {
  for (const s of p.systems ?? []) ref('system', s, `process ${p.id}`);
  if (p.agent) ref('agent', p.agent, `process ${p.id}`);
  const needsAgent = p.mode === 'agent' || p.mode === 'agent+hitl';
  if (needsAgent && !p.agent) errors.push(`process ${p.id}: mode "${p.mode}" requires an agent`);
  if (!needsAgent && p.agent) errors.push(`process ${p.id}: mode "${p.mode}" must not name an agent`);
}

for (const a of agents) {
  ref('domain', a.business?.domain, `agent ${a.id}`);
  ref('runtime', a.platform?.runtime, `agent ${a.id}`);
  for (const c of a.business?.capabilities ?? []) ref('capability', c, `agent ${a.id}`);
  for (const p of a.business?.processes ?? []) ref('process', p, `agent ${a.id}`);
  for (const s of a.interfaces?.systems ?? []) ref('system', s, `agent ${a.id}`);
  for (const c of a.governance?.controls ?? []) ref('control', c, `agent ${a.id}`);

  // A process may only claim an agent that claims it back.
  for (const pid of a.business?.processes ?? []) {
    const p = idx.process.get(pid);
    if (p && p.agent !== a.id) errors.push(`agent ${a.id}: claims process ${pid}, which is assigned to ${p.agent ?? 'nobody'}`);
  }
  if (!a.ownership?.technicalOwner || a.ownership.technicalOwner === 'UNASSIGNED')
    warnings.push(`agent ${a.id}: no technical owner assigned`);
  if (a.telemetry?.exportsTo === 'none')
    warnings.push(`agent ${a.id}: telemetry is not exported to the central pipeline`);
}

for (const r of runtimes) {
  for (const h of r.hosts ?? []) ref('agent', h, `runtime ${r.id}`);
  if (r.telemetry?.exportsTo && r.telemetry.exportsTo !== 'none') ref('controlPlane', r.telemetry.exportsTo, `runtime ${r.id}`);
}

const nodeExists = (id) =>
  idx.system.has(id) || idx.agent.has(id) || idx.runtime.has(id) || idx.controlPlane.has(id);
for (const f of flows) {
  if (!nodeExists(f.from)) errors.push(`flow ${f.id}: unknown source "${f.from}"`);
  if (!nodeExists(f.to)) errors.push(`flow ${f.id}: unknown target "${f.to}"`);
}

/* ---------------------------------------------------------------- derive */
const sum = (arr, f) => arr.reduce((t, x) => t + (f(x) ?? 0), 0);
const round1 = (n) => Math.round(n * 10) / 10;

// Coverage: share of a capability's process steps that an agent now performs.
for (const c of capabilities) {
  const ps = c.processes ?? [];
  const automated = ps.filter((p) => p.mode === 'agent' || p.mode === 'agent+hitl');
  c.derived = {
    processCount: ps.length,
    automatedCount: automated.length,
    coveragePct: ps.length ? Math.round((automated.length / ps.length) * 100) : 0,
    agents: [...new Set(ps.map((p) => p.agent).filter(Boolean))],
    minutesBefore: sum(ps, (p) => p.cycleTimeBefore),
    minutesAfter: sum(ps, (p) => p.cycleTimeAfter),
    fteReleased: round1((c.priorFte ?? 0) - (c.currentFte ?? 0)),
  };
  c.derived.cycleReductionPct = c.derived.minutesBefore
    ? Math.round((1 - c.derived.minutesAfter / c.derived.minutesBefore) * 100)
    : 0;
}

// Risk: the things an executive should be told without being asked.
const riskRules = [
  { id: 'no-owner', severity: 'critical', label: 'No technical owner', test: (a) => !a.ownership?.technicalOwner || a.ownership.technicalOwner === 'UNASSIGNED' },
  { id: 'unvalidated-gxp', severity: 'critical', label: 'In production against GxP scope without completed validation', test: (a) => a.governance?.gxpRelevant && a.status === 'production' && a.governance?.validationStatus !== 'validated' },
  { id: 'no-telemetry', severity: 'serious', label: 'Not exporting telemetry to the central pipeline', test: (a) => a.telemetry?.exportsTo === 'none' },
  { id: 'no-cost', severity: 'serious', label: 'No cost attribution', test: (a) => a.telemetry?.coverage?.cost === 'none' },
  { id: 'no-eval', severity: 'warning', label: 'No offline evaluation', test: (a) => a.telemetry?.coverage?.evaluations === 'none' },
  { id: 'no-fallback', severity: 'warning', label: 'No defined degraded mode', test: (a) => !a.model?.fallback || a.model.fallback === 'None configured' },
  { id: 'no-source', severity: 'warning', label: 'Source artefacts not held by the enterprise', test: (a) => a.provenance?.sourceAvailable === false },
  { id: 'no-review', severity: 'warning', label: 'No periodic review scheduled', test: (a) => !a.governance?.periodicReview || a.governance.periodicReview === 'not scheduled' },
  { id: 'unreviewed-external', severity: 'warning', label: 'Autonomous output reaching an external audience', test: (a) => a.interfaces?.humanInLoop?.mode === 'autonomous-with-escalation' },
];

const sevRank = { critical: 3, serious: 2, warning: 1 };
for (const a of agents) {
  const risks = riskRules.filter((r) => r.test(a)).map(({ id, severity, label }) => ({ id, severity, label }));
  a.derived = {
    risks,
    riskScore: sum(risks, (r) => sevRank[r.severity]),
    worstSeverity: risks.length ? risks.map((r) => r.severity).sort((x, y) => sevRank[y] - sevRank[x])[0] : 'good',
    netBenefitUsd: (a.economics?.annualBenefitUsd ?? 0) - (a.economics?.annualRunCostUsd ?? 0),
    processCount: a.business?.processes?.length ?? 0,
    systemCount: a.interfaces?.systems?.length ?? 0,
  };
}

for (const d of domains) {
  const caps = capabilities.filter((c) => c.domain === d.id);
  const ags = agents.filter((a) => a.business?.domain === d.id);
  const ps = caps.flatMap((c) => c.processes ?? []);
  const automated = ps.filter((p) => p.mode === 'agent' || p.mode === 'agent+hitl');
  d.derived = {
    capabilityCount: caps.length,
    processCount: ps.length,
    coveragePct: ps.length ? Math.round((automated.length / ps.length) * 100) : 0,
    agents: ags.map((a) => a.id),
    agentCount: ags.length,
    fteReleased: round1(sum(caps, (c) => (c.priorFte ?? 0) - (c.currentFte ?? 0))),
    priorFte: round1(sum(caps, (c) => c.priorFte)),
    currentFte: round1(sum(caps, (c) => c.currentFte)),
    runCostUsd: sum(ags, (a) => a.economics?.annualRunCostUsd),
    benefitUsd: sum(ags, (a) => a.economics?.annualBenefitUsd),
    riskScore: sum(ags, (a) => a.derived.riskScore),
    worstSeverity: ags.length
      ? ags.map((a) => a.derived.worstSeverity).sort((x, y) => (sevRank[y] ?? 0) - (sevRank[x] ?? 0))[0]
      : 'good',
    systems: [...new Set(ps.flatMap((p) => p.systems ?? []))],
  };
  d.derived.netBenefitUsd = d.derived.benefitUsd - d.derived.runCostUsd;
}

const portfolio = {
  agentCount: agents.length,
  frameworks: [...new Set(agents.map((a) => a.platform?.framework))],
  runtimeCount: runtimes.length,
  fteReleased: round1(sum(domains, (d) => d.derived.fteReleased)),
  runCostUsd: sum(agents, (a) => a.economics?.annualRunCostUsd),
  benefitUsd: sum(agents, (a) => a.economics?.annualBenefitUsd),
  valueAtStakeUsd: sum(domains, (d) => d.valueAtStake),
  criticalRiskCount: sum(agents, (a) => a.derived.risks.filter((r) => r.severity === 'critical').length),
  seriousRiskCount: sum(agents, (a) => a.derived.risks.filter((r) => r.severity === 'serious').length),
  telemetryConformancePct: Math.round(
    (agents.filter((a) => a.telemetry?.exportsTo && a.telemetry.exportsTo !== 'none').length / agents.length) * 100,
  ),
  gxpAgentCount: agents.filter((a) => a.governance?.gxpRelevant).length,
  validatedAgentCount: agents.filter((a) => a.governance?.validationStatus === 'validated').length,
};
portfolio.netBenefitUsd = portfolio.benefitUsd - portfolio.runCostUsd;

/* ----------------------------------------------------------------- report */
for (const w of warnings) console.warn(`  warn  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`  ERROR ${e}`);
  console.error(`\nmodel build failed: ${errors.length} referential error(s)`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const out = { meta, portfolio, domains, capabilities, processes, agents, systems, runtimes, controlPlane, controls, flows, riskRules };
writeFileSync(join(outDir, 'model.json'), JSON.stringify(out, null, 2));

console.log(
  `model ok — ${domains.length} domains, ${capabilities.length} capabilities, ${processes.length} processes, ` +
  `${agents.length} agents, ${systems.length} systems, ${runtimes.length} runtimes, ${flows.length} flows` +
  (warnings.length ? ` (${warnings.length} warning(s))` : ''),
);
