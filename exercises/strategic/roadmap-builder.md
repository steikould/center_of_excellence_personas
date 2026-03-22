# Exercise: AI Initiative Roadmap Builder

> **For: Senior Director, Project Manager, Enterprise Architect**

## Instructions

Use Copilot to build a phased roadmap for an AI initiative.

### Step 1 — Define the Initiative
Ask Copilot:
```
Help me build a 12-month roadmap for this AI initiative at our animal pharmaceutical company:
[Describe the initiative]

Context:
- We need GxP validation for any AI that touches regulated processes
- Change control requires 2-4 weeks for standard changes, 8-12 weeks for major changes
- Our data is spread across LIMS, ERP, QMS, and a data lake
- We have [X] data scientists, [X] developers, [X] automation engineers available

Structure the roadmap in 3-month phases: Foundation, Build, Scale, Optimize.
```

### Step 2 — Add Dependencies & Risks
```
For each phase, identify:
1. Dependencies on other systems, teams, or decisions
2. Top 3 risks with probability and impact (use animal pharma context)
3. Regulatory milestones or gates
4. Key decisions that must be made before the next phase
```

### Step 3 — Resource & Budget View
```
For each phase, estimate:
1. FTE requirements by role
2. Technology costs (infrastructure, licensing, tools)
3. External costs (consultants, vendors, training)
4. Total investment and expected value delivery

Present as a table with quarterly totals.
```

### Step 4 — Save
Save to: `personas/{your-role}/workspace/artifacts/roadmap-{initiative-name}.md`

## Success Criteria
- All 4 phases are defined with clear entry/exit criteria
- Regulatory gates are realistic for animal pharma
- Resource estimates account for the CoE team composition
- Risks are specific (not generic "resource constraints")
