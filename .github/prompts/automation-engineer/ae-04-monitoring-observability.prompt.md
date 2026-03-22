# AE-04 — Monitoring & Observability

> **Goal**: Design a complete monitoring stack for AI systems — infrastructure health, pipeline health, data quality, model performance, and business metrics with alerting and dashboards.

---

## Concept: The Three Pillars of AI Observability

Traditional software monitoring asks: "Is the server up? Are requests fast? Are there errors?" AI systems need all of that plus an entirely new dimension: "Is the model still right?"

**The three pillars:**

1. **Infrastructure & Pipeline Observability** — Are the systems running? Are pipelines completing on time? Are resources sufficient?
2. **Data Observability** — Is the data arriving? Is it the right shape and quality? Has the distribution shifted?
3. **Model Observability** — Are predictions accurate? Is the model drifting? Are explanations consistent?

**Why this matters more in pharma:**
- A silently degrading quality prediction model could lead to batch release decisions based on bad predictions
- Data pipeline failures that go undetected could mean missing pharmacovigilance signals
- Infrastructure outages during batch manufacturing could disrupt real-time monitoring systems
- Regulators expect demonstrated, documented monitoring of any AI system influencing GxP decisions

**The monitoring maturity ladder:**

| Level | What You Monitor | How You Respond |
|-------|-----------------|-----------------|
| 0 — Blind | Nothing | Find out when users complain |
| 1 — Reactive | Errors and crashes | Fix after failure |
| 2 — Proactive | Metrics and thresholds | Alert before user impact |
| 3 — Predictive | Trends and anomalies | Act before thresholds breach |
| 4 — Autonomous | Everything + auto-remediation | System self-heals for known failure modes |

## The Challenge

### Part 1 — Design Infrastructure and Pipeline Monitoring

Start with the foundation — know that your systems are running:

```
@automation-engineer

Design the infrastructure and pipeline monitoring layer for our AI platform at the animal pharmaceutical company. Cover:

**Infrastructure Metrics:**
For each component (compute nodes, databases, storage, network, GPU), define:
- Key metrics to collect (CPU, memory, disk, network, GPU utilization, queue depth)
- Collection method (Prometheus exporters, cloud-native metrics, custom metrics)
- Sampling interval (how often to collect)
- Retention period (how long to keep)
- Alerting thresholds (warning and critical levels)

**Pipeline Health Metrics:**
For each pipeline type (ingestion, training, serving, monitoring), define:
- Run status tracking (success/failure/running/stuck)
- Duration tracking (actual vs. expected, trend over time)
- Throughput (records processed, batches completed)
- Error rate (by error category from AE-03)
- SLA compliance (percentage of runs completing within SLA)
- Queue depth (backlog of pending work)

**Alerting Rules:**
For each metric, define:
- Warning threshold (investigate)
- Critical threshold (respond immediately)
- Alert channel (Slack, PagerDuty, email, Teams)
- Escalation path (who gets notified first, then second, then management)
- Auto-remediation actions (if any — e.g., restart a stuck task, scale up resources)

**Dashboard Design:**
Create specifications for three dashboards:
1. **Operations Overview** — Real-time status of all pipelines, current alerts, SLA compliance
2. **Pipeline Deep-Dive** — Detailed view of one pipeline: run history, duration trends, error breakdown
3. **Infrastructure Health** — Resource utilization across all compute, storage, and network

For each dashboard, specify: panels, visualizations (gauge, time series, table, heatmap), data sources, refresh interval.

Provide Grafana dashboard JSON structure or panel specifications.
```

### Part 2 — Design Data Quality Monitoring

The data layer needs its own monitoring:

```
@automation-engineer

Design data quality monitoring for our AI data pipelines. This sits between the raw data and the model — catching data problems before they become model problems.

**Data Quality Dimensions to Monitor:**

1. **Freshness** — Is data arriving on time?
   - Metric: Time since last successful data load per source
   - Alert: Data is more than [threshold] hours stale
   - Animal pharma example: LIMS lab results should arrive within 2 hours of test completion

2. **Volume** — Is the expected amount of data arriving?
   - Metric: Record count per load, compared to historical average
   - Alert: Volume deviates by more than [threshold]% from expected
   - Animal pharma example: A manufacturing site that usually sends 500 batch records/day sends 50

3. **Schema** — Is the data structure correct?
   - Metric: Schema validation pass/fail, new columns detected, missing columns
   - Alert: Any schema change (may be intentional but needs verification)
   - Animal pharma example: LIMS upgrade adds new test result fields

4. **Distribution** — Has the statistical shape of the data changed?
   - Metric: PSI (Population Stability Index) per feature, mean/median/std drift
   - Alert: PSI exceeds [threshold] for any feature
   - Animal pharma example: Raw material supplier change shifts pH distribution

5. **Completeness** — Are required fields populated?
   - Metric: Null percentage per column, compared to baseline
   - Alert: Null rate exceeds [threshold]%
   - Animal pharma example: Batch temperature readings with 15% missing values

6. **Uniqueness** — Are there unexpected duplicates?
   - Metric: Duplicate record count per primary key
   - Alert: Any duplicates detected in sources that should be unique
   - Animal pharma example: Duplicate batch record IDs from ERP integration

7. **Referential Integrity** — Do foreign key relationships hold?
   - Metric: Orphan record count, broken reference count
   - Alert: Any referential integrity violations
   - Animal pharma example: Test results referencing a batch ID that doesn't exist

**Implementation:**
- Where to run checks: dbt tests, Great Expectations suites, custom Python checks in Airflow
- When to run: After every ingestion load, before every model training run
- How to store results: Data quality metrics table with history for trending
- How to act: Block downstream processing on critical failures, warn on degradation

Provide a data quality check configuration template (YAML) and example implementations.
```

