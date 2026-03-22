# PE-04 — Continuous Improvement Metrics

> **Goal**: Build a measurement framework for AI-driven process improvements, including KPIs, before/after analysis methodology, and statistical control charts.

---

## What You're Learning
- How to design metrics that actually measure improvement (not just activity)
- Before/after analysis methodology with statistical rigor
- Control chart design and interpretation for process monitoring
- How to sustain improvements through measurement and escalation

## Concept: You Can't Improve What You Don't Measure

Continuous improvement in a pharmaceutical environment requires evidence — not anecdotes. When you claim a process improved, auditors, regulators, and leadership all want to see:

1. **Baseline**: What was the metric before the change? (With enough data points to be statistically meaningful)
2. **Intervention**: What specifically changed? (Documented in change control)
3. **Result**: What is the metric after the change? (With enough data points to confirm the trend)
4. **Sustainability**: Is the improvement holding? (Control charts, ongoing monitoring)
5. **Significance**: Is the change real or just noise? (Statistical tests, confidence intervals)

AI-driven improvements add a layer of complexity: the AI system itself may drift, the process may adapt around the AI, and the measurement system may need to evolve. Your framework must account for all of this.

## The Challenge

### Part 1 — Design Your KPI Framework

Start by defining what "improvement" means for a process you've been working with:

```
#file:personas/process-engineer/copilot-instructions.md

I need to design a KPI framework for measuring process improvement. The process is:
[Name and brief description of the process]

The improvement we're implementing is:
[Describe the change — AI-driven, automation, procedural, or a combination]

Help me design a balanced KPI framework using these categories:

1. EFFICIENCY metrics (time-based)
   - Cycle time (end-to-end and per-step)
   - Wait time / queue time
   - Throughput (units per time period)
   - First-pass yield (right-first-time rate)

2. QUALITY metrics (defect-based)
   - Defect rate / error rate
   - Rework frequency
   - Deviation rate
   - Customer complaint rate (if applicable)

3. COMPLIANCE metrics (regulatory)
   - On-time completion rate (vs. regulatory or internal deadlines)
   - Audit finding rate
   - CAPA closure timeliness
   - Training compliance rate

4. COST metrics (financial)
   - Cost per unit / cost per transaction
   - Labor hours per process cycle
   - Waste / scrap rate
   - Overtime hours

For each KPI:
- Define the metric precisely (numerator, denominator, unit of measure)
- Specify the data source (which system captures this?)
- Set the measurement frequency (daily, weekly, monthly)
- Propose a baseline target and a stretch target
- Identify leading vs. lagging indicators
```

### Part 2 — Build a Before/After Analysis

Design a rigorous before/after comparison:

```
Help me create a before/after analysis template for our process improvement. I need:

1. STUDY DESIGN
   - Baseline period: [recommended duration and why]
   - Implementation period: [transition window — data here may be excluded or flagged]
   - Post-implementation period: [recommended duration and why]
   - Confounding variables to control for: [seasonality, staffing changes, product mix, regulatory changes]

2. DATA COLLECTION PLAN
   For each KPI, specify:
   - Data source and extraction method
   - Sample size requirements (how many data points for statistical significance?)
   - Data quality checks (outlier identification, missing data handling)
   - Data storage location

3. ANALYSIS METHODS
   - Descriptive statistics: mean, median, standard deviation, range for before and after periods
   - Statistical tests: which test for which metric?
     * Continuous data, normal distribution → two-sample t-test
     * Continuous data, non-normal → Mann-Whitney U test
     * Proportions (defect rates) → chi-square or Fisher's exact test
     * Time series → interrupted time series analysis
   - Practical significance: even if statistically significant, is the improvement meaningful?

4. REPORTING FORMAT
   Design a one-page before/after summary that shows:
   - KPI name, baseline value, post-change value, delta, % change, statistical significance
   - Visualization: bar chart or box plot for each KPI
   - Narrative: what changed, why it matters, what's next

Generate the full template with example data so I can see the format.
```

### Part 3 — Design Control Charts

Create a statistical process control (SPC) system for ongoing monitoring:

