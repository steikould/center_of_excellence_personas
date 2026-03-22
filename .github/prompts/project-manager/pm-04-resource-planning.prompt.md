# PM-04 — Resource & Capacity Planning

> **Goal**: Build resource and capacity planning frameworks for AI initiatives — skills inventory, gap analysis, capacity models, and build-vs-buy decision frameworks.

---

## Concept: AI Projects Have a Skills Problem

The biggest constraint on AI projects is not technology — it's people. Specifically:

- **AI talent is scarce** — data scientists, ML engineers, and MLOps specialists are hard to hire and expensive to retain
- **Domain expertise is irreplaceable** — a model built without animal pharma SME input is a model that fails in production
- **The skills mix is unusual** — AI projects need a combination of skills (data science + regulatory + engineering + domain) that rarely exists in one team
- **Capacity is shared** — your data scientist also supports three other projects, the QA team has validation backlogs, and IT infrastructure is shared across the enterprise

Effective resource planning for AI means:
1. **Knowing what skills you need** at each project phase
2. **Knowing what skills you have** across the organization
3. **Identifying gaps** before they become blockers
4. **Making build/buy/partner decisions** strategically, not reactively
5. **Planning capacity** across a portfolio of AI projects, not just one

## The Challenge

### Part 1 — Build an AI Skills Inventory

Start by documenting what skills AI projects actually require:

```
@project-manager

Help me build a comprehensive AI skills inventory for our animal pharmaceutical company. I need two things:

**Part A — Skills Taxonomy**
Create a structured taxonomy of skills needed for AI projects, organized by category:

1. **Data & Analytics**: Data engineering, data quality, statistical analysis, EDA, feature engineering
2. **Machine Learning**: Model development, experiment design, model validation, deep learning, NLP, computer vision
3. **MLOps & Engineering**: Pipeline development, CI/CD for ML, model serving, monitoring, infrastructure as code
4. **Domain Expertise**: Animal health science, pharmaceutical manufacturing, regulatory affairs, quality systems, pharmacovigilance
5. **Project & Governance**: AI project management, risk management, change management, validation management, vendor management
6. **Tools & Platforms**: Python/R, cloud platforms (Azure/AWS), orchestration tools, LIMS/ERP/QMS, ML platforms

For each skill, include:
- Proficiency levels: Foundational / Practitioner / Expert
- Which project phases need this skill most
- Whether this skill exists internally or is typically sourced externally

**Part B — Current State Assessment**
Create a template I can use to assess our current team. For each team member, capture:
- Name, role, primary skills, proficiency level, current allocation (%), availability for AI projects
```

Work through Part B with your actual team data. This is where the template becomes valuable.

### Part 2 — Gap Analysis

With the skills inventory complete, identify the gaps:

```
@project-manager

Based on the AI skills taxonomy and our team assessment, help me perform a gap analysis. For each skill category:

1. **Required capacity** — How many person-hours per month do our planned AI projects need for this skill?
2. **Available capacity** — What do we currently have (accounting for existing commitments)?
3. **Gap** — The delta between required and available
4. **Criticality** — How much does this gap slow us down? (Blocking / Degrading / Manageable)
5. **Recommended action** — Hire / Train / Contract / Partner / Defer

Present as a gap analysis matrix. Flag the top 5 most critical gaps.

Then create a **skills heat map** showing coverage across our AI project portfolio:
- Rows: AI projects
- Columns: Key skill categories
- Cells: Green (covered) / Yellow (stretched) / Red (gap) / Gray (not needed)
```

### Part 3 — Build-vs-Buy Decision Framework

For each significant gap, you need a structured decision:

