# AA-03 — AI Governance Framework

> **Goal**: Design the technical governance architecture that ensures AI systems are inventoried, risk-assessed, monitored, and compliant throughout their lifecycle.

---

## What You're Learning
- How to design a model inventory and risk tiering system
- How to architect monitoring infrastructure for model health, drift, and fairness
- How to map AI governance requirements to technical controls

## Concept: Governance as Architecture, Not Bureaucracy

AI governance is often treated as a policy exercise — documents that sit in SharePoint. The AI Architect's job is to make governance *executable*: automated controls, built-in monitoring, and platform-enforced guardrails that make doing the right thing the easy thing.

**In animal pharma, AI governance intersects with existing quality systems.** The goal is not to build a parallel governance structure but to extend QMS, change control, and validation processes to cover AI/ML systems.

### Governance Control Layers

| Layer | Purpose | Implementation |
|-------|---------|----------------|
| **Inventory** | Know what models exist, who owns them, and their risk tier | Model registry with mandatory metadata fields |
| **Risk Tiering** | Classify models by impact to prioritize governance effort | Automated risk scoring based on use case, data sensitivity, autonomy level |
| **Validation** | Ensure models are fit for intended use before deployment | Automated validation pipelines with performance, bias, and robustness tests |
| **Access Control** | Restrict who can train, deploy, and modify models | RBAC integrated with identity provider, segregation of duties |
| **Monitoring** | Detect degradation, drift, and anomalies in production | Real-time dashboards, automated alerting, scheduled performance reviews |
| **Audit Trail** | Maintain complete lineage for every prediction | Immutable logs from data → features → model → prediction → decision |
| **Change Control** | Govern updates to data, models, and infrastructure | Automated change records tied to model registry promotions |

---

## Exercise

### Step 1 — Design the Model Risk Tiering System

Create a risk classification framework:

```
Prompt: Help me design a model risk tiering system for our AI CoE. I need:
- Risk tier definitions (e.g., Tier 1 = critical, Tier 4 = low risk)
- Criteria for classification (impact on patient/animal safety, regulatory scope,
  financial impact, autonomy level, data sensitivity)
- Governance requirements per tier (validation depth, review frequency,
  monitoring intensity, approval chain)
- Examples relevant to animal pharma (e.g., batch quality prediction = Tier 1,
  marketing email personalization = Tier 4)
```

### Step 2 — Design Monitoring Architecture

Architect the monitoring infrastructure:

```
Prompt: Help me design an AI monitoring architecture that covers:
- Data quality monitoring (input drift, missing values, schema violations)
- Model performance monitoring (accuracy degradation, prediction distribution shifts)
- Operational monitoring (latency, throughput, error rates, cost)
- Fairness monitoring (where applicable)
Show me a Mermaid diagram of the monitoring data flow and alerting pipeline.
```

### Step 3 — Map to Regulatory Frameworks

Align your governance architecture with industry frameworks:

```
Prompt: Help me create a mapping between our AI governance controls and:
- NIST AI Risk Management Framework (AI RMF)
- ISO/IEC 42001 (AI Management System)
- GAMP 5 (extended to AI/ML systems)
- FDA emerging guidance on AI/ML in drug development
For each framework requirement, show which technical control satisfies it.
```

### Step 4 — Contribute to Knowledge Base

Document the governance framework:

```
Prompt: Help me create a best-practice entry for AI governance architecture
using the knowledge-base/_schema/best-practice.schema.md template.
```

---

## Completion Criteria

- [ ] Model risk tiering system with tier definitions and governance requirements
- [ ] Monitoring architecture diagram (Mermaid) with alerting pipeline
- [ ] Regulatory framework mapping table
- [ ] Best-practice entry committed to knowledge base
