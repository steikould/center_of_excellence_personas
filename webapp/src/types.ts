/** Shapes of webapp/public/model.json, produced by scripts/build-model.mjs. */

export type Confidence = 'seed' | 'declared' | 'evidenced';
export type Severity = 'good' | 'warning' | 'serious' | 'critical';
export type ProcessMode = 'human' | 'agent' | 'agent+hitl' | 'system';
export type Coverage = 'full' | 'partial' | 'none';

export interface Kpi {
  id: string;
  label: string;
  value: number;
  unit: string;
  target: number;
  direction: 'up' | 'down';
}

export interface Domain {
  id: string;
  name: string;
  shortName: string;
  owner: string;
  confidence: Confidence;
  summary: string;
  valueAtStake: number;
  outcome: string;
  pressures: string[];
  kpis: Kpi[];
  derived: {
    capabilityCount: number;
    processCount: number;
    coveragePct: number;
    agents: string[];
    agentCount: number;
    fteReleased: number;
    priorFte: number;
    currentFte: number;
    runCostUsd: number;
    benefitUsd: number;
    netBenefitUsd: number;
    riskScore: number;
    worstSeverity: Severity;
    systems: string[];
  };
}

export interface Process {
  id: string;
  name: string;
  mode: ProcessMode;
  agent?: string;
  systems: string[];
  description?: string;
  cycleTimeBefore: number;
  cycleTimeAfter: number;
  cycleUnit: string;
  capability: string;
  domain: string;
}

export interface Capability {
  id: string;
  domain: string;
  name: string;
  confidence: Confidence;
  summary: string;
  annualVolume: number;
  volumeUnit: string;
  priorFte: number;
  currentFte: number;
  processes: Process[];
  derived: {
    processCount: number;
    automatedCount: number;
    coveragePct: number;
    agents: string[];
    minutesBefore: number;
    minutesAfter: number;
    cycleReductionPct: number;
    fteReleased: number;
  };
}

export interface AgentTool {
  name: string;
  type: string;
  access: string;
  scope: string;
}

export interface Agent {
  id: string;
  name: string;
  shortName: string;
  version: string;
  status: 'production' | 'pilot' | 'retired' | 'proposed';
  confidence: Confidence;
  oneLiner: string;
  provenance: {
    builtBy: string;
    deliveredOn: string;
    handoverStatus: string;
    sourceAvailable: boolean;
    sourceLocation: string;
  };
  platform: {
    framework: string;
    frameworkVersion: string;
    runtime: string;
    orchestrationStyle: string;
    interop: string;
  };
  ownership: { businessOwner: string; technicalOwner: string; accountableExecutive: string };
  replaces: {
    roleTitle: string;
    fteEquivalent: number;
    displacementType: string;
    retainedByHumans: string[];
    note?: string;
  };
  business: { domain: string; capabilities: string[]; processes: string[] };
  model: { primary: string; fallback: string; temperature: number | string; promptVersioning: string };
  interfaces: {
    systems: string[];
    tools: AgentTool[];
    humanInLoop: { mode: string; gate: string; slaMinutes: number; overrideRatePct: number };
  };
  data: { classifications: string[]; residency: string; retention: string; trainingUse: string };
  telemetry: {
    emits: string;
    semconv: string;
    collector: string;
    exportsTo: string;
    coverage: Record<string, Coverage>;
    gaps: string[];
  };
  governance: {
    gxpRelevant: boolean;
    part11Scope: boolean;
    validationStatus: string;
    validationRef: string;
    periodicReview: string;
    modelRiskTier: number;
    controls: string[];
    regulatoryExposure: string;
  };
  economics: {
    annualRunCostUsd: number;
    annualBenefitUsd: number;
    benefitBasis: string;
    costConfidence: Confidence;
    benefitConfidence: Confidence;
  };
  health: {
    runsPerMonth: number;
    successRatePct: number;
    p50LatencySeconds: number;
    p95LatencySeconds: number;
    escalationRatePct: number;
  };
  openQuestions: string[];
  derived: {
    risks: { id: string; severity: Severity; label: string }[];
    riskScore: number;
    worstSeverity: Severity;
    netBenefitUsd: number;
    processCount: number;
    systemCount: number;
  };
}

export interface SystemEntry {
  id: string;
  name: string;
  category: string;
  vendor: string;
  hosting: string;
  owner: string;
  confidence: Confidence;
  purpose: string;
  dataClassification: string;
  gxpRelevant: boolean;
  part11: boolean | string;
  validationStatus: string;
  auditTrail: string;
  aiReadiness: 'ready' | 'constrained' | 'not-ready';
  aiReadinessNote?: string;
  interfaces: string[];
}

export interface Runtime {
  id: string;
  name: string;
  cloud: string;
  region: string;
  confidence: Confidence;
  operator: string;
  summary: string;
  compute: string[];
  identity: string[];
  network: string[];
  data: string[];
  secrets: string[];
  telemetry: {
    native: string;
    wire: string;
    redactionPoint: string;
    exportsTo: string;
  };
  gxpBoundary: boolean;
  hosts: string[];
}

export interface ControlPlaneEntry {
  id: string;
  name: string;
  layer: string;
  summary: string;
  implementation: string;
  ownedBy: string;
  inRequestPath: boolean;
  note?: string;
}

export interface Control {
  id: string;
  name: string;
  category: string;
  statement: string;
  verification: string;
  regulatoryBasis: string[];
}

export interface Flow {
  id: string;
  from: string;
  to: string;
  kind: 'data' | 'control' | 'telemetry';
  label: string;
  frequency: string;
  criticality: string;
  gxpInTransit: boolean;
  protocol: string;
  health?: string;
  note?: string;
}

export interface Portfolio {
  agentCount: number;
  frameworks: string[];
  runtimeCount: number;
  fteReleased: number;
  runCostUsd: number;
  benefitUsd: number;
  netBenefitUsd: number;
  valueAtStakeUsd: number;
  criticalRiskCount: number;
  seriousRiskCount: number;
  telemetryConformancePct: number;
  gxpAgentCount: number;
  validatedAgentCount: number;
}

export interface Model {
  meta: { schemaVersion: string; organization: string; asOf: string; disclaimer: string };
  portfolio: Portfolio;
  domains: Domain[];
  capabilities: Capability[];
  processes: Process[];
  agents: Agent[];
  systems: SystemEntry[];
  runtimes: Runtime[];
  controlPlane: ControlPlaneEntry[];
  controls: Control[];
  flows: Flow[];
}