```
@project-manager

Create a build-vs-buy-vs-partner decision framework for AI capabilities. For each option:

**Build (Internal Development)**
- Criteria for when to build: strategic differentiator, proprietary data/process, long-term need, skill development investment
- Costs: Hiring, training, infrastructure, time-to-productivity (6-12 months for a new data scientist to be effective in pharma)
- Risks: Talent retention, knowledge concentration, slower time-to-value
- Animal pharma consideration: Domain expertise is hard to hire for; building takes longer but creates lasting capability

**Buy (Vendor Solution)**
- Criteria for when to buy: commodity capability, proven solution exists, speed-to-value critical, not a differentiator
- Costs: License fees, implementation, integration, ongoing support, vendor lock-in
- Risks: Vendor dependency, customization limits, data sovereignty concerns, GxP validation burden for vendor systems
- Animal pharma consideration: Vendor must support validated environments; evaluate GAMP 5 category

**Partner (Consulting/Outsource)**
- Criteria for when to partner: Temporary skill gap, proof-of-concept phase, specialized expertise for one project
- Costs: Day rates, knowledge transfer overhead, management overhead
- Risks: Knowledge leaves when partner leaves, quality variability, IP concerns
- Animal pharma consideration: Partners need pharma domain experience; onboarding time for GxP understanding

Create a decision scorecard template with weighted criteria that I can use for each capability decision.
```

### Part 4 — Capacity Planning Model

Build a model for planning across the AI portfolio:

```
@project-manager

Help me create a capacity planning model for our AI project portfolio. I need:

**Resource Demand Model**
For a typical AI project at each phase, how many hours per week do we need from each role?

| Role | Ideation | Discovery | Development | Validation | Deployment | Operations |
|------|----------|-----------|-------------|------------|------------|------------|
| Data Scientist | ? | ? | ? | ? | ? | ? |
| ML Engineer | ? | ? | ? | ? | ? | ? |
| Automation Engineer | ? | ? | ? | ? | ? | ? |
| QA / Validation | ? | ? | ? | ? | ? | ? |
| PM | ? | ? | ? | ? | ? | ? |
| Domain SME | ? | ? | ? | ? | ? | ? |
| Regulatory | ? | ? | ? | ? | ? | ? |

Fill in realistic estimates for an animal pharma AI project.

**Portfolio Capacity View**
If we have 3-5 AI projects running in parallel at different phases, show me how to calculate total demand and identify bottleneck roles.

**Capacity Levers**
When demand exceeds capacity, what are the options? Help me create a prioritization framework:
1. Prioritize projects (portfolio-level) — which projects get resources first?
2. Phase projects (time-shift) — can we stagger starts to smooth demand?
3. Augment capacity (people) — hire, contract, or partner for peak demand?
4. Reduce scope (project-level) — can we deliver a smaller MVP first?

For each lever, describe when to use it and what the trade-offs are.
```

## Save Step

- Save the skills taxonomy and assessment template to `personas/project-manager/workspace/artifacts/ai-skills-inventory.md`
- Save the gap analysis to `personas/project-manager/workspace/artifacts/skills-gap-analysis.md`
- Save the build-vs-buy framework to `personas/project-manager/workspace/artifacts/build-buy-partner-framework.md`
- Save the capacity planning model to `personas/project-manager/workspace/artifacts/capacity-planning-model.md`
- Mark PM-04 complete in your `personas/project-manager/journey.md`

## Stretch Goal

Create a **training roadmap** for upskilling your existing team. For each critical skills gap identified, design a 90-day learning plan:

```
For each of our top 3 skills gaps, create a 90-day upskilling plan that includes:
- Week 1-2: Foundational learning (courses, reading)
- Week 3-6: Hands-on practice (projects, sandboxes, paired work)
- Week 7-10: Applied learning (work on a real AI project with mentorship)
- Week 11-12: Assessment and next steps
- Resources: Specific courses, platforms, books, internal mentors
- Success criteria: How do we know the upskilling worked?

Factor in that these people have day jobs — the plan should assume 4-8 hours per week for learning.
```

---

**Congratulations.** You've completed all four PM role-specific modules. Combined with the shared modules, you now have a comprehensive AI project management toolkit. Return to your `personas/project-manager/journey.md` to review your progress and complete your reflection.
