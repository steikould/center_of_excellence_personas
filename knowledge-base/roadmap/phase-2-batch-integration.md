# Phase 2 — Batch Integration

> **Status**: Planned
> **Timeline**: After Phase 1 exit criteria met

## Objective

Extend the knowledge base beyond the CoE by integrating data from external organizational systems on a weekly batch cadence. The knowledge base becomes a cross-functional AI operations index.

## Data Sources to Integrate

| Source | Data Type | Frequency | Owner |
|--------|-----------|-----------|-------|
| Data Governance Platform (e.g., Collibra, Alation) | Data catalogs, lineage, quality scores | Weekly | Enterprise Architect |
| Other AI/ML Group Repos | Model registries, experiment logs, pipeline configs | Weekly | Data Scientist |
| Sales & Marketing Systems | Campaign data, market analytics, customer segmentation | Weekly | Senior Director / PM |
| Regulatory Document Management | Submission status, compliance findings, audit results | Weekly | Process Engineer |
| Quality Management System | CAPA records, deviation trends, inspection findings | Weekly | Process Engineer |
| IT Service Management | System uptime, incident history, change requests | Weekly | Automation Engineer |

## Architecture

```
External Systems → ETL/Ingestion Layer → knowledge-base/external/ → Schema Mapping → knowledge-base/
                                              ↓
                                    Provenance Tracking
                                    Conflict Resolution
                                    Quality Validation
```

## Key Design Decisions (to be made via ADRs)

- [ ] ETL tool selection (Azure Data Factory vs. Airflow vs. custom)
- [ ] Conflict resolution strategy (external overwrites vs. manual merge vs. versioning)
- [ ] Schema evolution approach (how to handle new data types from external sources)
- [ ] Access control model (who can see external data vs. internal knowledge)
- [ ] Data freshness SLAs (what "weekly" means for each source)

## Risks

- External data quality may not match internal schema standards
- Organizational politics around data sharing across groups
- Compliance implications of centralizing regulated data references
- Scope creep — the knowledge base trying to become the system of record instead of an index

## Dependencies

- Phase 1 governance templates must be finalized
- Enterprise Architect's graph schema design (EA-03) informs ingestion mapping
- IT infrastructure for scheduled batch jobs
- Data sharing agreements with external groups
