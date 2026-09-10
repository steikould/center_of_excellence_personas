# Operating the agent estate

> How the CoE takes ownership of five consultant-built agents, and how it governs
> the ones that come next — from Copilot Studio, from Dify, from wherever.

This document answers three questions in order, because the answers depend on each
other:

1. **What did the consultant actually build on?** (research, with the checks to confirm it)
2. **One harness for everything, or federated?** (recommendation, with the reasoning)
3. **What does the CoE actually build?** (the manifest, the pipeline, the atlas)

---

## 1. What the five agents are most likely built on

The strong prior is **PwC's agent OS**. It is PwC's own orchestration platform,
launched in 2025 and pushed hard into exactly this kind of engagement, and its
shape matches what a delivery team would leave behind:

| Property | What it means for us |
|---|---|
| Framework-agnostic orchestration — it wraps agents built on Anthropic, OpenAI, Azure, AWS, Google, Salesforce, SAP and others rather than replacing them | The "framework" question may have two answers: what agent OS orchestrates, and what each step is actually built on underneath |
| Cloud-agnostic deployment — AWS, Azure, GCP, OCI, Salesforce, or on-prem | The agents probably run in *our* tenant, not PwC's. Confirm this first; everything else follows from it |
| Model Context Protocol for tool and data access, behind an API gateway with authn/authz and per-call logging | Tool access is likely already MCP. That is good news: MCP servers are portable, the orchestration around them is not |
| Built-in governance dashboard — session tracking, execution history, human-in-the-loop feedback, and **OpenTelemetry traces** with latency and cost per step | Telemetry already exists in a standard wire format. The work is routing it, not creating it |
| Drag-and-drop flow authoring with natural-language transitions | The flow definitions may live in the workspace UI rather than in files we hold. **This is the handover risk.** |

**Do not take this on faith.** Four checks, roughly half a day, settle it:

1. **Whose tenant?** Open the Azure/AWS subscription the agents run in. If the
   resource group is ours, we hold the infrastructure. If it is PwC's, we hold nothing.
2. **Export a flow.** Ask for one agent's complete definition as a file — flow,
   prompts, tool schemas, eval set. If it can only be screenshotted, the agent is
   not an asset we own; it is a subscription.
3. **Find the traces.** If OpenTelemetry spans exist, find the collector endpoint
   and ask what it would take to add a second exporter. That is the whole
   integration.
4. **Read one MCP server.** If tool access is MCP, the servers are reusable
   regardless of what happens to the orchestrator. Inventory them separately.

If the answers come back differently — LangGraph, Bedrock AgentCore, plain Azure AI
Foundry agents, a bespoke Python service — **nothing below changes**. That is the
point of the design: the contract is the wire format and the manifest, not the
runtime.