```
Help me design control charts for monitoring our improved process. I need:

1. CHART SELECTION
   For each KPI, recommend the appropriate control chart type:
   - X-bar and R chart (continuous data, subgroups)
   - Individual and Moving Range chart (continuous data, individual observations)
   - p-chart (proportion defective)
   - c-chart (count of defects)
   - u-chart (defects per unit)
   Explain why each chart type fits the data.

2. CONTROL LIMIT CALCULATION
   For our primary KPI: [name the KPI and provide sample data or describe it]
   - Calculate the center line (CL)
   - Calculate Upper Control Limit (UCL) and Lower Control Limit (LCL)
   - Show the formulas used
   - Generate a sample control chart as a data table with columns: Subgroup, Value, CL, UCL, LCL

3. OUT-OF-CONTROL RULES (Western Electric Rules)
   Define and explain each rule:
   - Rule 1: One point beyond 3-sigma
   - Rule 2: Eight consecutive points on one side of center line
   - Rule 3: Six consecutive points steadily increasing or decreasing
   - Rule 4: Two out of three consecutive points beyond 2-sigma (same side)
   For each rule, describe what it signals about the process.

4. RESPONSE PLAN
   When an out-of-control signal is detected:
   - Immediate action: who is notified, what investigation begins?
   - Investigation template: what data to gather, what root causes to check
   - Escalation criteria: when does this become a deviation? A CAPA?
   - Documentation: where is the investigation and response recorded?

5. RECALCULATION TRIGGERS
   When should control limits be recalculated?
   - After a deliberate process change (new limits reflect new process)
   - After removing assignable causes (recalculate excluding out-of-control points)
   - On a periodic schedule (quarterly? annually?)
```

### Part 4 — Build the Improvement Dashboard

Bring everything together into a monitoring system:

```
Design a continuous improvement dashboard for our process. It should include:

1. DASHBOARD LAYOUT
   - Top section: Executive summary (3 headline KPIs with trend arrows)
   - Middle section: Control charts (2-3 primary metrics with current status)
   - Bottom section: Action items (open investigations, pending countermeasures, upcoming reviews)

2. UPDATE CADENCE
   - Real-time metrics (if system-generated): [which KPIs]
   - Daily metrics: [which KPIs]
   - Weekly metrics: [which KPIs]
   - Monthly metrics: [which KPIs]

3. AUDIENCE-SPECIFIC VIEWS
   - Operator view: Am I performing within limits today?
   - Supervisor view: Are there trends I need to investigate?
   - Management view: Are we improving quarter over quarter?
   - Quality view: Are we compliant? Any signals that require investigation?

4. ALERT SYSTEM
   - Green: all metrics within control limits
   - Yellow: warning signals (approaching limits, minor trends)
   - Red: out-of-control signals requiring investigation
   - Define the notification chain for yellow and red alerts

Generate the dashboard as a structured markdown document with placeholder data. Include Mermaid charts where possible.
```

## Save Step

Save these artifacts to `personas/process-engineer/workspace/artifacts/`:
- `pe-04-kpi-framework.md` — Your balanced KPI framework with definitions and targets
- `pe-04-before-after-template.md` — Reusable before/after analysis template
- `pe-04-control-chart-guide.md` — Control chart selection, calculation, and response plan
- `pe-04-improvement-dashboard.md` — Dashboard design with layout and alert system

Save reusable prompts to `personas/process-engineer/workspace/prompts/`:
- `control-chart-generator.prompt.md` — A prompt that takes process data and generates the appropriate control chart

Mark PE-04 complete in your `personas/process-engineer/journey.md`.

## Stretch Goal

Create a "Continuous Improvement Review" agent that:
- Reads process data from a structured markdown table
- Identifies out-of-control signals using Western Electric rules
- Generates an investigation recommendation
- Produces a summary suitable for a monthly quality review meeting

Save it as `personas/process-engineer/workspace/agents/ci-reviewer.agent.md`.

---

**Congratulations.** You've completed all four Process Engineer role-specific modules. Combined with your eight shared modules, you now have a comprehensive process improvement toolkit powered by AI. Return to your `personas/process-engineer/journey.md` to review your complete body of work.
