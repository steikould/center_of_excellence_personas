# AA-02 — MLOps Pipeline Design

> **Goal**: Design end-to-end MLOps pipelines that automate the model lifecycle from data ingestion through production monitoring.

---

## What You're Learning
- How to design reproducible, automated ML pipelines for training and deployment
- How to implement CI/CD for ML that accounts for both code and data/model changes
- How to build monitoring and retraining triggers that maintain model health in production

## Concept: MLOps is Not Just DevOps for ML

MLOps borrows from DevOps but adds unique challenges: data versioning, experiment tracking, model validation gates, drift detection, and retraining automation. A deployment pipeline for a model is fundamentally different from deploying a web service because the artifact (a trained model) depends on both code *and* data.

**In animal pharma, MLOps pipelines for GxP models must produce validation evidence automatically.** Every pipeline run should generate an auditable record of what data was used, what code ran, what model was produced, and what performance was achieved.

### Pipeline Taxonomy

| Pipeline Type | Trigger | Output | GxP Requirement |
|---------------|---------|--------|-----------------|
| **Data Pipeline** | Schedule / event | Validated features | Data quality reports, lineage |
| **Training Pipeline** | Data change / schedule / manual | Trained model artifact | Reproducibility evidence, performance report |
| **Validation Pipeline** | New model candidate | Validation report | Independent test results, bias assessment |
| **Deployment Pipeline** | Model promotion | Deployed endpoint | Change control record, rollback plan |
| **Monitoring Pipeline** | Continuous | Alerts, dashboards | Drift reports, performance degradation evidence |
| **Retraining Pipeline** | Drift alert / schedule | Retrained model | Full audit trail of trigger → retrain → validate → deploy |

---

## Exercise

### Step 1 — Map a Model's Lifecycle

Pick one AI use case (real or representative) and map its full lifecycle:

```
Prompt: Help me map the complete lifecycle for an AI model that [describe use case].
Walk me through each stage from data acquisition to production monitoring.
For each stage, identify: inputs, processing steps, outputs, validation gates,
and GxP considerations.
```

### Step 2 — Design the Pipeline DAG

Design the pipeline as a directed acyclic graph:

```
Prompt: Help me design an MLOps pipeline DAG for this use case using Mermaid.
Show: data ingestion → feature engineering → training → validation →
deployment → monitoring → retraining trigger. Include decision gates
(e.g., "performance above threshold?") and branching logic.
```

### Step 3 — Define CI/CD for ML

Design the CI/CD strategy that handles code, data, and model changes:

```
Prompt: Help me define a CI/CD strategy for our ML pipelines. I need:
- What triggers a pipeline run (code change vs. data change vs. schedule)
- Testing strategy (unit tests, integration tests, model validation tests)
- Promotion gates between environments (dev → staging → prod)
- Rollback strategy if a deployed model underperforms
- How this differs for GxP vs. non-GxP models
```

### Step 4 — Contribute to Knowledge Base

Document your pipeline patterns:

```
Prompt: Help me create a best-practice entry for MLOps pipeline design using
the knowledge-base/_schema/best-practice.schema.md template.
```

---

## Completion Criteria

- [ ] Model lifecycle map for a representative use case
- [ ] Pipeline DAG diagram (Mermaid) with validation gates
- [ ] CI/CD strategy document covering code, data, and model changes
- [ ] Best-practice entry committed to knowledge base
