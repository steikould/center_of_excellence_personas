# ADR-001: Federate agent runtimes, centralise the telemetry contract

## Status
Proposed

## Date
2026-09-09

## Context

The CoE has inherited five agents that now perform work people used to perform.
They were built by different teams on at least three different frameworks and run
in three different places: a consultant-delivered orchestration platform in an Azure
landing zone, a Power Platform managed environment, and an on-premises Kubernetes
cluster. More are coming, and we do not control which frameworks the business picks.

Three of the five touch GxP records. One produces regulatory submissions directly.
One answers veterinarians without human review. We currently cannot answer, in one
place, what agents exist, what they can reach, what they cost, or whether they are
working — and one of them is in production against regulatory submissions with no
technical owner and no telemetry we can query.

The forcing question is whether to build a single runtime harness that every agent
invocation passes through, or to let each runtime keep its own LLMOps and
standardise only what crosses the boundary.

## Decision

**Federate execution and native LLMOps. Centralise four thin things, none of them
in any agent's request path:**

1. **Agent Registry** — one Agent Operating Manifest per agent, version-controlled in git.
2. **Conformed telemetry pipeline** — a gateway OpenTelemetry Collector that *receives*
   already-redacted spans from each runtime's local collector, normalises them to the
   `gen_ai.*` semantic conventions, and lands them in a warehouse.
3. **Central evaluation and scorecard** — one golden-set harness that calls each agent
   through its own public interface and writes scores back as evaluation spans.
4. **Policy baseline** — the controls every agent must satisfy, checked in CI against
   the manifest and audited from telemetry.

**Redaction happens at the edge.** Each runtime's local collector strips
`gen_ai.*.content` and substitutes a payload hash reference before anything leaves
the boundary. The central pipeline rejects spans that still carry content attributes.

## Consequences

### Positive
- No new single point of failure in front of regulated work, and no latency hop on every model and tool call.
- Prompt and response bodies for GxP and personal data never leave the runtime that produced them, which keeps the central store out of validation scope and out of the residency argument.
- Each platform keeps the native tooling its builders already use — agent OS dashboards, Copilot Studio analytics, Langfuse — so adoption costs nothing.
- Works with platforms we do not control the request path of. Copilot Studio invokes managed models we cannot front; a proxy design would simply exclude it.
- Cross-framework comparison becomes possible on one schema: cost, latency, escalation rate, override rate, evaluation score.

### Negative
- Redaction configuration is duplicated per runtime and must be code-reviewed in each. A mistake in one collector leaks payloads from that boundary.
- Payload bodies are not centrally queryable, so deep debugging requires access to the originating runtime.
- Cost is not natively comparable across frameworks: Copilot Studio meters in Copilot Credits, not tokens, and self-hosted model cost is modelled rather than metered.

### Risks
- The `gen_ai.*` agent and tool spans are still experimental. Client spans stabilised in early 2026, but the conventions moved to their own repository with an independent release cadence in v1.42.0, and attribute names can still change. Mitigation: pin an accepted version at the central collector and own the mapping layer explicitly.
- Dify supports only one tracing backend per workflow app, so fan-out must happen at the collector, not in the application. Mitigation: this is already the design; do not let a team wire an app directly to the central endpoint.
- Federation degrades quietly. A runtime that stops exporting looks identical to a runtime with nothing to report. Mitigation: the registry declares expected coverage per agent, and absence of expected telemetry is itself an alert.

## Compliance Impact
- **GxP Affected**: Yes — three of five agents process GxP records.
- **Validation Required**: No for the telemetry pipeline itself, provided it carries no GxP source data and no regulated decision depends on it. The edge-redaction design is what makes that true, so any change to it reopens this question.
- **Change Control**: Yes for collector configuration inside validated landing zones.
- **Regulatory Notification**: No.

## Alternatives Considered

| Option | Pros | Cons | Why Not |
|---|---|---|---|
| Single central runtime harness / gateway all agents call through | One place for policy, payload inspection and cost metering; uniform enforcement | Single point of failure in front of regulated work; latency on every call; must see payloads, pulling GxP and personal data into a new system needing its own validation and Part 11 trail | Structurally cannot cover Copilot Studio or a vendor-hosted orchestrator, so it would deliver partial coverage while reporting it as complete |
| Per-cloud LLMOps with no central layer at all | Zero build cost; each team keeps what it has | No inventory, no cross-framework comparison, no independent evaluation, no portfolio view | This is the current state, and it is what produced an unowned unvalidated agent in production |
| Central layer built on a proprietary vendor schema | Faster to stand up; richer out of the box | Locks the estate to one vendor's model of what an agent is, at the exact moment the standard is settling | Contradicts the reason for a CoE-owned layer |
| Wait for `gen_ai.*` to stabilise before building | Avoids rework on attribute renames | Leaves the estate ungoverned for an unknown period | The mapping layer is cheaper than the delay |

## Metadata
- **Decision Maker(s)**: AI CoE Senior Director; Enterprise Architect
- **Contributed By**: Enterprise Architect
- **Last Reviewed**: 2026-09-09
