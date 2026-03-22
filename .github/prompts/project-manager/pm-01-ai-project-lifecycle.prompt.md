# PM-01 — AI Project Lifecycle

> **Goal**: Build a comprehensive project lifecycle template for AI initiatives in animal pharma, with phase gates, decision criteria, and GxP validation checkpoints.

---

## Concept: Why AI Projects Need a Different Lifecycle

Traditional software projects follow well-understood phases: requirements, design, build, test, deploy. AI projects are fundamentally different:

- **Data exploration** is non-linear — you may discover your data can't support the use case after weeks of work
- **Model development** is iterative — you don't "design" a model, you experiment toward one
- **Validation** is more complex — GxP requires you to prove the model works *and* that the system around it is validated
- **Deployment** isn't the end — models degrade over time and require ongoing monitoring and retraining

This means the traditional waterfall lifecycle doesn't fit, but pure agile lacks the governance gates that regulated pharma demands. The answer is a **hybrid lifecycle** with agile execution inside waterfall-style phase gates.

**The six phases of an AI project in regulated pharma:**

| Phase | Key Activities | Gate Criteria |
|-------|---------------|---------------|
| 1. Ideation | Problem framing, feasibility assessment, stakeholder alignment | Business case approved, data availability confirmed |
| 2. Discovery | Data exploration, EDA, initial modeling, technical feasibility | Data sufficient, model approach viable, risks identified |
| 3. Development | Model training, feature engineering, integration prototyping | Model meets performance thresholds, architecture reviewed |
| 4. Validation | GxP validation (IQ/OQ/PQ), UAT, regulatory mapping | Validation protocols approved, test evidence complete |
| 5. Deployment | Production rollout, change control, training, go-live | Change request approved, rollback plan tested, monitoring live |
| 6. Operations | Monitoring, retraining, model performance review, continuous improvement | Performance within thresholds, periodic revalidation scheduled |

## The Challenge

### Part 1 — Map Your Current State

Ask Copilot to help you assess how AI projects currently run at your organization:

```
@project-manager

I need to document how AI projects currently move from idea to production at our animal pharmaceutical company. Help me create a "current state" assessment by asking me structured questions about:
1. How AI ideas are proposed and prioritized today
2. What happens between "approved idea" and "data scientist starts working"
3. How models get validated and deployed
4. What governance or review gates exist (if any)
5. Where projects most commonly stall or fail

For each area, give me a rating scale (1-5) and help me score our maturity.
```

Work through the questions. Be honest — the current state assessment is the foundation for the lifecycle template you'll build.

### Part 2 — Design the Lifecycle Template

Now build the template. Ask Copilot:

```
@project-manager

Based on the current state assessment, help me design a complete AI project lifecycle template for our animal pharmaceutical company. For each of the 6 phases (Ideation, Discovery, Development, Validation, Deployment, Operations), I need:

1. **Phase description** — What happens and why
2. **Key activities** — Specific tasks with responsible roles
3. **Deliverables** — What must be produced before moving to the next phase
4. **Gate criteria** — Decision criteria for the phase gate review
5. **GxP considerations** — Validation activities and regulatory checkpoints specific to this phase
6. **Typical duration** — Realistic time range for animal pharma AI projects
7. **Common risks** — What typically goes wrong in this phase

Format as a detailed table or structured document I can share with stakeholders.
```

Review the output critically. Adjust durations based on your actual experience. Add any company-specific gates or approvals that are missing.

### Part 3 — Build the Phase Gate Checklist

Each phase gate needs a concrete checklist. Ask Copilot:

```
@project-manager

For each of the 6 phase gates in our AI project lifecycle, create a detailed checklist that the gate reviewer would use. Each checklist item should be:
- A yes/no question
- Specific enough that two reviewers would agree on the answer
- Tagged with the responsible role (PM, Data Scientist, QA, Regulatory, etc.)

Include GxP-specific items:
- Phase 1 gate: System classification (GxP impact assessment)
- Phase 3 gate: Validation strategy document approved
- Phase 4 gate: IQ/OQ/PQ evidence packages complete
- Phase 5 gate: Change control approved, 21 CFR Part 11 compliance verified
```

### Part 4 — Create the RACI Matrix

Every lifecycle needs clear accountability. Ask Copilot:

```
@project-manager

Create a RACI matrix for the AI project lifecycle template. Rows should be the key deliverables from each phase. Columns should be:
- Project Manager
- Data Science Lead
- ML Engineer
- Quality Assurance
- Regulatory Affairs
- IT/Infrastructure
- Business Sponsor
- Steering Committee

Rules: Exactly one "A" (Accountable) per row. "R" (Responsible) for doers. "C" (Consulted) for input providers. "I" (Informed) for stakeholders who need to know.
```

## Save Step

- Save the complete lifecycle template to `personas/project-manager/workspace/artifacts/ai-project-lifecycle-template.md`
- Save the phase gate checklists to `personas/project-manager/workspace/artifacts/phase-gate-checklists.md`
- Save the RACI matrix to `personas/project-manager/workspace/artifacts/lifecycle-raci-matrix.md`
- Mark PM-01 complete in your `personas/project-manager/journey.md`

## Stretch Goal

Create a **lifecycle decision tree** for determining which phases can be shortened or skipped based on project characteristics. For example:
- Is this a GxP system? If no, skip formal IQ/OQ/PQ (but keep design review)
- Is this replacing an existing model? If yes, shorten Discovery phase
- Is this a new data source? If yes, extend Discovery with data quality assessment

Ask Copilot to generate this as a flowchart in Mermaid markdown syntax.

---

**Next**: PM-02 — Risk Registry for AI
