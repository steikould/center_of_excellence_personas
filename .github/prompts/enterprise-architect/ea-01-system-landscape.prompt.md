# EA-01 — System Landscape Mapping

> **Goal**: Document the full technology landscape of the organization, categorize every system, and assess AI readiness across the estate.

---

## What You're Learning
- How to use Copilot to systematically inventory and categorize enterprise systems
- How the platform-entry schema structures knowledge for long-term reuse
- How to assess AI readiness at the system level — not just "can it do AI" but "what would it take"

## Concept: The System Landscape as Foundation

Every architecture decision starts with knowing what you have. Most organizations cannot answer basic questions: How many systems do we operate? Which ones hold GxP data? Which integrations are undocumented? Where does data get stuck?

The system landscape map is the answer to all of these questions. It is not a diagram you draw once and pin to a wall — it is a living, structured inventory that feeds your integration catalog, your technology radar, and ultimately, the enterprise knowledge graph.

**In animal pharma, the landscape has distinctive categories:**

| Category | Examples | Key Concern |
|----------|----------|-------------|
| **LIMS** | LabWare, STARLIMS | GLP/GMP data, instrument integration |
| **ERP** | SAP S/4HANA, Oracle | Batch records, supply chain, financials |
| **QMS** | Veeva QMS, TrackWise | CAPAs, deviations, change control |
| **EDMS** | Documentum, Veeva Vault | Controlled documents, 21 CFR Part 11 |
| **MES** | Syncade, Opcenter | Manufacturing execution, batch control |
| **CRM** | Salesforce, Veeva CRM | Veterinarian/distributor relationships |
| **Data Platform** | Snowflake, Databricks, Azure Synapse | Analytics, ML feature stores |
| **Clinical** | Medidata, Oracle Argus | GCP trial data, pharmacovigilance |
| **Environmental** | Vaisala, Ellab | Cleanroom monitoring, cold chain |

## The Challenge

### Part 1 — Establish Your Categories

Ask Copilot:
```
#file:knowledge-base/_schema/platform-entry.schema.md

I need to map our complete technology landscape for an animal pharmaceutical company. Help me define the system categories we should use. Start with the categories in the schema and expand them based on what a company like ours would typically operate. For each category, list:
1. What business capability it supports
2. What regulatory framework applies (GLP, GMP, GCP, or none)
3. Typical data classification level
4. Expected AI readiness (high/medium/low and why)
```

### Part 2 — Document Your Core Systems

Start with the 5 most critical systems you know. For each, create a full platform entry:

```
#file:knowledge-base/_schema/platform-entry.schema.md

Help me create a platform entry for [SYSTEM NAME]. Here's what I know:
- Category: [LIMS/ERP/QMS/etc.]
- What it does in our organization: [description]
- Data it holds: [types]
- Who owns it: [team]
- Current integrations I'm aware of: [list]
- Validation status: [validated/not/pending]
- Current AI/ML usage: [any or none]

Structure this as a complete platform entry. Push me on fields I'm missing — especially regulatory and data classification fields.
```

### Part 3 — Assess AI Readiness

For each documented system, perform an AI readiness assessment:

```
#codebase

Review the platform entries I've created in knowledge-base/platforms/. For each system, assess AI readiness across these dimensions:

| Dimension | Question |
|-----------|----------|
| Data Accessibility | Can we extract data via API? Is it trapped in a proprietary format? |
| Data Quality | Is the data clean, complete, and timely enough for ML? |
| Volume | Is there enough data to train or fine-tune models? |
| Regulatory Clearance | Can this data be used for AI/ML without additional validation? |
| Integration Maturity | Does the system support modern integration patterns (REST, events)? |
| Vendor AI Roadmap | Is the vendor building AI capabilities into the product? |

Produce a landscape heatmap as a markdown table: System vs. Dimension, rated Green/Yellow/Red.
```

### Part 4 — Identify the Gaps

Ask Copilot to find what is missing:

```
#codebase

Based on the platform entries documented so far and the typical technology landscape for a large animal pharmaceutical company, produce:

1. A list of system categories that have NO entries yet
2. For each gap, explain why this matters for the enterprise AI strategy
3. Prioritize which gaps to fill first based on: (a) AI opportunity value, (b) integration density, (c) regulatory importance
```

## Save Step
- Save platform entries to `knowledge-base/platforms/{platform-name}-ea-{YYYY-MM}.md`
- Save the AI readiness heatmap to `personas/enterprise-architect/workspace/artifacts/ai-readiness-heatmap.md`
- Save the landscape gap analysis to `personas/enterprise-architect/workspace/artifacts/landscape-gaps.md`
- Mark EA-01 complete in your journey

## Stretch Goal

Create a **technology radar** for your landscape. Classify every system as Adopt / Trial / Assess / Hold based on its strategic fit, AI readiness, and vendor trajectory. Save to `personas/enterprise-architect/workspace/artifacts/technology-radar.md`. Use the format:

```markdown
## Adopt
| System | Category | Rationale |
|--------|----------|-----------|

## Trial
...

## Assess
...

## Hold
...
```

---

**Next**: EA-02 — Integration Pattern Catalog
