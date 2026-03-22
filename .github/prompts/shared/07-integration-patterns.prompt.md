# Module 07 — Integration Patterns

> **Goal**: Map how your systems connect to others and document the data flows that will form the edges of our enterprise knowledge graph.

---

## What You're Learning
- Systems thinking — seeing beyond individual platforms to the connections between them
- How data flows map to graph edges in the future enterprise AI brain
- Integration architecture patterns relevant to animal pharmaceutical operations

## Concept: The Connection Graph

Every system in our organization is connected to others. These connections carry data, trigger processes, and create dependencies. Right now, most of this knowledge is tribal — it lives in the heads of the people who built or maintain the integrations.

**Your goal in this module:** Document the connections you know about, from your perspective, using the connection pattern schema. When combined with every other persona's contributions, these become the edge definitions of our enterprise knowledge graph.

```
[Platform A] --{data flow}--> [Platform B]
     |                              |
     |--{API call}-->[Platform C]   |--{file drop}-->[Platform D]
```

## The Challenge

### Part 1 — Map Your Integration Landscape
Start with the platforms you documented in Module 02. For each one, ask:

```
#file:knowledge-base/_schema/connection-pattern.schema.md
#codebase

Looking at the platform entry for [PLATFORM] in knowledge-base/platforms/, help me document all the integration points I know about. Let me describe them and you structure them as connection pattern entries.

Connections I know about:
- [Platform A] sends [what data] to [Platform B] via [how]
- [Platform C] pulls [what data] from [Platform A] every [frequency]
- [etc.]
```

### Part 2 — Discover Hidden Connections
Ask Copilot to help you think about connections you might be overlooking:

```
#codebase

Based on the platforms documented in knowledge-base/platforms/ and typical animal pharmaceutical IT landscapes, what integration patterns are likely missing? Consider:
- Regulatory reporting feeds
- Quality management system integrations
- Supply chain data flows
- Commercial/sales data connections
- Research & development data pipelines
```

### Part 3 — Assess AI/ML Readiness
For each connection you've documented, evaluate its AI/ML potential:

```
Review the connection patterns I've documented. For each one, assess:
1. Could an AI model consume this data flow as a feature source?
2. Could AI improve the reliability of this integration (anomaly detection, predictive alerting)?
3. Could this connection be part of an automated decision pipeline?
4. What data quality or compliance barriers would need to be addressed first?
```

### Part 4 — Cross-Persona Integration Map
Look at connections that involve other personas' platforms:

```
#codebase

Which of my documented connections touch platforms owned by other personas? Create a summary showing:
- Connection → Which persona owns each end
- What coordination would be needed to add AI/ML to this integration
- What governance considerations apply
```

## Save Step
- Save connection patterns to `knowledge-base/connections/{source}-to-{target}-{persona}-{YYYY-MM}.md`
- Save your integration landscape summary to `personas/{role}/workspace/artifacts/integration-map.md`
- Mark Module 07 complete in your journey

## Stretch Goal
Draft a "future state" integration map showing how AI/ML services would sit in the data flow architecture. What new connections would be needed? What existing connections would need to be enhanced? Save to `personas/{role}/workspace/artifacts/future-integration-map.md`.

---

**Next**: Module 08 — Capstone
