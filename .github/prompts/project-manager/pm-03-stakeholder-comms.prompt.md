# PM-03 — Stakeholder Communications

> **Goal**: Build audience-tailored communication templates for every stakeholder group you work with — executives, technical teams, regulatory affairs, quality, and external partners.

---

## Concept: Communication Is the PM's Primary Deliverable

A project manager who builds perfect plans but communicates poorly is a failed PM. Communication is not overhead — it *is* the job. In AI projects, the communication challenge is amplified because:

- **Executives** want business outcomes and ROI, not model accuracy metrics
- **Technical teams** want clear scope and dependencies, not strategic vision
- **Regulatory teams** want compliance evidence and risk exposure, not feature lists
- **Quality teams** want validation status and data integrity assurance, not architecture diagrams
- **External partners** want contractual clarity and milestone tracking, not internal process details

The same project update must be told five different ways to five different audiences. Each version emphasizes different information, uses different vocabulary, and answers different implicit questions.

**The implicit questions each audience is asking:**

| Audience | Their Real Question |
|----------|-------------------|
| Executive Sponsor | "Is this on track to deliver the value I signed up for?" |
| Steering Committee | "Are there decisions I need to make or risks I need to know about?" |
| Technical Team | "What do I need to deliver this sprint, and is anything blocking me?" |
| Quality/Regulatory | "Will this pass audit? Where are the compliance gaps?" |
| External Partners | "Are we meeting our contractual obligations on both sides?" |
| Site Leaders | "How will this affect my operations and my people?" |

## The Challenge

### Part 1 — Map Your Stakeholder Landscape

Start by documenting who you actually communicate with:

```
@project-manager

Help me create a stakeholder communication map for AI projects at our animal pharmaceutical company. I need to identify:

1. **Stakeholder groups** — Who are they? (Be specific to animal pharma: R&D leadership, manufacturing site directors, quality heads, regulatory affairs, commercial, IT, data science team, external CROs, technology vendors)

2. **For each group, document:**
   - Their role in AI projects (decision maker, contributor, influencer, observer)
   - What information they need from me
   - What information I need from them
   - Their preferred communication format (email, deck, dashboard, meeting, Teams message)
   - Ideal cadence (daily, weekly, bi-weekly, monthly, milestone-based)
   - Their AI literacy level (high, medium, low) — this affects vocabulary

Format as a stakeholder register table.
```

### Part 2 — Build Executive Communication Templates

Executives need concise, decision-oriented communication:

```
@project-manager

Create three executive communication templates for AI projects in animal pharma:

**Template 1 — Monthly Executive Status Report**
- RAG status with one-sentence justification for each color
- Key accomplishments this period (3-5 bullets, business language)
- Upcoming milestones with dates
- Risks and issues requiring attention (top 3 only, with recommended actions)
- Decisions needed (specific ask with options and recommendation)
- Budget status (planned vs. actual vs. forecast)
- One "spotlight" item (a win, a learning, or a demo)

**Template 2 — Steering Committee Briefing**
- Portfolio view: all active AI projects with RAG status
- Deep dive on 1-2 projects needing attention
- Resource utilization across the AI portfolio
- Risk escalations with recommended decisions
- Strategic alignment check: are we still solving the right problems?

**Template 3 — Executive Escalation**
- Issue summary in one paragraph (what happened, what's the impact)
- Options (at least 2, with pros/cons/cost/timeline for each)
- Recommendation with rationale
- Decision needed by [date] — what happens if we don't decide

For all templates: use business language, not technical jargon. Translate model accuracy into business impact. Reference animal pharma context (batch quality, regulatory timelines, patient safety).
```

### Part 3 — Build Technical Team Communication Templates

Technical audiences need different content:

```
@project-manager

Create three communication templates for technical teams working on AI projects:

**Template 1 — Sprint Planning Brief**
- Sprint goal (one sentence tied to project milestone)
- User stories / tasks with acceptance criteria
- Dependencies on other teams (with contact and deadline)
- Technical risks or blockers identified
- Environment and data availability status
- Definition of done for this sprint

**Template 2 — Technical Decision Request**
- Context: what decision is needed and why now
- Options evaluated (at least 3) with technical trade-offs
- Evaluation criteria (performance, scalability, maintainability, GxP impact, cost)
- Recommendation with supporting evidence
- Impact if decision is delayed
- Stakeholders who need to be consulted

**Template 3 — Integration Handoff Document**
- What's being handed off (model, pipeline, API, etc.)
- Technical specifications (inputs, outputs, SLAs, error handling)
- Deployment requirements (infrastructure, configuration, access)
- Validation requirements (what QA needs to test)
- Support model (who owns it post-handoff, escalation path)
- Known limitations and technical debt
```

### Part 4 — Build Regulatory and Quality Communication Templates

The most critical audience in pharma:

```
@project-manager

Create two communication templates for regulatory and quality stakeholders:

**Template 1 — GxP Impact Assessment Communication**
- System description (what the AI system does, in plain language)
- GxP classification recommendation (direct impact, indirect impact, no impact) with rationale
- Data integrity considerations (ALCOA+ mapping)
- 21 CFR Part 11 applicability assessment
- Proposed validation approach (IQ/OQ/PQ scope)
- Regulatory submission implications (does this affect any filing?)
- Proposed timeline for validation activities
- Resources needed from Quality and Regulatory teams

**Template 2 — Validation Status Update**
- Overall validation status (RAG)
- Completed validation activities with evidence references
- Upcoming validation milestones with dates
- Open deviations or findings with remediation status
- Change control requests in progress
- Audit readiness assessment (ready / conditionally ready / not ready)
- Risk to go-live date from validation activities

Use regulatory vocabulary accurately. Reference specific regulations (21 CFR Part 11, Annex 11, GAMP 5 categories). Do not oversimplify — quality and regulatory teams need precision, not summaries.
```

## Save Step

- Save the stakeholder register to `personas/project-manager/workspace/artifacts/stakeholder-register.md`
- Save executive templates to `personas/project-manager/workspace/artifacts/exec-comm-templates.md`
- Save technical templates to `personas/project-manager/workspace/artifacts/tech-comm-templates.md`
- Save regulatory/quality templates to `personas/project-manager/workspace/artifacts/reg-qa-comm-templates.md`
- Mark PM-03 complete in your `personas/project-manager/journey.md`

## Stretch Goal

Build a **communication calendar** for a hypothetical 6-month AI project. Map every communication touchpoint across all stakeholder groups onto a timeline. Show which templates you'd use at each point and what the key message would be at each project phase. Ask Copilot:

```
Create a 6-month communication calendar for an AI project that goes through all 6 lifecycle phases. Show: Week, Audience, Communication Type, Template Used, Key Message. Overlay the project phase gates so I can see how communications align with major milestones.
```

---

**Next**: PM-04 — Resource & Capacity Planning
