# AE-02 — Pipeline Design Patterns

> **Goal**: Design reusable pipeline patterns for data ingestion, model training, model serving, and feedback loops — production-grade templates you can apply to any AI use case.

---

## Concept: Reusable Patterns Beat One-Off Pipelines

Every AI use case needs the same fundamental pipeline building blocks: get data in, transform it, train a model, serve predictions, and monitor everything. Yet most teams build each pipeline from scratch, introducing inconsistency, duplicated effort, and maintenance nightmares.

The solution is **pipeline design patterns** — reusable, parameterized templates that encode best practices once and apply everywhere. Think of them as the pipeline equivalent of software design patterns.

**The four core pipeline patterns for AI:**

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│   Ingestion  │────▶│  Training     │────▶│   Serving     │────▶│  Monitoring  │
│   Pipeline   │     │  Pipeline     │     │  Pipeline     │     │  Pipeline    │
└─────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
       │                    │                    │                     │
       ▼                    ▼                    ▼                     ▼
  Raw → Cleaned      Features → Model    Request → Prediction   Metrics → Alerts
  → Feature Store    → Registry         → Response              → Dashboards
```

**In animal pharma, these patterns must also:**
- Maintain data lineage and audit trails (ALCOA+)
- Support validation evidence generation (IQ/OQ/PQ)
- Handle batch manufacturing data patterns (discrete lots, not continuous streams)
- Integrate with LIMS, ERP, QMS, and MES systems
- Support multi-site deployment with site-specific configurations

## The Challenge

### Part 1 — Data Ingestion Pipeline Pattern

Build the foundational pattern — getting data in reliably:

```
@automation-engineer

Design a reusable data ingestion pipeline pattern for AI use cases at our animal pharmaceutical company. This pattern should be parameterized so it can be applied to different data sources. I need:

**Pipeline Structure (as a DAG):**
1. Source connection and extraction (support: database query, API call, file pickup, streaming)
2. Schema validation (does the data match expected structure?)
3. Data quality checks (nulls, ranges, duplicates, freshness, referential integrity)
4. Transformation (standardize, clean, enrich, conform to target schema)
5. Load to target (data lake, feature store, data warehouse)
6. Lineage logging (record source, transformation, destination, timestamps)
7. Quality report generation (summary statistics, anomaly flags, comparison to previous run)

**For each step, provide:**
- Input / output specification
- Error handling strategy (what happens on failure?)
- Retry logic (how many retries? backoff strategy?)
- Monitoring hooks (what metrics to emit?)
- Logging requirements (structured JSON logs)

**Animal pharma data sources to support:**
- LIMS extracts (lab test results, stability data, raw material testing)
- ERP data (batch records, inventory, production schedules)
- MES data (in-process controls, equipment readings, environmental monitoring)
- QMS data (deviations, CAPAs, change controls)
- Clinical trial data (study results, adverse events)
- Commercial data (sales, demand signals, market data)

**Provide as:**
1. Architecture diagram (Mermaid markdown)
2. Airflow DAG skeleton (Python)
3. Configuration template (YAML) for parameterizing per data source
4. Data quality check template (dbt or Great Expectations style)
```

### Part 2 — Model Training Pipeline Pattern

Build the pattern for training and validating models:

```
@automation-engineer

Design a reusable model training pipeline pattern. This needs to support the full ML experiment-to-production workflow:

**Pipeline Structure (as a DAG):**
1. Feature retrieval (from feature store or data warehouse)
2. Data splitting (train/validation/test with reproducible seeds)
3. Feature engineering (transformations, encoding, scaling)
4. Model training (parameterized for different algorithms)
5. Model evaluation (metrics computation, comparison to baseline)
6. Model validation gates (does it meet performance thresholds? statistical tests)
7. Model registration (version, tag, metadata, lineage in model registry)
8. Validation evidence generation (for GxP: training data hash, hyperparameters, performance report)

**For each step, provide:**
- Input / output specification
- Failure handling (what if training diverges? what if data is insufficient?)
- Reproducibility requirements (random seeds, environment pinning, data versioning)
- Artifact logging (MLflow or equivalent: metrics, parameters, artifacts)

**GxP-specific requirements:**
- Training data provenance tracking (which version of which data source?)
- Model lineage (which code version, which hyperparameters, which training run?)
- Performance evidence (statistical validation report suitable for regulatory review)
- Comparison to predicate model (if replacing an existing model/process)
- Approval gate (human-in-the-loop approval before model registration)

