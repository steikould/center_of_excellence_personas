# SD-03 — AI Governance Framework

> **Goal**: Use Copilot to build an enterprise AI governance framework — covering usage policies, model risk management, data classification, ethical AI principles, and change control for AI systems.
> **Time**: ~50 minutes
> **You'll build**: AI Governance Framework document and supporting policy templates saved to `personas/senior-director/workspace/artifacts/`

---

## What You're Learning

Governance is where AI CoE credibility is won or lost. Too light, and you get shadow AI proliferating across functions with no oversight. Too heavy, and you strangle adoption and lose the innovators. This module builds a governance framework that is proportionate, risk-based, and specifically tuned to the regulatory realities of animal pharmaceutical operations.

You will use Copilot to draft policy-grade documents — learning how to prompt for precision, regulatory alignment, and organizational usability. This is the highest-stakes application of Copilot in the Senior Director's toolkit: producing governance artifacts that must be defensible under audit.

---

## Concept: The Governance Architecture

```
Layer 1 — Principles         Why we govern AI (ethical foundations, risk philosophy)
Layer 2 — Policies           What the rules are (AI usage policy, data policy, model policy)
Layer 3 — Standards          How rules are implemented (classification schemes, risk tiers, validation protocols)
Layer 4 — Procedures         Step-by-step processes (change control, model review, incident response)
Layer 5 — Oversight          Who enforces (governance bodies, review boards, escalation paths)
```

In animal pharma, governance must harmonize with existing quality and compliance frameworks:
- AI governance cannot contradict GxP quality systems — it must extend them
- Model risk management must align with the company's existing risk management framework (ICH Q9 principles)
- Data classification for AI must be compatible with existing data governance and 21 CFR Part 11 controls
- Change control for AI models must integrate with existing change control boards and procedures

---

## Challenge 1 — AI Usage Policy

Start with the foundational policy that defines how AI tools are used across the organization:

```
#file:knowledge-base/_schema/best-practice.schema.md

Draft an AI Usage Policy for a large animal pharmaceutical company. This is the enterprise-wide policy that every employee must follow. Structure it as:

1. **Purpose and Scope** — What this policy covers and who it applies to
2. **Definitions** — AI, ML, generative AI, foundation models, AI-assisted vs. AI-automated decisions
3. **Permitted Uses** — What employees may use AI for (with examples from R&D, manufacturing, quality, commercial)
4. **Prohibited Uses** — Hard boundaries (e.g., no AI for final GxP release decisions, no patient/animal safety determinations without human review, no confidential data in public AI tools)
5. **Approval Requirements** — What needs approval and from whom, based on risk tier
6. **Data Handling** — Rules for what data can be used with which AI systems
7. **Record-Keeping** — Audit trail requirements for AI-assisted decisions in regulated contexts
8. **Accountability** — Who is responsible when AI is used (the human, not the model)
9. **Reporting** — How to report concerns, incidents, or unexpected AI behavior
10. **Review Cycle** — How often this policy is reviewed and updated

Make it specific to animal pharma. Reference GxP obligations, FDA CVM expectations, and 21 CFR Part 11 where relevant. Write it in policy language — clear, direct, enforceable — not academic or aspirational.
```

---

## Challenge 2 — AI Risk Classification

Build a tiered system for classifying AI initiatives by risk:

```
Design an AI Risk Classification Framework for our animal pharma company. We need a tiered model that determines the level of governance, validation, and oversight required for any AI initiative.

**Tier 1 — Low Risk (Self-service)**
AI tools used for personal productivity with no regulated data or decisions.
Examples: Copilot for code review, AI-assisted literature search, meeting summarization.

**Tier 2 — Moderate Risk (Review required)**
AI applied to business processes that are not GxP-regulated but affect significant decisions.
Examples: Demand forecasting, commercial analytics, talent analytics, supply chain optimization.

**Tier 3 — High Risk (Full governance)**
AI that touches regulated processes, patient/animal safety data, or makes recommendations used in GxP decision-making.
Examples: Predictive quality in manufacturing, adverse event signal detection, clinical trial data analysis, batch release support.

**Tier 4 — Critical (Board-level oversight)**
AI making or directly supporting decisions with safety, regulatory, or existential business impact.
Examples: AI-assisted drug safety assessments, automated regulatory submission components, AI in validated manufacturing systems.

For each tier, define:
- Approval authority (who approves deployment)
- Validation requirements (none, verification, full IQ/OQ/PQ)
- Monitoring requirements (none, periodic, continuous)
- Documentation requirements (informal, standard, GxP-grade)
- Change control requirements (standard IT, enhanced, full GxP change control)
- Incident response requirements

Present as a comprehensive comparison table.
```

---

## Challenge 3 — Model Risk Management

Define how AI/ML models are managed through their lifecycle:

