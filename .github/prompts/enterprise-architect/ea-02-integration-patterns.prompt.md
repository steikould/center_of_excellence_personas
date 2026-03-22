# EA-02 — Integration Pattern Catalog

> **Goal**: Build a comprehensive catalog of integration patterns across the enterprise — documenting current state, identifying anti-patterns, and proposing the target architecture.

---

## What You're Learning
- How to use Copilot to systematically document integration patterns using structured schemas
- How to identify integration anti-patterns and propose migration paths
- How the connection-pattern schema creates the edges of the enterprise knowledge graph

## Concept: Integrations Are the Architecture

Individual systems are commodities. The architecture is in the integrations — how data moves, what triggers what, where transformations happen, and what breaks when something fails. In animal pharma, these integrations carry regulatory weight: a LIMS-to-ERP batch result transfer is not just a data flow, it is a GxP-regulated handoff that auditors will inspect.

**Common integration patterns in animal pharma:**

| Pattern | Example | Concern |
|---------|---------|---------|
| **Batch result transfer** | LIMS to ERP quality module | GxP data integrity, audit trail continuity |
| **Batch record assembly** | MES + LIMS + ERP to batch record | Regulatory submission readiness |
| **Environmental alerting** | Monitoring sensors to QMS | Real-time excursion detection, deviation triggers |
| **Supply chain sync** | ERP to warehouse/distribution | Demand forecasting, cold chain compliance |
| **Document lifecycle** | Authoring tools to EDMS to regulatory | Version control, 21 CFR Part 11 signatures |
| **Pharmacovigilance** | Field reports to safety database | Adverse event regulatory timelines |
| **Master data sync** | ERP to all downstream systems | Material, vendor, customer data consistency |

**Integration anti-patterns to watch for:**

| Anti-Pattern | Symptom | Risk |
|--------------|---------|------|
| **Point-to-point spaghetti** | Every system talks directly to every other system | Exponential complexity, no single view of data flows |
| **Shared database coupling** | Systems read/write the same database tables | Tight coupling, schema changes break everything |
| **Manual file drops** | SFTP folders with CSV files and no monitoring | Silent failures, data staleness, no audit trail |
| **Middleware monolith** | One integration platform does everything | Single point of failure, vendor lock-in |
| **Shadow integrations** | Undocumented Excel macros or scripts moving data | Compliance risk, no one knows they exist until they break |

## The Challenge

### Part 1 — Document Current-State Integrations

Start with the systems from EA-01. For each pair of connected systems, create a connection pattern entry:

```
#file:knowledge-base/_schema/connection-pattern.schema.md
#codebase

Help me document the integration between [SYSTEM A] and [SYSTEM B]. Here's what I know:
- What data moves: [description]
- Direction: [A to B / B to A / bidirectional]
- How it moves: [API / file drop / database link / message queue / manual]
- Frequency: [real-time / hourly / daily / etc.]
- What middleware is involved: [MuleSoft / Informatica / custom / none]
- What happens when it fails: [description]
- Is GxP data involved: [yes/no]

Create a complete connection-pattern entry. Flag any fields I should know but might not have visibility into.
```

### Part 2 — Identify Anti-Patterns

Ask Copilot to analyze the integration catalog for problems:

```
#codebase

Review all the connection patterns documented in knowledge-base/connections/. Identify:

1. **Anti-patterns present**: Which integrations match known anti-patterns? Classify each.
2. **Missing monitoring**: Which integrations have no error handling or monitoring documented?
3. **GxP risk**: Which integrations carry GxP data but lack adequate audit trail or validation documentation?
4. **Single points of failure**: Which integrations, if they failed, would halt business operations?
5. **Undocumented dependencies**: Based on the platforms documented, which integrations almost certainly exist but haven't been documented yet?

Present as a risk-prioritized table with: Integration | Anti-Pattern | Risk Level | Recommended Action.
```

### Part 3 — Design Target-State Patterns

For each anti-pattern identified, propose the target architecture:

```
#codebase

For the integration anti-patterns identified in our catalog, propose target-state patterns:

For each anti-pattern:
1. Name the target pattern (API gateway, event-driven, data mesh, etc.)
2. Draw the target architecture using text-based notation
3. Explain what changes — middleware, protocols, data formats, monitoring
4. Assess the migration difficulty (Low/Medium/High)
5. Identify regulatory implications — does the migration require revalidation?
6. Estimate the impact on adjacent integrations

Produce an ADR for the top 3 most impactful pattern migrations using #file:knowledge-base/_schema/decision-record.schema.md
```

### Part 4 — Build the Integration Roadmap

Synthesize your findings into a prioritized migration plan:

```
Produce an integration modernization roadmap with 3 horizons:

**Horizon 1 (0-6 months)**: Quick wins — monitoring gaps, documentation, non-GxP anti-pattern fixes
**Horizon 2 (6-18 months)**: Strategic migrations — replace point-to-point with API gateway, introduce event-driven patterns
**Horizon 3 (18-36 months)**: Platform transformation — data mesh adoption, full integration observability, AI-ready data flows

For each item on the roadmap, include:
- Which integrations are affected
- Prerequisites and dependencies
- Validation impact
- Success criteria
```

## Save Step
- Save connection patterns to `knowledge-base/connections/{source}-to-{target}-ea-{YYYY-MM}.md`
- Save anti-pattern analysis to `personas/enterprise-architect/workspace/artifacts/integration-anti-patterns.md`
- Save target-state ADRs to `knowledge-base/decisions/`
- Save the integration roadmap to `personas/enterprise-architect/workspace/artifacts/integration-roadmap.md`
- Mark EA-02 complete in your journey

## Stretch Goal

Create a **connection matrix** — a table with all documented systems on both axes, showing the integration pattern at each intersection (API, Event, File, Database, None, Unknown). Color-code by maturity: Green (modern, monitored), Yellow (functional but fragile), Red (anti-pattern or undocumented). This becomes the single most useful artifact for integration planning conversations.

Save to `personas/enterprise-architect/workspace/artifacts/connection-matrix.md`.

---

**Next**: EA-03 — Graph of Operations Design
