# Platform Entry Schema

Use this template when documenting a platform, system, or tool in the knowledge base.

---

## Template

```markdown
# {Platform Name}

## Overview
- **Category**: {LIMS | ERP | QMS | EDMS | CRM | Data Platform | Analytics | CI/CD | Cloud | Custom | Other}
- **Vendor**: {Vendor name or "Internal"}
- **Version**: {Current version in use}
- **Owner**: {Team or individual responsible}
- **Business Unit(s)**: {Which parts of the org use this}

## Purpose
{2-3 sentences on what this platform does and why the organization uses it}

## Data Profile
- **Data Types**: {What kinds of data does it hold? e.g., batch records, stability data, sales figures}
- **Data Classification**: {Public | Internal | Confidential | Restricted}
- **Volume**: {Approximate data volume or transaction frequency}
- **Retention**: {How long is data kept?}

## Regulatory & Compliance
- **GxP Relevant**: {Yes/No}
- **21 CFR Part 11 Compliant**: {Yes/No/N/A}
- **Validation Status**: {Validated | Pending | Not Required}
- **Audit Trail**: {Enabled | Not Available | Partial}
- **ALCOA+ Compliant**: {Yes/No/Partial}

## Integration Points
- **Inbound From**: {List systems that send data TO this platform}
- **Outbound To**: {List systems this platform sends data TO}
- **Integration Method(s)**: {API | File Drop | Database Link | Message Queue | Manual | Other}
- **Authentication**: {OAuth | API Key | SAML/SSO | Certificate | Other}

## Current AI/ML Usage
{Describe any current AI/ML capabilities or integrations. "None" is a valid answer.}

## AI/ML Opportunities
{Describe potential AI/ML use cases for this platform. Consider: predictive analytics, automation, NLP, computer vision, optimization.}

## Notes
{Any additional context — known issues, upcoming migrations, tribal knowledge.}

## Metadata
- **Contributed By**: {Persona role}
- **Date**: {YYYY-MM-DD}
- **Last Reviewed**: {YYYY-MM-DD}
```

---

## Field Guidance

- **Category**: Use the predefined list. If "Other", specify in the Overview.
- **Data Classification**: Follow company data classification policy. When in doubt, default to "Confidential".
- **GxP Relevant**: If this system touches any data used in regulatory submissions, clinical trials, manufacturing, or quality — it's GxP relevant.
- **AI/ML Opportunities**: Think broadly. Even non-technical platforms may benefit from NLP on their document stores or predictive analytics on their transaction data.
