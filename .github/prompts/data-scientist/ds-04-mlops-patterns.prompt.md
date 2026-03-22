# DS-04 — MLOps Pipeline Design

> **Goal**: Design end-to-end MLOps pipelines for training, serving, monitoring, and retraining ML models in a regulated animal pharmaceutical environment.

---

## What You're Learning
- How to architect ML pipelines that are production-grade, not just notebook-grade
- Serving infrastructure patterns for different latency and throughput requirements
- Model monitoring: detecting drift, degradation, and anomalies before they cause harm
- Retraining triggers and governance: when and how to update models safely
- How MLOps intersects with GxP validation requirements

## Concept: From Notebook to Production

The gap between "model works in a notebook" and "model runs reliably in production" is where most ML projects fail. MLOps bridges that gap with engineering discipline applied to the ML lifecycle.

In animal pharma, production ML carries extra weight:

- **A batch yield prediction model going down** can stall manufacturing scheduling decisions
- **A pharmacovigilance model producing stale predictions** means safety signals get missed
- **A demand forecasting model silently drifting** causes over/under-production of critical medicines
- **Any GxP-impacting model change** requires change control documentation before deployment

**The MLOps maturity ladder:**

| Level | Description | What It Looks Like |
|-------|-------------|-------------------|
| 0 | Manual | Notebooks, manual deployment, no monitoring |
| 1 | Automated training | Scripted pipelines, but manual deployment and monitoring |
| 2 | Automated deployment | CI/CD for models, automated testing, basic monitoring |
| 3 | Automated retraining | Drift detection triggers retraining, full pipeline automation |
| 4 | Governed automation | All of Level 3 + regulatory compliance, audit trails, approval gates |

**Our target: Level 4.** Automation with governance.

## The Challenge

### Part 1 — Design the Training Pipeline

Ask Copilot to help you architect a training pipeline:

```
@data-scientist

Help me design an ML training pipeline for an animal pharmaceutical company. The pipeline should handle models across different use cases (quality prediction, demand forecasting, pharmacovigilance analytics).

**Pipeline stages:**

1. **Data Ingestion**
   - Pull from multiple sources (LIMS, MES/ERP, data warehouse)
   - Apply data quality checks (Great Expectations or equivalent)
   - Version the training dataset (DVC)
   - Log data lineage

2. **Feature Engineering**
   - Pull from feature store (or compute features from raw data)
   - Apply feature validation (schema checks, distribution checks)
   - Log feature importance from previous model versions

3. **Training**
   - Support multiple model types (configurable)
   - Hyperparameter optimization (Optuna, Ray Tune, or equivalent)
   - Full experiment tracking (MLflow)
   - Cross-validation with appropriate strategy
   - Set and log all random seeds

4. **Evaluation**
   - Compare against baseline and previous production model
   - Statistical significance testing
   - Performance by subgroup (species, product line, etc.)
   - Generate evaluation report artifact

5. **Packaging**
   - Serialize model in deployment-ready format (ONNX, MLflow model, etc.)
   - Generate draft model card
   - Package with inference dependencies
   - Run model compatibility tests

6. **Registration**
   - Register in model registry with appropriate lifecycle state
   - Trigger approval workflow (automated for non-GxP, manual gate for GxP)
   - Archive training artifacts for audit trail

For each stage, specify:
- Inputs and outputs
- Tools and infrastructure
- Error handling and retry logic
- Logging and audit trail requirements
- Estimated duration and resource requirements

Design as a DAG (directed acyclic graph) suitable for implementation in Airflow, Prefect, or Dagster.
```

### Part 2 — Design the Serving Infrastructure

Different models need different serving patterns. Ask Copilot:

```
@data-scientist

Help me design model serving infrastructure for these four patterns at an animal pharma company:

**Pattern 1: Batch Prediction (most common)**
- Use case: Monthly demand forecasting, weekly quality trend analysis
- Characteristics: High throughput, latency not critical, scheduled runs
- Example: Predict next month's demand for all products across all regions

**Pattern 2: Near-Real-Time Serving**
- Use case: Manufacturing process parameter recommendations, incoming inspection predictions
- Characteristics: Sub-minute latency, moderate throughput, event-triggered
- Example: Predict batch yield from current process parameters during manufacturing

**Pattern 3: Real-Time API**
- Use case: Pharmacovigilance case triage, customer service recommendation
- Characteristics: Sub-second latency, variable throughput, always-on
- Example: Score incoming adverse event report for severity and signal relevance

**Pattern 4: Edge/Embedded**
- Use case: Equipment sensor anomaly detection, in-clinic diagnostic support
- Characteristics: Millisecond latency, intermittent connectivity, resource-constrained
- Example: Detect anomalous readings from manufacturing equipment sensors

For each pattern, specify:
- Infrastructure architecture (containerized, serverless, stream processing, edge runtime)
- Scaling strategy (horizontal, vertical, pre-warmed)
- Input/output contract (API spec or data format)
- Authentication and authorization
- Caching strategy (if applicable)
- Fallback behavior (what happens when the model is unavailable)
- A/B testing and canary deployment support
- GxP considerations (validation of serving infrastructure, audit logging)
```

### Part 3 — Design the Monitoring System

A model in production without monitoring is a liability. Ask Copilot:

