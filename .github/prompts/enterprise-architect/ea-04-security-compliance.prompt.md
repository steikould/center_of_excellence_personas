# EA-04 — Security & Compliance Architecture

> **Goal**: Design the security architecture for AI systems in a regulated pharmaceutical environment — covering data classification, access control, audit trails, GxP validation, and 21 CFR Part 11 compliance.

---

## What You're Learning
- How to design security architecture that satisfies both cybersecurity and regulatory requirements
- How GxP validation applies to AI/ML systems — a genuinely unsettled area of pharma IT
- How to create audit trail architecture that makes AI decisions explainable and traceable

## Concept: Security in Regulated AI

Most organizations think about AI security as a cybersecurity problem — model theft, adversarial attacks, data poisoning. In animal pharma, the security problem is broader: the AI system must also satisfy regulatory expectations for data integrity, traceability, and validation.

**The four pillars of AI security in regulated pharma:**

| Pillar | Cybersecurity View | Regulatory View |
|--------|-------------------|-----------------|
| **Data Protection** | Encryption, access control, DLP | Data classification, ALCOA+ integrity, 21 CFR Part 11 |
| **Model Governance** | Model versioning, supply chain security | Validation, change control, performance monitoring |
| **Access Control** | RBAC, least privilege, MFA | Audit trail of who did what, electronic signature compliance |
| **Auditability** | Logging, SIEM, incident response | Complete traceability from input to output to decision |

**The key tension:** AI systems are inherently probabilistic. Regulatory frameworks were designed for deterministic systems. The architecture must bridge this gap — making AI outputs traceable and explainable without pretending they are deterministic.

## The Challenge

### Part 1 — Data Classification Framework for AI

Design how data flows through AI systems with appropriate classification:

```
#codebase

Based on the platform entries and connection patterns in our knowledge base, design a data classification framework for AI/ML workloads:

1. **Classification tiers**: Define 4-5 tiers appropriate for animal pharma AI (e.g., Public, Internal, Confidential, GxP-Restricted, PII-Regulated)

2. **Classification by data source**: Map each platform in our landscape to its default data classification tier

3. **Classification rules for AI**: When data moves from a source system into an AI pipeline, what rules apply?
   - Can GxP data be used for model training? Under what conditions?
   - Can production data be used in development/test environments?
   - What de-identification or anonymization is required?
   - How does data classification change when AI generates derived data?

4. **Cross-classification handling**: When an AI model ingests data from multiple classification tiers, what classification does the output inherit?

Present as a structured policy document with decision trees for common scenarios.
```

### Part 2 — Access Control Patterns for AI Systems

Design the access control architecture:

```
Design access control patterns for our AI ecosystem:

1. **Role-based access (RBAC) model**:
   | Role | Can Train Models | Can Deploy Models | Can Access GxP Data | Can Override AI Recommendations |
   |------|-----------------|-------------------|--------------------|---------------------------------|

2. **Service-to-service authentication**: How do AI services authenticate with source systems and each other? Design patterns for:
   - AI pipeline accessing LIMS data
   - AI model serving endpoint authenticating API consumers
   - AI agent accessing the knowledge graph
   - Training pipeline accessing data lake

3. **21 CFR Part 11 electronic signature requirements**: When an AI system makes a recommendation that a human approves, how do we capture:
   - The AI model version and input data that produced the recommendation
   - The human identity and intent (meaning of signature)
   - The timestamp and system state at time of signature
   - The complete audit trail linking all three

4. **Privileged access management**: Who can modify model weights, retrain models, change decision thresholds? How is this controlled and logged?
```

### Part 3 — Audit Trail Architecture

Design the audit trail that makes AI systems inspectable:

```
Design an audit trail architecture for AI-augmented decision-making:

1. **What to log** — For every AI inference or recommendation:
   - Input data (or hash + pointer to input data)
   - Model version (exact weights and configuration)
   - Output / recommendation
   - Confidence score or uncertainty measure
   - Human action taken (accepted, rejected, modified)
   - Business context (which process, which batch, which patient)

2. **How to store** — Audit trail requirements:
   - Immutable storage (append-only, tamper-evident)
   - Retention aligned with regulatory requirements (GxP records: life of product + N years)
   - Queryable for investigations and audits
   - Protected from unauthorized deletion or modification

3. **How to query** — Design the audit queries regulators will ask:
   - "Show me every AI recommendation for batch X and whether it was followed"
   - "Show me how model Y's accuracy has changed over the last 12 months"
   - "Show me all cases where a human overrode an AI recommendation and why"
   - "Show me the training data and validation results for the model version that produced this recommendation"

4. **Architecture diagram** — Produce a text-based diagram showing: AI inference → Audit event → Immutable store → Query API → Audit dashboard
```

### Part 4 — GxP Validation Strategy for AI/ML

This is the frontier. Design how your organization validates AI systems:

```
Design a GxP validation strategy for AI/ML systems, addressing:

1. **GAMP 5 classification for AI**: How do AI/ML systems fit into GAMP categories?
   - Is a trained model Category 4 (configured) or Category 5 (custom)?
   - When does retraining constitute a new system vs. a configuration change?
   - How do you validate a system whose behavior changes with new data?

2. **Risk-based validation approach**:
   - **High risk**: AI making GxP-impacting decisions (e.g., batch release recommendation)
   - **Medium risk**: AI augmenting human decisions with GxP data (e.g., deviation trend analysis)
   - **Low risk**: AI operating on non-GxP data (e.g., demand forecasting)
   For each risk tier: What validation documentation is required? What testing is needed? What ongoing monitoring?

3. **Continuous validation**: Traditional IQ/OQ/PQ assumes a stable system. AI models drift. Design:
   - Performance monitoring thresholds that trigger revalidation
   - Automated drift detection as part of the validation lifecycle
   - Change control criteria: what level of model change requires what level of re-testing
   - Periodic review cadence and content

4. **Vendor qualification for AI services**: When using third-party AI (cloud AI APIs, vendor-embedded AI):
   - What vendor assessments are required?
   - How do you validate a system you cannot fully inspect (black box models)?
   - What contractual requirements must be in place?
   - How do you handle vendor model updates?

Produce this as a validation framework document suitable for QA review.
```

## Save Step
- Save data classification framework to `personas/enterprise-architect/workspace/artifacts/ai-data-classification.md`
- Save access control patterns to `personas/enterprise-architect/workspace/artifacts/ai-access-control.md`
- Save audit trail architecture to `personas/enterprise-architect/workspace/artifacts/ai-audit-architecture.md`
- Save GxP validation strategy to `personas/enterprise-architect/workspace/artifacts/ai-validation-strategy.md`
- Create ADRs for key decisions to `knowledge-base/decisions/`
- Mark EA-04 complete in your journey

## Stretch Goal

Draft a **position paper** on "AI Validation in Animal Pharmaceutical Manufacturing" — a document you could present to your quality organization to establish the company's approach to validating AI systems. Include references to FDA guidance on AI/ML in drug manufacturing, GAMP 5 Second Edition guidance on AI, and industry best practices from ISPE and PDA.

Save to `personas/enterprise-architect/workspace/artifacts/ai-validation-position-paper.md`.

---

**Congratulations.** You have completed all 4 Enterprise Architect role-specific modules. Return to your journey file to capture your reflections, then proceed to the Module 08 Capstone to synthesize everything into your Enterprise AI Architecture Blueprint.
