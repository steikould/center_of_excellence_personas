# DS-02 — Model Registry Design

> **Goal**: Design a model registry that supports the full ML model lifecycle in a regulated animal pharmaceutical environment, including model cards, versioning, lifecycle states, and approval workflows.

---

## What You're Learning
- How to structure a model registry for enterprise ML governance
- Model card design: documenting models so anyone can understand what they do, how they perform, and when they should (and shouldn't) be used
- Lifecycle state management: from development through production to retirement
- Approval workflows that satisfy regulated-environment requirements without crushing velocity

## Concept: The Model Registry as Organizational Memory

A model registry is the single source of truth for "what models exist, what do they do, and are they trustworthy?" Without one, organizations accumulate shadow models — notebooks running on someone's laptop that quietly influence decisions.

In animal pharma, the stakes are higher:

- **A quality prediction model** that influences batch release decisions must be validated, versioned, and auditable
- **A demand forecasting model** that drives manufacturing schedules affects drug availability
- **A pharmacovigilance signal detection model** that misses an adverse event signal has patient safety implications
- **An efficacy prediction model** that influences clinical trial design affects regulatory submissions

**The registry solves three problems:**
1. **Discovery** — "Does a model for this already exist?"
2. **Trust** — "Is this model validated, monitored, and maintained?"
3. **Compliance** — "Can I prove to an auditor who built this, how it was tested, and who approved it?"

## The Challenge

### Part 1 — Define Model Lifecycle States

Every model moves through stages. Ask Copilot to help you design the state machine:

```
@data-scientist

Help me design model lifecycle states for an animal pharmaceutical company's model registry. I need:

1. **State definitions** — What does each state mean? Who can transition a model to this state?
2. **Transition rules** — What criteria must be met to move from one state to the next?
3. **Regulatory overlay** — Which transitions require formal approval for GxP-impacting models?

Consider these states at minimum:
- Exploratory / Sandbox
- Development
- Validation (internal)
- Regulatory Review (for GxP models)
- Staging / Pre-Production
- Production
- Monitoring / Active
- Degraded (performance below threshold)
- Deprecated
- Retired / Archived

For each state, define:
- Entry criteria (what must be true to enter this state)
- Exit criteria (what must be true to leave this state)
- Required artifacts (what documentation must exist)
- Responsible role (who owns the model in this state)
- Audit requirements (what gets logged)
```

### Part 2 — Design the Model Card Template

A model card is the "nutrition label" for an ML model. Ask Copilot:

```
@data-scientist

Help me design a model card template for our animal pharma model registry. It needs to serve three audiences:
1. **Data scientists** — who need technical details to evaluate, reuse, or improve the model
2. **Business stakeholders** — who need to understand what the model does and how confident to be in it
3. **Auditors/regulators** — who need to verify the model was built, tested, and approved properly

Include these sections:

**Identity & Purpose**
- Model name, version, owner, creation date
- Business problem statement (in plain language)
- Intended use cases and out-of-scope uses
- Species applicability (if relevant)

**Data**
- Training data description (sources, size, date range, species coverage)
- Feature list with descriptions
- Data preprocessing and feature engineering steps
- Known data limitations or biases

**Architecture & Training**
- Model type/algorithm
- Hyperparameters (key ones)
- Training infrastructure and compute
- Training time and convergence details
- Random seeds and reproducibility information

**Performance**
- Primary metric(s) with values
- Secondary metrics
- Performance by subgroup (e.g., by species, by product line)
- Comparison to baseline/previous version
- Confidence intervals and statistical significance

**Validation & Approval**
- Validation protocol reference (for GxP models)
- Test dataset description
- Validation results summary
- Approval chain (who approved, when, under what authority)
- Regulatory classification (GxP-impacting, business-only, exploratory)

**Deployment & Monitoring**
- Serving infrastructure
- Input/output specifications
- Latency and throughput requirements
- Monitoring metrics and alert thresholds
- Retraining trigger criteria
- Fallback/rollback procedure

**Ethical Considerations**
- Potential for harm if model is wrong
- Known biases or failure modes
- Human oversight requirements

**Change History**
- Version log with dates, changes, and approvers

Format as a markdown template with placeholder text that makes it clear what to fill in.
```

### Part 3 — Design Versioning Strategy

Models evolve. Ask Copilot:

```
@data-scientist

Help me design a model versioning strategy for our registry. I need to handle:

1. **What triggers a new version?**
   - Retrained on new data (same architecture)
   - Architecture change (new algorithm or hyperparameters)
   - Feature engineering change
   - Bug fix in preprocessing
   - Environment/infrastructure change

2. **Version numbering scheme**
   - How do we number versions? (semantic versioning? date-based? custom?)
   - When is it a patch vs. minor vs. major version?
   - How does this interact with the lifecycle states?

3. **What gets versioned?**
   - Model artifacts (weights, pickle files, ONNX exports)
   - Training code (Git SHA)
   - Training data snapshot (DVC hash or equivalent)
   - Feature definitions
   - Configuration/hyperparameters
   - Model card
   - Validation results

4. **Lineage tracking**
   - Given model v2.1.0, I should be able to trace back to: exact training data, exact code, exact configuration, and the approval chain
   - How do we link model versions to data versions (DVC) and code versions (Git)?

5. **Regulatory implications**
   - For GxP models: version changes that affect model output require revalidation
   - How do we distinguish "administrative updates" from "functional changes"?
   - What's the minimum documentation for each version change?

Design this as a policy document with clear rules and examples.
```

### Part 4 — Design Approval Workflows

Regulated models need formal approval chains. Ask Copilot:

```
@data-scientist

Help me design approval workflows for our model registry. We need two tracks:

**Track 1: Non-GxP Models (business analytics, forecasting, internal tools)**
- Lighter governance
- Peer review by another data scientist
- Business owner sign-off
- Automated testing gates

**Track 2: GxP-Impacting Models (quality prediction, manufacturing, pharmacovigilance)**
- Formal validation protocol
- Statistical review
- Quality Assurance review
- Regulatory Affairs consultation (if model output appears in submissions)
- Change control board approval
- Documentation package audit

For each track, define:
1. The approval stages (in order)
2. Who approves at each stage (by role, not person)
3. What artifacts are required at each stage
4. What automated checks run (data drift, performance regression, code quality)
5. SLA for each approval step (so models don't languish)
6. Escalation path when approval is blocked

Also address:
- Emergency deployment: what's the expedited process when a model needs urgent update?
- Rollback approval: who authorizes reverting to a previous version?
- Sunset process: how does a model get formally retired?

Format as a workflow document with clear stage gates.
```

## Save Step

- Save your lifecycle state design to `personas/data-scientist/workspace/artifacts/model-lifecycle-states.md`
- Save the model card template to `personas/data-scientist/workspace/artifacts/model-card-template.md`
- Save the versioning strategy to `personas/data-scientist/workspace/artifacts/model-versioning-strategy.md`
- Save approval workflows to `personas/data-scientist/workspace/artifacts/model-approval-workflows.md`
- Consider contributing the model card template to `knowledge-base/best-practices/by-role/` as a best practice
- Mark DS-02 complete in your journey

## Stretch Goal

Fill out a complete model card for a real or realistic model. Pick one of these animal pharma use cases and create the full model card:

1. **Batch yield predictor** — Predicts manufacturing batch yield from process parameters
2. **Adverse event signal detector** — Identifies potential safety signals from pharmacovigilance data
3. **Demand forecaster** — Predicts product demand by species and geography
4. **Stability predictor** — Predicts drug product stability from accelerated study data

```
@data-scientist

Using the model card template I just designed, help me fill out a complete model card for a [choose one] model in an animal pharma context. Make it realistic — use plausible metrics, data descriptions, and limitations. This should feel like a real model card someone could review and understand the model from.
```

---

**Next**: DS-03 — Experiment Tracking Patterns
