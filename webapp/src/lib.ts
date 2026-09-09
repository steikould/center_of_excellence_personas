import type { Agent, Capability, Coverage, Domain, Model, ProcessMode, Severity } from './types';

/* ------------------------------------------------------------- formatting */

export const usd = (n: number): string => {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  if (abs >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
};

export const num = (n: number): string => n.toLocaleString('en-US');

export const pct = (n: number): string => `${Math.round(n)}%`;

/** Minutes rendered at whatever unit reads naturally at that magnitude. */
export const duration = (minutes: number): string => {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  if (minutes < 60 * 24) return `${(minutes / 60).toFixed(minutes < 600 ? 1 : 0)} hr`;
  return `${(minutes / (60 * 8)).toFixed(1)} days`;
};

/** Latency reads in whatever unit keeps it a two-digit number. */
export const seconds = (s: number): string => {
  if (s < 90) return `${Math.round(s)}s`;
  if (s < 5400) return `${(s / 60).toFixed(s < 600 ? 1 : 0)} min`;
  return `${(s / 3600).toFixed(1)} hr`;
};

export const titleCase = (s: string): string =>
  s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/* ----------------------------------------------------------------- colour */

/** Categorical slots 1–3, reserved for framework identity. Assigned in fixed
 *  order and never cycled: a fourth framework folds into "Other" until the
 *  palette is re-validated for four all-pairs slots. */
const FRAMEWORK_ORDER = ['pwc-agent-os', 'copilot-studio', 'dify'] as const;

export const frameworkColor = (framework: string): string => {
  const i = FRAMEWORK_ORDER.indexOf(framework as (typeof FRAMEWORK_ORDER)[number]);
  return i >= 0 ? `var(--cat-${i + 1})` : 'var(--text-muted)';
};

export const frameworkLabel = (framework: string): string =>
  ({
    'pwc-agent-os': 'PwC agent OS',
    'copilot-studio': 'Copilot Studio',
    dify: 'Dify (self-hosted)',
  })[framework] ?? titleCase(framework);

/** Degree of machine execution is ordinal, not categorical: one hue, stepped.
 *  `system` is conventional (non-AI) automation and gets a neutral outline so
 *  it never reads as a step on the AI ramp. */
export const modeColor = (mode: ProcessMode): string =>
  ({
    human: 'transparent',
    system: 'var(--ord-1)',
    'agent+hitl': 'var(--ord-2)',
    agent: 'var(--ord-3)',
  })[mode];

export const modeLabel = (mode: ProcessMode): string =>
  ({
    human: 'Human',
    system: 'System automation',
    'agent+hitl': 'Agent, human approves',
    agent: 'Agent',
  })[mode];

export const MODE_ORDER: ProcessMode[] = ['human', 'system', 'agent+hitl', 'agent'];

export const statusColor = (s: Severity): string => `var(--${s})`;

export const severityLabel = (s: Severity): string =>
  ({ good: 'Healthy', warning: 'Watch', serious: 'At risk', critical: 'Critical' })[s];

/** Icon + label always accompany a status colour — colour never carries it alone. */
export const severityIcon = (s: Severity): string =>
  ({ good: '✓', warning: '!', serious: '▲', critical: '■' })[s];

export const coverageRank: Record<Coverage, number> = { none: 0, partial: 1, full: 2 };

export const coverageColor = (c: Coverage): string =>
  ({ none: 'var(--ord-track)', partial: 'var(--ord-2)', full: 'var(--ord-3)' })[c];

/* ---------------------------------------------------------------- lookups */

export interface Lookups {
  domain: Map<string, Domain>;
  capability: Map<string, Capability>;
  agent: Map<string, Agent>;
  process: Map<string, Model['processes'][number]>;
  system: Map<string, Model['systems'][number]>;
  runtime: Map<string, Model['runtimes'][number]>;
  controlPlane: Map<string, Model['controlPlane'][number]>;
  control: Map<string, Model['controls'][number]>;
}

export const buildLookups = (m: Model): Lookups => ({
  domain: new Map(m.domains.map((d) => [d.id, d])),
  capability: new Map(m.capabilities.map((c) => [c.id, c])),
  agent: new Map(m.agents.map((a) => [a.id, a])),
  process: new Map(m.processes.map((p) => [p.id, p])),
  system: new Map(m.systems.map((s) => [s.id, s])),
  runtime: new Map(m.runtimes.map((r) => [r.id, r])),
  controlPlane: new Map(m.controlPlane.map((c) => [c.id, c])),
  control: new Map(m.controls.map((c) => [c.id, c])),
});

/** Human-readable name for any node id in the model, whatever its kind. */
export const nodeName = (lk: Lookups, id: string): string =>
  lk.agent.get(id)?.name ??
  lk.system.get(id)?.name ??
  lk.runtime.get(id)?.name ??
  lk.controlPlane.get(id)?.name ??
  lk.domain.get(id)?.name ??
  lk.capability.get(id)?.name ??
  lk.process.get(id)?.name ??
  id;
