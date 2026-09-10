# ADR-002: The Agent Operating Manifest is the registration and provisioning contract

## Status
Proposed

## Date
2026-09-09

## Context

ADR-001 establishes a federated estate with a central registry. This ADR settles
what a registry entry *is*, and how an agent gets one.

The organisation already runs an enterprise deployment platform: approved projects
spin up their own applications, obtain API connections to internal systems, and
provision cloud resources through it. Agents are currently being built outside that
path — one of the five reached production with no technical owner, no telemetry
export and validation still in draft, and nothing in the process caught it.

Registration schemes that are pure compliance overhead do not get used. Registration
that is the only way to get an API connection does.

## Decision

**One Agent Operating Manifest per agent, in git, as the single intake artefact for
the enterprise deployment platform.**

- Schema: `knowledge-base/_schema/agent-manifest.schema.md`. Framework-neutral: agent
  OS, Copilot Studio, Dify and anything future describe themselves identically.
- Storage: `model/agents/{id}.yaml`, reviewed as code.
- Validation: `app/tools/generate_seed.py` projects the registry into the enterprise
  graph and fails on any broken reference — an unknown process, application, runtime
  or control. It derives risk findings by rule, so the gap list cannot go stale by
  hand, and `app/tools/verify.mjs` asserts the acceptance criteria in CI.
- Provisioning: on merge, the deployment platform provisions from the manifest — the
  workload identity, the API connections named in `interfaces.systems`, the secret
  scope, and the collector endpoint named in `telemetry.collector`.
- Promotion: blocked until the central evaluation score clears the agent's registered
  threshold (`ctl-eval-gate`).
- Every record carries a `confidence` marker (`seed` / `declared` / `evidenced`), and
  the Enterprise Map renders it, so unverified numbers cannot silently become fact.

## Consequences

### Positive
- Registration is the path of least resistance rather than a tax: you register because that is how you get your API connections.
- Access is declared, reviewable and diffable. `read-write` on a QMS shows up in a pull request instead of a console.
- Governance gaps become build failures and derived findings rather than a spreadsheet somebody maintains.
- The Enterprise Map, the evaluation harness and the deployment platform all read one artefact, so they cannot disagree.
- The estate survives the consultant leaving: the manifest is ours whatever happens to the workspace it describes.

### Negative
- A pull request stands between a team and a running agent. For a genuine prototype this is friction; `status: proposed` and a non-GxP scope should keep that path light.
- The manifest can drift from reality. It asserts; it does not observe.

### Risks
- Drift is the main failure mode: a manifest that says `read` while the service principal holds `read-write`. Mitigation: reconcile declared access against IAM and against observed tool-call spans, and treat a mismatch as a finding — `evidenced` confidence should mean exactly this reconciliation passed.
- Schema churn as the estate grows. Mitigation: `AOM v1.0` is versioned; additive changes only within a major version.

## Compliance Impact
- **GxP Affected**: Yes — the manifest carries validation status, Part 11 scope and controls in force for GxP agents.
- **Validation Required**: No for the registry itself. It is metadata and pointers, not a regulated record, and no product decision depends on it.
- **Change Control**: Yes where a manifest change alters a validated agent's scope, autonomy or system access.
- **Regulatory Notification**: No.

## Alternatives Considered

| Option | Pros | Cons | Why Not |
|---|---|---|---|
| Register agents in the existing CMDB / ServiceNow | Reuses an owned system; already in ITSM workflows | No good shape for prompts, tools, evaluation thresholds or telemetry coverage; not diffable; not close to where agents are built | Would become a stale copy within a quarter |
| Use each framework's own registry (agent OS workspace, Power Platform solutions, Dify apps) | Zero build; always current | Three registries, three schemas, no portfolio view, and nothing survives losing access to a vendor workspace | Fails the question this ADR exists to answer |
| A registry database with a UI, rather than files in git | Nicer authoring for non-engineers | Loses code review, diffs, CI validation and the ability to provision from the same artefact | Files first; the Enterprise Map already reads the same schema, and richer authoring can come later if it proves to be the bottleneck |

## Metadata
- **Decision Maker(s)**: AI CoE Senior Director; Enterprise Architect; Platform Engineering
- **Contributed By**: Enterprise Architect
- **Last Reviewed**: 2026-09-09
