/**
 * The agent estate: agents that now perform work people used to perform.
 *
 * Everything here reads from the graph. Findings are derived per agent by rule
 * in the generator and stored on the node, so the portfolio and the agent page
 * are the same numbers summed differently rather than two opinions.
 */
import { tpl, raw, plural, truncate } from "../util.js";
import { rows, section, statTile, emptyState, nodeHeader } from "./common.js";
import { dumbbell, reductionBars } from "./chart.js";
import {
  coverageBadge, severityBadge, confidenceBadge, frameworkBadge,
  healthBadge, usd, seconds, duration, FRAMEWORK_LABEL, TYPE_LABEL,
} from "../format.js";

const SIGNALS = [
  ["traces", "Traces"], ["metrics", "Metrics"], ["cost", "Cost"],
  ["toolCalls", "Tool calls"], ["humanFeedback", "Human feedback"], ["evaluations", "Evaluations"],
];

/* ------------------------------------------------------------- portfolio */

export function renderAgentEstate(model) {
  const e = model.agentEstate();
  if (!e.agents.length) {
    return tpl`<div class="view-head"><div><h1>Agent estate</h1>
      <p class="lede">No agents are registered yet. Add a manifest under
      <code>model/agents/</code> and regenerate the model.</p></div></div>`;
  }
  const seeded = e.agents.filter((a) => (a.props.confidence || "seed") !== "evidenced").length;

  return tpl`
    <div class="view-head">
      <div>
        <p class="eyebrow">Agent operations</p>
        <h1>The agent estate</h1>
        <p class="lede">
          ${plural(e.agents.length, "agent")} across ${plural(e.frameworks.size, "framework")} and
          ${plural(e.runtimes.length, "runtime")}, performing ${plural(e.processesRun, "business process step")}
          that people used to perform. Each one is a node in the same graph as everything else, so the
          lens pivot, the technology chain and impact analysis all work on it.
        </p>
      </div>
    </div>

    ${seeded ? tpl`<p class="notice">
      <strong>${seeded} of ${e.agents.length} manifests are unverified.</strong> The structure is real; the
      values are placeholders until the handover checks in <code>docs/agent-operations/</code> replace them.
      Every seed number is flagged where it appears.
    </p>` : ""}

    <div class="impact-summary">
      ${statTile(e.agents.length, "Agents in service")}
      ${statTile(e.fteAbsorbed, "FTE of task load absorbed")}
      ${statTile(usd(e.netBenefit), "Net annual benefit")}
      ${statTile(`${e.conformancePct}%`, "Telemetry conformance", e.conformancePct < 100 ? "risk" : "")}
      ${statTile(e.criticalFindings.length, "Critical findings", e.criticalFindings.length ? "risk" : "")}
      ${statTile(`${e.validatedCount}/${e.gxpCount}`, "GxP agents validated",
        e.validatedCount < e.gxpCount ? "risk" : "")}
    </div>

    ${section("What needs a decision", e.criticalFindings.length + e.seriousFindings.length,
      renderFindings([...e.criticalFindings, ...e.seriousFindings]))}

    ${cycleSection(model)}

    ${section("Agents", e.agents.length, tpl`
      <div class="agent-grid">${e.agents.map((a) => agentCard(model, a))}</div>`)}

    ${section("Telemetry conformance across frameworks", null, tpl`
      <p class="lede">The contract is the OpenTelemetry GenAI semantic conventions. This is whether each
      agent actually honours it — the gaps are the backlog, not the design.</p>
      ${conformanceTable(e.agents)}`)}

    ${section("Runtimes", e.runtimes.length, tpl`
      <p class="lede">Execution is federated: each runtime keeps its own native LLMOps and redacts payloads
      at its own edge, before anything crosses the boundary.</p>
      ${rows(model, e.runtimes)}`)}

    ${section("Central control plane", e.controlPlane.length, tpl`
      <p class="lede">Thin, and deliberately out of every agent's request path — telemetry reaches it by
      integration, never by dependency. Impact analysis from any of these reaches no business process,
      which is what makes that claim checkable rather than merely asserted.</p>
      ${rows(model, e.controlPlane)}`)}
  `;
}

