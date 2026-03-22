# AE-03 — Orchestration Architecture

> **Goal**: Design an orchestration architecture for multi-step AI workflows — DAG design, dependency management, error handling, retry logic, and state management across complex pipelines.

---

## Concept: Orchestration Is the Nervous System of AI Operations

Individual pipelines are useful. Orchestrated workflows are powerful. The difference between a collection of scripts and a production AI platform is orchestration — the system that knows what to run, when, in what order, what to do when things fail, and how to recover gracefully.

In animal pharma, orchestration complexity is multiplied by:
- **Multi-site operations**: The same workflow may need to run at 5 manufacturing sites with different local data sources
- **Regulatory dependencies**: Some steps can only proceed after quality approval, which may take days
- **Batch manufacturing cadence**: Workflows are tied to production batch schedules, not arbitrary cron times
- **Data freshness requirements**: Some data must be processed within hours of generation (e.g., environmental monitoring excursions), while other data is batch-processed weekly (e.g., stability trending)

**Orchestration architecture decisions:**

| Decision | Options | Trade-offs |
|----------|---------|------------|
| Pull vs. Push | Polling for new data vs. event-triggered | Push is more responsive but requires event infrastructure |
| Centralized vs. Distributed | One orchestrator vs. per-site orchestrators | Central is simpler but creates a single point of failure |
| DAG vs. State Machine | Directed acyclic graph vs. state machine | DAGs are simpler; state machines handle long-running human-in-the-loop workflows |
| Eager vs. Lazy | Pre-compute everything vs. compute on demand | Eager is faster at read time; lazy saves compute for unused results |
| Monolith vs. Micro-pipelines | One big DAG vs. many small DAGs with triggers | Micro-pipelines are easier to maintain but harder to debug end-to-end |

## The Challenge

### Part 1 — Design Your DAG Architecture

Start with the overall structure of how your workflows connect:

```
@automation-engineer

Help me design a DAG architecture for orchestrating AI workflows at our animal pharmaceutical company. I need to think through:

**Workflow Decomposition:**
Take a complete AI use case (e.g., predictive batch quality) and break it into orchestrated workflows:

1. **Data Ingestion DAG** — Runs on schedule, pulls data from source systems
2. **Feature Engineering DAG** — Triggered by successful ingestion, transforms raw data into features
3. **Model Training DAG** — Triggered manually or by drift detection, trains new model versions
4. **Model Serving DAG** — Runs on batch schedule, generates predictions
5. **Monitoring DAG** — Runs continuously, checks model and data health

For each DAG, define:
- Tasks (individual steps)
- Dependencies (which tasks depend on which)
- Trigger type (schedule, event, manual, upstream DAG completion)
- Expected runtime and SLA
- Failure impact (what breaks if this DAG fails?)

**Inter-DAG Dependencies:**
Show how these DAGs connect to each other:
- DAG A completes → triggers DAG B
- DAG C depends on outputs from DAG A and DAG B
- DAG D runs independently but shares infrastructure

**Provide:**
1. Individual DAG diagrams (Mermaid)
2. Inter-DAG dependency diagram showing the complete workflow
3. Airflow/Prefect DAG skeleton code for the most complex DAG
```

### Part 2 — Design Error Handling and Recovery

Production pipelines fail. Design for it:

```
@automation-engineer

Design a comprehensive error handling and recovery strategy for our AI orchestration architecture. Cover:

**Error Categories and Responses:**

1. **Transient errors** (network timeout, API rate limit, temporary resource unavailability)
   - Strategy: Retry with exponential backoff
   - Config: Max retries, initial delay, backoff multiplier, jitter
   - Example: LIMS API returns 503 → retry 3 times with 30s/60s/120s delays

2. **Data errors** (missing data, schema mismatch, quality threshold failure)
   - Strategy: Quarantine bad data, alert data owner, continue with valid data if possible
   - Config: Quality thresholds, quarantine location, alerting rules
   - Example: Batch record missing 3 required fields → quarantine record, alert QA, process remaining records

3. **Infrastructure errors** (out of memory, disk full, compute node failure)
   - Strategy: Auto-scale if possible, fail with clear diagnostics, alert ops
   - Config: Resource limits, scaling policies, health check intervals
   - Example: Training job OOM → restart on larger instance, log memory profile

4. **Logic errors** (model training diverges, unexpected output shape, business rule violation)
   - Strategy: Fail fast, preserve state for debugging, alert ML team
   - Config: Sanity checks at each step, output validators
   - Example: Model accuracy drops below 50% → halt, preserve training artifacts, alert data scientist

5. **Dependency errors** (upstream DAG failed, external system unavailable, human approval pending)
   - Strategy: Wait with timeout, degrade gracefully, notify dependent teams
   - Config: Timeout duration, fallback behavior, notification chain
   - Example: Feature engineering DAG didn't complete → serving DAG uses yesterday's features with staleness warning

**For each category, provide:**
- Detection method (how do you know this error occurred?)
- Immediate response (what happens automatically?)
- Escalation path (who gets notified, in what order?)
- Recovery procedure (how to get back to a good state?)
- Prevention strategy (how to reduce future occurrences?)

Create as a runbook-style document with decision trees.
```

