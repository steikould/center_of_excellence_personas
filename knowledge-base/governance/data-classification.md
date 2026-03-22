# Data Classification for AI/ML — Template

> **Status**: DRAFT — To be completed by the Enterprise Architect during Module EA-04

This template defines data classification levels relevant to AI/ML use cases in an animal pharmaceutical company.

---

## Classification Levels

| Level | Label | Description | AI/ML Usage Rules |
|-------|-------|-------------|-------------------|
| 1 | **Public** | Publicly available information | No restrictions on AI training or inference |
| 2 | **Internal** | General business information | May be used with approved AI tools; no external AI services without review |
| 3 | **Confidential** | Sensitive business data, IP, trade secrets | Approved AI tools only; no cloud AI without encryption; data stays within approved infrastructure |
| 4 | **Restricted** | GxP data, PII, regulatory submissions, safety data | AI use requires Tier 3/4 approval; validated systems only; full audit trail required |

## Data Types & Default Classifications

| Data Type | Default Level | Notes |
|-----------|--------------|-------|
| Batch manufacturing records | Restricted | GxP — 21 CFR Part 11 applies |
| Stability study data | Restricted | Regulatory submission data |
| Adverse event reports | Restricted | Pharmacovigilance — regulatory reporting |
| Clinical trial data | Restricted | GCP regulated |
| Quality control results | Restricted | GMP regulated |
| Supply chain data | Confidential | Competitive sensitivity |
| Sales & marketing data | Confidential | Commercial sensitivity |
| Employee data | Confidential | Privacy regulations |
| Published research | Public | Already in public domain |
| General business processes | Internal | Standard business information |

## AI-Specific Considerations

{To be completed — address:}
- Can this data be used to train models?
- Can this data be sent to external AI APIs?
- What anonymization/de-identification is required?
- What consent/authorization is needed?
- How is data lineage tracked through AI pipelines?
- What happens to data after model training (right to deletion)?

---

*This template is populated during the Enterprise Architect's Module EA-04: Security & Compliance Architecture.*