### Part 3 — Design Model Performance Monitoring

The AI-specific layer:

```
@automation-engineer

Design model performance monitoring for our AI systems. This is the critical layer that tells us whether the AI is still making good decisions.

**Model Performance Metrics:**

1. **Prediction Quality** (when ground truth is available)
   - Classification: Accuracy, precision, recall, F1, AUC-ROC per class
   - Regression: MAE, RMSE, MAPE, R-squared
   - Tracking: Rolling window metrics (7-day, 30-day, 90-day)
   - Animal pharma example: Batch quality prediction accuracy trending down from 94% to 88% over 30 days

2. **Prediction Distribution** (always available, ground truth not required)
   - Output distribution: Are prediction probabilities/values shifting?
   - Confidence distribution: Is the model becoming less confident?
   - Edge case frequency: Are more inputs falling into uncertain regions?
   - Animal pharma example: Quality prediction model suddenly classifying 40% of batches as "borderline" when historical rate was 15%

3. **Data Drift** (input feature monitoring)
   - Feature-level drift: PSI, KS test, chi-squared per input feature
   - Multivariate drift: MMD (Maximum Mean Discrepancy) across feature space
   - Root cause: Which features are drifting and why?
   - Animal pharma example: New raw material supplier changes 3 input features simultaneously

4. **Concept Drift** (relationship between inputs and outputs)
   - Performance degradation not explained by data drift alone
   - Requires ground truth — may have delayed availability
   - Animal pharma example: Equipment upgrade changes relationship between process parameters and batch quality

5. **Operational Metrics**
   - Inference latency (p50, p95, p99)
   - Throughput (predictions per second/minute)
   - Error rate (failed predictions, timeout rate)
   - Model version in production (are all endpoints on the same version?)

**Alerting Strategy:**
- Severity 1 (Critical): Model accuracy drops below safety threshold → page on-call, halt automated decisions
- Severity 2 (High): Significant drift detected → alert data science team, investigate within 24 hours
- Severity 3 (Medium): Minor drift or performance degradation → add to weekly review
- Severity 4 (Info): Baseline shift for tracking purposes → log for trend analysis

**Dashboard Design:**
Create specifications for a Model Performance Dashboard:
- Model health summary: all models with current status (healthy/degrading/critical)
- Individual model view: all metrics over time with threshold lines
- Drift explorer: feature-by-feature drift visualization
- Prediction explorer: sample predictions with explanations for investigation

Provide monitoring implementation as Python code (framework-agnostic) with Prometheus metric emission.
```

### Part 4 — Build the Complete Monitoring Stack

Assemble everything into a cohesive design:

```
@automation-engineer

Assemble the complete monitoring stack design for our AI platform. Create a unified architecture document that covers:

**Stack Components:**
1. **Metrics Collection**: Prometheus (infrastructure + custom AI metrics)
2. **Log Aggregation**: ELK stack or Azure Monitor (structured JSON logs)
3. **Alerting**: Alertmanager or PagerDuty (multi-channel, escalation-aware)
4. **Dashboards**: Grafana (infrastructure, pipeline, data quality, model performance)
5. **Incident Management**: Integration with on-call rotation and runbooks

**Architecture Diagram:**
Show how all components connect:
- Data sources (pipelines, models, infrastructure) → metric exporters
- Metric exporters → Prometheus → Grafana (visualization) + Alertmanager (alerting)
- Applications → structured logs → ELK → Kibana (log analysis)
- Alertmanager → PagerDuty → on-call engineer → runbook

**On-Call Playbook:**
For each alert severity:
- Who gets paged (by rotation, not by name)
- Expected response time
- First diagnostic steps (link to runbook)
- Escalation criteria and path
- Post-incident review process

**GxP Monitoring Requirements:**
- Audit trail for all alerts and responses (when was it detected, who responded, what action was taken)
- Periodic monitoring review (monthly review of all alerts, false positive rate, missed events)
- Validation evidence: monitoring system itself needs IQ/OQ/PQ if it watches GxP systems
- Data integrity: monitoring data is itself regulated data — ALCOA+ applies

**Provide:**
1. Complete architecture diagram (Mermaid)
2. Prometheus alert rules (YAML) for top 20 alerts
3. Grafana dashboard specifications for all four dashboards
4. On-call playbook template
5. Monitoring validation documentation template
```

## Save Step

- Save infrastructure monitoring design to `personas/automation-engineer/workspace/artifacts/infrastructure-monitoring.md`
- Save data quality monitoring to `personas/automation-engineer/workspace/artifacts/data-quality-monitoring.md`
- Save model performance monitoring to `personas/automation-engineer/workspace/artifacts/model-performance-monitoring.md`
- Save the complete stack design to `personas/automation-engineer/workspace/artifacts/monitoring-stack-design.md`
- Mark AE-04 complete in your `personas/automation-engineer/journey.md`

## Stretch Goal

Build a **synthetic monitoring system** — automated tests that continuously verify your AI platform is working end-to-end by sending known inputs and validating expected outputs:

```
Design a synthetic monitoring system for our AI platform:
- Synthetic data generators that produce realistic but identifiable test records
- End-to-end test flows that send synthetic data through ingestion → feature engineering → prediction
- Validation checks that compare synthetic predictions to expected values
- Canary deployments: use synthetic traffic to validate new model versions before real traffic
- Report: What percentage of end-to-end tests pass in the last 24 hours?

Show how synthetic monitoring integrates with the production monitoring stack and how to distinguish synthetic alerts from real alerts.
```

---

**Congratulations.** You've completed all four Automation Engineer role-specific modules. Combined with the shared modules, you now have a complete AI pipeline and automation toolkit. Return to your `personas/automation-engineer/journey.md` to review your progress and complete your reflection.
