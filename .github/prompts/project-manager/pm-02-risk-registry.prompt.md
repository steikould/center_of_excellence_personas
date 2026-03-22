# PM-02 — Risk Registry for AI

> **Goal**: Create a comprehensive risk registry specific to AI projects in animal pharmaceutical manufacturing, covering AI-specific, regulatory, organizational, and operational risks.

---

## Concept: Why AI Projects Have Different Risks

Traditional IT project risks — scope creep, budget overruns, resource constraints — still apply to AI projects. But AI introduces an entirely new category of risks that most project managers have never managed:

**AI-Specific Risks:**
- **Model drift** — A model that was 95% accurate at deployment degrades to 80% because the underlying data distribution changed (e.g., new animal breed enters the product line, raw material supplier changes)
- **Data quality** — "Garbage in, garbage out" is literal. Missing values, labeling errors, sampling bias, and stale data can make a model dangerous
- **Bias and fairness** — A model trained on historical data may encode historical biases (e.g., over-indexing on data from one manufacturing site)
- **Explainability** — Regulators and quality teams need to understand *why* a model makes a decision, not just *what* decision it makes
- **Reproducibility** — Can you retrain the model and get the same results? In GxP, this is a validation requirement

**Pharma-Regulatory Risks:**
- GxP classification uncertainty — Is this model a "direct impact" system requiring full validation?
- Regulatory submission dependencies — A model that informs a regulatory filing has different risk than an internal optimization
- Audit readiness — Can you demonstrate model lineage, training data provenance, and decision audit trails?

**Organizational Risks:**
- Change resistance — "We've always done it this way" is the number one AI project killer
- Skills gaps — The team has domain expertise but not ML literacy (or vice versa)
- Shadow AI — Teams building unvalidated models outside the CoE's governance framework

## The Challenge

### Part 1 — Identify AI-Specific Risks

Ask Copilot to help you build a comprehensive risk inventory:

```
@project-manager

I need to build a risk registry for AI projects at our animal pharmaceutical company. Start by generating a comprehensive list of risks organized into these categories:

1. **AI/ML Technical Risks** — Model performance, data quality, bias, drift, explainability, reproducibility, training data provenance
2. **Regulatory & Compliance Risks** — GxP validation, 21 CFR Part 11, FDA CVM submissions, audit findings, data integrity (ALCOA+)
3. **Organizational & Change Risks** — Skill gaps, change resistance, shadow AI, stakeholder misalignment, vendor dependency
4. **Operational & Infrastructure Risks** — System availability, data pipeline failures, security vulnerabilities, disaster recovery, multi-site deployment
5. **Ethical & Reputational Risks** — Animal welfare implications of AI decisions, data privacy, public perception of AI in pharma

For each risk, provide:
- Risk ID (e.g., AI-001, REG-001, ORG-001)
- Risk description (one clear sentence)
- Potential trigger (what causes this risk to materialize)
- Potential impact (what happens if it does)

Generate at least 8 risks per category.
```

Review the list. Add risks from your own experience that Copilot missed. Remove any that don't apply to your specific context.

### Part 2 — Score and Prioritize

Now score each risk:

```
@project-manager

Take the risk inventory we just created and add quantitative scoring. For each risk:

1. **Likelihood** (1-5): 1=Rare, 2=Unlikely, 3=Possible, 4=Likely, 5=Almost Certain
2. **Impact** (1-5): 1=Negligible, 2=Minor, 3=Moderate, 4=Major, 5=Critical
3. **Risk Score**: Likelihood x Impact
4. **Risk Level**: Critical (20-25), High (12-19), Medium (6-11), Low (1-5)

Score these from the perspective of a large animal pharmaceutical company where:
- Regulatory non-compliance = Critical impact (always 5)
- Data integrity failures = Major to Critical (4-5)
- Model performance issues = context-dependent (2-4)
- Organizational issues = Moderate to Major (3-4)

Format as a table sorted by risk score (highest first).
```

### Part 3 — Define Mitigations

For every High and Critical risk, build a mitigation plan:

```
@project-manager

For each risk scored as High or Critical in our registry, create a mitigation plan with:

1. **Response Strategy**: Avoid / Mitigate / Transfer / Accept
2. **Mitigation Actions**: Specific, actionable steps (not vague platitudes)
3. **Risk Owner**: The role responsible for monitoring and managing this risk
4. **Key Indicators**: Early warning signs that this risk is materializing
5. **Contingency Plan**: What to do if the risk materializes despite mitigation
6. **Review Cadence**: How often this risk should be reassessed

For animal pharma context, ensure mitigations reference:
- Validation protocols for AI/ML technical risks
- Regulatory consultation for compliance risks
- Change management for organizational risks
- DR/BCP procedures for operational risks
```

### Part 4 — Build the Risk Register Template

Combine everything into a reusable template:

```
@project-manager

Create a risk register template in markdown table format that I can reuse across all AI projects. The template should include:

Header section:
- Project name, project ID, risk register version, last updated date, risk owner

Column structure:
- Risk ID | Category | Description | Trigger | Likelihood (1-5) | Impact (1-5) | Score | Level | Response Strategy | Mitigation Actions | Owner | Key Indicators | Contingency | Review Date | Status (Open/Mitigated/Closed/Accepted)

Include:
- Pre-populated rows for the top 10 "universal" AI project risks that should be on every register
- Instructions for how to add project-specific risks
- Escalation criteria (which risk scores trigger steering committee notification)
- Review process (when and how to update the register)
```

## Save Step

- Save the complete risk inventory to `personas/project-manager/workspace/artifacts/ai-risk-inventory.md`
- Save the scored and prioritized register to `personas/project-manager/workspace/artifacts/ai-risk-register.md`
- Save the reusable template to `personas/project-manager/workspace/artifacts/risk-register-template.md`
- Mark PM-02 complete in your `personas/project-manager/journey.md`

## Stretch Goal

Create a **risk heat map** in Mermaid or ASCII art that visualizes risks by likelihood and impact. Then build a "risk radar" — a one-page summary that shows the top 5 risks across all active AI projects, designed for the steering committee. Ask Copilot:

```
Create a risk radar template: a one-page executive summary showing the top 5 risks across the AI portfolio, each with a trend indicator (increasing/stable/decreasing), owner, and next action. Format it so I can drop it into a PowerPoint or steering committee deck.
```

---

**Next**: PM-03 — Stakeholder Communications
