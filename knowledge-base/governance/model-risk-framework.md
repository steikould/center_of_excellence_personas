# Model Risk Framework — Template

> **Status**: DRAFT — To be completed by the Data Scientist (Module DS-02) and Senior Director (Module SD-03)

This template defines how AI/ML model risk is assessed, managed, and governed in an animal pharmaceutical company.

---

## Model Risk Tiers

| Tier | Risk Level | Criteria | Governance Required |
|------|-----------|----------|-------------------|
| 1 | **Exploratory** | Research/experimentation only, no business decisions | Experiment tracking, peer review |
| 2 | **Advisory** | Informs human decisions, not sole basis | Model card, validation, periodic review |
| 3 | **Operational** | Directly impacts business operations | Full validation (IQ/OQ/PQ), change control, monitoring |
| 4 | **Regulated** | Impacts GxP processes, regulatory submissions, or safety | GAMP 5 validation, regulatory notification, continuous monitoring, annual review |

## Model Lifecycle Governance

| Stage | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|-------|--------|--------|--------|--------|
| Development | Experiment log | + Model card | + Design review | + Regulatory impact assessment |
| Validation | Peer review | + Statistical validation | + IQ/OQ/PQ | + Regulatory validation protocol |
| Deployment | Git tag | + Approval workflow | + Change control | + Regulatory notification |
| Monitoring | None required | Quarterly review | Continuous + alerts | Continuous + regulatory reporting |
| Retirement | Archive | + Impact assessment | + Migration plan | + Regulatory notification |

## Model Card Requirements

{To be completed — the Data Scientist will define model card fields in Module DS-02}

## Validation Requirements by GAMP 5 Category

{To be completed — the Enterprise Architect will map AI system types to GAMP 5 categories in Module EA-04}

## Change Control for Models

{To be completed — define: what constitutes a change requiring re-validation, minor vs. major changes, emergency change process}

## Incident Response

{To be completed — define: model failure classification, escalation paths, root cause analysis requirements, regulatory reporting thresholds}

---

*This template is collaboratively populated by multiple personas across their journeys.*
