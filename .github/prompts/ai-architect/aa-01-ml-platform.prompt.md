# AA-01 — ML Platform Architecture

> **Goal**: Design the foundational ML platform that supports experimentation, training, deployment, and monitoring across the enterprise.

---

## What You're Learning
- How to evaluate and select ML platform components for an animal pharma enterprise
- How to design a platform that supports both GxP and non-GxP AI workloads
- How to balance self-service experimentation with governance and cost control

## Concept: The ML Platform as Product

An ML platform is not a single tool — it is a curated stack of capabilities that data scientists and engineers consume as an internal product. The best platforms minimize the time from hypothesis to production while maximizing reproducibility, governance, and cost efficiency.

**In animal pharma, the platform must answer a fundamental question: can this workload touch GxP data?** That single question splits your architecture into two lanes with different validation, access control, and audit requirements.

### Platform Capability Map

| Capability | Purpose | GxP Consideration |
|------------|---------|-------------------|
| **Experiment Tracking** | Log parameters, metrics, artifacts | Audit trail for regulated model development |
| **Feature Store** | Reusable, point-in-time correct features | Data lineage and provenance for GxP features |
| **Model Registry** | Version, stage, and promote models | Change control for GxP model promotions |
| **Training Orchestration** | Scalable, reproducible training runs | Validated compute environments for GxP |
| **Model Serving** | Low-latency, scalable inference | Validated deployment pipelines for GxP |
| **Monitoring** | Drift, performance, fairness tracking | Continuous validation evidence for GxP |
| **Notebook Environment** | Interactive development and EDA | Segregated environments for GxP data access |

---

## Exercise

### Step 1 — Assess Current State

Use Copilot to inventory your current ML tooling:

```
Prompt: Help me create an ML platform maturity assessment for our organization.
For each capability in the ML platform capability map, I need to document:
- Current tool(s) in use (if any)
- Current maturity level (0-3)
- Key gaps and pain points
- GxP readiness (ready / needs work / not applicable)
```

### Step 2 — Design Target Architecture

Design the target-state ML platform:

```
Prompt: Based on my maturity assessment, help me design a target-state ML platform
architecture. I need:
- A Mermaid diagram showing all platform components and their interactions
- A clear separation between GxP and non-GxP workload lanes
- Technology recommendations for each capability (with alternatives considered)
- A phased adoption roadmap that respects our current maturity level
```

### Step 3 — Write the ADR

Document the platform architecture decision:

```
Prompt: Help me write an Architecture Decision Record for our ML platform selection
using the knowledge-base/_schema/decision-record.schema.md template. Include:
- Context: why we need a unified ML platform
- Decision: the platform architecture we chose
- Consequences: what this enables and what constraints it introduces
- Compliance impact: how this addresses GxP requirements
```

### Step 4 — Contribute to Knowledge Base

Create a platform entry for the ML platform:

```
Prompt: Help me create a platform-entry for our ML platform using the
knowledge-base/_schema/platform-entry.schema.md template.
```

---

## Completion Criteria

- [ ] ML platform maturity assessment completed
- [ ] Target-state architecture diagram (Mermaid) with GxP/non-GxP separation
- [ ] Architecture Decision Record committed to knowledge base
- [ ] Platform entry committed to knowledge base