/** Every business step a machine took over, and what happened to its cycle
 *  time. The one picture at estate level: sorted by reduction, so the biggest
 *  claim is also the one a reader will check first. */
function cycleSection(model) {
  const impact = model.cycleImpact();
  if (!impact.length) return raw("");
  const items = impact.map((d) => ({
    label: d.step.name, sub: d.agent.props.shortName || d.agent.name,
    pct: d.reductionPct, detail: `${duration(d.before)} → ${duration(d.after)}`,
    before: d.before, after: d.after, unit: d.unit,
  }));
  const worst = impact[impact.length - 1];
  // Name the units actually present rather than a fixed example list, so the
  // sentence cannot drift from the data behind it.
  const units = [...new Set(impact.map((d) => d.unit).filter(Boolean))].sort();
  return section("What it did to the clock", impact.length, tpl`
    <p class="lede">Proportional change in cycle time, per unit of work. These steps are measured in
    ${units.length} different units — ${units.join(", ")} — so their absolute times share no axis and
    only the proportion is comparable. The absolute figures are printed beside each bar, and the table
    names the unit for each.</p>
    ${reductionBars(items, {
      caption: `Smallest reduction: ${worst.step.name} at ${worst.reductionPct}% (${duration(worst.before)} → ${duration(worst.after)} ${worst.unit}). These are the agents' own claims, at the same seed confidence as the rest of the manifest — the thing to go and measure, not a measurement.`,
    })}`);
}

function renderFindings(findings) {
  if (!findings.length) return emptyState("No critical or serious findings across the estate.");
  return tpl`<table class="data-table findings">
    <thead><tr><th>Severity</th><th>Finding</th><th>Agent</th><th>Framework</th></tr></thead>
    <tbody>${findings.map((f) => tpl`<tr>
      <td>${severityBadge(f.severity)}</td>
      <td>${f.label}</td>
      <td><button type="button" class="linklike" data-goto="${f.agent.id}">${f.agent.name}</button></td>
      <td>${FRAMEWORK_LABEL[f.agent.props.framework] || f.agent.props.framework}</td>
    </tr>`)}</tbody>
  </table>`;
}

function agentCard(model, a) {
  const p = a.props;
  const supports = model.out(a.id).filter((e) => e.type === "supports")
    .map((e) => model.node(e.to)).filter(Boolean);
  const worst = (p.findings || []).some((f) => f.severity === "critical") ? "risk"
    : (p.findings || []).length ? "watch" : "";
  return tpl`
    <button type="button" class="agent-card" data-goto="${a.id}" data-tone="${worst}">
      <span class="chips">
        ${frameworkBadge(p.framework)}
        <span class="badge badge-neutral">v${p.version}</span>
        ${healthBadge(a)}
      </span>
      <span class="agent-card-name">${a.name}</span>
      <p class="agent-card-desc">${truncate(a.description, 130)}</p>
      <span class="agent-card-foot">
        <span>Replaced <strong>${p.replacesRole}</strong> — ${p.fteEquivalent} FTE</span>
        <span>${plural(supports.length, "process step")} · ${p.runsPerMonth ? `${p.runsPerMonth.toLocaleString("en-US")} runs/mo` : "no run data"}</span>
      </span>
    </button>`;
}

function conformanceTable(agents) {
  return tpl`<table class="data-table conformance">
    <thead><tr><th>Agent</th>${SIGNALS.map(([, label]) => tpl`<th>${label}</th>`)}</tr></thead>
    <tbody>${agents.map((a) => tpl`<tr>
      <th scope="row"><button type="button" class="linklike" data-goto="${a.id}">${a.props.shortName || a.name}</button></th>
      ${SIGNALS.map(([key]) => tpl`<td>${coverageBadge((a.props.coverage || {})[key] || "none")}</td>`)}
    </tr>`)}</tbody>
  </table>`;
}

/* ---------------------------------------------------------- agent detail */

export function renderAgent(model, a) {
  const p = a.props;
  const supports = model.out(a.id).filter((e) => e.type === "supports")
    .map((e) => model.node(e.to)).filter(Boolean);
  const reaches = model.out(a.id).filter((e) => e.type === "depends_on")
    .map((e) => model.node(e.to)).filter(Boolean);
  const runtime = model.out(a.id).find((e) => e.type === "runs_on");
  const runtimeNode = runtime ? model.node(runtime.to) : null;
  const critical = (p.findings || []).filter((f) => f.severity === "critical");
  const rest = (p.findings || []).filter((f) => f.severity !== "critical");

  const actions = tpl`
    <button type="button" class="primary" data-action="lens-business" data-id="${a.id}">Business capabilities served →</button>
    <button type="button" class="ghost" data-action="impact" data-id="${a.id}">Impact analysis</button>
    <button type="button" class="ghost" data-action="dual" data-id="${a.id}">Dual pane</button>`;

  return tpl`
    ${nodeHeader(a, { actions, eyebrow: `${TYPE_LABEL.Agent} · ${FRAMEWORK_LABEL[p.framework] || p.framework}` })}

    <p class="chips">
      ${frameworkBadge(p.framework)}
      <span class="badge badge-neutral">v${p.version}</span>
      <span class="badge badge-neutral">Built by ${p.builtBy}</span>
      ${p.gxpRelevant ? raw('<span class="badge badge-neutral">GxP</span>') : ""}
      ${confidenceBadge(p.confidence)}
    </p>

    ${critical.length ? tpl`<p class="notice risk">
      <strong>${plural(critical.length, "critical finding")}.</strong>
      ${critical.map((f) => f.label).join(". ")}.
    </p>` : ""}

    <div class="impact-summary">
      ${statTile((p.runsPerMonth || 0).toLocaleString("en-US"), "Runs per month")}
      ${statTile(`${p.successRatePct}%`, "Success rate", p.successRatePct < 95 ? "risk" : "")}
      ${statTile(seconds(p.p95LatencySeconds), "p95 latency")}
      ${statTile(`${p.escalationRatePct}%`, "Escalated to a person")}
      ${statTile(`${p.overrideRatePct}%`, "Human override")}
    </div>

    ${section("What it replaced", null, tpl`
      <dl class="detail-list">
        <dt>Role</dt><dd>${p.replacesRole}</dd>
        <dt>Task load absorbed</dt><dd>${p.fteEquivalent} FTE</dd>
        <dt>Displacement</dt><dd>${String(p.displacementType || "").replace(/-/g, " ")}</dd>
        <dt>Still done by people</dt><dd><ul class="plain-list">${(p.retainedByHumans || []).map((r) => tpl`<li>${r}</li>`)}</ul></dd>
        ${p.replacesNote ? tpl`<dt>Note</dt><dd>${p.replacesNote}</dd>` : ""}
      </dl>`)}

    ${section("Business steps it performs", supports.length,
      supports.length ? rows(model, supports) : emptyState("This agent is not linked to any business step."))}

    ${agentCycleChart(model, a)}

    ${section("Accountability", null, tpl`
      <dl class="detail-list">
        <dt>Business owner</dt><dd>${p.businessOwner}</dd>
        <dt>Technical owner</dt><dd>${p.technicalOwner === "UNASSIGNED"
          ? severityBadge("critical") : p.technicalOwner}${p.technicalOwner === "UNASSIGNED" ? " Unassigned" : ""}</dd>
        <dt>Accountable executive</dt><dd>${p.accountableExecutive}</dd>
        <dt>Delivered</dt><dd>${p.deliveredOn} · handover ${p.handoverStatus}</dd>
        <dt>Source artefacts</dt><dd>${p.sourceAvailable ? p.sourceLocation
          : raw('<span class="badge badge-risk"><span class="glyph" aria-hidden="true">▲</span>Not held by the enterprise</span>')}</dd>
      </dl>`)}

    ${section("Platform and runtime", null, tpl`
      <dl class="detail-list">
        <dt>Framework</dt><dd>${FRAMEWORK_LABEL[p.framework] || p.framework} ${p.frameworkVersion}</dd>
        <dt>Orchestration</dt><dd>${p.orchestrationStyle}</dd>
        <dt>Tool interop</dt><dd>${p.interop}</dd>
        <dt>Prompt versioning</dt><dd>${p.promptVersioning}</dd>
        <dt>Runs on</dt><dd>${runtimeNode
          ? tpl`<button type="button" class="linklike" data-goto="${runtimeNode.id}">${runtimeNode.name}</button>`
          : "Not recorded"}</dd>
        <dt>Primary model</dt><dd>${p.modelPrimary}</dd>
        <dt>Degraded mode</dt><dd>${p.modelFallback}</dd>
        <dt>Data residency</dt><dd>${p.residency}</dd>
      </dl>`)}

    ${section("Blast radius", reaches.length, tpl`
      <p class="lede">Every system this agent can reach, and with what access. Scope says what it may
      <em>not</em> do, because that sentence is what a control gets verified against.</p>
      <table class="data-table">
        <thead><tr><th>Tool</th><th>Type</th><th>Access</th><th>Scope</th></tr></thead>
        <tbody>${(p.tools || []).map((t) => tpl`<tr>
          <td><code>${t.name}</code></td><td>${t.type}</td>
          <td><span class="badge badge-neutral">${t.access}</span></td>
          <td class="muted">${t.scope}</td></tr>`)}</tbody>
      </table>
      ${rows(model, reaches, { emptyMessage: "This agent reaches no system of record." })}`)}

    ${section("Human in the loop", null, tpl`
      <dl class="detail-list">
        <dt>Mode</dt><dd>${String(p.hitlMode || "").replace(/-/g, " ")}</dd>
        <dt>Gate</dt><dd>${p.hitlGate}</dd>
        <dt>Response SLA</dt><dd>${p.hitlSlaMinutes
          ? `${p.hitlSlaMinutes} min` : "No gate — output goes out unreviewed"}</dd>
        <dt>Override rate</dt><dd>${p.overrideRatePct}%</dd>
      </dl>`)}

    ${section("Observability", null, tpl`
      <p class="lede">Emits ${p.telemetryEmits} · ${p.semconv}</p>
      ${conformanceTable([a])}
      ${(p.telemetryGaps || []).length ? tpl`<ul class="plain-list gaps">
        ${(p.telemetryGaps || []).map((g) => tpl`<li>${g}</li>`)}</ul>` : ""}`)}

    ${section("Governance", null, tpl`
      <dl class="detail-list">
        <dt>GxP relevant</dt><dd>${p.gxpRelevant ? "Yes" : "No"}</dd>
        <dt>21 CFR Part 11 scope</dt><dd>${p.part11Scope ? "Yes" : "No"}</dd>
        <dt>Validation</dt><dd>${p.validationStatus === "validated"
          ? `${p.validationStatus} · ${p.validationRef}`
          : tpl`${severityBadge("critical")} ${p.validationStatus} · ${p.validationRef}`}</dd>
        <dt>Model risk tier</dt><dd>Tier ${p.modelRiskTier}</dd>
        <dt>Periodic review</dt><dd>${p.periodicReview}</dd>
        <dt>Regulatory exposure</dt><dd>${p.regulatoryExposure}</dd>
        <dt>Data classification</dt><dd>${(p.dataClassifications || []).join(", ")}</dd>
        <dt>Training use</dt><dd>${p.trainingUse}</dd>
      </dl>
      <h3>Controls in force</h3>
      <ul class="plain-list controls">${(p.controls || []).map((c) => tpl`<li>
        <strong>${c.name}</strong>
        <span class="muted">${c.statement}</span>
        <span class="muted verify">Proven by: ${c.verification}</span>
      </li>`)}</ul>`)}

    ${section("Economics", null, tpl`
      <div class="impact-summary">
        ${statTile(usd(p.annualRunCostUsd), `Annual run cost (${p.costConfidence})`)}
        ${statTile(usd(p.annualBenefitUsd), `Attributed benefit (${p.benefitConfidence})`)}
        ${statTile(usd((p.annualBenefitUsd || 0) - (p.annualRunCostUsd || 0)), "Net")}
      </div>
      <p class="lede">${p.benefitBasis}</p>`)}

    ${(rest.length || (p.openQuestions || []).length) ? section("Open items", null, tpl`
      ${rest.length ? tpl`<p class="chips">${rest.map((f) => tpl`${severityBadge(f.severity)} <span class="muted">${f.label}</span>`)}</p>` : ""}
      ${(p.openQuestions || []).length ? tpl`<h3>Questions for the build team</h3>
        <ul class="plain-list">${(p.openQuestions || []).map((q) => tpl`<li>${q}</li>`)}</ul>` : ""}`) : ""}
  `;
}

function agentCycleChart(model, a) {
  const impact = model.cycleImpact(a.id);
  if (!impact.length) return raw("");
  const items = impact.map((d) => ({
    label: d.step.name, sub: d.unit, before: d.before, after: d.after, unit: d.unit,
  }));
  return section("What it did to the clock", null, tpl`
    <p class="lede">This agent's own claim about the steps it took over, at the manifest's confidence.</p>
    ${dumbbell(items, { tableHeading: "Show the numbers behind this" })}`);
}

/* --------------------------------------------------------- runtime panel */

/** Appended to the standard IT view when the anchor is an agent runtime. */
export function renderRuntimePanel(model, r) {
  const p = r.props;
  const hosted = model.in(r.id).filter((e) => e.type === "runs_on")
    .map((e) => model.node(e.from)).filter((n) => n && n.type === "Agent");
  const layers = [["compute", "Compute"], ["identity", "Identity"], ["network", "Network"],
    ["dataResidency", "Data"], ["secrets", "Secrets"]];
  return tpl`
    ${section("Agents hosted here", hosted.length,
      hosted.length ? rows(model, hosted) : emptyState("No agent runs on this runtime."))}

    ${section("Infrastructure layers", null, tpl`
      <div class="layer-grid">${layers.map(([key, label]) => tpl`
        <div class="layer">
          <h3>${label}</h3>
          <ul class="plain-list">${(p[key] || []).map((item) => tpl`<li>${item}</li>`)}</ul>
        </div>`)}</div>`)}

    ${section("Telemetry path", null, tpl`
      <p class="lede">Redaction happens here, inside the boundary — not centrally. That is what keeps
      payload bodies out of the shared store, and the shared store out of validation scope.</p>
      <dl class="detail-list">
        <dt>Native LLMOps</dt><dd>${p.telemetryNative}</dd>
        <dt>Wire format</dt><dd>${p.telemetryWire}</dd>
        <dt>Redaction point</dt><dd>${p.redactionPoint}</dd>
        <dt>Exports to</dt><dd>${p.telemetryExportsTo && p.telemetryExportsTo !== "none"
          ? tpl`<button type="button" class="linklike" data-goto="${p.telemetryExportsTo}">${
              model.node(p.telemetryExportsTo)?.name || p.telemetryExportsTo}</button>`
          : "Nothing. This runtime is not reporting centrally."}</dd>
      </dl>`)}
  `;
}