### Part 3 — Design State Management

Complex workflows need state tracking:

```
@automation-engineer

Design a state management system for our AI orchestration. Address:

**Workflow State Tracking:**
- Each workflow run has a unique ID, status (pending/running/success/failed/retrying), start time, end time, and result metadata
- Each task within a workflow tracks its own status, inputs, outputs, and logs
- State must survive orchestrator restarts (persistent state, not in-memory)

**Idempotency Design:**
Every task should be safe to re-run. For each pipeline pattern from AE-02, show how to make it idempotent:
- Data ingestion: Use watermarks or timestamps to avoid re-processing
- Feature engineering: Overwrite feature values keyed by entity + timestamp
- Model training: Use deterministic seeds, pin data versions
- Model serving: Predictions keyed by input hash, idempotent writes

**Checkpointing:**
For long-running workflows, how do you checkpoint progress so you can resume from the last successful step instead of starting over?
- Where to store checkpoints (database, object storage, orchestrator metadata)
- Granularity (per-task, per-batch, per-record)
- Cleanup policy (how long to keep checkpoints)

**Concurrency Control:**
- What happens when two instances of the same DAG run simultaneously?
- Locking strategies (database locks, file locks, orchestrator-level locks)
- Queue management (FIFO, priority-based, fair scheduling)

**Provide:**
1. State database schema (tables for workflow runs, task runs, checkpoints)
2. Idempotency implementation examples for each pipeline type
3. Concurrency control configuration for Airflow/Prefect
```

### Part 4 — Multi-Site Orchestration

Design for the reality of a global pharma operation:

```
@automation-engineer

Design a multi-site orchestration architecture for our AI pipelines. We have manufacturing sites in multiple geographies, each with local data sources but shared AI models. Address:

**Architecture Options:**

Option A — Centralized Orchestration:
- One orchestrator in the cloud manages all sites
- Pros: Single pane of glass, consistent execution
- Cons: Network dependency, latency, single point of failure

Option B — Federated Orchestration:
- Each site has its own orchestrator, with a central coordinator
- Pros: Local resilience, reduced network dependency
- Cons: Complexity, configuration drift, harder to debug

Option C — Hybrid:
- Local orchestrators for data ingestion and serving
- Central orchestrator for model training and global analytics
- Pros: Best of both, aligns with data locality
- Cons: More integration points

**For the recommended architecture:**
1. Deployment diagram showing components at each site and in central
2. Communication patterns (how do sites talk to central? APIs? message queues? shared storage?)
3. Configuration management (how do you ensure consistency across sites while allowing local variation?)
4. Failure isolation (a site going offline doesn't affect other sites)
5. Data sovereignty (some data may not leave certain jurisdictions)

**Animal pharma specifics:**
- Manufacturing batch data should be processed locally (latency and compliance)
- Model training can be centralized (pooled data from all sites, with appropriate access controls)
- Predictions may need site-specific calibration (different equipment, different environmental conditions)
- Regulatory requirements may vary by jurisdiction (FDA vs. EMA vs. local authorities)

Provide the architecture as Mermaid diagrams with a written rationale for your recommendation.
```

## Save Step

- Save the DAG architecture to `personas/automation-engineer/workspace/artifacts/dag-architecture.md`
- Save the error handling runbook to `personas/automation-engineer/workspace/artifacts/error-handling-runbook.md`
- Save the state management design to `personas/automation-engineer/workspace/artifacts/state-management-design.md`
- Save the multi-site architecture to `personas/automation-engineer/workspace/artifacts/multi-site-orchestration.md`
- Mark AE-03 complete in your `personas/automation-engineer/journey.md`

## Stretch Goal

Build a **chaos engineering test plan** for your orchestration architecture. Design tests that intentionally break things to verify your error handling works:

```
Create a chaos engineering test plan for our AI orchestration. For each failure scenario:
- What we break (e.g., kill the LIMS API, corrupt an input file, exhaust GPU memory)
- Expected behavior (what should the system do?)
- How to inject the fault (script, network rule, resource limit)
- Success criteria (how do we know the system handled it correctly?)
- Blast radius (what's affected if the test goes wrong?)

Include at least 10 scenarios covering network, data, compute, and dependency failures.
```

---

**Next**: AE-04 — Monitoring & Observability
