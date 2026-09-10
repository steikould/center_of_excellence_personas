# Agent Operating Manifest Schema (AOM v1.0)

Use this template when registering an AI agent — one that performs work a person
used to perform, or work nobody performed before. One manifest per agent, one file,
in `model/agents/{agent-id}.yaml`.

The manifest is **framework-neutral by design**. A PwC agent OS agent, a Copilot
Studio agent and a self-hosted Dify workflow all describe themselves with the same
fields, because everything downstream — the registry, the telemetry contract, the
evaluation gate, the deployment platform, the Enterprise Map — keys off this shape
rather than off any vendor's.

---

## Template

```yaml
id: agt-{short-name}                # stable, never reused
name: {Full agent name}
shortName: {Name for charts and tables}
version: "{semver of the agent, not the framework}"
status: {proposed | pilot | production | retired}
confidence: {seed | declared | evidenced}
oneLiner: "{What it does, in one sentence a business owner would recognise.}"

provenance:
  builtBy: "{Consultancy, internal team, or vendor}"
  deliveredOn: "{YYYY-MM-DD}"
  handoverStatus: {none | partial | complete | n/a}
  sourceAvailable: {true | false}   # do WE hold the flow, prompts and eval set?
  sourceLocation: "{Repository path, or TBC}"

platform:
  framework: {pwc-agent-os | copilot-studio | dify | bedrock-agentcore | langgraph | custom}
  frameworkVersion: "{version}"
  runtime: rt-{runtime-id}          # must exist in model/infrastructure.yaml
  orchestrationStyle: "{Deterministic flow | Planner+worker | ReAct | Topic-driven | ...}"
  interop: "{MCP | connectors | HTTP tools | ...}"

ownership:
  businessOwner: "{Role that owns the outcome}"
  technicalOwner: "{Team that gets paged. UNASSIGNED is a critical finding.}"
  accountableExecutive: "{Who answers for it at board level}"

replaces:
  roleTitle: "{The job title whose work this absorbed}"
  fteEquivalent: {number}
  displacementType: {task-absorption | channel-shift | net-new | role-elimination}
  retainedByHumans:
    - "{What a person still does, and why}"
  note: "{What actually happened to the people. Say the true thing.}"

business:
  domain: bd-{id}                   # ids from the enterprise model in app/data/
  capabilities: [cap-{id}]
  processes:                        # each id must exist; the generator checks
    - id: proc-{id}
      cycleBeforeMinutes: {number}  # optional; the agent's claim about this step
      cycleAfterMinutes: {number}
      cycleUnit: "{per case | per batch | per submission | ...}"
    - proc-{id}                     # a bare id is also accepted, with no claim

model:
  primary: "{Model and how it is reached}"
  fallback: "{Degraded mode. 'None configured' is a finding.}"
  temperature: {number}
  promptVersioning: "{How prompts are versioned. Console state is not versioning.}"

interfaces:
  systems: [sys-{id}]
  tools:
    - { name: "{tool-id}", type: {mcp | connector | http}, access: {read | read-write | write | execute}, scope: "{What it may touch, and what it may not}" }
  humanInLoop:
    mode: {approve-before-commit | review-after-produce | autonomous-with-escalation | none}
    gate: "{Who approves what, at which point}"
    slaMinutes: {number}
    overrideRatePct: {number}

data:
  classifications: [{public | internal | confidential | restricted | gxp | personal-data}]
  residency: "{us | eu | us-onprem | ...}"
  retention: "{Run state, span skeletons, payload bodies — each with a period}"
  trainingUse: {prohibited | permitted-with-dpia | "{condition}"}

telemetry:
  emits: {otel | appinsights-otel | native-only | none}
  semconv: "{Which convention version, or 'none — vendor dashboard only'}"
  collector: rt-{runtime-id}
  exportsTo: {cp-otel | none}
  coverage:
    traces:        {full | partial | none}
    metrics:       {full | partial | none}
    cost:          {full | partial | none}
    toolCalls:     {full | partial | none}
    humanFeedback: {full | partial | none}
    evaluations:   {full | partial | none}
  gaps:
    - "{What you cannot see, stated plainly}"

governance:
  gxpRelevant: {true | false}
  part11Scope: {true | false}
  validationStatus: {validated | pending | not-required}
  validationRef: "{Validation package reference}"
  periodicReview: "{YYYY-MM-DD, or 'not scheduled'}"
  modelRiskTier: {1 | 2 | 3}
  controls: [ctl-{id}]
  regulatoryExposure: "{Direct, indirect, or none — and through what}"

economics:
  annualRunCostUsd: {number}
  annualBenefitUsd: {number}
  benefitBasis: "{How the benefit was derived. Be specific enough to argue with.}"
  costConfidence: {seed | declared | evidenced}
  benefitConfidence: {seed | declared | evidenced}

health:
  runsPerMonth: {number}
  successRatePct: {number}
  p50LatencySeconds: {number}
  p95LatencySeconds: {number}
  escalationRatePct: {number}

openQuestions:
  - "{What you still do not know, and who can answer it}"
```

