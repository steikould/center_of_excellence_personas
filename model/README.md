# The agent registry

The system of record for **what agents exist**. One Agent Operating Manifest per
agent, in plain YAML, reviewed in a pull request like code.

This directory holds the agent layer only. The enterprise business and IT model —
domains, capabilities, processes, applications, infrastructure — lives in
[`app/data/`](../app/data/) and is generated from `app/tools/seed_business.py` and
`seed_apps.py`. The two meet in the graph, not in a second copy of the model.

| File | What it holds |
|------|---------------|
| `agents/*.yaml` | One [Agent Operating Manifest](../knowledge-base/_schema/agent-manifest.schema.md) per agent |
| `infrastructure.yaml` | The federated runtimes agents execute on, and the central control plane |
| `controls.yaml` | Governance controls, each with how conformance is actually evidenced |
| `meta.yaml` | Schema version and the confidence-level definitions |

## Regenerating

```bash
python3 app/tools/generate_seed.py   # projects the registry into app/data/
node app/tools/verify.mjs            # acceptance checks, agent layer included
```

`app/tools/seed_agents.py` does the projection. Every binding into the enterprise
model is guarded: a manifest naming a process, application, host or platform
service that does not exist fails the generator rather than producing a dangling
edge. Runtime `hosts` lists are cross-checked against what each manifest claims
its runtime is, so the two cannot drift apart silently.

## Where an agent lands in the graph

| | Level | Why there |
|---|---|---|
| `Agent` | T1 — application & service landscape | An agent is a service that supports business steps. Placing it beside applications means the lens pivot, technology chain and impact analysis work on it with no special cases. |
| `AgentRuntime` | T4 — platform & runtime | It is one. Runtimes then run on the clusters, hosts and sites already in the model. |

The control plane is bound in as platform services, but telemetry reaches it by
`integrates_with`, never `depends_on`. That is deliberate: the graph does not
treat an integration as a dependency, so impact analysis from the conformed
telemetry pipeline reaches **zero** business processes — which makes ADR-001's
central claim checkable rather than merely asserted. `verify.mjs` asserts it.

## Confidence

Every record carries `confidence: seed | declared | evidenced`, and the agent
estate view renders the marker wherever a value appears.

**Everything here is `seed`** — illustrative structure, not an inventory. Replace
it with what the handover checks in
[`docs/agent-operations/`](../docs/agent-operations/README.md) turn up.
