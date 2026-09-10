/** Presentation vocabulary: labels, glyphs and tones, shared across both lenses.
 *  Every colour-carrying badge also carries a glyph and a word, so colour is
 *  never the only signal. */
import { tpl, raw, esc } from "./util.js";

export const HEALTH = {
  ok: { label: "Healthy", glyph: "●", tone: "ok" },
  watch: { label: "Watch", glyph: "▲", tone: "watch" },
  "at-risk": { label: "At risk", glyph: "■", tone: "risk" },
  unknown: { label: "Unknown", glyph: "○", tone: "unknown" },
};

export const LIFECYCLE = {
  plan: { label: "Planned", glyph: "◌" },
  active: { label: "Active", glyph: "✓" },
  "phase-out": { label: "Phasing out", glyph: "→" },
  retired: { label: "Retired", glyph: "✗" },
};

export const CRITICALITY = {
  critical: { label: "Business critical", short: "Critical", glyph: "!!" },
  high: { label: "High criticality", short: "High", glyph: "!" },
  medium: { label: "Medium criticality", short: "Medium", glyph: "·" },
  low: { label: "Low criticality", short: "Low", glyph: "·" },
};

export const TYPE_ICON = {
  BusinessDomain: "▦", Capability: "▣", Process: "▸", Activity: "·",
  Application: "⌗", ExternalService: "☁", DeployableUnit: "▢",
  DataStore: "⌸", Interface: "⇄", IntegrationFlow: "⟶",
  PlatformService: "⚙", Environment: "▤", Host: "☐", Cluster: "⊞",
  NetworkZone: "⬡", Site: "⚑",
  Agent: "◈", AgentRuntime: "▩",
};

export const TYPE_LABEL = {
  BusinessDomain: "Business domain", Capability: "Capability", Process: "Process", Activity: "Activity",
  Application: "Application", ExternalService: "External service", DeployableUnit: "Deployable unit",
  DataStore: "Data store", Interface: "Interface", IntegrationFlow: "Integration flow",
  PlatformService: "Platform service", Environment: "Environment", Host: "Host",
  Cluster: "Cluster", NetworkZone: "Network zone", Site: "Site / region",
  Agent: "AI agent", AgentRuntime: "Agent runtime",
};

export const TYPE_LABEL_PLURAL = {
  BusinessDomain: "Business domains", Capability: "Capabilities", Process: "Processes", Activity: "Activities",
  Application: "Applications", ExternalService: "External services", DeployableUnit: "Deployable units",
  DataStore: "Data stores", Interface: "Interfaces", IntegrationFlow: "Integration flows",
  PlatformService: "Platform services", Environment: "Environments", Host: "Hosts",
  Cluster: "Clusters", NetworkZone: "Network zones", Site: "Sites and regions",
  Agent: "AI agents", AgentRuntime: "Agent runtimes",
};

export const EDGE_LABEL = {
  contains: "contains", supports: "supports", realizes: "realises", depends_on: "depends on",
  connects_to: "connects to", integrates_with: "integrates with", runs_on: "runs on",
  hosted_in: "hosted in", stores: "stores", reads: "reads",
};

export function healthBadge(node) {
  const h = HEALTH[node.health] || HEALTH.unknown;
  return tpl`<span class="badge badge-${h.tone}" title="Health: ${h.label}"><span class="glyph" aria-hidden="true">${h.glyph}</span>${h.label}</span>`;
}

export function lifecycleBadge(node) {
  const l = LIFECYCLE[node.lifecycle] || LIFECYCLE.active;
  const tone = node.lifecycle === "phase-out" || node.lifecycle === "retired" ? "watch" : "neutral";
  return tpl`<span class="badge badge-${tone}" title="Lifecycle: ${l.label}"><span class="glyph" aria-hidden="true">${l.glyph}</span>${l.label}</span>`;
}

export function criticalityBadge(node) {
  const c = CRITICALITY[node.criticality] || CRITICALITY.medium;
  const tone = node.criticality === "critical" ? "risk" : node.criticality === "high" ? "watch" : "neutral";
  return tpl`<span class="badge badge-${tone}" title="${c.label}"><span class="glyph" aria-hidden="true">${c.glyph}</span>${c.short}</span>`;
}

export function typeBadge(node) {
  return tpl`<span class="badge badge-${node.lens === "business" ? "business" : "it"}">${TYPE_LABEL[node.type] || node.type}</span>`;
}

export function maturityMeter(value) {
  if (!value) return raw("");
  const cells = [];
  for (let i = 1; i <= 5; i += 1) cells.push(`<span class="${i <= value ? "on" : ""}"></span>`);
  return tpl`<span class="meter" role="img" aria-label="Maturity ${value} of 5">${raw(cells.join(""))}</span>`;
}