Sources: [PwC agent OS](https://www.pwc.com/us/en/services/ai/agent-os.html) ·
[launch announcement](https://www.pwc.com/us/en/about-us/newsroom/press-releases/pwc-launches-ai-agent-operating-system-enterprises.html) ·
[MCP support](https://www.pwc.com/us/en/about-us/newsroom/press-releases/pwc-adds-support-for-mcp-in-agent-os.html) ·
[recent enhancements](https://www.pwc.com/us/en/services/ai/agent-os/agent-os-recent-enhancements.html)

---

## 2. One harness, or federated? — Federate the runtime, centralise the contract

**Recommendation: do not build a single harness that every agent calls through.**
Centralise four thin things instead, none of them in any agent's request path.

### Why a single runtime harness is the wrong shape

A central proxy or gateway that every agent invocation passes through fails on four
counts, and the fourth is fatal:

- **Availability.** It becomes a single point of failure in front of regulated work.
  When the harness is down, batch review stops.
- **Latency.** A hop in front of every model call and every tool call, paid on work
  that already runs to minutes.
- **Compliance blast radius.** To proxy the calls it must *see* the payloads. That
  puts GxP records, adverse event narratives and personal data into one new system
  that now needs its own validation, its own residency story and its own 21 CFR
  Part 11 audit trail.
- **It will not work anyway.** Copilot Studio agents run inside Power Platform and
  invoke managed models you do not front. A vendor-hosted agent OS runtime routes
  its own tool calls. You would be building a gateway that a third of your estate
  structurally cannot use — and then reporting "conformance" that means nothing.

### What to centralise instead

Standardise the **wire format**, not the runtime. Every major platform already
emits, or can emit, OpenTelemetry GenAI spans:

| Platform | Native LLMOps | How it reaches the centre |
|---|---|---|
| **PwC agent OS** | Governance dashboard: sessions, execution history, per-step latency and cost, HITL feedback | Already emits OTel traces. Add a second OTLP exporter on the in-cluster collector |
| **Microsoft Copilot Studio** | Copilot Studio analytics; environment-level agent telemetry export | Exports OpenTelemetry-aligned spans (agent invocation, tool calls, messages) to Application Insights; bridge App Insights → OTLP |
| **Dify (self-hosted)** | Dify tracing → Langfuse | Langfuse speaks OTLP natively. Note Dify allows **one tracing backend per workflow app**, so the collector must be the fan-out point, not the app |
| **Anything else** | Whatever it has | If it can emit OTLP, it qualifies. If it cannot, it does not go to production |

A caveat worth putting in front of the architecture board: the `gen_ai.*` agent
spans are **still experimental**. Client spans stabilised in early 2026, but agent
and tool spans have not, and as of the v1.42.0 release the GenAI conventions moved
into their own repository with their own release cadence. Pin a version, own a
mapping layer in the central collector, and expect to rev it. That is a smaller
cost than inventing a proprietary schema.

Sources:
[OTel GenAI conventions overview](https://greptime.com/blogs/2026-05-09-opentelemetry-genai-semantic-conventions) ·
[Copilot Studio telemetry export](https://learn.microsoft.com/en-us/microsoft-copilot-studio/whats-new) ·
[Application Insights agent view](https://learn.microsoft.com/en-us/azure/azure-monitor/app/agents-view) ·
[Dify observability](https://signoz.io/docs/dify-observability/) ·
[Langfuse OTel](https://langfuse.com/integrations/native/opentelemetry) ·
[Dify single-backend limitation](https://github.com/langgenius/dify/issues/25113)

### The four central components

| Component | What it is | Why it must be central |
|---|---|---|
| **Agent Registry** | One Agent Operating Manifest per agent, in git | You cannot govern an inventory you do not have. This is the artefact everything else keys off |
| **Conformed telemetry pipeline** | A gateway OTel Collector that accepts already-redacted spans and normalises them | Comparison across frameworks is impossible without one schema. Receives only — never proxies |
| **Central evaluation & scorecard** | One golden-set harness that calls each agent through its own public interface | **The one thing deliberately not federated.** A vendor grading its own homework is not evidence, and in a GxP context periodic review needs independent evidence |
| **Policy baseline** | The controls every agent must satisfy, checked in CI and audited from telemetry | A control nobody can evidence is a policy statement, not a control |

### Redaction happens at the edge, not the centre

This is the design decision that makes federation compliant rather than merely
convenient. Each runtime's **local** collector strips `gen_ai.*.content` and
replaces payloads with a hash reference **before anything leaves the boundary**.
The central pipeline rejects any span that still carries content attributes.

So: prompt and response bodies for GxP and personal data never leave the runtime
that produced them. What travels is the span skeleton — who ran, which tools, how
long, how much, what the human decided. That is enough for cost, reliability,
override rates and audit, and it keeps the central store out of validation scope.

---

## 3. What the CoE builds

### The Agent Operating Manifest (AOM)

One YAML file per agent, in git, reviewed like code. It is the pivot: framework-neutral,
so a PwC agent OS agent, a Copilot Studio agent and a Dify workflow all describe
themselves the same way.

Schema: [`knowledge-base/_schema/agent-manifest.schema.md`](../../knowledge-base/_schema/agent-manifest.schema.md)
Live examples: [`model/agents/`](../../model/agents/)

It carries the things nobody can currently answer in one place:

- what business process this replaced, and what people still do
- which systems it can reach, with what access — the blast radius
- where it runs, on what model, with what degraded mode
- what telemetry it actually emits, signal by signal
- GxP scope, validation status, model risk tier, controls in force
- run cost and attributed benefit, each with its own confidence marker

### The agent estate view

Agents are not given their own application. They are projected into the
[Enterprise Map](../../app/README.md) as nodes in the same graph as everything
else — an `Agent` sits at T1 beside the applications it works alongside, and an
`AgentRuntime` at T4 beside the platforms it runs on. That placement is the whole
trick: the lens pivot, the technology chain, impact analysis and search all work
on an agent with no special cases, and the agent estate view at `#/agents` is a
rollup of the same graph rather than a second opinion about it.

What that buys, concretely:

- **"Which business processes stop if the agent OS landing zone fails?"** is the
  ordinary impact-analysis question, answered against the ordinary graph: two
  business domains, three capabilities, six processes.
- **"What does a machine now do in pharmacovigilance?"** is the ordinary lens
  pivot from a capability into its IT scope.
- **ADR-001's claim that the centre is not in the request path** stops being an
  assertion and becomes a checkable property: telemetry reaches the control plane
  by `integrates_with`, which the graph does not treat as a dependency, so impact
  analysis from the conformed pipeline reaches zero business processes.
  `app/tools/verify.mjs` asserts exactly that.

The view is deliberately a *reader* of the registry, not a second source of truth.
If a number is wrong, the fix is a pull request against `model/agents/`.

### The tie to the enterprise deployment platform

Since approved projects can already provision their own apps, API connections and
cloud resources, **make the manifest the intake artefact**:

1. A team proposes an agent by opening a pull request with its manifest.
2. CI validates it — referential integrity against the real enterprise model, and
   that the committed graph still matches the manifests
   (`.github/workflows/model.yml`).
3. On merge, the deployment platform provisions from the manifest: the workload
   identity, the API connections listed under `interfaces.systems`, the secret
   scope, and the collector endpoint the runtime exports to.
4. The evaluation gate blocks promotion until the golden-set score clears the
   registered threshold.
5. The atlas picks it up on the next model build.

That makes registration the path of least resistance rather than a compliance tax:
you register because that is how you get your API connections. And it closes the
gap that produced the current situation, where an agent reached production against
regulatory submissions with no technical owner, no telemetry export and validation
still in draft.

---

## Sequencing

| | Work | Done when |
|---|---|---|
| **Now** | Run the four handover checks. Write a manifest for each of the five agents from what you find | Five manifests merged, every `confidence: seed` replaced |
| **Now** | Assign a technical owner to every agent | No agent shows the `no-owner` finding |
| **Next** | Add the second OTLP exporter in each runtime's collector; stand up the central collector and warehouse | Telemetry conformance at 100% in the atlas |
| **Next** | Emit human override *reason codes* as span attributes | The most valuable quality signal stops being stranded in vendor dashboards |
| **Then** | Stand up the central evaluation harness; wire the gate into the deployment platform | No promotion without a passing score |
| **Then** | Make the manifest the deployment platform's intake artefact | Provisioning is driven from the registry |

## Open decisions for the architecture board

- Pin which `gen_ai.*` convention version the central pipeline accepts, and who owns the mapping layer when it revs.
- Agree a Copilot Credit → token conversion factor, or accept that cost is not comparable across frameworks and say so on the dashboard.
- Decide whether `agt-reg-assembly` continues in production while its validation is in draft. That is a risk acceptance with a named signatory, or it stops.
- Decide the Documentum position. Legacy OCR failures cap batch-record automation, and no amount of agent work routes around it.