```
Draft a Model Risk Management standard for AI/ML models in our animal pharma company. This should cover the full model lifecycle:

1. **Model Inventory** — Central registry of all AI/ML models. Required fields: model name, owner, risk tier, purpose, input data, output type, deployment environment, validation status, last review date.

2. **Model Development Standards**
   - Data quality requirements and data lineage documentation
   - Training/test/validation split requirements
   - Bias and fairness assessment (especially important for multi-species applications)
   - Performance metrics and acceptance criteria
   - Peer review requirements

3. **Model Validation**
   - Tier-based validation approach (mapped to our risk classification)
   - For GxP models: alignment with GAMP 5 and CSV (Computer System Validation) requirements
   - Independent validation vs. developer validation thresholds
   - Validation documentation requirements

4. **Model Deployment**
   - Pre-deployment checklist
   - Monitoring and alerting requirements
   - Fallback procedures (what happens when the model fails or is unavailable)
   - Human-in-the-loop requirements by risk tier

5. **Model Monitoring and Drift**
   - Performance monitoring metrics and thresholds
   - Data drift detection approach
   - Re-validation triggers
   - Scheduled periodic reviews

6. **Model Retirement**
   - Retirement criteria
   - Data retention requirements (regulatory minimums)
   - Knowledge capture upon retirement

Align with ICH Q9 risk management principles where applicable. This standard must be auditable — an FDA investigator reviewing our AI practices should find this document defensible.
```

---

## Challenge 4 — Ethical AI Principles

Establish the company's position on responsible AI:

```
Draft Ethical AI Principles for our animal pharmaceutical company. These should be:
- Specific enough to guide real decisions (not vague aspirations)
- Relevant to animal health (animal welfare, food safety, environmental impact)
- Compatible with our regulatory obligations
- Actionable — each principle includes "what this means in practice"

Cover these areas:
1. **Transparency** — Explainability requirements for AI decisions, especially in regulated contexts
2. **Fairness** — Bias prevention across species, geographies, and market segments
3. **Safety** — Human oversight of AI in safety-critical applications (drug safety, product quality)
4. **Privacy** — Data protection for customer data, veterinarian data, and farmer/producer data
5. **Accountability** — Clear ownership of AI outcomes; AI advises, humans decide
6. **Sustainability** — Environmental impact of AI compute; responsible resource use
7. **Animal welfare** — AI applications must align with animal welfare commitments

For each principle, include:
- The principle statement (1 sentence)
- What this means in practice (2-3 specific examples in animal pharma)
- Red line (what would violate this principle)
- Governance mechanism (how we enforce it)
```

---

## Challenge 5 — Change Control for AI Systems

Integrate AI change management into existing quality systems:

```
Design a Change Control Process for AI Systems that integrates with our existing pharmaceutical change control framework. This is critical — AI models are not static software. They learn, drift, and require updates in ways traditional change control wasn't designed for.

Address:
1. **What constitutes a "change" for an AI model?**
   - Retraining with new data
   - Hyperparameter adjustments
   - Feature engineering changes
   - Infrastructure/platform changes
   - Input data source changes
   - Threshold/decision boundary adjustments

2. **Change classification**
   - Minor (no impact on model behavior or regulated outputs)
   - Moderate (potential impact, requires assessment)
   - Major (significant impact, requires re-validation)

3. **Change control workflow**
   - Change request initiation
   - Impact assessment (including GxP impact)
   - Approval routing (based on risk tier and change classification)
   - Implementation and testing
   - Validation (if required)
   - Documentation and closure
   - Post-implementation review

4. **Integration points with existing quality systems**
   - How this connects to the existing Change Control Board
   - How this maps to CAPA (Corrective and Preventive Action) processes
   - How model changes are reflected in the quality management system

5. **Emergency change process**
   - When a model must be updated urgently (e.g., safety signal, performance degradation)
   - Expedited approval path
   - Retrospective documentation requirements

Make this practical. Show a flowchart-style decision tree in markdown for classifying and routing AI changes.
```

---

## Save Step

Assemble the complete governance framework:

```
Compile all sections into a single AI Governance Framework document:
- AI Usage Policy
- Risk Classification Framework
- Model Risk Management Standard
- Ethical AI Principles
- Change Control Process for AI Systems

Add:
- Executive summary (1 page max — suitable for board review)
- Governance body structure (AI Governance Board, Model Review Committee, Data Ethics Panel — with membership and meeting cadence)
- Implementation roadmap (which elements to deploy first, what can be phased)
- Appendix: Glossary of terms

Format as a formal governance document with numbered sections. This must be professional enough to share with Quality, Regulatory Affairs, and Legal for review.
```

Save to: `personas/senior-director/workspace/artifacts/ai-governance-framework.md`

Also save individual policy templates to: `personas/senior-director/workspace/artifacts/policies/`

Mark **SD-03** complete in your `personas/senior-director/journey.md`.

---

## Stretch Goal

Stress-test your governance framework:

```
You are an FDA CVM investigator conducting a routine inspection. You've learned that this animal pharmaceutical company is using AI/ML models in their manufacturing quality processes. Review the AI Governance Framework and identify:

1. Three areas where the framework would satisfy your expectations
2. Three gaps or weaknesses you would flag as observations
3. One area that could become a 483 observation if not addressed

Be specific and reference relevant regulations and guidance documents.
```

Then ask Copilot to play the Chief Quality Officer and challenge the governance framework from an operational perspective — is it implementable or just a shelf document?

---

**Next**: [SD-04 — ROI Measurement & Value Realization](.github/prompts/senior-director/sd-04-roi-measurement.prompt.md)