export function icon(node) {
  return raw(`<span class="row-icon" aria-hidden="true">${esc(TYPE_ICON[node.type] || "□")}</span>`);
}

/** Tile tone for the selected overlay - drives the coloured tile edge. */
export function overlayTone(node, overlay, context = {}) {
  switch (overlay) {
    case "health": return HEALTH[node.health]?.tone || "unknown";
    case "maturity":
      if (!node.maturity) return "unknown";
      return node.maturity >= 4 ? "ok" : node.maturity >= 3 ? "watch" : "risk";
    case "apps": {
      const n = context.appCount ?? 0;
      return n === 0 ? "risk" : n > 3 ? "watch" : "ok";
    }
    case "risk": {
      const r = context.risk ?? 0;
      return r === 0 ? "ok" : r === 1 ? "watch" : "risk";
    }
    case "cost": {
      const band = context.cost || "";
      return band === "XL" || band === "L" ? "watch" : band ? "ok" : "unknown";
    }
    default: return "none";
  }
}

export function overlayMetric(node, overlay, context = {}) {
  switch (overlay) {
    case "health": return HEALTH[node.health]?.label || "Unknown";
    case "maturity": return node.maturity ? `Maturity ${node.maturity}/5` : "Maturity not rated";
    case "apps": return `${context.appCount ?? 0} supporting application${(context.appCount ?? 0) === 1 ? "" : "s"}`;
    case "risk": return context.riskLabel || "No technical risk flagged";
    case "cost": return context.cost ? `Cost band ${context.cost}` : "Cost band not recorded";
    default: return "";
  }
}


/* ------------------------------------------------------------------ agents */

export const FRAMEWORK_LABEL = {
  "pwc-agent-os": "PwC agent OS",
  "copilot-studio": "Microsoft Copilot Studio",
  dify: "Dify (self-hosted)",
  "bedrock-agentcore": "Bedrock AgentCore",
  langgraph: "LangGraph",
  custom: "Custom",
};

/** Coverage of one telemetry signal. Ordinal, not categorical: none < partial
 *  < full is an ordering, so it reads as one ramp rather than three colours. */
export const COVERAGE = {
  full: { label: "full", tone: "ok", glyph: "●" },
  partial: { label: "partial", tone: "watch", glyph: "◐" },
  none: { label: "none", tone: "risk", glyph: "○" },
};

export const SEVERITY = {
  critical: { label: "Critical", tone: "risk", glyph: "■" },
  serious: { label: "At risk", tone: "risk", glyph: "▲" },
  warning: { label: "Watch", tone: "watch", glyph: "!" },
};

/** How confident the model is in a value. Rendered everywhere a seed number is
 *  shown, so a placeholder can never quietly read as an inventory fact. */
export const CONFIDENCE = {
  seed: { label: "Seed - not yet verified", short: "seed" },
  declared: { label: "Declared, not evidenced", short: "declared" },
  evidenced: { label: "Evidenced", short: "evidenced" },
};

export function coverageBadge(value) {
  const c = COVERAGE[value] || COVERAGE.none;
  return tpl`<span class="badge badge-${c.tone}" title="Telemetry coverage: ${c.label}"><span class="glyph" aria-hidden="true">${c.glyph}</span>${c.label}</span>`;
}

export function severityBadge(severity) {
  const s = SEVERITY[severity] || SEVERITY.warning;
  return tpl`<span class="badge badge-${s.tone}"><span class="glyph" aria-hidden="true">${s.glyph}</span>${s.label}</span>`;
}

export function confidenceBadge(value) {
  if (!value || value === "evidenced") return raw("");
  const c = CONFIDENCE[value] || CONFIDENCE.seed;
  return tpl`<span class="badge badge-seed" title="${c.label}">${c.label}</span>`;
}

export function frameworkBadge(framework) {
  return tpl`<span class="badge badge-neutral" data-framework="${framework}">
    <span class="glyph" aria-hidden="true">◈</span>${FRAMEWORK_LABEL[framework] || framework}</span>`;
}

export function usd(value) {
  const n = Number(value) || 0;
  const abs = Math.abs(n);
  if (abs >= 1e6) return `${n < 0 ? "-" : ""}$${(abs / 1e6).toFixed(abs >= 1e7 ? 0 : 1)}M`;
  if (abs >= 1e3) return `${n < 0 ? "-" : ""}$${Math.round(abs / 1e3)}k`;
  return `${n < 0 ? "-" : ""}$${Math.round(abs)}`;
}

/** Latency in whatever unit keeps it a two-digit number. */
export function seconds(value) {
  const s = Number(value) || 0;
  if (s < 90) return `${Math.round(s)}s`;
  if (s < 5400) return `${(s / 60).toFixed(s < 600 ? 1 : 0)} min`;
  return `${(s / 3600).toFixed(1)} hr`;
}
