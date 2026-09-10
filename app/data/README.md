# Model interchange format

The model is two JSON documents: one for **nodes**, one for **edges**. Both are plain, flat and
sorted, so they can be produced from a spreadsheet export, an enterprise-architecture repository or
a CMDB extract, and diffed sensibly in version control.

`seed-data.js` is the same content wrapped as an ES module, so the application also runs from the
file system where `fetch` is unavailable. It is generated — never edit it by hand.

## nodes.json

```json
{
  "format": "business-it-map",
  "kind": "nodes",
  "version": "1.0",
  "model": "Vetrellis Animal Health - demo enterprise model",
  "nodes": [
    {
      "id": "app-billwise",
      "type": "Application",
      "lens": "it",
      "level": "T1",
      "name": "BillWise Billing",
      "description": "Invoice generation, billing schedules, credit notes and dispute case handling.",
      "code": "",
      "owner": "Application Owner - Finance",
      "lifecycle": "active",
      "criticality": "critical",
      "health": "ok",
      "maturity": 0,
      "tags": ["application", "finance", "vendor"],
      "props": { "category": "Finance", "vendor": "BillWise", "costBand": "L" },
      "externalRefs": { "cmdb": "CI-APP-BILLWISE" }
    }
  ]
}
```

| Field | Meaning |
|---|---|
| `id` | Stable unique identifier. Referenced by every edge. |
| `type` | One of the node types below. |
| `lens` | `business` or `it`. Derived from `level` when absent. |
| `level` | `B1`–`B4` in the business lens, `T1`–`T5` in the IT lens. |
| `name`, `description` | Plain language. The description is shown to non-technical users. |
| `code` | Optional hierarchy number, e.g. `5.5.2`. |
| `owner` | Named steward or team. Empty or `Unassigned` is reported as a finding. |
| `lifecycle` | `plan` · `active` · `phase-out` · `retired` |
| `criticality` | `low` · `medium` · `high` · `critical` |
| `health` | `ok` · `watch` · `at-risk` · `unknown` |
| `maturity` | `0` (not rated) to `5`. |
| `tags` | Free-form labels. |
| `props` | Anything type-specific: vendor, protocol, environment, region, cost band… |
| `externalRefs` | Identifiers in the systems this was imported from, e.g. `{"cmdb": "CI-…"}`. |

**Node types** — `BusinessDomain`, `Capability`, `Process`, `Activity`, `Application`, `Agent`,
`ExternalService`, `DeployableUnit`, `DataStore`, `Interface`, `IntegrationFlow`, `PlatformService`,
`AgentRuntime`, `Environment`, `Host`, `Cluster`, `NetworkZone`, `Site`.

`Agent` (T1) and `AgentRuntime` (T4) are generated from the agent registry in
[`../../model/`](../../model/README.md) by `app/tools/seed_agents.py` — do not hand-edit them here;
edit the manifest and regenerate. An agent is a supporting service like an application, but it is
deliberately **not** an application: redundancy, coverage gaps and the capability matrix all mean
*application* specifically.

## edges.json

```json
{
  "format": "business-it-map",
  "kind": "edges",
  "version": "1.0",
  "model": "Vetrellis Animal Health - demo enterprise model",
  "edges": [
    { "id": "app-billwise|supports|proc-invoice-generation",
      "type": "supports", "from": "app-billwise", "to": "proc-invoice-generation", "props": {} }
  ]
}
```

Edges are directed. `id` defaults to `from|type|to`, which makes them naturally idempotent.

| Type | Direction | Meaning |
|---|---|---|
| `contains` | parent → child | Hierarchy within a lens. Domain→Capability→Process→Activity; Application→its parts; Environment→Host; Site→NetworkZone. |
| `supports` | Application → business node, Agent → business node | **The pivot edge.** What business work this system serves. From an agent it may carry `props.cycleBeforeMinutes` / `cycleAfterMinutes` / `cycleUnit` — that agent's claim about what it did to the step. |
| `realizes` | DeployableUnit → Application, ExternalService → Application, unit → Interface | The concrete thing that provides the abstract one. |
| `depends_on` | any → any | A dependency not covered by a more specific type. |
| `connects_to` | Application → IntegrationFlow → Application | Integration, modelled with the flow as the middle node so it can carry protocol and frequency. |
| `integrates_with` | Application ↔ Application, AgentRuntime → control plane, Agent → Agent | Convenience summary of a `connects_to` pair; carries `props.via`. Also used for links that are explicitly **not** dependencies — telemetry export and agent handoffs — so they never appear in impact analysis. |
| `runs_on` | DeployableUnit → PlatformService, DataStore → PlatformService, Agent → AgentRuntime | Execution or storage platform. |
| `hosted_in` | PlatformService → Host, Host → Site, Host → NetworkZone | Physical or logical placement. |
| `stores` / `reads` | DeployableUnit ↔ DataStore | Which unit owns the data and which only reads it. |

### Rules

1. **`contains` forms a tree.** Every element has at most one containing parent, and no cycles.
   Everything else forms a graph.
2. **Edges must resolve.** An edge naming a node that is not in the file is dropped on import and
   reported in the data-quality panel rather than failing the load.
3. **Orphans are findings, not errors.** An application with no `supports` edge imports fine and is
   surfaced at `#/quality` — that is the point of the panel.
4. **Canonical form.** Keys are written in the order above, elements sorted by `id`, two-space
   indent, trailing newline. Two exports of the same model are byte-identical; `node
   app/tools/verify.mjs` asserts that an export followed by a re-import reproduces the model exactly.

## Loading your own model

`#/model` → *Import*, as Admin. Select a nodes file and an edges file (or one bundle holding both).
The file is validated before anything is replaced, and problems are listed rather than swallowed.

Minimum viable model: business nodes joined by `contains`, applications, and one `supports` edge
per application. Everything else — the technology levels, the health ratings, the integrations —
enriches the views but is not required.