```
@data-scientist

Help me design a comprehensive model monitoring system for animal pharma ML models. I need to detect problems before they cause business impact.

**Data Monitoring:**
- Input data drift detection (compare incoming data distributions to training data)
  - Statistical tests: PSI, KS test, Jensen-Shannon divergence
  - Feature-level drift tracking
  - Alert thresholds (yellow = investigate, red = act)
- Data quality monitoring (nulls, out-of-range values, schema violations)
- Data freshness monitoring (is input data arriving on schedule?)

**Model Performance Monitoring:**
- Prediction distribution monitoring (are outputs changing even if inputs look stable?)
- Ground truth comparison (when labels become available, compare to predictions)
  - Lag-aware monitoring: different use cases have different label delay
  - Quality prediction: ground truth in days (after QC testing)
  - Demand forecasting: ground truth in weeks/months
  - Pharmacovigilance: ground truth may never be definitive
- Performance metric tracking over time (sliding window)
- Subgroup performance monitoring (species, product line, region)

**Operational Monitoring:**
- Inference latency and throughput
- Error rates (prediction failures, timeouts)
- Resource utilization (CPU, memory, GPU)
- Serving infrastructure health

**Alerting & Response:**
- Alert routing: who gets notified for what (data scientist vs. platform engineer vs. business owner)
- Escalation policies
- Runbook templates for common alerts
- Incident post-mortem template

**Dashboard Design:**
- Executive summary view (all models, traffic light status)
- Model detail view (deep dive into one model's health)
- Drift analysis view (before/after distributions)
- Historical performance view (trends over time)

For each monitoring component, specify: what to measure, how to measure it, alert thresholds, and response actions.
```

### Part 4 — Design Retraining Triggers and Governance

When should a model be retrained, and who decides? Ask Copilot:

```
@data-scientist

Help me design a retraining strategy and governance framework for ML models at an animal pharma company.

**Retraining Triggers:**

1. **Scheduled retraining**
   - Frequency by use case type (monthly, quarterly, annually)
   - Rationale for each cadence
   - Calendar awareness (avoid retraining during regulatory audit periods)

2. **Performance-triggered retraining**
   - Metric degradation thresholds (when does "slightly worse" become "needs action"?)
   - Statistical significance of degradation (avoid reacting to noise)
   - Grace period (how long below threshold before triggering?)

3. **Data-triggered retraining**
   - Significant data drift detected
   - New data source becomes available
   - Training data quality issue discovered and corrected

4. **Business-triggered retraining**
   - New product launch (model needs to cover new SKUs)
   - New species added to portfolio
   - Regulatory requirement change
   - Market shift (e.g., pandemic changes demand patterns)

**Retraining Governance:**

For non-GxP models:
- Automated retraining pipeline runs
- Automated comparison against current production model
- Automated deployment if performance improves and tests pass
- Human review of results within 48 hours (retrospective)

For GxP models:
- Retraining pipeline runs but does NOT auto-deploy
- Results reviewed by data scientist and peer reviewer
- Model card updated with new version information
- Change control documentation generated
- QA review of validation results
- Approval gate before production deployment
- Post-deployment monitoring with enhanced scrutiny for 2 weeks

**Rollback Protocol:**
- When to rollback (criteria)
- How to rollback (technical process)
- Who authorizes rollback
- Post-rollback investigation requirements
- Documentation requirements

Design as a decision tree that a data scientist can follow when any retraining trigger fires.
```

## Save Step

- Save your training pipeline design to `personas/data-scientist/workspace/artifacts/training-pipeline-design.md`
- Save the serving infrastructure patterns to `personas/data-scientist/workspace/artifacts/serving-infrastructure-patterns.md`
- Save the monitoring system design to `personas/data-scientist/workspace/artifacts/monitoring-system-design.md`
- Save the retraining governance framework to `personas/data-scientist/workspace/artifacts/retraining-governance.md`
- Consider contributing the monitoring design to `knowledge-base/best-practices/by-technology/` as an MLOps best practice
- Consider contributing the GxP retraining governance to `knowledge-base/governance/` as a governance artifact
- Mark DS-04 complete in your journey

## Stretch Goal

Design a complete MLOps architecture diagram for one specific use case. Pick a real scenario and map the full pipeline end-to-end:

```
@data-scientist

Help me design a complete MLOps architecture for a **manufacturing batch yield prediction model** at an animal pharma company. This model:
- Predicts whether a manufacturing batch will meet yield targets based on process parameters
- Is GxP-impacting (influences manufacturing decisions)
- Receives near-real-time process data from manufacturing equipment
- Needs to serve predictions within 30 seconds of data arrival
- Must be fully auditable and validated

Draw the complete architecture (as structured text/markdown):
1. Data flow: from manufacturing equipment sensors → data lake → feature store → model
2. Training pipeline: scheduled monthly with manual approval gate
3. Serving: near-real-time with batch fallback
4. Monitoring: data drift, prediction drift, ground truth comparison
5. Retraining: triggered by performance degradation or process changes
6. Governance: change control, validation, audit trail at every step

Include all technology choices, infrastructure components, and integration points. This should be detailed enough for an Automation Engineer to start building.
```

---

**Congratulations on completing the Data Scientist role-specific modules!** Return to your journey file and reflect on what you've built. Then proceed to Module 08 (Capstone) to synthesize everything into your ML Lifecycle Document.