**Provide as:**
1. Architecture diagram (Mermaid markdown)
2. Pipeline skeleton (Python — framework-agnostic, but show Airflow/Prefect hooks)
3. MLflow tracking integration example
4. Model card template (metadata document generated with each trained model)
5. Configuration template (YAML) for parameterizing per use case
```

### Part 3 — Model Serving Pipeline Pattern

Build the pattern for getting predictions into production:

```
@automation-engineer

Design a reusable model serving pipeline pattern. Support both batch and real-time inference:

**Batch Serving Pattern:**
1. Trigger (schedule or event-based)
2. Load model from registry (specific version, validated)
3. Load input data (from feature store or staging table)
4. Run inference (with input/output logging)
5. Post-processing (threshold application, business rules, formatting)
6. Write results to target system (database, API, dashboard, file)
7. Generate prediction audit log (for GxP traceability)

**Real-Time Serving Pattern:**
1. Model deployment (containerized model behind API endpoint)
2. Request handling (input validation, feature lookup, preprocessing)
3. Inference (with latency SLA)
4. Response formatting (prediction + confidence + explanation)
5. Logging (every request/response pair for audit trail)
6. Health checks (liveness, readiness, model version verification)

**For both patterns:**
- A/B testing support (serve multiple model versions, route traffic)
- Fallback logic (what if the model is unavailable? default response? escalate to human?)
- Rate limiting and throttling
- Input validation (reject malformed requests before they hit the model)
- Output validation (sanity check predictions before returning them)

**Animal pharma serving scenarios:**
- Batch quality prediction: Run inference on each production batch's in-process data, flag potential OOS (out-of-spec) results → route to quality for review
- Demand forecasting: Nightly batch predictions for next-30-day product demand → feed into ERP production planning
- Adverse event classification: Real-time classification of incoming pharmacovigilance reports → route to appropriate review queue

**Provide as:**
1. Architecture diagrams for batch and real-time (Mermaid)
2. Docker + FastAPI skeleton for real-time serving
3. Airflow DAG skeleton for batch serving
4. Kubernetes deployment manifest (Helm chart values)
5. Health check and monitoring integration
```

### Part 4 — Feedback Loop Pattern

Close the loop — monitoring feeds back into retraining:

```
@automation-engineer

Design a feedback loop pipeline pattern that connects model monitoring back to model retraining:

**Pipeline Structure:**
1. Prediction logging (capture all inputs, outputs, timestamps)
2. Ground truth collection (when actual outcomes become available, match to predictions)
3. Performance calculation (compare predictions to actuals, compute drift metrics)
4. Drift detection (data drift + concept drift + performance drift)
5. Alert generation (threshold-based alerts when drift exceeds tolerance)
6. Retraining trigger (automatic or human-approved retraining based on drift severity)
7. Retraining pipeline invocation (calls the training pipeline with updated data)
8. Champion-challenger comparison (new model vs. current model on holdout data)
9. Model swap (if new model wins, promote to production; if not, alert and investigate)

**Drift detection specifics:**
- Data drift: PSI (Population Stability Index), KS test, chi-squared test on input features
- Concept drift: Performance metric degradation over time windows
- Prediction drift: Distribution shift in model outputs

**Animal pharma considerations:**
- Retraining must go through change control for GxP models
- Performance degradation in quality-related models requires immediate investigation (not just automated retraining)
- Seasonal patterns in animal health data (breeding cycles, disease seasonality) — distinguish true drift from expected variation
- Regulatory requirement: document why the model was retrained and what changed

**Provide as:**
1. Architecture diagram (Mermaid)
2. Monitoring DAG skeleton (Python)
3. Drift detection configuration (YAML — thresholds per metric)
4. Alert routing rules (who gets notified for what severity)
5. Retraining decision tree (when to auto-retrain vs. investigate vs. escalate)
```

## Save Step

- Save the ingestion pattern to `personas/automation-engineer/workspace/artifacts/pattern-data-ingestion.md`
- Save the training pattern to `personas/automation-engineer/workspace/artifacts/pattern-model-training.md`
- Save the serving pattern to `personas/automation-engineer/workspace/artifacts/pattern-model-serving.md`
- Save the feedback loop pattern to `personas/automation-engineer/workspace/artifacts/pattern-feedback-loop.md`
- Mark AE-02 complete in your `personas/automation-engineer/journey.md`

## Stretch Goal

Compose all four patterns into a single **end-to-end AI pipeline blueprint** for a specific use case. Pick one:
- Predictive batch quality (manufacturing)
- Demand forecasting (supply chain)
- Adverse event classification (pharmacovigilance)

Show how the four patterns connect, where data flows between them, and what the complete DAG looks like from raw data to deployed predictions to automated retraining.

---

**Next**: AE-03 — Orchestration Architecture
