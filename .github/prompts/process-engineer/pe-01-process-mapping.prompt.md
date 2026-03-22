# PE-01 — Process Mapping with AI Touchpoints

> **Goal**: Map a real business process end-to-end and identify where AI can intervene to improve speed, quality, or compliance.

---

## What You're Learning
- How to document current-state processes in a structured, reusable format
- How to identify AI opportunity points within existing workflows
- How to use Copilot to generate process maps from narrative descriptions
- The difference between automating a process and improving a process

## Concept: Process Maps as AI Canvases

Every AI initiative starts with a process. Before you can automate, predict, or optimize, you need to see the workflow clearly — who does what, in what order, with what inputs and outputs, and where things go wrong.

A process map with AI touchpoints adds a layer: at each step, you evaluate whether AI could:
- **Automate** the step entirely (rule-based or ML-driven)
- **Augment** the human doing the step (decision support, drafting, quality checks)
- **Monitor** the step for anomalies (predictive quality, drift detection)
- **Accelerate** the step (pre-populate forms, auto-classify documents, suggest next actions)

The output is not just a map — it is an AI opportunity assessment grounded in operational reality.

## The Challenge

### Part 1 — Select and Scope Your Process

Pick a real process from your work. Good candidates for this exercise:
- Batch record review and release
- Deviation investigation and CAPA
- Incoming material inspection
- Regulatory submission document assembly
- Change control from initiation to closure

Tell Copilot what you've chosen:

```
I'm a Process Engineer at an animal pharmaceutical company. I want to map the following process end-to-end:

Process: [name the process]
Trigger: [what kicks it off — e.g., "batch completion," "customer complaint received"]
End state: [what does "done" look like — e.g., "batch released to warehouse," "CAPA closed and verified"]
Key departments involved: [e.g., Manufacturing, QA, QC, Regulatory]

Help me define the process boundaries. What should be in scope and out of scope? Ask me clarifying questions if the boundaries aren't clear enough.
```

Review Copilot's suggestions. Refine the scope until you have a clean start-to-finish boundary.

### Part 2 — Document the Current State

Now walk Copilot through the process step by step:

```
#file:personas/process-engineer/copilot-instructions.md

I'm going to describe my process step by step. For each step I describe, capture:
- Step number and name
- Who performs it (role/department)
- Inputs required
- Outputs produced
- Estimated cycle time (active work time)
- Estimated wait time (time sitting in queue or waiting for approval)
- Systems used (QMS, ERP, LIMS, email, paper, etc.)
- Decision points (yes/no gates, approval thresholds)
- Known pain points or failure modes

Generate a structured process table as I describe each step. I'll tell you when I'm done.

Step 1: [describe the first step in your own words]
```

Continue describing steps until the process is complete. Don't worry about perfection — capture reality, not the idealized version.

### Part 3 — Generate the Process Map

Ask Copilot to convert your structured table into a visual process map:

```
Convert the process steps we documented into a Mermaid flowchart diagram. Requirements:
- Use swimlanes to show which department/role owns each step
- Mark decision points as diamond shapes
- Show wait times as annotations on the arrows between steps
- Highlight rework loops (where the process goes backward)
- Use color coding: green for value-adding steps, yellow for necessary but non-value-adding, red for waste

Also create a summary table showing:
- Total number of steps
- Total cycle time (active work)
- Total wait time (queue/approval time)
- Number of handoffs between departments
- Number of decision points
- Number of rework loops
```

### Part 4 — Identify AI Touchpoints

This is where process mapping meets AI strategy. Ask Copilot:

```
Now analyze each step of this process for AI intervention opportunities. For every step, evaluate whether AI could:

1. AUTOMATE: Replace the human step entirely (what type of AI? rule-based, ML, NLP?)
2. AUGMENT: Support the human with better information (decision support, drafting, risk scoring)
3. MONITOR: Watch for anomalies or quality signals (predictive analytics, SPC, drift detection)
4. ACCELERATE: Speed up the step without changing it (auto-populate, pre-classify, suggest)

For each opportunity identified:
- Describe the AI intervention specifically (not "use AI" — what model, what data, what output?)
- Rate feasibility: High / Medium / Low
- Rate impact: High / Medium / Low
- Note any regulatory considerations (would this change require validation? Change control? Regulatory notification?)
- Estimate the time savings if implemented

Present this as an AI Opportunity Matrix.
```

Review the matrix critically. Push back on anything unrealistic. Add opportunities Copilot missed based on your domain knowledge.

## Save Step

Save these artifacts to `personas/process-engineer/workspace/artifacts/`:
- `pe-01-current-state-map.md` — The structured process table and Mermaid diagram
- `pe-01-ai-opportunity-matrix.md` — The AI touchpoint analysis

Mark PE-01 complete in your `personas/process-engineer/journey.md`.

## Stretch Goal

Pick the highest-impact, highest-feasibility AI opportunity from your matrix. Write a one-page business case:
- Current state metric (time, cost, error rate)
- Proposed AI intervention
- Expected improvement (with assumptions stated)
- Implementation requirements (data, infrastructure, validation)
- Risks and mitigations

Save it as `pe-01-ai-business-case.md` in your artifacts folder.

---

**Next**: PE-02 — Bottleneck Analysis Framework
