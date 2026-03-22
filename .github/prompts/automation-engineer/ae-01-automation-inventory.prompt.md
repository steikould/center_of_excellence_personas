# AE-01 — Automation Inventory

> **Goal**: Document all current automation across your environment — scheduled jobs, pipelines, scripts, cron jobs, and managed workflows. Assess each for reliability, observability, and AI readiness.

---

## Concept: You Can't Automate What You Don't Know Exists

Every organization has automation debt: scheduled jobs nobody remembers creating, scripts running on someone's desktop, cron jobs on servers that haven't been patched in years, and ETL pipelines held together by hope. Before building AI pipelines, you need to know what already exists, because:

- **Hidden dependencies** — That cron job refreshing a CSV file? Three downstream dashboards depend on it, and the data science team just assumed that data was "always there."
- **Reliability blind spots** — If a pipeline fails silently at 2 AM, does anyone know? Unmonitored automation is a ticking bomb in a GxP environment where data integrity matters.
- **Duplication** — Two teams often automate the same data pull differently, creating inconsistent data and wasted compute.
- **AI readiness** — Not every pipeline is ready to serve an AI workflow. Can it handle the volume? Is the data quality sufficient? Is the output in a usable format?

An automation inventory is not glamorous work, but it is the foundation everything else builds on.

**Automation maturity levels:**

| Level | Description | Characteristics |
|-------|-------------|-----------------|
| 0 — Manual | No automation | Human runs the process every time |
| 1 — Scripted | Basic scripts | Runs manually but logic is codified; no scheduling, no error handling |
| 2 — Scheduled | Cron/scheduler | Runs on a schedule; minimal monitoring; failures may go unnoticed |
| 3 — Orchestrated | DAG-based | Multi-step with dependencies; has retry logic; some monitoring |
| 4 — Observable | Full monitoring | Structured logging, metrics, alerting, dashboards; SLAs defined |
| 5 — Self-Healing | Automated recovery | Circuit breakers, auto-scaling, automatic failover; validated |

## The Challenge

### Part 1 — Discover Existing Automation

Start by cataloguing everything that runs automatically in your environment:

```
@automation-engineer

I need to create a comprehensive automation inventory for our animal pharmaceutical company. Help me build a discovery questionnaire that I can use to interview team members across departments. The questionnaire should uncover:

1. **Scheduled jobs** — What runs on a timer? (cron, Task Scheduler, Airflow DAGs, Azure Data Factory pipelines, scheduled notebooks)
2. **Triggered automation** — What runs in response to events? (file drops, API calls, database changes, email triggers)
3. **Manual-but-scripted processes** — What has a script but still requires a human to kick it off?
4. **Data pipelines** — What moves data between systems? (ETL/ELT jobs, file transfers, API integrations, database replication)
5. **Deployment automation** — What handles CI/CD? (build pipelines, deployment scripts, infrastructure provisioning)
6. **Monitoring and alerting** — What watches other systems? (health checks, threshold alerts, log aggregation)

For each discovered automation, I need to capture:
- Name / identifier
- Owner (person and team)
- Source system → Target system
- Schedule / trigger
- Language / platform (Python, PowerShell, Airflow, ADF, etc.)
- Last modified date
- Documentation status (none / partial / complete)
- GxP relevance (does it touch validated systems or regulated data?)

Create the questionnaire with specific prompting questions that help non-technical people describe their automation. Include examples from animal pharma: "Do you have any scheduled reports that pull from LIMS?" or "Is there an automated process that transfers batch records to the quality system?"
```

### Part 2 — Assess Reliability

For each item in the inventory, score its reliability:

```
@automation-engineer

Help me create a reliability assessment framework for our automation inventory. For each automated process, I need to evaluate:

**Reliability Dimensions:**

1. **Failure Visibility** (1-5)
   - 1: No one knows when it fails
   - 3: Someone eventually notices (hours/days)
   - 5: Automated alerting within minutes, with escalation

2. **Error Handling** (1-5)
   - 1: Crashes silently on error
   - 3: Logs errors but no recovery
   - 5: Retry logic, dead-letter queues, graceful degradation

3. **Recovery Capability** (1-5)
   - 1: Must be manually rebuilt from scratch
   - 3: Can be restarted but may have data issues
   - 5: Idempotent — safe to re-run anytime with consistent results

4. **Documentation** (1-5)
   - 1: No documentation, one person knows how it works
   - 3: README exists but may be outdated
   - 5: Full runbook with troubleshooting steps, tested by someone other than the author

5. **Change Control** (1-5)
   - 1: Anyone can modify it, no version control
   - 3: In version control but no review process
   - 5: Full CI/CD with code review, testing, and validated deployment

Calculate a **Reliability Score** (sum of all dimensions, max 25) and map to:
- 21-25: Production-grade
- 16-20: Adequate with improvements needed
- 11-15: At risk — prioritize for hardening
- 6-10: Critical — immediate attention required
- 1-5: Fragile — should not be relied upon

Create a scoring template as a markdown table I can fill in for each automation.
```

