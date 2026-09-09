# The model

Source of truth for the [Agent Atlas](../webapp/). Plain YAML, so it can be reviewed
in a pull request, edited by a person, or written by an agent.

| File | What it holds |
|------|---------------|
| `meta.yaml` | Schema version, as-of date, confidence-level definitions |
| `domains.yaml` | Level 0 — business domains, their outcomes, pressures and KPIs |
| `capabilities.yaml` | Levels 1–2 — capabilities and the process steps inside them |
| `agents/*.yaml` | One [Agent Operating Manifest](../knowledge-base/_schema/agent-manifest.schema.md) per agent |
| `systems.yaml` | Systems of record — mirrors the platform-entry schema |
| `infrastructure.yaml` | Level 3 — federated runtimes and the central control plane |
| `flows.yaml` | Integration topology — mirrors the connection-pattern schema |
| `controls.yaml` | Governance controls and how each is actually evidenced |

## Editing

```bash
cd webapp
npm run model     # compile + validate → webapp/public/model.json
```

The compile step *is* the validation step. It fails on any broken cross-reference —
an unknown domain, capability, process, system, runtime or control; a process
claiming an agent that does not claim it back; a process whose mode requires an
agent but names none. It warns on governance gaps that are not build-breaking, and
derives the risk findings the atlas renders.

## Confidence

Every record carries `confidence: seed | declared | evidenced`.

**Everything in this seed model is `seed`** — illustrative structure, not an
inventory. The atlas renders the marker on every page precisely so that unverified
numbers cannot quietly become fact. Replace them with what the handover checks in
[`docs/agent-operations/`](../docs/agent-operations/README.md) turn up.
