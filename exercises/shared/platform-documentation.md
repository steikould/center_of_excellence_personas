# Exercise: Platform Documentation

> **For all personas** — Practice documenting a system using the platform entry schema.

## Instructions

1. Choose a platform from this list (or pick one you know):
   - LIMS (Laboratory Information Management System)
   - ERP (SAP, Oracle)
   - QMS (Quality Management System)
   - EDMS (Electronic Document Management System)
   - Clinical Trial Management System
   - Pharmacovigilance Database
   - Manufacturing Execution System (MES)
   - Supply Chain Management
   - CRM (Customer Relationship Management)
   - Data Lake / Data Warehouse

2. Open Copilot Chat and use this prompt:
```
#file:knowledge-base/_schema/platform-entry.schema.md

I need to document [PLATFORM NAME] as a platform entry. This is used at an animal pharmaceutical company. Help me fill out each field. For fields I'm unsure about, suggest typical values for this type of system in our industry and mark them with "[VERIFY]" so I know to confirm.
```

3. Review the output. Replace `[VERIFY]` placeholders with actual values.

4. Save to `knowledge-base/platforms/{platform-name}-{your-persona}-{YYYY-MM}.md`

## Success Criteria

- All required schema fields are populated
- Animal pharma context is specific (not generic)
- At least one AI/ML opportunity is identified
- Integration points reference other known systems