### Part 3 — Assess AI Readiness

Now evaluate which automations are ready to support AI workflows:

```
@automation-engineer

For each automation in our inventory, I need to assess AI readiness — can this pipeline or process be extended to support AI/ML workloads? Help me create an AI readiness assessment with these dimensions:

1. **Data Quality** — Does this automation produce or move data that could feed an ML model?
   - Is the data structured and consistent?
   - Is there sufficient volume and history?
   - Are there data quality checks in place?

2. **Scalability** — Can this automation handle AI-scale workloads?
   - Can it process 10x the current volume?
   - Is it containerized or easily scalable?
   - Are there resource limits (memory, CPU, network) that would bottleneck?

3. **Observability** — Is the automation instrumented enough for ML monitoring?
   - Does it emit structured logs?
   - Are there metrics endpoints?
   - Can you track data lineage through the pipeline?

4. **Integration** — Can AI components be inserted into the workflow?
   - Is there an API or message queue interface?
   - Can the pipeline be extended with new steps?
   - Is the orchestration flexible (DAG vs. rigid sequence)?

5. **Compliance** — Is the automation aligned with GxP requirements for AI?
   - Is it under change control?
   - Does it produce audit trails?
   - Is the infrastructure validated or validatable?

Score each dimension 1-5. AI Readiness Score = sum (max 25).
- 21-25: AI-ready — can integrate ML workloads now
- 16-20: AI-capable — needs minor enhancements
- 11-15: AI-potential — needs significant upgrades
- 6-10: Not AI-ready — rebuild required for AI use
- 1-5: Legacy — replace before AI integration

Present the results as a prioritized list: which automations to upgrade first for AI enablement.
```

### Part 4 — Create the Automation Catalogue

Combine everything into a living document:

```
@automation-engineer

Help me assemble the complete automation catalogue. Structure it as:

**Section 1: Executive Summary**
- Total automations discovered
- Breakdown by maturity level (0-5)
- Breakdown by reliability score category
- Breakdown by AI readiness score category
- Top 5 risks (most fragile automations touching critical processes)
- Top 5 opportunities (highest-value automations to upgrade for AI)

**Section 2: Automation Registry**
A table with every automation and its scores. Sortable by reliability score, AI readiness score, or GxP relevance.

**Section 3: Action Plan**
- Immediate actions (fragile automations touching GxP data)
- Short-term improvements (reliability hardening for score <15)
- AI enablement roadmap (upgrades needed for top AI use cases)
- Decommission candidates (redundant or obsolete automations)

**Section 4: Governance**
- Who owns the automation catalogue going forward?
- How often is it reviewed?
- Process for registering new automation
- Process for decommissioning old automation

Make it a template I can share with the team and update quarterly.
```

## Save Step

- Save the discovery questionnaire to `personas/automation-engineer/workspace/artifacts/automation-discovery-questionnaire.md`
- Save the reliability assessment framework to `personas/automation-engineer/workspace/artifacts/reliability-assessment-framework.md`
- Save the AI readiness assessment to `personas/automation-engineer/workspace/artifacts/ai-readiness-assessment.md`
- Save the complete automation catalogue to `personas/automation-engineer/workspace/artifacts/automation-catalogue.md`
- Mark AE-01 complete in your `personas/automation-engineer/journey.md`

## Stretch Goal

Build a **dependency map** of your automation landscape. Ask Copilot to generate a Mermaid diagram showing which automations feed into which others, which share data sources, and where single points of failure exist:

```
Based on the automation inventory, create a dependency graph in Mermaid syntax showing:
- Nodes: Each automation (colored by reliability score: green/yellow/red)
- Edges: Data flows between automations
- Clusters: Group by department or system
- Highlight: Single points of failure (automations with many dependents and low reliability)
```

---

**Next**: AE-02 — Pipeline Design Patterns
