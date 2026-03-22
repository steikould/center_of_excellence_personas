# Connection Pattern Schema

Use this template when documenting an integration or data flow between systems.

---

## Template

```markdown
# {Source System} → {Target System}

## Overview
- **Pattern Name**: {Descriptive name, e.g., "LIMS Batch Results to ERP Quality Module"}
- **Direction**: {Unidirectional | Bidirectional}
- **Frequency**: {Real-time | Near-real-time | Hourly | Daily | Weekly | On-demand | Event-driven}
- **Criticality**: {Critical | High | Medium | Low}

## Data Flow
- **What moves**: {Describe the data payload — records, events, files, etc.}
- **Format**: {JSON | XML | CSV | HL7 | EDI | Flat File | Binary | Other}
- **Volume**: {Approximate records/messages per interval}
- **Transformation**: {Describe any data mapping, enrichment, or transformation required}

## Technical Details
- **Protocol**: {REST API | SOAP | SFTP | Message Queue (Kafka/RabbitMQ) | Database Link | Custom}
- **Middleware**: {Integration platform used, if any — MuleSoft, Informatica, Azure Data Factory, etc.}
- **Authentication**: {How the connection authenticates}
- **Error Handling**: {Retry logic, dead letter queues, alerting, manual intervention}
- **Monitoring**: {How is this connection monitored? Dashboards, alerts, logs?}

## Regulatory Considerations
- **GxP Data in Transit**: {Yes/No}
- **Validation Required**: {Yes/No}
- **Audit Trail**: {How are data transfers logged for compliance?}
- **Data Integrity**: {How is ALCOA+ maintained across the integration?}

## Failure Impact
{What happens when this connection fails? Which business processes are affected? What's the manual workaround?}

## AI/ML Relevance
{Could this data flow feed an AI/ML use case? Could AI improve the reliability, speed, or quality of this integration?}

## Metadata
- **Contributed By**: {Persona role}
- **Date**: {YYYY-MM-DD}
- **Last Reviewed**: {YYYY-MM-DD}
```

---

## Field Guidance

- **Criticality**: "Critical" means business stops if this fails. "Low" means delayed or degraded but operational.
- **GxP Data in Transit**: If either the source or target is GxP-relevant and the data contributes to regulatory decisions, this is GxP data in transit.
- **AI/ML Relevance**: Think about both consuming this data for ML models AND using AI to improve the integration itself (anomaly detection on data quality, predictive failure alerting, etc.).