---

## Field guidance

**`confidence`** — Every record carries one. `seed` is an illustrative placeholder
authored by the CoE. `declared` is asserted by the owning team. `evidenced` is backed
by telemetry, a config export, or a signed manifest. A dashboard full of `seed`
values presented as fact is worse than no dashboard.

**`replaces`** — The hardest section to write honestly and the one an executive will
be asked about first. `fteEquivalent` is task load absorbed, not people removed;
`displacementType` and `note` are where you say which actually happened. If people
were redeployed, say where to. If contracts were not renewed, say that.

**`interfaces.tools[].access`** — This is the blast radius. `read-write` on a QMS is
a materially different agent from `read`. Scope must say what the agent may *not* do
(`create draft deviations; cannot close or approve`), because that sentence is what
a control is verified against.

**`telemetry.coverage`** — Per signal, not one overall grade. `traces: full` with
`cost: none` is a common and expensive combination: you can see the agent working
and cannot attribute a cent of the model bill to it.

**`governance.controls`** — Reference `model/controls.yaml`. Every control there
names how conformance is *proven*. Listing a control you cannot evidence from
telemetry or CI makes the manifest worse, not better.

**`business.processes[].cycle*`** — The agent's claim about what it did to that
step's cycle time. It belongs here, on the agent, rather than on the enterprise
process node: the "before" only means anything relative to an intervention, and
the 120 steps no agent touches have no before. The generator writes the pair onto
the `supports` edge — which is exactly what it describes, this agent's effect on
this step — and refuses a claim where the cycle got *worse*, since that is almost
always a transposition.

**`cycleUnit` matters more than it looks.** Steps measured per inquiry and per
submission share no axis, so the estate view charts *proportional* change and
only ever puts absolute times on a shared axis within a single agent. Name the
unit or the number cannot be read.

**`openQuestions`** — Keep it populated. An agent with no open questions has either
been fully handed over or has not been looked at.

---

## Validation

`app/tools/seed_agents.py` projects the registry into the enterprise graph, and
that projection is the validation. Every binding is guarded: a manifest naming a
business process, application, runtime, host, platform service or control that
does not exist fails `generate_seed.py` rather than producing a dangling edge.
Runtime `hosts` lists are cross-checked against what each manifest claims its
runtime is, so the two cannot drift apart silently.

It also derives the risk findings — no technical owner, GxP production without
validation, no central telemetry export, no cost attribution, no evaluation, no
degraded mode, source not held, no periodic review, unreviewed external output.
Those are rules over the manifests, not a hand-maintained list, so they cannot go
stale while the estate changes. `health` is derived from them too: an agent
carrying a critical finding cannot render as green.

`node app/tools/verify.mjs` then asserts the acceptance criteria, including that
every agent is bound into the graph in both directions and that the central
control plane is in no agent's request path.

## Where to save

- `model/agents/{id}.yaml` — the manifest itself
- `knowledge-base/decisions/` — an ADR for any material change to an agent's scope,
  autonomy or regulatory posture
